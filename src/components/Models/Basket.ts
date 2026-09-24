import type { IProduct } from '../../types';

export class Basket {
    private items: IProduct[] = [];

    getItems(): IProduct[] {
        return [...this.items];
    }

    addItem(item: IProduct): void {
        if (!this.hasItem(item.id)) {
            this.items.push(item);
        }
    }

    removeItem(item: IProduct): void {
        this.items = this.items.filter((basketItem) => basketItem.id !== item.id);
    }

    clear(): void {
        this.items = [];
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
