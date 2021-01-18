import { Inject, Injectable } from '@nestjs/common';
import { AcendaClient } from 'src/acenda-client/acenda-client';
import { AcendaAdapterService } from './acenda-adapter.service';
import { AcendaService } from './acenda.service';
import { IAcendaVariant } from './models/acenda-variant.model';


@Injectable()
export class AcendaProductsService {
  constructor(@Inject(AcendaClient) private acendaClient: AcendaClient, 
  private acendaAdapterService: AcendaAdapterService, private acendaService: AcendaService) { }

  async getVariantById(storeId: string, id: string): Promise<IAcendaVariant> {
    try {
      const acenda = await this.acendaClient.getAcendaClient(storeId)

      const response = await acenda.get('variant', id)
      return response.data.result as IAcendaVariant
    } catch (error) {
      throw error
    }
  }


  async updateVariant(vendorId: string, variant: IAcendaVariant) {
    // product changed in storeId store
    // we have to find all stores use storeId as vendor
    const acendaAdapter = await this.acendaAdapterService.list({ filter: { "stores.storeId": vendorId } })
    const updateData = { inventory_quantity: variant.inventory_quantity }
    await Promise.all(acendaAdapter.map(async retailer => {
      const acenda = await this.acendaClient.getAcendaClient(vendorId)
      const targetVariant = await acenda.list('variant', `query={"data_manager_id":${variant.id},"data_manager_source":"${vendorId}"}`, 1, 1);
      const response = await acenda.update('variant', targetVariant.data.result[0].id, updateData)
    }))
  }
}