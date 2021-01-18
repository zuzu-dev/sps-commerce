export enum FeedSource {
  "SFTP" = "SFTP",
  "MANUAL" = "MANUAL"
}

export enum Adapter {
  "AMAZON" = "AMAZON",
  "SHOPIFY" = "SHOPIFY",
  "SALSIFY" = "SALSIFY",
  "CHANNELADVISOR" = "CHANNELADVISOR",
  "ACENDA" = "ACENDA",
  "GOOGLEMERCHANTCENTER" = "GOOGLEMERCHANTCENTER",
  "LOWES" = "LOWES"
}

export enum DataType {
  "product" = "product",
  "variant" = "variant",
  "order" = "order",
  "orderItem" = "orderItem",
  "category" = "category"
}

export enum Validator {
  "string" = "string",
  "number" = "number",
  "boolean" = "boolean",
  "array" = "array",
  "object" = "object"
}

export enum TransformationType {
  FIND_AND_REPLACE = "FIND_AND_REPLACE",
  REGEX = "REGEX",
  TWIG = "TWIG",
  PRICE = "PRICE",
  REMOVE_HTML = "REMOVE_HTML",
  LODASH = "LODASH",
  MATH = "MATH",
  BOOL = "BOOL"
}

export enum ImportRequestStatus {
  "QUEUED" = "QUEUED",
  "IN_PROCESS" = "IN_PROCESS",
  "COMPLETED" = "COMPLETED",
  "CANCELED" = "CANCELED",
  "FAILED" = "FAILED",
  "READY" = "READY"
}

export enum FeedType {
  "AMAZON_CATEGORY_LISTING" = "AMAZON_CATEGORY_LISTING",
  "SALSIFY" = "SALSIFY",
  "SHOPIFY" = "SHOPIFY"
}

export enum ImportType {
  "API" = "API",
  "FEED" = "FEED"
}

export enum ImportFrequency {
  "WEEKLY" = "WEEKLY",
  "DAILY" = "DAILY",
  "TWICE_DAILY" = "TWICE_DAILY",
  "THREE_TIMES_DAILY" = "THREE_TIMES_DAILY",
  "FOUR_TIMES_DAILY" = "FOUR_TIMES_DAILY",
  "SIX_TIMES_DAILY" = "SIX_TIMES_DAILY",
  "TWELVE_TIMES_DAILY" = "TWELVE_TIMES_DAILY"
}