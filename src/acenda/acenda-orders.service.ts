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
  constructor(@Inject(AcendaClient) private acendaClient, private acendaProductsService: AcendaProductsService) { }

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

  private async checkVariantOnVendor(orderItem: IAcendaOrderItem, storeId) {
    const acendaVariant = await this.acendaProductsService.getVariantById(storeId, orderItem.variant_id.toString()) as IAcendaVariant
    if (acendaVariant.data_manager_id) {
      orderItem.data_manager_id = acendaVariant.data_manager_id
      orderItem.data_manager_source = acendaVariant.data_manager_source
    }
    return orderItem
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

  async updateOrder(storeId: string, orderId: string, update: IAcendaOrder) {
    try {
      const acenda = await this.acendaClient.getAcendaClient(storeId)
      const response = await acenda.update('order', orderId, update)
      return response.data.result
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