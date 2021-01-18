import {
  CallHandler, ExecutionContext, Injectable,
  NestInterceptor, UnauthorizedException
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';


@Injectable()
export class StoreIdInterceptor implements NestInterceptor {
  constructor() {
  }
  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    try {
      const incomingMessage = context.getArgs()[0];
      if (!incomingMessage['originalUrl'].startsWith('/subscriptions') && context.getHandler().name != "callback") {
        const authJsonWebToken: string = incomingMessage.headers.authorization;
        const store = jwt.verify(authJsonWebToken.slice(7, authJsonWebToken.length), '@McQfTjWnZr4u7w!z%C*F-JaNdRgUkXp');
        if (store) {
          incomingMessage.body.storeId = store["storeId"];
          return next.handle();
        }
      } else {
        return next.handle()
      }
    } catch (e) {
      throw new UnauthorizedException('Authorization Failed');
    }
  }
}