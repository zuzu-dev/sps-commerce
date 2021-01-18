import { IsString } from "class-validator"

export class GetCategoriesWithQueryArgs {
  @IsString()
  apiSource: string
  @IsString()
  storeId: string
  @IsString()
  query: string
}