export class OrderResponseDto {
    id: string;
    name: string;
    priceDetails: PriceDetailsDto;
    items: OrderItemDto[];
}
  
export class OrderItemDto {
    id: string;
    name: string;
    weight: number;
    weightUnit: string;
    priceDetails: PriceDetailsDto;
    productId: string;
    quantity: number;
    sku: string;
    variantId: string;
    tax: PriceDetailsDto;
}
  
export class PriceDetailsDto {
    shopPrice: PriceDto;
    presentmentPrice: PriceDto;
}
  
export class PriceDto {
    amount: number;
    currency: string;
}