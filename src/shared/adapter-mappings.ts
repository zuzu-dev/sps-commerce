import { DataType, Validator } from './models/enums';

export class AdapterMappings {

  public static amazon = [
    { "sourceField": "item_sku", "targetDataType": DataType.variant, "targetField": "sku","validator":Validator.string },
    { "sourceField": "brand_name", "targetDataType": DataType.variant, "targetField": "brand","validator":Validator.string },
    { "sourceField": "item_name", "targetDataType": DataType.variant, "targetField": "title","validator":Validator.string },
    { "sourceField": "item_name", "targetDataType": DataType.product, "targetField": "name","validator":Validator.string },
    { "sourceField": "item_name", "targetDataType": DataType.variant, "targetField": "name","validator":Validator.string },
    { "sourceField": "external_product_id", "targetDataType": DataType.variant, "targetField": "barcode","validator":Validator.string },
    { "sourceField": "standard_price", "targetDataType": DataType.variant, "targetField": "price","validator":Validator.number },
    { "sourceField": "list_price", "targetDataType": DataType.variant, "targetField": "compare_price","validator":Validator.number },
    { "sourceField": "product_description", "targetDataType": DataType.product, "targetField": "description","validator":Validator.string },
    { "sourceField": "generic_keywords", "targetDataType": DataType.product, "targetField": "tags","validator":Validator.string },
    { "sourceField": "item_type", "targetDataType": DataType.product, "targetField": "category","validator":Validator.string }
  ]
  public static shopify = [
    { "sourceField": "vendor", "sourceDataType": DataType.product, "targetDataType": DataType.product, "targetField": "brand" ,"validator":Validator.string},
    { "sourceField": "body_html", "sourceDataType": DataType.product, "targetDataType": DataType.product, "targetField": "description","validator":Validator.string },
    { "sourceField": "title", "sourceDataType": DataType.product, "targetDataType": DataType.product, "targetField": "name","validator":Validator.string },
    { "sourceField": "title", "sourceDataType": DataType.product, "targetDataType": DataType.product, "targetField": "title" ,"validator":Validator.string},
    { "sourceField": "handle", "sourceDataType": DataType.product, "targetDataType": DataType.product, "targetField": "slug","validator":Validator.string },
    { "sourceField": "barcode", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "barcode","validator":Validator.string },
    { "sourceField": "vendor", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "brand","validator":Validator.string },
    { "sourceField": "compare_at_price", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "compare_price","validator":Validator.number },
    { "sourceField": "inventory_quantity", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "inventory_quantity","validator":Validator.number },
    { "sourceField": "position", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "position","validator":Validator.number },
    { "sourceField": "price", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "price","validator":Validator.number },
    { "sourceField": "sku", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "sku","validator":Validator.string },
    { "sourceField": "taxable", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "taxable","validator":Validator.boolean },
    { "sourceField": "cost", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "cost","validator":Validator.number },
    { "sourceField": "weight", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "weight","validator":Validator.number },
  ]
  public static shopifyFeed = [
    { "sourceField": "title", "sourceDataType": DataType.product, "targetDataType": DataType.product, "targetField": "name" ,"validator":Validator.string },
    { "sourceField": "handle", "sourceDataType": DataType.product, "targetDataType": DataType.product, "targetField": "slug"  ,"validator":Validator.string},
    { "sourceField": "barcode", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "barcode" ,"validator":Validator.string },
    { "sourceField": "compare_at_price", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "compare_price" ,"validator":Validator.number },
    { "sourceField": "inventory_qty", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "inventory_quantity" ,"validator":Validator.number },
    { "sourceField": "cost", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "cost"  ,"validator":Validator.number},
    { "sourceField": "price", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "price" ,"validator":Validator.number },
    { "sourceField": "sku", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "sku"  ,"validator":Validator.string},
    { "sourceField": "taxable", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "taxable" ,"validator":Validator.boolean },
    { "sourceField": "requires_shipping", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "variant.require_shipping"  ,"validator":Validator.boolean},
    { "sourceField": "weight", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "weight" ,"validator":Validator.number },
    { "sourceField": "id", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "data_manager_id" ,"validator":Validator.string },
    
 

  ]
  public static acenda = [
    { "sourceField": "group", "sourceDataType": DataType.product, "targetDataType": DataType.product, "targetField": "group" },
    { "sourceField": "name", "sourceDataType": DataType.product, "targetDataType": DataType.product, "targetField": "name" },
    { "sourceField": "popularity", "sourceDataType": DataType.product, "targetDataType": DataType.product, "targetField": "popularity" },
    { "sourceField": "brand", "sourceDataType": DataType.product, "targetDataType": DataType.product, "targetField": "brand" },
    { "sourceField": "type", "sourceDataType": DataType.product, "targetDataType": DataType.product, "targetField": "type" },
    // { "sourceField": "images", "sourceDataType": DataType.product, "targetDataType": DataType.product, "targetField": "images" },
    // { "sourceField": "images", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "images" },
    { "sourceField": "description", "sourceDataType": DataType.product, "targetDataType": DataType.product, "targetField": "description" },
    { "sourceField": "title", "sourceDataType": DataType.product, "targetDataType": DataType.product, "targetField": "title" },
    { "sourceField": "name", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "name" },
    { "sourceField": "sku", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "sku" },
    { "sourceField": "barcode", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "barcode" },
    { "sourceField": "price", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "price" },
    { "sourceField": "compare_price", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "compare_price" },
    { "sourceField": "cost", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "cost" },
    { "sourceField": "inventory_quantity", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "inventory_quantity" },
    { "sourceField": "inventory_minimum_quantity", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "inventory_minimum_quantity" },
    { "sourceField": "inventory_tracking", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "inventory_tracking" },
    { "sourceField": "inventory_shipping_estimate", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "inventory_shipping_estimate" },
    { "sourceField": "inventory_policy", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "inventory_policy" },
    { "sourceField": "inventory_shipping_leadtime_min", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "inventory_shipping_leadtime_min" },
    { "sourceField": "inventory_shipping_leadtime_max", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "inventory_shipping_leadtime_max" },
    { "sourceField": "inventory_returnable", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "inventory_returnable" },
    { "sourceField": "has_stock", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "has_stock" },
    { "sourceField": "popularity", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "popularity" },
    { "sourceField": "require_shipping", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "require_shipping" },
    { "sourceField": "discountable", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "discountable" },
    { "sourceField": "taxable", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "taxable" },
    { "sourceField": "weight", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "weight" },
    { "sourceField": "enable_instockemail", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "enable_instockemail" },
    { "sourceField": "brand", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "brand" },
    { "sourceField": "title", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "title" },
    { "sourceField": "taxjarcode", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "taxjarcode" },
  ]

  public static channelAdvisor = [
    { "sourceField": "Inventory Number", "targetDataType": DataType.variant, "targetField": "sku" },
    { "sourceField": "Auction Title", "targetDataType": DataType.product, "targetField": "name" },
    { "sourceField": "Brand", "targetDataType": DataType.product, "targetField": "brand" },
    { "sourceField": "Brand", "targetDataType": DataType.variant, "targetField": "brand" },
    { "sourceField": "Description", "targetDataType": DataType.product, "targetField": "description" },
    { "sourceField": "UPC", "targetDataType": DataType.variant, "targetField": "barcode" },
    { "sourceField": "Buy It Now Price", "targetDataType": DataType.variant, "targetField": "price" },
    { "sourceField": "Retail Price", "targetDataType": DataType.variant, "targetField": "compare_price" },
    // { "sourceField": "Picture URLs", "targetDataType": DataType.variant, "targetField": "images" },
    { "sourceField": "Weight", "targetDataType": DataType.variant, "targetField": "weight" },
    { "sourceField": "Color", "targetDataType": DataType.variant, "targetField": "color" },
    { "sourceField": "Size", "targetDataType": DataType.variant, "targetField": "size" },
  ]
  
  public static googleMerchantCenter = [
    { "sourceField": "description", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "description" },
    { "sourceField": "name", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "title" },
    { "sourceField": "sku", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "id" },
    { "sourceField": "url", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "link" },
    // { "sourceField": "thumbnail", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "image_link" },
    { "sourceField": "status", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "condition" },
    { "sourceField": "status", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "availability"},
    { "sourceField": "compare_price", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "price"},
    { "sourceField": "barcode", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "gtin"},
    { "sourceField": "brand", "sourceDataType": DataType.product, "targetDataType": DataType.variant, "targetField": "brand"},
    { "sourceField": "mnp", "sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "mnp"},
    { "sourceField": "id", "sourceDataType": DataType.product, "targetDataType": DataType.variant, "targetField": "item_group_id"},
    // shipping nested later
    
  ]


    //exports!!

    public static lowes = [
      
      { "sourceField": "sku","sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "Supplier Model Number" },
      { "sourceField": "brand", "sourceDataType": DataType.variant,"targetDataType": DataType.variant, "targetField": "Brand"},
      { "sourceField": "price","sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "Minimum Advertised Price"},
      { "sourceField": "compare_price","sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "MSRP"},
      { "sourceField": "height","sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "ITEM_ Shipping_x000d_HEIGHT"},
      { "sourceField": "width","sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "ITEM_ Shipping_x000d_WIDTH"},
      { "sourceField": "length","sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "ITEM_ Shipping_x000d_LENGTH"},
      { "sourceField": "weight","sourceDataType": DataType.variant, "targetDataType": DataType.variant, "targetField": "ITEM_ Shipping WEIGHT"},
      { "sourceField": "name","sourceDataType": DataType.product, "targetDataType": DataType.variant, "targetField": "Item Description"},
    ]
   
    //exports!!

}