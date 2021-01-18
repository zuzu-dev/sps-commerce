import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { AcendaClientModule } from './acenda-client/acenda-client.module';
import { AcendaModule } from './acenda/acenda.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './config/keys';
import { OrdersModule } from './orders/orders.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { TokenMiddleware } from './token.middleware';
import { SpsModule } from './sps/sps.module';


@Module({
  imports: [
    TypegooseModule.forRoot(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }),
    AcendaModule,
    SubscriptionsModule, 
    OrdersModule,
    AcendaClientModule,
    SpsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
