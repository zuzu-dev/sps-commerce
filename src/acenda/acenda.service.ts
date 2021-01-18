import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Acenda } from 'acenda';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import _ from 'lodash';
import md5 from 'md5';
import { AcendaClient } from 'src/acenda-client/acenda-client';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { Constants } from '../shared/constants';
import { Helper } from '../shared/helper';
import { CustomField } from '../shared/models/custom-field';
import { DataRecord, IDataRecord } from '../shared/models/data-record.model';
import { DataType, Validator } from '../shared/models/enums';
import { AcendaCategory } from './models/acenda-category.model';
import { AcendaCollection } from './models/acenda-collection.model';
import { AcendaProduct, IAcendaProduct } from './models/acenda-product.model';
import { AcendaVariant } from './models/acenda-variant.model';


@Injectable()
export class AcendaService {

  constructor(@Inject(AcendaClient) private acendaClient: AcendaClient,
    private subscriptionsService: SubscriptionsService) {

  }

  public async getParentIdOfAcendaSoureCategory(storeId, sourceCatId) {
    try {
      const acenda = await this.acendaClient.getAcendaClient(storeId)
      const category = await acenda.get('category', sourceCatId)
      if (category.data.result.parent_id.length) {
        return category.data.result.parent_id[0]
      } else {
        return "0"
      }
    } catch (error) {
      throw error
    }
  }

  async createCustomFields(customFields: CustomField[], storeId: string) {

    try {
      const acenda = await this.acendaClient.getAcendaClient(storeId)
      if (!Array.isArray(customFields))
        return

      const modelTypes: string[] = []
      customFields.forEach((field) => {
        if (!modelTypes.includes(field.dataType)) {
          modelTypes.push(field.dataType)
        }
      })
      modelTypes.forEach(async (modelType) => {
        const res = await acenda.get('dataschema', modelType)
        const existingRules = res.data.result.rules
        const existingFields: string[] = []
        existingRules.forEach((rule) => existingFields.push(rule.name))
        let rules = [...existingRules]
        customFields.forEach((field) => {
          if (field.dataType === modelType && !existingFields.includes(field.name))
            rules.push({ name: field.name, required: false, validator: field.validator });
        })
        await acenda.update('dataschema', modelType, { rules })
      })
    } catch (error) {
      throw error
    }
  }

  public async getAcendaFields(model: string, storeId: string) {
    model = model.toLowerCase()
    const modelNames: string[] = []
    modelNames.push(model)
    let fields = []
    if (model == 'product') {
      modelNames.push('variant')
    }
    const acenda = await this.acendaClient.getAcendaClient(storeId)

    try {
      await Promise.all(modelNames.map(async (model) => {
        const res = await acenda.get('dataschema', model)
        res.data.result.rules.forEach((rule) => {
          if (rule.validator == "string" || rule.validator == "boolean" || rule.validator == "numerical")
            if (`${model}.${rule.name}` != `product.data_manager_id`
              && `${model}.${rule.name}` != `product.data_manager_source`
              && `${model}.${rule.name}` != `variant.data_manager_id`
              && `${model}.${rule.name}` != `variant.data_manager_source`)
              fields.push({ name: `${model}.${rule.name}`, dataType: rule.validator, required: rule.required })
        })
      }))
      fields = fields.concat(Constants.getAcendaFields(model))
      const shortedFields = fields.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
      return shortedFields
    } catch (error) {
      throw error
    }
  }

  async getAcendaProductByField(fieldName: string, fieldValue: string, storeId: string): Promise<AcendaProduct> {

    try {
      const acenda = await this.acendaClient.getAcendaClient(storeId)

      const matchingProducts = await acenda.list('product', `query={${fieldName}:${fieldValue}}`);
      if (matchingProducts.data.result.length) {
        return matchingProducts.data.result[0];
      }
    } catch (error) {
      throw error
    }
  }

  async createProduct(product: AcendaProduct, storeId: string) {
    try {
      const acenda = await this.acendaClient.getAcendaClient(storeId)

      const response = await acenda.create('product', product)
      if (response.data) {
        return response.data.result
      }
    } catch (error) {
      throw error
    }
  }


  async createVariant(variant: AcendaVariant, storeId: string) {
    try {
      const acenda = await this.acendaClient.getAcendaClient(storeId)

      const response = await acenda.create('variant', variant)
      if (response.data) {
        return response.data.result
      }
    } catch (error) {
      throw error
    }
  }

  async updateProduct(id: string, product: AcendaProduct, storeId: string) {
    try {
      const acenda = await this.acendaClient.getAcendaClient(storeId)

      const response = await acenda.update('product', id, product)
      if (response.data) {
        return response.data.result
      }
    } catch (error) {
      throw error
    }
  }


  async updateVariant(id: string, variant: AcendaVariant, storeId: string) {
    try {
      const acenda = await this.acendaClient.getAcendaClient(storeId)
      const response = await acenda.update('variant', id, variant)
      if (response.data) {
        return response.data.result
      }
    } catch (error) {
      throw error
    }
  }

  async getAcendaVariantByIdentifier(acendaVariant: AcendaVariant, productId: number, storeId: string): Promise<AcendaVariant> {
    try {
      const acenda = await this.acendaClient.getAcendaClient(storeId)

      const apiResult = await acenda.list(`product/${productId}/variants`);
      let found: AcendaVariant
      if (apiResult.data.result.length) {
        const variants = apiResult.data.result as AcendaVariant[]
        variants.forEach((variant) => {
          if ((variant.sku && variant.sku == acendaVariant.sku)
            || (variant.barcode && variant.barcode == acendaVariant.barcode)
            || (variant.name && variant.name == acendaVariant.name)) {
            found = variant
          }
        });
      }
      return found
    } catch (error) {
      throw error
    }
  }
  
  async getAcendaCategoryId(category: string, storeId: string): Promise<number> {
    try {
      const acenda = await this.acendaClient.getAcendaClient(storeId)

      let response = await acenda.list('category', `query={name:${category}}`)
      if (response.data.result.length) {
        return response.data.result[0]["id"]
      } else {
        response = await acenda.create('category', { name: category })
        return response.data.result
      }
    } catch (error) {
      throw error
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public async deleteAllAcendaProducts(storeId: string) {
    try {
      //console.log'delete started')
      storeId = "botbot"
      const acenda = await this.acendaClient.getAcendaClient(storeId)

      let limit = 250;
      const response = await acenda.list('product', "", 1, limit)
      const products = response.data.result
      const res = await acenda.get('product', response.data.result[0].id)
      await Promise.all(products.map(async (product) => {
        await acenda.delete('product', product.id.toString())
      }))
      if (limit === products.length) {
        await this.sleep(5000);
        await this.deleteAllAcendaProducts(storeId)
      }
    } catch (error) {
      await this.sleep(30000);
      await this.deleteAllAcendaProducts(storeId)
      throw error
    }
  }



  
  async checkCategories(acendaSource, acendaTarget) {
    try {
      const responseOfAllCategories = await acendaSource.list('category', '', 1, 250);
      await Promise.all(responseOfAllCategories.data.result.map(async category => {
        let query = `query={"slug": "${category.slug}" }`;
        let responseOfTargetCategory = await acendaTarget.list('category', query, 1, 1)
        if (responseOfTargetCategory.data.result.length > 0) {
          // //console.log`${category.slug} exists`);
        } else {
          let categoryDto = new AcendaCategory()
          categoryDto.name = category.name
          categoryDto.slug = category.slug
          categoryDto.status = category.status
          categoryDto.selection = category.selection
          categoryDto.has_items = category.has_items
          await acendaTarget.create('category', categoryDto);
        }
      }))
    } catch (error) {
      throw error
    }

  }


  async linkToCategoryIds(acendaSource: Acenda, acendaTarget: Acenda) {
    try {
      const responseOfAllCategories = await acendaSource.list('category', '', 1, 250);
      await Promise.all(responseOfAllCategories.data.result.map(async category => {
        let query = `query={"slug": "${category.slug}" }`;
        let responseOfTargetCategory = await acendaTarget.list('category', query, 1, 1)
        if (responseOfTargetCategory.data.result.length > 0) {
          if (category.parent_id.length) {
            const parent_id = []
            await Promise.all(category.parent_id.map(async parent => {
              let categoryInSource = await acendaSource.get('category', parent)
              let categoryInTarget = await acendaTarget.list('category', `query={"slug": "${categoryInSource.data.result.slug}" }`, 1, 1)
              parent_id.push(categoryInTarget.data.result[0].id)
            }))
            const response = await acendaTarget.update('category', responseOfTargetCategory.data.result[0].id, { parent_id })
          }

        } else {
          // //console.log`${category.slug} not found! There is smt wrong.`);
        }
      }))
    } catch (error) {
      throw error
    }
  }
  async checkCollections(acendaSource, acendaTarget) {
    try {
      const responseOfAllCollections = await acendaSource.list('collection', '', 1, 250)
      await Promise.all(responseOfAllCollections.data.result.map(async collection => {
        let query = `query={"slug": "${collection.slug}" }`
        let responseOfTargetCollection = await acendaTarget.list('collection', query, 1, 1)
        if (responseOfTargetCollection.data.result.length > 0) {
          //  //console.log`${collection.slug} exists`)
        }
        else {
          let collectionDto = new AcendaCollection()
          collectionDto.name = collection.name
          collectionDto.slug = collection.slug
          collectionDto.status = collection.status
          collectionDto.title = collection.title
          collectionDto.brand = collection.brand
          collectionDto.tags = collection.tags
          if (collection.category.length) {
            collectionDto.category = collection.category
            let category_id = []
            await Promise.all(collection.category.map(async cat => {
              let query = `query={"slug": "${cat}" }`
              let categoryOnTarget = await acendaTarget.list('category', query, 1, 1)
              category_id.push(categoryOnTarget.data.result[0].id)
            }))
            collectionDto.category_id = category_id;
          }
          await acendaTarget.create('collection', collectionDto)
        }
      }))
    } catch (error) {
      throw error
    }

  }

  assignAcendaImages(sourceImages: any[]): any[] {
    const images = []
    sourceImages.map(image => {
      const fields = image.original.split('/');
      const imageUrl = `https://cdn.acenda.com/swift/v1/${fields[3]}/images/bucket/${fields[4]}/${fields[5]}/${fields[6]}/${fields[7]}`
      images.push({ "url": imageUrl })
    })
    return images
  }

  async isProductExistsOnAcenda(sourceProduct: AcendaProduct, storeId: string): Promise<number> {
    try {
      const acenda = await this.acendaClient.getAcendaClient(storeId)
      const query = `query={"data_manager_id":"${sourceProduct.data_manager_id}","data_manager_source":"${sourceProduct.data_manager_source}"}`
      const response = await acenda.list('product', query, 1, 1)
      if (response.data.result.length) {
        return response.data.result[0].id
      } else {
        return 0
      }
    } catch (error) {
      throw error
    }
  }


  async isVariantExistsOnAcenda(sourceVariant: AcendaVariant, storeId: string, productId: string): Promise<number> {
    try {
      const acenda = await this.acendaClient.getAcendaClient(storeId)
      const query = `query={"data_manager_id":"${sourceVariant.data_manager_id}"}`
      const response = await acenda.list('variant', query, 1, 1)
      if (response.data.result.length) {
        return response.data.result[0].id
      } else {
        return 0
      }
    } catch (error) {
      throw error
    }
  }

  
  getAcendaProductDataRecord(product: AcendaProduct) {
    let fieldNames = Object.keys(product);
    const record = new DataRecord()
    record.modelName = "product"
    record.source = "acenda"
    record.fields = []
    fieldNames.forEach(fieldName => {
      record.fields.push({ name: fieldName, value: product[fieldName], dataType: DataType.product })
    });
    return record
  }

  getAcendaVariantDataRecord(variant: AcendaVariant) {
    let fieldNames = Object.keys(variant);
    const record = new DataRecord()
    record.modelName = "variant"
    record.source = "acenda"
    record.fields = []
    fieldNames.forEach(fieldName => {
      record.fields.push({ name: fieldName, value: variant[fieldName], dataType: DataType.variant })
    });
    return record
  }

  async getAcendaProductAndVariant(storeId: string) {
    const sourceData = []
    const acenda = await this.acendaClient.getAcendaClient(storeId)
    let query = 'query={status:active}'
    const variantListResponse = await acenda.list('variant', query, 1, 1)
    const responseOfProduct = await acenda.get('product', variantListResponse.data.result[0].product_id);
    const product = responseOfProduct.data.result;
    const responseOfVariant = await acenda.get('variant', variantListResponse.data.result[0].id)
    const variant = responseOfVariant.data.result;
    sourceData.push(product)
    sourceData.push(variant)
    return sourceData
  }


  async checkAcendaCategoryExists(target: string, source: string) {
    const acenda = await this.acendaClient.getAcendaClient(target)

    const response = await acenda.list('category', `query={"slug":${source}}`, 1, 1);
    if (response.data.result.length) {
      return response.data.result[0]
    } else {
      return false
    }
  }

  async createToTargetForParent(target: string, name, source: string) {
    const acenda = await this.acendaClient.getAcendaClient(target)
    const response = await acenda.create('category', { name, slug: source, status: "active" });
    return response.data.result
  }

  async findAcendaParentCategory(parentId: string, source: string, target: string) {
    try {
      const acenda = await this.acendaClient.getAcendaClient(source)
      const parentCat = await acenda.get('category', parentId);
      const cat = parentCat.data.result;
      const parent = await this.checkAcendaCategoryExists(target, cat.slug)
      if (!parent) {
        return await this.createToTargetForParent(target, cat.name, cat.slug)
      } else {
        return parent.id
      }
    } catch (error) {
    }
  }

  async createAcendaCategory(newCategory, target: string): Promise<AxiosResponse> {
    try {
      //parent relationship!!
      const acenda = await this.acendaClient.getAcendaClient(target)

      if (newCategory.parentId)
        return await acenda.create('category', { name: newCategory.newCategoryName, status: "active", parent_id: [newCategory.parentId] });
      else
        return await acenda.create('category', { name: newCategory.newCategoryName, status: "active" });

    } catch (error) {
      throw error
    }

  }

  async getAcendaCategories(args) {
    try {
      let store = ''
      if (args.apiSource) {
        store = args.apiSource
      } else {
        store = args.storeId
      }
      const acenda = await this.acendaClient.getAcendaClient(store)
      const response = await acenda.list('category', 'query={status:active}', 1, 250);
      return response.data.result
    } catch (error) {
      throw error
    }

  }


  async getAcendaFieldsRelatedByProduct(args) {
    try {
      const hash = md5(args.storeId)
      var config: AxiosRequestConfig = {
        method: 'get',
        url: `https://admin.acenda.com/preview/${hash}/api/product?format=fields`,
        headers: {
        }
      };
      const response = await axios(config)
      return response.data


    } catch (error) {
      throw error
    }

  }
  async getAcendaProducts(args): Promise<IAcendaProduct[]> {
    try {
      // //console.log'Getting All Product started' + store)
      const acenda = await this.acendaClient.getAcendaClient(args.storeId)
      let page = 1
      let limit = 100
      // let allProducts: IAcendaProduct[] = []
      //console.logargs.query)
      let response = await acenda.list('product', `query=${args.query}`, page, limit)

      return response.data.result
    } catch (error) {
      throw error
    }
  }


  async getProducts(store: string, query: string): Promise<IAcendaProduct[]> {
    try {
      const acenda = await this.acendaClient.getAcendaClient(store)

      let page = 1
      let limit = 100
      let reached = false
      let products = []
      let allProducts: IAcendaProduct[] = []
      if (query == "{}")
        query = ""

      if (query) {
        query = `query=${query}`
      }
      while (!reached) {
        let response = await acenda.list('product', query, page, limit)
        products = response.data.result
        if (products.length) {
          allProducts = allProducts.concat(products)
        } else {
          reached = true
        }
        page++
      }
      return allProducts
    } catch (error) {
      throw error
    }
  }

  async getCategoriesWithQuery(args) {
    try {
      const products = await this.getProducts(args.apiSource, args.query)
      let categoryOfSource = []
      products.map(product => {
        if (product.category && product.category.length) {
          product.category.map((name, i) => {
            let isExists = false;
            categoryOfSource.map(x => {
              if (x.categoryId == product.category_id[i]) {
                isExists = true
              }
            })
            if (!isExists) {
              categoryOfSource.push({ categoryId: product.category_id[i], categoryName: name })
            }
          })
        }
      })


      let categoryOfTarget = []
      const acenda = await this.acendaClient.getAcendaClient(args.storeId)

      //!!! 250 for right now we gonna get all categories !!!
      const categoriesOfTargetNew = await acenda.list('category', 'query={status:active}', 1, 250);

      categoriesOfTargetNew.data.result.map(cat => {
        categoryOfTarget.push({ categoryId: cat.id, categoryName: cat.name })
      })
      return { categoryOfSource, categoryOfTarget }
    } catch (error) {
      throw error
      throw new NotFoundException()
    }
  }

}