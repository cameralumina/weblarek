import { Component } from '../base/Component';
import type { IFormState } from '../../types';
import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export abstract class Form<T extends IFormState> extends Component<T> {
    protected readonly submitButton: HTMLButtonElement;
    private readonly errorsElement: HTMLElement;

    protected constructor(
        container: HTMLFormElement,
        events: IEvents,
        submitEvent: string
    ) {
        super(container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', container);

        container.addEventListener('submit', (event) => {
            event.preventDefault();
            events.emit(submitEvent);
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorsElement.textContent = value;
    }
}
