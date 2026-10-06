import { Component } from '../base/Component';
import type { ICardData } from '../../types';
import { ensureElement, formatPrice } from '../../utils/utils';

export abstract class Card<T extends ICardData> extends Component<T> {
    protected readonly titleElement: HTMLElement;
    protected readonly priceElement: HTMLElement;

    protected constructor(container: HTMLElement) {
        super(container);
        this.titleElement = ensureElement<HTMLElement>('.card__title', container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', container);
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = formatPrice(value);
    }
}
