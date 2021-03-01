export class SpsOrder {
    Orders: {
        $: {
            xmlns: string
        };
        Order: {
            Header: {
                OrderHeader: {
                    TradingPartnerId: string,
                    PurchaseOrderNumber: string,
                    TsetPurposeCode: string,
                    PrimaryPOTypeCode: string,
                    PurchaseOrderDate: string,
                    ShipCompleteCode: string,
                    BuyersCurrency: string,
                    Department: string,
                    Vendor: string,
                    Division: string
                },
                PaymentTerms: {
                    TermsType: string,
                    TermsBasisDateCode: string,
                    TermsDiscountPercentage: string,
                    TermsDiscountDate: string,
                    TermsDiscountDueDays: string,
                    TermsNetDueDate: string,
                    TermsNetDueDays: string,
                    TermsDiscountAmount: string,
                    TermsDescription: string
                },
                Dates: {
                    DateTimeQualifier: string,
                    Date: string,
                    Time: string
                },
                Contacts: {
                    ContactTypeCode: string,
                    ContactName: string,
                    PrimaryPhone: string,
                    PrimaryFax: string,
                    PrimaryEmail: string
                },
                Address:
                {
                    AddressTypeCode: string,
                    LocationCodeQualifier: string,
                    AddressLocationNumber: string,
                    AddressName: string,
                    AddressAlternateName: string,
                    Address1: string,
                    Address2: string,
                    City: string,
                    State: string,
                    PostalCode: string,
                    Country: string
                }[],
                FOBRelatedInstruction: {
                    FOBPayCode: string,
                    FOBLocationQualifier: string,
                    FOBLocationDescription: string
                },
                CarrierInformation: {
                    CarrierTransMethodCode: string,
                    CarrierAlphaCode: string,
                    CarrierRouting: string,
                    ServiceLevelCodes: {
                        ServiceLevelCode: string
                    }
                },
                References: {
                    ReferenceQual: string,
                    ReferenceID: string,
                    Description: string
                },
                Notes: {
                    NoteCode: string,
                    Note: string
                },
                QuantityTotals: {
                    QuantityTotalsQualifier: string,
                    Quantity: string,
                    QuantityUOM: string
                }
            },
            LineItem: {
                OrderLine: {
                    LineSequenceNumber: string,
                    BuyerPartNumber: string,
                    VendorPartNumber: string,
                    ConsumerPackageCode: string,
                    GTIN: string,
                    UPCCaseCode: string,
                    ProductID: {
                        PartNumberQual: string,
                        PartNumber: string
                    },
                    OrderQty: string,
                    OrderQtyUOM: string,
                    PurchasePrice: string,
                    ProductSizeCode: string,
                    ProductSizeDescription: string,
                    ProductColorCode: string,
                    ProductColorDescription: string,
                    ProductMaterialDescription: string,
                    NRFStandardColorAndSize: {
                        NRFColorCode: string,
                        NRFSizeCode: string
                    }
                },
                PriceInformation: {
                    PriceTypeIDCode: string,
                    UnitPrice: string
                },
                ProductOrItemDescription: {
                    ProductCharacteristicCode: string,
                    ProductDescription: string
                },
                PhysicalDetails: {
                    PackQualifier: string,
                    PackValue: string,
                    PackSize: string,
                    PackUOM: string
                },
                References: {
                    ReferenceQual: string,
                    ReferenceID: string
                },
                Notes: {
                    NoteCode: string,
                    Note: string
                },
                QuantitiesSchedulesLocations: {
                    QuantityQualifier: string,
                    TotalQty: string,
                    TotalQtyUOM: string,
                    LocationQuantity:
                    {
                        Location: string,
                        Qty: string
                    }[];
                    Dates: {
                        DateTimeQualifier: string,
                        Date: string,
                        Time: string
                    }
                }
            }[],
            Summary: {
                TotalAmount: string,
                TotalLineItemNumber: string
            }
        }
    }
}