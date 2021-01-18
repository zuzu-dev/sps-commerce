import { SaveOptions } from 'mongoose';
import { ICreateParams } from 'mongoose-crud-service';
import { IAcendaVariant } from 'src/acenda/models/acenda-variant.model';

import { IAcendaOrder, IFulfillment } from '../../acenda/models/acenda-order.model';
import { IAcendaProduct } from '../../acenda/models/acenda-product.model';
import { ISubscription } from '../models/subscription.model';

export class SubscriptionCrudDto {
    readonly acenda: {
        readonly store: {
            readonly name: string,
        },
        readonly subscription: {
            readonly credentials: {
                readonly api_key: string,
                readonly notifications_email: string,
            },
            readonly id: string,
        },
        readonly event_payload: [
            {
                readonly Order: IAcendaOrder,
                readonly Product: IAcendaProduct,
                readonly OrderFulfillment: IFulfillment,
                readonly Variant: IAcendaVariant
            }
        ]
    };
}

export class CreateSubscriptionDto implements ICreateParams<ISubscription> {
    constructor(public data: ISubscription) {
    }
    options: SaveOptions;
    user: any;

}

