import { Card } from './Card';
import type { IPreviewCardData, ICardActions, IImageData } from '../../types';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

export class PreviewCard extends Card<IPreviewCardData> {
    private readonly categoryElement: HTMLElement;
    private readonly imageElement: HTMLImageElement;
    private readonly descriptionElement: HTMLElement;
    private readonly actionButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions: ICardActions) {
        super(container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
        this.actionButton = ensureElement<HTMLButtonElement>('.card__button', container);

        this.actionButton.addEventListener('click', actions.onClick);
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
