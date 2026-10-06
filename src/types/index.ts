export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash';

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment | null;
    email: string;
    phone: string;
    address: string;
}

export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

export interface IProductsResponse {
    total: number;
    items: IProduct[];
}

export interface TOrder extends IBuyer {
    total: number;
    items: string[];
}

export interface IOrderResponse {
    id: string;
    total: number;
}

export interface IGalleryData {
    items: HTMLElement[];
}

export interface IHeaderData {
    counter: number;
}

export interface IModalData {
    content: HTMLElement;
}

export interface ICardData {
    id: string;
    title: string;
    price: number | null;
}

export interface ICatalogCardData extends ICardData {
    category: string;
    image: string;
}

export interface IPreviewCardData extends ICatalogCardData {
    description: string;
    buttonText: string;
    buttonDisabled: boolean;
}

export interface IBasketCardData extends ICardData {
    index: number;
}

export interface IBasketViewData {
    items: HTMLElement[];
    total: number;
    valid: boolean;
}

export interface IFormState {
    valid: boolean;
    errors: string;
}

export type TOrderFormData = Pick<IBuyer, 'payment' | 'address'> & IFormState;
export type TContactsFormData = Pick<IBuyer, 'email' | 'phone'> & IFormState;

export interface ISuccessData {
    total: number;
}

export interface IProductIdEvent {
    id: string;
}

export interface IPaymentChangeEvent {
    payment: TPayment;
}

export interface IInputChangeEvent {
    value: string;
}
