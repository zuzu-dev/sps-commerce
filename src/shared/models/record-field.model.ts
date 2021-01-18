import { modelOptions, prop, Severity } from '@typegoose/typegoose';

import { DataType, Validator } from './enums';

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class RecordField {
  @prop()
  name: string
  @prop()
  value: string | number | boolean | any[]
  @prop({ enum: DataType })
  dataType: DataType
  @prop({ enum: Validator })
  validator?: Validator
}