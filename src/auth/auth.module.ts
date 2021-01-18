import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuthService } from './auth.service';
import { Auth } from './models/auth.model';



@Module({
  imports: [TypegooseModule.forFeature([Auth])],
  providers: [AuthService],
  exports:[AuthService]
})
export class AuthModule { }
