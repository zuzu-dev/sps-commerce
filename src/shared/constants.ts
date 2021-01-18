export class Constants {

  static getAcendaFields(modelName: string) {
    switch (modelName) {
      case "product":
        return [
          { name: "product.status", dataType: "string", required: false },
          { name: "product.popularity", dataType: "string", required: false },
          { name: "product.type", dataType: "string", required: false },
          { name: "product.category", dataType: "string", required: false },
          { name: "variant.status", dataType: "string", required: false },
          { name: "variant.compare_price", dataType: "numerical", required: false },
          { name: "variant.cost", dataType: "numerical", required: false },
          { name: "variant.inventory_quantity", dataType: "numerical", required: false },
          { name: "variant.inventory_minimum_quantity", dataType: "numerical", required: false },
          { name: "variant.inventory_tracking", dataType: "boolean", required: false },
          { name: "variant.inventory_policy", dataType: "string", required: false },
          { name: "variant.inventory_shipping_estimate", dataType: "string", required: false },
          { name: "variant.inventory_shipping_leadtime_min", dataType: "string", required: false },
          { name: "variant.inventory_shipping_leadtime_max", dataType: "string", required: false },
          { name: "variant.inventory_returnable", dataType: "boolean", required: false },
          { name: "variant.popularity", dataType: "string", required: false },
          { name: "variant.require_shipping", dataType: "boolean", required: false },
          { name: "variant.discountable", dataType: "boolean", required: false },
          { name: "variant.taxable", dataType: "boolean", required: false },
          { name: "variant.weight", dataType: "numerical", required: false },
          { name: "variant.enable_instockemail", dataType: "boolean", required: false },
          { name: "product.name", dataType: "string", required: true },
          { name: "product.brand", dataType: "string", required: false },
          { name: "product.title", dataType: "string", required: false },
          { name: "product.description", dataType: "string", required: false },
          { name: "variant.name", dataType: "string", required: false },
          { name: "variant.sku", dataType: "string", required: true },
          { name: "variant.barcode", dataType: "string", required: false },
          { name: "variant.description", dataType: "string", required: false },
          { name: "variant.price", dataType: "numerical", required: true },
          { name: "variant.position", dataType: "numerical", required: false },
          { name: "variant.title", dataType: "string", required: false },
          { name: "variant.brand", dataType: "string", required: false }
        ]
    }
  }

  static getShopifyFieldsFromCSV() {
    return [
      "product.id",
      "product.title",
      "product.handle",
      "variant.price",
      "variant.sku",
      "variant.position",
      "variant.cost",
      "variant.inventory_policy",
      "variant.compare_at_price",
      "variant.fulfillment_service",
      "variant.inventory_management",
      "variant.option_1_name",
      "variant.option_2_name",
      "variant.option_3_name",
      "variant.option_1_value",
      "variant.option_2_value",
      "variant.option_3_value",
      "variant.taxable",
      "variant.variant_tax_code",
      "variant.barcode",
      "variant.grams",
      "variant.weight",
      "variant.weight_unit",
      "variant.inventory_item_id",
      "variant.inventory_quantity",
      "variant.old_inventory_quantity",
      "variant.requires_shipping"
    ]
  }

  static getShopifyFields(modelName: string) {
    switch (modelName) {
      case "product":
        return [
          "product.title",
          "product.body_html",
          "product.product_type",
          "product.handle",
          "product.template_suffix",
          "product.published_scope",
          "product.tags",
          "product.image",
          "product.vendor",
          "variant.product_id",
          "variant.title",
          "variant.price",
          "variant.sku",
          "variant.position",
          "variant.inventory_policy",
          "variant.compare_at_price",
          "variant.fulfillment_service",
          "variant.inventory_management",
          "variant.option1",
          "variant.option2",
          "variant.option3",
          "variant.taxable",
          "variant.barcode",
          "variant.grams",
          "variant.weight",
          "variant.weight_unit",
          "variant.inventory_item_id",
          "variant.inventory_quantity",
          "variant.old_inventory_quantity",
          "variant.requires_shipping"
        ]
    }
  }

  static getGoogleFields(modelName: string) {
    switch (modelName) {
      case "product":
        return [
          "id",
          "title", "description", "link", "image_link", "condition", "availability", "price", "gtin", "brand", "mpn", "google_product_category", "product_type",
          "item_group_id",
          "ads_redirect",
          "display_ads_link",
          "promotion_id", "sale_price",
          "additional_image_link",
          "adult",
          "gender", "excluded_destination",
          "color", "size",
          "custom_label_0",
          "custom_label_1",
          "custom_label_2", "custom_label_3",
          "custom_label_4",
          "sell_on_google_quantity",
          "age_group", "shipping.price", "shipping.country",
          "shipping.service"
        ]
    }
  }
}

