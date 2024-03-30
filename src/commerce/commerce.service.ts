import { Injectable } from '@nestjs/common';
import { ShopifyService } from '../platforms/shopify/shopify.service';
import { CommerceService } from './commerce.interface';

@Injectable()
export class CommerceServiceFactory {
    constructor(
        private readonly shopifyService: ShopifyService
    ) {}

    getService(platform: string): CommerceService {
        switch (platform.toLowerCase()) {
        case 'shopify':
            return this.shopifyService;
        // Add cases for other platforms as needed
        default:
            throw new Error(`Unsupported platform: ${platform}`);
        }
    }
}