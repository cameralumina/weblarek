import { Component } from '../base/Component';
import type { ISuccessData } from '../../types';
import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { appEvents } from '../../utils/events';

export class Success extends Component<ISuccessData> {
    private readonly descriptionElement: HTMLElement;
    private readonly closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);

        this.closeButton.addEventListener('click', () => {
            events.emit(appEvents.successClose);
        });
    }

    set total(value: number) {
        this.descriptionElement.textContent = `Списано ${value} синапсов`;
    }
}
