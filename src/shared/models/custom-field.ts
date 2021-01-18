import { DataType } from './enums';

export class CustomField {
  name: string
  dataType: DataType
  required: boolean
  validator: string
}