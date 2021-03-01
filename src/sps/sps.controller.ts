import { Controller, Get, Post } from '@nestjs/common';
import { SpsService } from './sps.service';

@Controller('sps')
export class SpsController {
    constructor(private spsService: SpsService) {}

    @Get()
    redirect() {
        console.log(`redirected`);
        return "Success!"
    }

    @Get('purchase-orders')
    async getTransactions() {
        return await this.spsService.get('orders');
    }

    @Post('test')
    async test() {
        var obj = {name: "Super", Surname: "Man", age: 23};
        return await this.spsService.json2xml(obj);
    }
}
