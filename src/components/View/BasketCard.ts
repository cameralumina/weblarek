import { Card } from './Card';
import type { IBasketCardData, IProductIdEvent } from '../../types';
import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { appEvents } from '../../utils/events';

export class BasketCard extends Card<IBasketCardData> {
    private readonly indexElement: HTMLElement;
    private readonly deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        this.deleteButton.addEventListener('click', () => {
            const id = this.container.dataset.id;
            if (id) {
                events.emit<IProductIdEvent>(appEvents.basketRemove, { id });
            }
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}
