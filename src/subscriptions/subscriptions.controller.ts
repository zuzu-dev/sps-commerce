import { Body, Controller, Post, Response } from '@nestjs/common';
import { AcendaAdapterService } from 'src/acenda/acenda-adapter.service';
import { AcendaProductsService } from 'src/acenda/acenda-products.service';
import { AcendaOrdersService } from '../acenda/acenda-orders.service';
import { LoginDto } from './dto/login.dto';
import { SubscriptionCrudDto } from './dto/subscription-crud.dto';
import { SubscriptionsService } from './subscriptions.service';



@Controller('subscriptions')
export class SubscriptionsController {

  constructor(private subscriptionsService: SubscriptionsService,
    private acendaOrdersService: AcendaOrdersService,
    private acendaProductsService: AcendaProductsService,
    private acendaAdapterService:AcendaAdapterService) {

  }

  @Post('login')
  login(@Body() loginDto: LoginDto, @Response() res) {
    return this.subscriptionsService.login(loginDto.storeId, loginDto.apiKey, res)
  }

  @Post('register')
  async register(@Body() args: SubscriptionCrudDto) {
    try {
      await this.subscriptionsService.createSubscription(args);
    } catch (error) {
      throw error
    }
  }

  @Post('create-fulfillment')
  async createFulfillment(@Body() args: SubscriptionCrudDto) {
    const fulfillment = args.acenda.event_payload[0].OrderFulfillment
    return this.acendaOrdersService.updateFulfillmentFromVendor(args.acenda.store.name, fulfillment)

  }

  @Post('create-order')
  async createOrder(@Body() args: SubscriptionCrudDto) {
    const order = args.acenda.event_payload[0].Order
    if (!order.data_manager_source) {
      return this.acendaOrdersService.createOrderFromRetailer(args.acenda.store.name, order)
    }
  }

  @Post('update-order')
  async updateOrder(@Body() args: SubscriptionCrudDto) {
    const order = args.acenda.event_payload[0].Order
    if (order.data_manager_source) {
      return this.acendaOrdersService.cancelItemOnRetailer(args.acenda.store.name, order)
    } else {
      return this.acendaOrdersService.cancelItemOnVendor(args.acenda.store.name, order)
    }
  }

  @Post('cancel-order')
  async cancelOrder(@Body() args: SubscriptionCrudDto) {
    try {
      const order = args.acenda.event_payload[0].Order

      if (order.data_manager_source) {
        return this.acendaOrdersService.cancelOrderOnRetailer(args.acenda.store.name, order)
      } else {
        return this.acendaOrdersService.cancelOrderOnVendor(args.acenda.store.name, order)
      }
    } catch (error) {
      throw error
    }
  }


  @Post('update-variant')
  async updateVariant(@Body() args: SubscriptionCrudDto) {
    const variant = args.acenda.event_payload[0].Variant
    return this.acendaProductsService.updateVariant(args.acenda.store.name, variant)
  }

  @Post('reconcile-orders')
  async reconcileOrders(@Body() args: SubscriptionCrudDto) {
    try {
      const storeId = args.acenda.store.name
      const adapters = await this.acendaAdapterService.list({ filter: { storeId, stores: { $exists: true, $ne: [] } } })
      if (adapters.length) {
        this.acendaOrdersService.reconcileOrders(storeId)
      }
    } catch (error) {
      throw error
    }
  }

  @Post('reconcile-fulfillments')
  async reconcileFulfillments(@Body() args: SubscriptionCrudDto) {
    try {
      const storeId = args.acenda.store.name
      const adapters = await this.acendaAdapterService.list({ filter: { storeId, stores: { $exists: true, $ne: [] } } })
      if (adapters.length) {
        this.acendaOrdersService.reconcileFulfillments(storeId)
      }
    } catch (error) {
      throw error
    }
  }

}