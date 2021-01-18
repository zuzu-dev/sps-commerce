import { ISubscription } from '../../subscriptions/models/subscription.model';

export class AcendaCredentialsDto {
  storeId: string
  stores: ISubscription[]
}