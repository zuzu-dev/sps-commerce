import { Module } from '@nestjs/common';
import { SpsController } from './sps.controller';
import { SpsService } from './sps.service';

@Module({
  controllers: [SpsController],
  providers: [SpsService],
  exports: [SpsService]
})
export class SpsModule {}
