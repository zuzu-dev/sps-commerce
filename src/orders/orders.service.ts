import { Model } from 'mongoose';
import { GenericMongooseCrudService } from 'mongoose-crud-service';
import { InjectModel } from 'nestjs-typegoose';
import { Injectable } from '@nestjs/common';
import { IOrder, IOrderModel, Order } from './models/order.model';
import { SpsService } from 'src/sps/sps.service';
import { SpsOrder } from 'src/sps/models/sps-order.model';
import { AcendaOrder, AcendaOrderItem } from 'src/acenda/models/acenda-order.model';
import { AcendaOrdersService } from 'src/acenda/acenda-orders.service';

@Injectable()
export class OrdersService extends GenericMongooseCrudService<IOrder, IOrderModel> {
  constructor(
    @InjectModel(Order) orderModel: Model<IOrderModel>,
    private spsService: SpsService,
    private acendaOrdersService: AcendaOrdersService
  ) { super(orderModel) }

  public async tranferOrders2Acenda(storeId: string) {
    const orders = await this.spsService.get('orders');
    const orderCount = orders.length;
    let i = 0;
    const batchSize = 5;
    while (i < orderCount) {
      let orderBatch: SpsOrder[] = orders.slice(i, i + batchSize);
      await Promise.all(orderBatch.map(async spsOrder => {
        const acendaOrder: AcendaOrder = this.mapOrderFieldsAndReturnAcendaOrder(spsOrder);
        await this.acendaOrdersService.createOrder(storeId, acendaOrder);
      }))
      i += batchSize;
    }

  }

  private mapOrderFieldsAndReturnAcendaOrder(order: SpsOrder): AcendaOrder {
    let header = order.Orders.Order.Header;
    let lineItems = order.Orders.Order.LineItem;
    const summary = order.Orders.Order.Summary;
    const acendaOrder = new AcendaOrder();

    acendaOrder.items = [];

    if(!Array.isArray(lineItems)) {
      lineItems = [lineItems];
    }

    lineItems.forEach((lineItem) => {
      let acendaOrderItem = new AcendaOrderItem();
      acendaOrderItem.quantity = Number(lineItem.OrderLine.OrderQty);
      acendaOrderItem.sku = lineItem.OrderLine.ProductID.PartNumber;
      acendaOrderItem.price = Number(lineItem.OrderLine.PurchasePrice);
      acendaOrder.items.push(acendaOrderItem);
    });


    if(!Array.isArray(header.Address)) {
      header.Address = [header.Address];
    }

    let targetAddress;
    header.Address.forEach(address => {
      if (address.AddressTypeCode == "BT") { //TODO AddressTypeCode must be inspected in order to differentiate source and target address.
        targetAddress = address;
      }
    });
    acendaOrder.shipping_first_name = header.Contacts.ContactName;
    acendaOrder.shipping_phone_number = header.Contacts.PrimaryPhone;
    acendaOrder.email = header.Contacts.PrimaryEmail;
    acendaOrder.shipping_country = 'US' //targetAddress.Country;
    acendaOrder.shipping_state = targetAddress.State;
    acendaOrder.shipping_city = targetAddress.City;
    acendaOrder.shipping_address = targetAddress.AddressName;
    acendaOrder.shipping_street_line1 = targetAddress.Address1;
    acendaOrder.shipping_street_line2 = targetAddress.Address2;
    acendaOrder.shipping_zip = targetAddress.PostalCode;

    acendaOrder.total = summary.TotalAmount;
    console.log(JSON.stringify(acendaOrder));
    return acendaOrder;
  }
}
