import type { IBuyer, TBuyerErrors } from '../../types';
import type { IEvents } from '../base/Events';
import { appEvents } from '../../utils/events';

const validationMessages: Record<keyof IBuyer, string> = {
    payment: 'Не выбран вид оплаты',
    address: 'Укажите адрес доставки',
    email: 'Укажите email',
    phone: 'Укажите телефон',
};

const initialBuyerData: IBuyer = {
    payment: null,
    email: '',
    phone: '',
    address: '',
};

export class Buyer {
    private data: IBuyer = { ...initialBuyerData };

    constructor(private readonly events: IEvents) {}

    setData(data: Partial<IBuyer>): void {
        this.data = {
            ...this.data,
            ...data,
        };
        this.events.emit(appEvents.buyerChanged, {});
    }

    getData(): IBuyer {
        return { ...this.data };
    }

    clear(): void {
        this.data = { ...initialBuyerData };
        this.events.emit(appEvents.buyerChanged, {});
    }

    validate(): TBuyerErrors {
        const errors: TBuyerErrors = {};

        if (!this.data.payment) {
            errors.payment = validationMessages.payment;
        }

        if (!this.data.address.trim()) {
            errors.address = validationMessages.address;
        }

        if (!this.data.email.trim()) {
            errors.email = validationMessages.email;
        }

        if (!this.data.phone.trim()) {
            errors.phone = validationMessages.phone;
        }

        return errors;
    }
}
