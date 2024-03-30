import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { OrderResponseDto, OrderItemDto } from './dto/shopify.order.dto';
import { ProductResponseDto } from './dto/shopify.product.dto';
import { CreateProductDto } from '../../commerce/dto/commerce.product.dto'
import axios from 'axios';

@Injectable()
export class ShopifyService {
    private readonly shopifyBaseUrl = process.env.SHOPIFY_BASE_URL;
    private readonly username: string;
    private readonly password: string;

    constructor() {
        this.username = process.env.SHOPIFY_USERNAME;
        this.password = process.env.SHOPIFY_PASSWORD;

        if (!this.username || !this.password || !this.shopifyBaseUrl) {
            throw new UnauthorizedException('Shopify credentials or base URL not provided');
        }
    }

    private getAuthObject() {
        return {
            username: this.username,
            password: this.password,
        };
    }

    async getOrderById(platform: string, id: string): Promise<any> {
        try {
            const response = await axios.get(`${this.shopifyBaseUrl}/orders/${id}.json`, {
                auth: this.getAuthObject()
            });
            return this.mapOrderResponse(response.data.order);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                throw new HttpException(`Order #${id} not found`, HttpStatus.NOT_FOUND);
            }
            throw new HttpException(`Internal server error - ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getOrdersList(platform: string): Promise<any> {
        try {
            const response = await axios.get(`${this.shopifyBaseUrl}/orders.json`, {
                auth: this.getAuthObject()
            });
            const formattedOrders = response.data.orders.map((order: any) => this.mapOrderResponse(order));
            return formattedOrders;
        } catch (error) {
            throw new HttpException(`Internal server error - ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createProduct(platform: string, productData: CreateProductDto): Promise<any> {
        try {
            return this.formatProductData(productData)
        } catch (error) {
            if (error.response && error.response.status === 422) {
                throw new HttpException('Invalid data provided', HttpStatus.UNPROCESSABLE_ENTITY);
            }
            throw new HttpException(`Internal server error - ${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private mapOrderResponse(orderData: any): OrderResponseDto {
        const mappedOrder = {
            id: orderData.id,
            name: orderData.name,
            priceDetails: {
                shopPrice: {
                    amount: orderData.total_price,
                    currency: orderData.currency
                },
                presentmentPrice: {
                    amount: orderData.total_price,
                    currency: orderData.currency
                }
            },
            items: orderData.line_items.map((item: any) => this.mapOrderItem(item))
        };

        orderData.line_items.forEach((item: any) => {
            for (let i = 0; i < item.quantity; i++) {
              const itemCopy = { ...item };
              itemCopy.quantity = 1;
              mappedOrder.items.push(this.mapOrderItem(itemCopy));
            }
        });

        return mappedOrder;
    }
    
    private mapOrderItem(item: any): OrderItemDto {
        return {
            id: item.id,
            name: item.name,
            weight: item.grams,
            weightUnit: 'g', // no weight attribute for item
            priceDetails: {
                shopPrice: {
                    amount: item.price,
                    currency: item.currency
                },
                presentmentPrice: {
                    amount: item.price,
                    currency: item.currency
                }
            },
            productId: item.product_id,
            quantity: 1, // quantity is always 1 for split items
            sku: item.sku,
            variantId: item.variant_id,
            tax: {
                shopPrice: {
                    amount: item.total_tax,
                    currency: item.currency
                },
                presentmentPrice: {
                    amount: item.total_tax,
                    currency: item.currency
                }
            }
        };
    }

    private formatProductData(productData: any): ProductResponseDto {
        return {
            id: Date.now().toString(),
            type: productData.type,
            status: 'active',
            tags: [],
            title: productData.title,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            vendor: productData.vendor
        }
    }
}