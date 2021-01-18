import { Body, Controller, Post, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { StoreIdInterceptor } from '../shared/current.interceptor';
import { AcendaAdapterService } from './acenda-adapter.service';
import { AcendaOrdersService } from './acenda-orders.service';
import { AcendaService } from './acenda.service';
import { GetCategoriesWithQueryArgs } from './dto/acenda-adapters-query';
import { AcendaCredentialsDto } from './dto/acenda-credentials.dto';
import { CreateAcendaVendorDto } from './dto/create-acenda-vendor.dto';
import { DeleteAcendaVendorDto } from './dto/delete-acenda-vendor.dto';


@Controller('acenda')
export class AcendaController {

  constructor(private acendaService: AcendaService, private acendaAdapterService: AcendaAdapterService,
    private acendaOrdersService: AcendaOrdersService) {

  }

  @UseInterceptors(StoreIdInterceptor)
  @Post('credentials')
  async saveCredentials(@Body() args: AcendaCredentialsDto) {
    return await this.acendaAdapterService.saveAcendaAdapter(args)
  }

  @UseInterceptors(StoreIdInterceptor)
  @Post('check-acenda')
  async checkAcendaStore(@Body() args: CreateAcendaVendorDto) {
    return await this.acendaAdapterService.checkAcendaStoreByApiKey(args)
  }

  @UseInterceptors(StoreIdInterceptor)
  @Post('adapters')
  async getAdapters(@Body() args) {
    try {
      return await this.acendaAdapterService.get({ filter: { storeId: args.storeId } })

    } catch (error) {
      return error
    }
  }

  @UseInterceptors(StoreIdInterceptor)
  @Post('delete-acenda-credential')
  async deleteAcendaCredentialById(@Body() args: DeleteAcendaVendorDto) {
    return await this.acendaAdapterService.deleteAcendaCredentialById(args)
  }

  @UseInterceptors(StoreIdInterceptor)
  @Post('check')
  async checkAcenda(@Body() args) {
    return this.acendaAdapterService.checkAcendaAdapter(args.storeId)
  }


  @UseInterceptors(StoreIdInterceptor)
  @Post('get-acenda-categories')
  async getAcendaCategories(@Body() args) {
    return this.acendaService.getAcendaCategories(args)
  }


  @UseInterceptors(StoreIdInterceptor)
  @Post('get-acenda-fields')
  async getAcendaFieldsRelatedByProduct(@Body() args) {
    return this.acendaService.getAcendaFieldsRelatedByProduct(args)
  }

  @UseInterceptors(StoreIdInterceptor)
  @Post('get-acenda-products')
  async getAcendaProducts(@Body() args) {
    return this.acendaService.getAcendaProducts(args)
  }

  @UseInterceptors(StoreIdInterceptor)
  @Post('send-notify')
  async sendNotify(@Body() args) {
    //return this.acendaService.sendNotify(args,"as")
  }

  @UseInterceptors(StoreIdInterceptor)
  // @UseFilters(new HttpExceptionFilter())
  @Post('get-categories-with-query')
  async getCategoryiesWithQuery( @Body(new ValidationPipe()) args:GetCategoriesWithQueryArgs) {
    return this.acendaService.getCategoriesWithQuery(args)
  }


}
