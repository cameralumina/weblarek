import { Card } from './Card';
import type { IPreviewCardData, IProductIdEvent } from '../../types';
import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { appEvents } from '../../utils/events';
import { categoryMap, CDN_URL } from '../../utils/constants';

export class PreviewCard extends Card<IPreviewCardData> {
    private readonly categoryElement: HTMLElement;
    private readonly imageElement: HTMLImageElement;
    private readonly descriptionElement: HTMLElement;
    private readonly actionButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
        this.actionButton = ensureElement<HTMLButtonElement>('.card__button', container);

        this.actionButton.addEventListener('click', () => {
            const id = this.container.dataset.id;
            if (id) {
                events.emit<IProductIdEvent>(appEvents.productToggle, { id });
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

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set buttonText(value: string) {
        this.actionButton.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this.actionButton.disabled = value;
    }
}
