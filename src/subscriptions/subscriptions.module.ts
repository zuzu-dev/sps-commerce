import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypegooseModule } from 'nestjs-typegoose';
import { AcendaModule } from 'src/acenda/acenda.module';
import { Subscription } from './models/subscription.model';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';



@Module({
  imports: [TypegooseModule.forFeature([Subscription]), JwtModule.register({
    secret: '@McQfTjWnZr4u7w!z%C*F-JaNdRgUkXp',
    signOptions: {
      expiresIn: 86400,
    },
  }), forwardRef(() => AcendaModule)],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService]
})
export class SubscriptionsModule { }
