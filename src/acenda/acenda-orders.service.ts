import { Inject, Injectable } from '@nestjs/common';
import { AcendaClient } from 'src/acenda-client/acenda-client';
import { IOrder, IOrderModel, Order } from '../orders/models/order.model';
import { OrdersService } from '../orders/orders.service';
import { Helper } from '../shared/helper';
import { AcendaProductsService } from './acenda-products.service';
import {
  AcendaOrder, AcendaOrderItem, Fulfillment, FulfillmentItem, IAcendaOrder, IAcendaOrderItem,
  IFulfillment,
  IFulfillmentItem
} from './models/acenda-order.model';
import { IAcendaVariant } from './models/acenda-variant.model';


@Injectable()
export class AcendaOrdersService {
  constructor(@Inject(AcendaClient) private acendaClient, private acendaProductsService: AcendaProductsService,
    private ordersService: OrdersService) { }


  async reconcileOrders(storeId: string) {
    try {
      const starterPromise = Promise.resolve(null)
      const date = new Date()
      date.setHours(date.getHours() - 24)
      const orders = await this.getOrders(storeId, date.toISOString())
      await orders.reduce((p, order) => p.then(async () => {
        await Helper.sleep(600)
        await this.checkAndCreateOrderOnVendor(order, storeId)
      }), starterPromise)
    } catch (error) {
      throw error
    }
  }

  async getOrders(store: string, from?: string, to?: string, status?: string): Promise<IAcendaOrder[]> {
    try {
      const acenda = await this.acendaClient.getAcendaClient(store)
      let page = 1
      let limit = 250
      let reached = false
      let orders = []
      let allOrders: IAcendaOrder[] = []
      let query = ''
      let statusQuery = ''
      if (status) {
        statusQuery = `,"status":"${status}"`
      }
      if (from && to) {
        query = `query={"date_created":{"$gte":"${from}","$lte":"${to}"}${statusQuery}}`
      } else if (from) {
        query = `query={"date_created":{"$gte":"${from}"}${statusQuery}}`
      } else if (to) {
        query = `query={"date_created":{"$lte":"${to}"}${statusQuery}}`
      }

      while (!reached) {
        await Helper.sleep(1000)
        let response = await acenda.list('order', query, page, limit)
        orders = response.data.result
        if (orders.length) {
          allOrders = allOrders.concat(orders)
        } else {
          reached = true
        }
        page++
      }
      return allOrders
    } catch (error) {
      throw error
    }
  }

  async createOrderFromRetailer(storeId: string, order: IAcendaOrder) {
    await Promise.all(order.items.map(async (item) => item = await this.checkVariantOnVendor(item, storeId)))
    await this.createOrderOnVendor(order.items, order, storeId)
  }

  private async checkAndCreateOrderOnVendor(order: IAcendaOrder, storeId: string) {
    try {
      const result = await this.ordersService.list({ filter: { retailer_id: order.id.toString(), retailer: storeId } })
      if (!result.length) {
        const acendaOrder = await this.getOrderById(storeId, order.id.toString())
        await this.createOrderFromRetailer(storeId, acendaOrder)
      }
    } catch (error) {
      throw error
    }
  }

  private async checkVariantOnVendor(orderItem: IAcendaOrderItem, storeId) {
    const acendaVariant = await this.acendaProductsService.getVariantById(storeId, orderItem.variant_id.toString()) as IAcendaVariant
    if (acendaVariant.data_manager_id) {
      orderItem.data_manager_id = acendaVariant.data_manager_id
      orderItem.data_manager_source = acendaVariant.data_manager_source
    }
    return orderItem
  }

  private async createOrderOnVendor(items: IAcendaOrderItem[], order: IAcendaOrder, storeId: string) {
    const vendorItems = Helper.groupBy(items, 'data_manager_source')
    let vendors = Object.keys(vendorItems)
    vendors = vendors.filter((x) => x != 'undefined')
    await Promise.all(vendors.map(async (vendor) => {
      try {
        const vendorOrder = new AcendaOrder()
        vendorOrder.items = []
        Helper.assignAcendaShippingFields(order, vendorOrder)
        const orderItems = vendorItems[vendor] as IAcendaOrderItem[]
        orderItems.forEach(item => {
          const vendorOrderItem = new AcendaOrderItem()
          vendorOrderItem.variant_id = Number(item.data_manager_id)
          vendorOrderItem.quantity = item.quantity
          vendorOrderItem.price = item.price
          vendorOrderItem.name = item.name
          vendorOrderItem.sku = item.sku || ''
          vendorOrderItem.data_manager_id = item.id.toString()
          vendorOrderItem.ordered_quantity = item.quantity
          vendorOrder.items.push(vendorOrderItem)
        });

        vendorOrder.data_manager_id = order.id.toString()
        vendorOrder.data_manager_source = storeId
        vendorOrder.payments = order.payments
        if (vendorOrder.payments.length) {
          if (vendorOrder.payments[0].order_id)
            delete vendorOrder.payments[0].order_id
          if (vendorOrder.payments[0].id)
            delete vendorOrder.payments[0].id
        }

        const vendor_id = await this.createOrder(vendor, vendorOrder)
        const vendorCreatedOrder: IAcendaOrder = await this.getOrderById(vendor, vendor_id)
        const mappedOrder = new Order()
        mappedOrder.retailer = storeId
        mappedOrder.retailer_id = order.id.toString()
        mappedOrder.vendor = vendor
        mappedOrder.vendor_id = vendor_id.toString()
        mappedOrder.items = vendorOrder.items

        vendorCreatedOrder.items.forEach((item) => {
          const mappedOrderItem = mappedOrder.items.filter((x) => x.variant_id === item.variant_id)[0]
          mappedOrderItem.id = item.id
        })

        mappedOrder.status = "open"
        Helper.assignAcendaShippingFields(order, mappedOrder)
        mappedOrder.date_created = new Date(order.date_created)
        await this.ordersService.create({ data: mappedOrder })
      } catch (error) {
        throw error
      }
    }))
  }

  async getOrderById(storeId: string, id: string): Promise<IAcendaOrder> {
    try {
      const acenda = await this.acendaClient.getAcendaClient(storeId)
      const response = await acenda.get('order', id)
      return response.data.result as IAcendaOrder
    } catch (error) {
      throw error
    }
  }

  async createOrder(storeId: string, order: IAcendaOrder) {
    try {
      const acenda = await this.acendaClient.getAcendaClient(storeId)
      const response = await acenda.create('order', order)
      return response.data.result
    } catch (error) {
      throw error
    }
  }

  async reconcileFulfillments(storeId: string) {
    try {
      const from = new Date()
      from.setDate(from.getDate() - 14)
      const to = new Date()
      const orders = await this.ordersService.list({ filter: { retailer: storeId, status: "open", date_created: { $gte: from, $lte: to } } })
      console.log(orders.length)
      const starterPromise = Promise.resolve(null)
      await orders.reduce((p, order) => p.then(async () => {
        const vendorOrder = await this.getOrderById(order.vendor, order.vendor_id)
        await vendorOrder.fulfillments.reduce((q, fulfillment) => q.then(async () => {
          const found = order.fulfillments.filter((match) => match.id == fulfillment.id)
          if (found.length === 0) {
            const retailerFulfillmentId = await this.createFulfillmentOnRetailer(fulfillment, order)
            fulfillment.retailer_id = retailerFulfillmentId.toString()
            order.fulfillments.push(fulfillment)
          }
        }), starterPromise)
        if (this.checkOrderFulfilled(order)) {
          order.status = "completed"
        }

        await order.save()
      }), starterPromise)
    } catch (error) {
      throw error
    }
  }

  private async createFulfillmentOnRetailer(fulfillment: IFulfillment, order: IOrderModel) {
    const retailerItems = this.getRetailerFulfilledItems(fulfillment.items, order.items)
    const retailerFulfillment = new Fulfillment()
    retailerFulfillment.items = retailerItems
    retailerFulfillment.packages = fulfillment.packages
    retailerFulfillment.shipping_method = fulfillment.shipping_method
    retailerFulfillment.status = fulfillment.status
    retailerFulfillment.tracking_company = fulfillment.tracking_company
    retailerFulfillment.tracking_numbers = fulfillment.tracking_numbers
    retailerFulfillment.tracking_urls = fulfillment.tracking_urls
    const retailerFulfillmentId = await this.createFulfillment(order.retailer, order.retailer_id, retailerFulfillment)
    return retailerFulfillmentId
  }

  getRetailerFulfilledItems(vendorItems: IFulfillmentItem[], orderItems: IAcendaOrderItem[]) {
    const retailerItems: IFulfillmentItem[] = []
    vendorItems.map((item) => {
      const fulfillmentItem = new FulfillmentItem()
      const matchItem = orderItems.filter((orderItem) => orderItem.variant_id == item.variant_id)
      if (matchItem.length) {
        fulfillmentItem.id = Number(matchItem[0].data_manager_id)
        fulfillmentItem.name = matchItem[0].name
        fulfillmentItem.quantity = item.quantity
        retailerItems.push(fulfillmentItem)
      }
    })
    return retailerItems
  }

  async createFulfillment(storeId: string, orderId: string, fulfillment: IFulfillment) {
    try {
      const acenda = await this.acendaClient.getAcendaClient(storeId)
      const response = await acenda.create(`order/${orderId}/fulfillments`, fulfillment)
      return response.data.result
    } catch (error) {
      throw error
    }
  }

  async checkOrderFulfilled(order: IOrder) {
    let fulfilledItemsTotal = 0
    let itemsTotal = 0
    order.items.map((item) => {
      itemsTotal += item.quantity

    })
    order.fulfillments.forEach((fulfillment) => fulfillment.items.map((fulfillmentItem) => {
      if (fulfillment.status == "success") {
        fulfilledItemsTotal += fulfillmentItem.quantity
      }
    }))
    if (fulfilledItemsTotal === itemsTotal) {
      return true
    } else {
      return false
    }
  }

  async updateFulfillmentFromVendor(vendor: string, fulfillment: IFulfillment) {
    const vendorOrderId = fulfillment.order_id
    const order = await this.ordersService.get({ filter: { vendor_id: vendorOrderId, vendor } })
    const retailerFulfillmentId = await this.createFulfillmentOnRetailer(fulfillment, order)
    fulfillment.retailer_id = retailerFulfillmentId.toString()
    order.fulfillments.push(fulfillment)
    if (this.checkOrderFulfilled(order)) {
      order.status = "completed"
    }
    await order.save()
  }

  async cancelItemOnVendor(retailer: string, order: IAcendaOrder) {
    const matchingOrders = await this.ordersService.list({ filter: { retailer, retailer_id: order.id, status: "open" } })
    matchingOrders.forEach((matchedOrder) => {
      const updateOrder = new AcendaOrder()
      updateOrder.items = []
      matchedOrder.items.forEach(async (item) => {
        const matchedItems = order.items.filter((x) => x.id == Number(item.data_manager_id))
        if (matchedItems.length) {
          const updateItem = new AcendaOrderItem()
          if (matchedItems[0].quantity === 0 && matchedOrder.items.length === 1) {
            matchedOrder.status = "cancelled"
            await matchedOrder.save()
            await this.cancelOrder(matchedOrder.vendor, matchedOrder.vendor_id)
          } else if (matchedItems[0].quantity < item.quantity) {
            item.quantity = matchedItems[0].quantity
            updateItem.id = item.id
            updateItem.quantity = item.quantity
            updateItem.price = item.price
            updateItem.sku = item.sku
            updateOrder.items.push(updateItem)
          }
        }
        await matchedOrder.save()
        return await this.updateOrder(matchedOrder.vendor, matchedOrder.vendor_id, updateOrder)
      })
    })
  }

  async cancelItemOnRetailer(vendor: string, order: IAcendaOrder) {
    try {
      const matchedOrder = await this.ordersService.get({ filter: { vendor, vendor_id: order.id, status: "open" } })
      const updateOrder = new AcendaOrder()
      updateOrder.items = []
      matchedOrder.items.forEach(async (item) => {
        const matchedItems = order.items.filter((x) => x.id == Number(item.id))
        if (matchedItems.length) {
          const updateItem = new AcendaOrderItem()
          if (matchedItems[0].quantity < item.quantity) {
            item.quantity = matchedItems[0].quantity
            updateItem.price = item.price
            updateItem.sku = item.sku
            updateItem.quantity = item.quantity
            updateItem.id = Number(item.data_manager_id)
            updateOrder.items.push(updateItem)
          }
        }
        await matchedOrder.save()
        const result = await this.updateOrder(matchedOrder.retailer, matchedOrder.retailer_id, updateOrder)
        //console.logresult)
      })
    } catch (error) {
      throw error
    }

  }

  async updateOrder(storeId: string, orderId: string, update: IAcendaOrder) {
    try {
      const acenda = await this.acendaClient.getAcendaClient(storeId)
      const response = await acenda.update('order', orderId, update)
      return response.data.result
    } catch (error) {
      throw error
    }
  }

  async cancelOrderOnRetailer(vendor: string, order: IAcendaOrder) {
    try {
      const mappedOrder = await this.ordersService.get({ filter: { vendor, vendor_id: order.id, status: "open" } })
      if (mappedOrder) {
        //console.log'cancelling order', mappedOrder.retailer_id)
        mappedOrder.status = "cancelled"
        await mappedOrder.save()
        await this.cancelOrder(mappedOrder.retailer, mappedOrder.retailer_id)
      }
    } catch (error) {
      throw error
    }
  }

  async cancelOrderOnVendor(storeId: string, order: IAcendaOrder) {
    try {
      const matchingOrders = await this.ordersService.list({ filter: { retailer: storeId, retailer_id: order.id, status: "open" } })
      matchingOrders.forEach(async (matchedOrder) => {
        matchedOrder.status = "cancelled"
        await matchedOrder.save()
        await this.cancelOrder(matchedOrder.vendor, matchedOrder.vendor_id)
      })
    } catch (error) {
      throw error
    }
  }

  async cancelOrder(storeId: string, orderId: string) {
    try {
      const acenda = await this.acendaClient.getAcendaClient(storeId)
      const response = await acenda.create(`order/${orderId}/cancel`, '')
      return response.data.result
    } catch (error) {
      throw error
    }
  }
}