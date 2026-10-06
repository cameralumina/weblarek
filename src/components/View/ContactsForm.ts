import { Form } from './Form';
import type { IInputChangeEvent, TContactsFormData } from '../../types';
import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { appEvents } from '../../utils/events';

export class ContactsForm extends Form<TContactsFormData> {
    private readonly emailInput: HTMLInputElement;
    private readonly phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events, appEvents.contactsSubmit);
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);

        this.emailInput.addEventListener('input', () => {
            events.emit<IInputChangeEvent>(appEvents.contactsEmailChange, {
                value: this.emailInput.value,
            });
        });

        this.phoneInput.addEventListener('input', () => {
            events.emit<IInputChangeEvent>(appEvents.contactsPhoneChange, {
                value: this.phoneInput.value,
            });
        });
    }

    set email(value: string) {
        if (this.emailInput.value !== value) {
            this.emailInput.value = value;
        }
    }

    set phone(value: string) {
        if (this.phoneInput.value !== value) {
            this.phoneInput.value = value;
        }
    }
}
