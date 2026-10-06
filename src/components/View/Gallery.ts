import { Component } from '../base/Component';
import type { IGalleryData } from '../../types';

export class Gallery extends Component<IGalleryData> {
    constructor(container: HTMLElement) {
        super(container);
    }

    set items(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}
