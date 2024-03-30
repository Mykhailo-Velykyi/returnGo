import { Test, TestingModule } from '@nestjs/testing';
import { ShopifyService } from './shopify.service';
import axios from 'axios';

describe('ShopifyService', () => {
    let service: ShopifyService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ShopifyService],
        }).compile();

        service = module.get<ShopifyService>(ShopifyService);
    });

    it('should fetch order by ID', async () => {
        const mockOrderData = {
            id: '777777777',
            name: 'Order #777777777',
            total_price: 100,
            currency: 'EUR',
            line_items: [
            {
                id: 'item-x',
                title: 'Product X',
                price: 50,
                quantity: 1,
                sku: 'SKU-X',
                variant_id: 'variant-id-xx',
                tax_lines: [],
            },
            {
                id: 'item-y',
                title: 'Product Y',
                price: 25,
                quantity: 1,
                sku: 'SKU-Y',
                variant_id: 'variant-id-yy',
                tax_lines: [],
            },
            ],
        };
        jest.spyOn(axios, 'get').mockResolvedValue({ data: { order: mockOrderData } });

        const orderId = '777777777';
        const order = await service.getOrderById('shopify', orderId);

        expect(order).toBeDefined();
        expect(order.id).toEqual(mockOrderData.id);
        expect(order.name).toEqual(mockOrderData.name);
    });
});