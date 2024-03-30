import { Controller, Get, Post, Body, Param, HttpException, HttpStatus} from '@nestjs/common';
import { CommerceServiceFactory } from './commerce.service';
import { CommerceService } from './commerce.interface';
import { CreateProductDto } from './dto/commerce.product.dto'

@Controller()
export class CommerceController {
    constructor(private readonly commerceServiceFactory: CommerceServiceFactory) {}

    @Get('order/:platform/:id')
    async getOrderById(@Param('platform') platform: string, @Param('id') id: string): Promise<any> {
        try {
            const service: CommerceService = this.commerceServiceFactory.getService(platform);
            return service.getOrderById(platform, id);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
        
    }

    @Get('orders/:platform')
    async getOrdersList(@Param('platform') platform: string): Promise<any> {
        try {
            const service: CommerceService = this.commerceServiceFactory.getService(platform);
            return service.getOrdersList(platform);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('product/:platform')
    async createProduct(@Param('platform') platform: string, @Body() productData: CreateProductDto): Promise<any> {
        try {
            const service: CommerceService = this.commerceServiceFactory.getService(platform);
            return service.createProduct(platform, productData);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}