import { Card } from './Card';
import type { ICatalogCardData, IProductIdEvent } from '../../types';
import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { appEvents } from '../../utils/events';
import { categoryMap, CDN_URL } from '../../utils/constants';

export class CatalogCard extends Card<ICatalogCardData> {
    private readonly categoryElement: HTMLElement;
    private readonly imageElement: HTMLImageElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);

        this.container.addEventListener('click', () => {
            const id = this.container.dataset.id;
            if (id) {
                events.emit<IProductIdEvent>(appEvents.cardSelect, { id });
            }
        });
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        this.categoryElement.classList.remove(...Object.values(categoryMap));
        const categoryClass = categoryMap[value];
        if (categoryClass) {
            this.categoryElement.classList.add(categoryClass);
        }
    }

    set image(value: string) {
        this.setImage(this.imageElement, `${CDN_URL}${value}`, this.titleElement.textContent ?? '');
    }
}
