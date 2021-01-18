import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { GenericMongooseCrudService } from 'mongoose-crud-service';
import { InjectModel } from 'nestjs-typegoose';
import { Subscription } from '../subscriptions/models/subscription.model';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { AcendaCredentialsDto } from './dto/acenda-credentials.dto';
import { CreateAcendaVendorDto } from './dto/create-acenda-vendor.dto';
import { DeleteAcendaVendorDto } from './dto/delete-acenda-vendor.dto';
import { AcendaAdapter, IAcendaAdapter, IAcendaAdapterModel } from './models/acenda-adapter.model';



export class AcendaAdapterService extends GenericMongooseCrudService<IAcendaAdapter, IAcendaAdapterModel> {
  constructor(@InjectModel(AcendaAdapter) private acendaAdapterModel: Model<IAcendaAdapterModel>, private subscriptionsService: SubscriptionsService) {
    super(acendaAdapterModel)
  }
  async saveAcendaAdapter(args: AcendaCredentialsDto) {
    const { stores, storeId } = args
    let isFailed: boolean = false
    try {
      stores.forEach(async (store) => {
        try {
          await this.subscriptionsService.get({ filter: { storeId: store.storeId, apiKey: store.apiKey } })
        } catch (error) {
          isFailed = true
        }
      })
      const adapter = await this.get({ filter: { storeId } })
      if (!isFailed) {
        adapter.stores = stores
        return await adapter.save()
      } else {
        throw new BadRequestException()
      }

    } catch (error) {
      if (!isFailed) {
        const acendaAdapter = new AcendaAdapter()
        acendaAdapter.storeId = storeId
        acendaAdapter.stores = stores
        await this.create({ data: acendaAdapter })
      } else {
        throw new NotFoundException('check your credentials')
      }
    }
  }

  async deleteAcendaCredentialById(args: DeleteAcendaVendorDto) {
    let acendaAdapter = await this.acendaAdapterModel.findOne({ storeId: args.storeId })
    if (acendaAdapter) {
      if (args.vendorId !== args.storeId) {
        let stores = []
        acendaAdapter.stores.map(store => {
          if (store.storeId !== args.vendorId) {
            stores.push(store)
          }
        })
        acendaAdapter.stores = stores
        return await acendaAdapter.updateOne(acendaAdapter)
      }
    } else {
      throw new NotFoundException('Check your credentials')
    }
  }

  async checkAcendaStoreByApiKey(args: CreateAcendaVendorDto) {
    try {
      if(args.storeId==args.vendorId){
        throw new NotFoundException('Your vendor is same by your account')
      }

      let vendors = await this.subscriptionsService.get({ filter: { storeId: args.vendorId, apiKey: args.apiKey } })
      if (vendors) {
        let acendaAdapter = await this.acendaAdapterModel.findOne({ storeId: args.storeId })
        if (acendaAdapter) {
          console.log(acendaAdapter)
          let isExists = false
          acendaAdapter.stores.map(store => {
            if (store.storeId === args.vendorId) {
              isExists = true
            }
          })
          if (!isExists) {
            let stores = []
            acendaAdapter.stores.map(store => {
              stores.push(store)
            })
            stores.push({ storeId: args.vendorId, apiKey: args.apiKey })
            acendaAdapter.stores = stores
            return await acendaAdapter.save()
          } else {
            throw new NotFoundException('Check your credentials')
          }
        } else {
          if (args.vendorId !== args.storeId) {
            const adapter = new AcendaAdapter()
            adapter.storeId = args.storeId
            const subscription = new Subscription()
            subscription.storeId = args.vendorId
            subscription.apiKey = args.apiKey
            adapter.stores = []
            adapter.stores.push(subscription)
            return await this.acendaAdapterModel.create(adapter)
          } else {
            throw new NotFoundException('Your vendor is same by your account.')
          }
        }
      } else {
        throw new NotFoundException('Check your credentials')
      }
    } catch (error) {
      throw new NotFoundException('Check your credentials')
    }

  }


  async getAdapters(storeId) {
    return this.acendaAdapterModel.find({ storeId })
  }

  async checkAcendaToExport(args) {
    try {
      return await this.subscriptionsService.get({ filter: { storeId: args.apiSource, apiKey: args.apiKey } })
    } catch (error) {
      throw error
    }
  }

  async checkAcendaAdapter(storeId) {
    try {
      const adapter = await this.acendaAdapterModel.findOne({ storeId })
      if (adapter && adapter.stores.length > 0) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    }


  }
}