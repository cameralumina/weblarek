import { Component } from '../base/Component';
import type { IBasketViewData } from '../../types';
import type { IEvents } from '../base/Events';
import { ensureElement, formatPrice } from '../../utils/utils';
import { appEvents } from '../../utils/events';

export class BasketView extends Component<IBasketViewData> {
    private readonly listElement: HTMLElement;
    private readonly totalElement: HTMLElement;
    private readonly checkoutButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.listElement = ensureElement<HTMLElement>('.basket__list', container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
        this.checkoutButton = ensureElement<HTMLButtonElement>('.basket__button', container);

        this.checkoutButton.addEventListener('click', () => {
            events.emit(appEvents.basketCheckout, {});
        });
    }

    set items(value: HTMLElement[]) {
        this.listElement.replaceChildren(...value);
    }

    set total(value: number) {
        this.totalElement.textContent = formatPrice(value);
    }

    set valid(value: boolean) {
        this.checkoutButton.disabled = !value;
    }
}
