import type { IBuyer, TBuyerData, TBuyerErrors } from '../../types';

const validationMessages: Record<keyof IBuyer, string> = {
    payment: 'Не выбран вид оплаты',
    address: 'Укажите адрес доставки',
    email: 'Укажите email',
    phone: 'Укажите телефон',
};

export class Buyer {
    private data: TBuyerData = {};

    setData(data: TBuyerData): void {
        this.data = {
            ...this.data,
            ...data,
        };
    }

    getData(): TBuyerData {
        return { ...this.data };
    }

    clear(): void {
        this.data = {};
    }

    validate(): TBuyerErrors {
        const errors: TBuyerErrors = {};

        if (!this.data.payment) {
            errors.payment = validationMessages.payment;
        }

        if (!this.data.address?.trim()) {
            errors.address = validationMessages.address;
        }

        if (!this.data.email?.trim()) {
            errors.email = validationMessages.email;
        }

        if (!this.data.phone?.trim()) {
            errors.phone = validationMessages.phone;
        }

        return errors;
    }
}
