import { forwardRef, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { AcendaModule } from 'src/acenda/acenda.module';
import { SpsModule } from 'src/sps/sps.module';
import { Order } from './models/order.model';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';



@Module({
  imports: [
    TypegooseModule.forFeature([Order]),
    SpsModule,
    forwardRef(() => AcendaModule)
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports:[OrdersService]
})
export class OrdersModule { }
