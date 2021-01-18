import { HttpException, Inject, Injectable, Response } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { GenericMongooseCrudService } from 'mongoose-crud-service';
import { InjectModel } from 'nestjs-typegoose';
import { AcendaClient } from 'src/acenda-client/acenda-client';
import { v4 as uuidv4 } from 'uuid';
import { Helper } from '../shared/helper';
import { CreateSubscriptionDto, SubscriptionCrudDto } from './dto/subscription-crud.dto';
import { ISubscription, ISubscriptionModel, Subscription } from './models/subscription.model';



@Injectable()
export class SubscriptionsService extends GenericMongooseCrudService<ISubscription, ISubscriptionModel> {

  constructor(@Inject(AcendaClient) private acendaClient: AcendaClient,
    @InjectModel(Subscription) public subscriptionModel: Model<ISubscriptionModel>, private jwtService: JwtService) {
    super(subscriptionModel)
  }



  public async login(storeId: string, apiKey: string, @Response() res) {

    const storeResult = await this.subscriptionModel.findOne({ storeId });
    if (!storeResult) {
      throw new HttpException('Error', 403)
    }

    if (storeResult.apiKey === apiKey) {
      //this payload contains _id,username and role.
      //Thanks to this jwt, we will able to know each request is send by whom.
      //Then, we will return true or false after checking role
      const payload = { id: storeResult._id, storeId: storeResult.storeId, apiKey: storeResult.apiKey, isActive: storeResult.isActive };
      const accessToken = await this.jwtService.sign(payload);
      res.send(accessToken);
      // res.cookie('accessToken', accessToken);
      // return res.sendStatus(200);
    } else {
      throw new HttpException('Invalid account error', 403)
    }
  }

  async createSubscription(subscriptionDto: SubscriptionCrudDto) {
    const storeId = subscriptionDto.acenda.store.name;
    try {
      const subscription = await this.model.findOne({ storeId })
      if (!subscription) {
        const apiKey = uuidv4();
        const subscription = new Subscription();
        subscription.apiKey = apiKey;
        subscription.storeId = storeId;
        subscription.isActive = true;
        subscription.notificationsEmail = subscriptionDto.acenda.subscription.credentials.notifications_email || ""
        const createSubscriptionDto = new CreateSubscriptionDto(subscription);
        await this.create(createSubscriptionDto);
        await this.saveApiKeyAndCredentials(storeId, subscriptionDto.acenda.subscription.id, subscription);
      } else {
        subscription.notificationsEmail = subscriptionDto.acenda.subscription.credentials.notifications_email || ""
        const subscriptionModel = await subscription.save()
        await this.saveApiKeyAndCredentials(storeId, subscriptionDto.acenda.subscription.id, subscriptionModel);
      }
    } catch (error) {
      throw error
    }
  }

  async saveApiKeyAndCredentials(storeId: string, serviceId: string, subscription: ISubscription) {
    try {
      const data = Helper.generateAcendaCredentials(['apiKey', 'notificationsEmail'], subscription)
      const acenda = await this.acendaClient.getAcendaClient(storeId)
      await acenda.update('servicesubscribers', serviceId, data)
    } catch (error) {
      throw error
    }
  }
}
