import type { IProduct } from '../../types';
import type { IEvents } from '../base/Events';
import { appEvents } from '../../utils/events';

export class Basket {
    private items: IProduct[] = [];

    constructor(private readonly events: IEvents) {}

    getItems(): IProduct[] {
        return [...this.items];
    }

    addItem(item: IProduct): void {
        this.items.push(item);
        this.events.emit(appEvents.basketChanged);
    }

    removeItem(item: IProduct): void {
        this.items = this.items.filter((basketItem) => basketItem.id !== item.id);
        this.events.emit(appEvents.basketChanged);
    }

    clear(): void {
        this.items = [];
        this.events.emit(appEvents.basketChanged);
    }

    getTotalPrice(): number {
        return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
    }

    getItemsCount(): number {
        return this.items.length;
    }

    hasItem(id: string): boolean {
        return this.items.some((item) => item.id === id);
    }
}
