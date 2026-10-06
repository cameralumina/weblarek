import type { IProduct } from '../../types';
import type { IEvents } from '../base/Events';
import { appEvents } from '../../utils/events';

export class Products {
    private items: IProduct[] = [];
    private selectedItem: IProduct | null = null;

    constructor(private readonly events: IEvents) {}

    setItems(items: IProduct[]): void {
        this.items = [...items];
        this.events.emit(appEvents.productsChanged, {});
    }

    getItems(): IProduct[] {
        return [...this.items];
    }

    getItem(id: string): IProduct | undefined {
        return this.items.find((item) => item.id === id);
    }

    setSelectedItem(item: IProduct | null): void {
        this.selectedItem = item;
        this.events.emit(appEvents.selectedProductChanged, {});
    }

    getSelectedItem(): IProduct | null {
        return this.selectedItem;
    }
}
