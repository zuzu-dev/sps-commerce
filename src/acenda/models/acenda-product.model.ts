import { VariantOption } from '../../shared/models/variant-option';
import { AcendaVariant } from './acenda-variant.model';
import { PersonalizationOption } from './personalization_option.model';

export class AcendaImage {
  url:string
}
export class AcendaProduct implements IAcendaProduct {
  storeId?: string
  id?: number
  acenda_id?: number;
  group?: string;
  status: string;
  slug?: string;
  name: string;
  collection_id?: number[];
  category_id?: number[];
  customer_group_id?: number[];
  popularity?: number;
  brand?: string;
  type?: string;
  tags?: string[];
  description?: string;
  cross_sellers?: number[];
  review_score?: number;
  variant_options?: VariantOption[];
  options?: string[];
  images?: AcendaImage[];
  videos?: string[];
  dynamic_attributes?: string[];
  personalization_options?: PersonalizationOption[];
  date_modified?: string;
  date_created?: Date;
  title?: string;
  thumbnail?: string;
  url?: string;
  category?: string[];
  collections?: any[];
  keywords?: string[];
  data_manager_id?: string;
  data_manager_source?: string;
  variants?: AcendaVariant[]
}

export interface IAcendaProduct {
  id?: number
  storeId?: string
  acenda_id?: number
  group?: string
  status: string
  slug?: string
  name: string
  collection_id?: number[],
  category_id?: number[],
  customer_group_id?: number[],
  popularity?: number,
  brand?: string,
  type?: string,
  tags?: string[],
  description?: string,
  cross_sellers?: number[],
  review_score?: number,
  variant_options?: VariantOption[],
  options?: string[],
  images?: AcendaImage[],
  videos?: string[],
  dynamic_attributes?: string[],
  personalization_options?: PersonalizationOption[],
  date_modified?: string,
  date_created?: Date,
  title?: string,
  thumbnail?: string,
  url?: string,
  category?: string[],
  collections?: any[],
  keywords?: string[],
  data_manager_id?: string,
  data_manager_source?: string,
  variants?: AcendaVariant[]
  compare_price?:number
}

//export interface IAcendaProductModel extends IAcendaProduct, IMongoDocument { }