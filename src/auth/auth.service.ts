import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Model } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import config from '../config/keys';
import { Auth, IAuth, IAuthModel } from './models/auth.model';



@Injectable()
export class AuthService {
  constructor(@InjectModel(Auth) private readonly authModel: Model<IAuthModel>) {
  }

  async getAccessToken(): Promise<IAuth> {
    const acendaApi: Auth = await this.authModel.findOne({ name: 'acenda' });
    if (acendaApi) {
      if (((Date.now() - acendaApi.createdAt.getTime()) > ((acendaApi.expiresIn - 14400) * 1000))) {
        return await this.createOrUpdateAccessToken();
      } else {
        return acendaApi;
      }
    } else {
      return await this.createOrUpdateAccessToken();
    }
  }

  async createOrUpdateAccessToken() {
    const response = await axios.post(config.tokenHost, {
      "grant_type": "client_credentials",
      "client_id": config.clientId,
      "client_secret": config.clientSecret
    })

    if (response.data) {
      const auth = new Auth()
      auth.accessToken = response.data.access_token
      auth.name = "acenda"
      auth.expiresIn = response.data.expires_in
      auth.createdAt = new Date()
      return await this.authModel.findOneAndUpdate({ name: "acenda" }, auth, { upsert: true })
    }
  }
}
