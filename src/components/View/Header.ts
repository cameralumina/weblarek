import { Component } from '../base/Component';
import type { IHeaderData } from '../../types';
import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { appEvents } from '../../utils/events';

export class Header extends Component<IHeaderData> {
    private readonly basketButton: HTMLButtonElement;
    private readonly counterElement: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
        this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', container);

        this.basketButton.addEventListener('click', () => {
            events.emit(appEvents.basketOpen);
        });
    }

    set counter(value: number) {
        this.counterElement.textContent = String(value);
    }
}
