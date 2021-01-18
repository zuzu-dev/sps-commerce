import fs from 'fs';
import _ from 'lodash';
import { evaluate } from 'mathjs';
import path from 'path';
import { twig } from 'twig';
import { IAcendaOrder } from '../acenda/models/acenda-order.model';
import { AcendaVariant } from '../acenda/models/acenda-variant.model';
import { Subscription } from '../subscriptions/models/subscription.model';
import { IDataRecord } from './models/data-record.model';
import { DataType, TransformationType, Validator } from './models/enums';
import { RecordField } from './models/record-field.model';

export class Helper {
  static async processSequantial(array: any[], method: Function, params?: any) {
    const starterPromise = Promise.resolve(null)
    await array.reduce((p, element) => p.then(async () => {
      await method(element, params)
    }), starterPromise)
  }

  public static removeId(doc: any) {
    doc.map(d => {
      delete d._id
      delete d.id
    })
    return doc
  }

  static async processSequantialAndReturn(array: any[], method: Function, params?: any) {
    const starterPromise = Promise.resolve(null)
    const result = []
    await array.reduce((p, element) => p.then(async () => {
      result.push(await method(element, params))
    }), starterPromise)
    return result
  }

  public static generateAcendaCredentials(fields: string[], subscription: Subscription) {
    let credentials = ""
    fields.forEach((field) => {
      credentials = credentials.concat(`\"${field}\":\"${subscription[field] || ""}\",`)
    })
    credentials = `{${credentials.substring(0, credentials.length - 1)}}`
    return { credentials }
  }
  
  public static removeHtml(source: any): string {
    let reg = new RegExp(`<[^>]*>`, 'g')
    if (typeof source === "string")
      return source.replace(reg, "")
  }

  public static getFieldValueFromDataRecord(data: IDataRecord, identifier: string, value?: string | number | boolean | any[]): string | number | boolean | any[] {
    const found = data.fields.filter((field) => field.name === identifier)
    if (found.length) {
      if (value == '' || (typeof value != 'undefined' && found[0].value != value)) {
        return null
      }
      if (found[0].validator == Validator.number) {
        return Number(found[0].value)
      } else if (found[0].validator == Validator.boolean) {
        return Boolean(found[0].value)
      } else {
        return found[0].value
      }
    }
  }

  public static slugify(data: string) {
    const a = 'çğıöşü·_,:;'
    const b = 'cgiosu-----'
    const p = new RegExp(a.split('').join('|'), 'g')
    return data.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
      .replace(/&/g, '') // Replace & with 'and'
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, '')
      .replace(/\//g, '') // Trim - from end of text
  }


  static assignSingleField(from: Object, to: Object, key: string, transform?: Function) {

    if (typeof from !== 'undefined') {
      if (typeof transform === 'function') {
        to[key] = transform(from)
      } else {
        to[key] = from
      }
    }
  }
  static assignMappedFields(from: IDataRecord, to: Object, fieldMapping: Map<string, string>, modelName: string) {
    from.fields.forEach((field) => {
      const acendaField = fieldMapping.get(field.name)
      if (typeof acendaField !== 'undefined') {
        if (acendaField.includes('.')) {
          const found = acendaField.substring(0, acendaField.indexOf('.'))
          if (found === modelName) {
            to[acendaField.substring(acendaField.indexOf('.') + 1, acendaField.length)] = field.value
          }
        } else {
          to[acendaField] = field.value
        }
      }
    })
  }

  static recordFieldsFromAcendaVariant(variant: AcendaVariant) {

    const fields: RecordField[] = []
    Object.keys(variant).forEach((key) => fields.push({ name: key, value: variant[key], dataType: DataType.variant }))
    return fields
  }

  static groupBy(xs: any[], key: string) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  static assignAcendaShippingFields(source: IAcendaOrder, target: IAcendaOrder) {
    target.shipping_address = source.shipping_address
    target.shipping_city = source.shipping_city
    target.shipping_country = source.shipping_country
    target.shipping_first_name = source.shipping_first_name
    target.shipping_last_name = source.shipping_last_name
    target.shipping_method = source.shipping_method
    target.shipping_state = source.shipping_state
    target.shipping_street_line1 = source.shipping_street_line1
    target.shipping_street_line2 = source.shipping_street_line2
    target.shipping_zip = source.shipping_zip
    target.tax_shipping = source.tax_shipping
    target.tax_included = source.tax_included
    target.email = "noreply@acenda.com"
  }

  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public static checkAndCreatePath(filePath: string, removeFolder?: boolean) {
    if (removeFolder) {
      Helper.deleteAllFilesInFolder(filePath)
    }
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
  }
  public static deleteAllFilesInFolder(folder: string) {
    fs.readdir(folder, (err, files) => {
      if (!err) {
        for (const file of files) {
          fs.unlink(path.join(folder, file), (err) => {
            if (err) throw err;
          });
        }
      }
    });
  }
}