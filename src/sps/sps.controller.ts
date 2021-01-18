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

    @Post('access-token') 
    getAccessToken() {
        return this.spsService.getAccessToken()
    }
}
