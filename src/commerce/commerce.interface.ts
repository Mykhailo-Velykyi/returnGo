export interface CommerceService {
    getOrderById(platform: string, id: string): Promise<any>;
    getOrdersList(platform: string): Promise<any>;
    createProduct(platform: string, productData: any): Promise<any>;
}