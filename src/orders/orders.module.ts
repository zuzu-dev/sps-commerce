import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Order } from './models/order.model';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';



@Module({
  imports: [TypegooseModule.forFeature([Order])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports:[OrdersService]
})
export class OrdersModule { }
