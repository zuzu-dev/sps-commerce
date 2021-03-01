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

  @Post('update-variant')
  async updateVariant(@Body() args: SubscriptionCrudDto) {
    const variant = args.acenda.event_payload[0].Variant
    return this.acendaProductsService.updateVariant(args.acenda.store.name, variant)
  }


}