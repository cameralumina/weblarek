import { Component } from '../base/Component';
import type { IModalData } from '../../types';
import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { appEvents } from '../../utils/events';

export class Modal extends Component<IModalData> {
    private readonly closeButton: HTMLButtonElement;
    private readonly contentElement: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.contentElement = ensureElement<HTMLElement>('.modal__content', container);

        this.closeButton.addEventListener('click', () => {
            events.emit(appEvents.modalClose, {});
        });

        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                events.emit(appEvents.modalClose, {});
            }
        });
    }

    set content(value: HTMLElement) {
        this.contentElement.replaceChildren(value);
    }

    open(): void {
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
    }
}
