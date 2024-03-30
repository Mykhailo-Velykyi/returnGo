import { Module } from '@nestjs/common';
import { CommerceController } from './commerce.controller';
import { CommerceServiceFactory } from './commerce.service';
import { ShopifyService } from '../platforms/shopify/shopify.service';

@Module({
    imports: [],
    controllers: [CommerceController],
    providers: [CommerceServiceFactory, ShopifyService],
})

export class CommerceModule {}