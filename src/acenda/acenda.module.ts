import { forwardRef, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { AcendaClientModule } from 'src/acenda-client/acenda-client.module';
import { OrdersModule } from 'src/orders/orders.module';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';
import { AcendaAdapterService } from './acenda-adapter.service';
import { AcendaOrdersService } from './acenda-orders.service';
import { AcendaProductsService } from './acenda-products.service';
import { AcendaController } from './acenda.controller';
import { AcendaService } from './acenda.service';
import { AcendaAdapter } from './models/acenda-adapter.model';



@Module({
  imports: [TypegooseModule.forFeature([AcendaAdapter]), AcendaClientModule, forwardRef(() => SubscriptionsModule),
    OrdersModule],
  controllers: [AcendaController],
  providers: [AcendaService, AcendaAdapterService, AcendaOrdersService, AcendaProductsService],
  exports: [AcendaService, AcendaClientModule, AcendaAdapterService, AcendaOrdersService, AcendaProductsService]
})
export class AcendaModule { }
