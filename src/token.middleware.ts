import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class TokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    const authJsonWebToken = req.headers.authorization;
    if (!req.baseUrl.startsWith('/subscriptions') && !req.baseUrl.startsWith('/sps') && !req.baseUrl.startsWith('/orders')) {
      if (!authJsonWebToken) {
        throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED)
      } else {
        try {
          const store = jwt.verify(authJsonWebToken.slice(7, authJsonWebToken.length), '@McQfTjWnZr4u7w!z%C*F-JaNdRgUkXp');
          if (store) {
            req['store'] = store;
            next();
          }
        } catch (error) {
          throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED)
        }
      }
    }
    else {
      next();
    }
  }
}