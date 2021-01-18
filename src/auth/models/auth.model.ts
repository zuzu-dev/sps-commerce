import { IModelInstance, IMongoDocument } from 'mongoose-crud-service';

import { prop } from '@typegoose/typegoose';

export class Auth implements IAuth {
    _id: any;
    @prop()
    name: string;
    @prop()
    tokenType: string;
    @prop()
    accessToken: string;
    @prop()
    expiresIn: number;
    @prop()
    refreshToken: string;
    @prop()
    xRefreshToken: number;
    @prop()
    idToken: string;
    @prop()
    createdAt?: Date;
    createdBy?: object;
    @prop()
    deleted?: boolean;
    @prop()
    deletedAt?: Date;
    deletedBy?: object;
    @prop()
    updatedAt?: Date;
    updatedBy?: object;
    @prop()
    scope?: string
}

export interface IAuthModel extends IAuth, IMongoDocument {
}

export interface IAuth extends IModelInstance {
    name: string;
    tokenType: string;
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
    xRefreshToken: number;
    idToken: string;
    scope?: string

}
