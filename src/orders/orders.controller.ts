import { Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) { }

    @Post('transfer-orders')
    async transferOrders() {
        this.ordersService.tranferOrders2Acenda("botstore");    
    }
}
