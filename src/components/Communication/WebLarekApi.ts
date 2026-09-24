import type {
    IApi,
    IOrderResponse,
    IProductsResponse,
    TOrder,
} from '../../types';

const productsEndpoint = '/product/';
const orderEndpoint = '/order/';

export class WebLarekApi {
    constructor(private readonly api: IApi) {}

    getProducts(): Promise<IProductsResponse> {
        return this.api.get<IProductsResponse>(productsEndpoint);
    }

    createOrder(order: TOrder): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>(orderEndpoint, order);
    }
}
