import { prop } from '@typegoose/typegoose';

export class DataField {
  @prop()
  key: string
  @prop()
  value: string
}