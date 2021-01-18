import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AcendaClient } from './acenda-client';
import { acendaAuth } from './acenda-client.provider';

@Module({
  imports: [AuthModule],
  providers: [acendaAuth, AcendaClient],
  exports: [AcendaClient]
})
export class AcendaClientModule { }
