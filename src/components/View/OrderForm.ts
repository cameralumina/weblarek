import { Form } from './Form';
import type {
    IInputChangeEvent,
    IPaymentChangeEvent,
    TOrderFormData,
    TPayment,
} from '../../types';
import type { IEvents } from '../base/Events';
import { ensureAllElements, ensureElement } from '../../utils/utils';
import { appEvents } from '../../utils/events';

export class OrderForm extends Form<TOrderFormData> {
    private readonly paymentButtons: HTMLButtonElement[];
    private readonly addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events, appEvents.orderSubmit);
        this.paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', container);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

        this.paymentButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const payment = button.name;
                if (payment === 'card' || payment === 'cash') {
                    events.emit<IPaymentChangeEvent>(appEvents.orderPaymentChange, { payment });
                }
            });
        });

        this.addressInput.addEventListener('input', () => {
            events.emit<IInputChangeEvent>(appEvents.orderAddressChange, {
                value: this.addressInput.value,
            });
        });
    }

    set payment(value: TPayment | null) {
        this.paymentButtons.forEach((button) => {
            button.classList.toggle('button_alt-active', button.name === value);
        });
    }

    set address(value: string) {
        this.addressInput.value = value;
    }
}
