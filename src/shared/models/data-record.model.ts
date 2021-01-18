import { RecordField } from './record-field.model';

export interface IDataRecord {
  source: string
  modelName: string
  fields: RecordField[]
}

export class DataRecord implements IDataRecord {
  constructor() { }
  source: string;
  modelName: string;
  fields: RecordField[];
}