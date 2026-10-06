import { Card } from './Card';
import type { ICatalogCardData, ICardActions, IImageData } from '../../types';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

export class CatalogCard extends Card<ICatalogCardData> {
    private readonly categoryElement: HTMLElement;
    private readonly imageElement: HTMLImageElement;

    constructor(container: HTMLElement, actions: ICardActions) {
        super(container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);

        this.container.addEventListener('click', actions.onClick);
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        this.categoryElement.classList.remove(...Object.values(categoryMap));
        const categoryClass = categoryMap[value];
        if (categoryClass) {
            this.categoryElement.classList.add(categoryClass);
        }
    }

    set image(value: IImageData) {
        this.setImage(this.imageElement, value.src, value.alt);
    }
}
