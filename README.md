# Проектная работа «Веб-ларёк»

«Веб-ларёк» — учебный интернет-магазин товаров для веб-разработчиков. Пользователь может посмотреть каталог и подробности товара, добавить товары в корзину, заполнить данные покупателя и отправить заказ на сервер.

Стек: HTML, SCSS, TypeScript, Vite.

## Установка и запуск

Создайте в корне проекта файл `.env`:

```env
VITE_API_ORIGIN=https://larek-api.nomoreparties.co
```

Установите зависимости:

```bash
npm install
```

Запустите проект в режиме разработки:

```bash
npm run dev
```

Соберите production-версию:

```bash
npm run build
```

## Структура проекта

- `src/components/base/` — базовые классы стартового набора: `Api`, `Component`, `EventEmitter`;
- `src/components/Models/` — модели данных каталога, корзины и покупателя;
- `src/components/Communication/` — предметный API приложения;
- `src/components/View/` — компоненты слоя представления;
- `src/types/index.ts` — интерфейсы и типы приложения;
- `src/utils/constants.ts` — адреса API/CDN и карта категорий;
- `src/utils/events.ts` — имена событий приложения;
- `src/utils/utils.ts` — вспомогательные функции;
- `src/main.ts` — Presenter: создание экземпляров, подписки на события и сценарии взаимодействия слоёв.

## Архитектура и паттерн MVP

Приложение построено по паттерну **MVP (Model–View–Presenter)**.

### Model

Модели хранят состояние приложения и предоставляют методы для работы с ним. Модели не работают с DOM и не выполняют HTTP-запросы.

При изменении данных модели уведомляют приложение через `EventEmitter`:

- `Products` хранит каталог и выбранный для просмотра товар;
- `Basket` хранит выбранные товары;
- `Buyer` хранит данные покупателя и выполняет их валидацию.

### View

Компоненты представления отвечают только за DOM:

- получают данные через `render()` и сеттеры;
- изменяют разметку;
- подписываются на пользовательские действия один раз в конструкторах;
- уведомляют о действиях пользователя через брокер событий;
- не хранят данные предметной области и не принимают бизнес-решения.

Для трёх вариантов карточки используется общий класс `Card`, а для двух форм — общий класс `Form`.

### Presenter

Presenter реализован в `src/main.ts`. Он:

- создаёт модели, представления и API-клиент;
- подписывается на события моделей и компонентов View;
- получает данные из моделей;
- решает, какие действия выполнить;
- передаёт актуальные данные компонентам View;
- формирует объект заказа и передаёт его коммуникационному слою.

Presenter не генерирует события самостоятельно, а только обрабатывает события, созданные моделями и представлениями.

## Типы данных

Все типы приложения находятся в `src/types/index.ts`.

### `TPayment`

```ts
type TPayment = 'card' | 'cash';
```

Доступные способы оплаты.

### `IProduct`

```ts
interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}
```

Товар каталога. `price` равен `null`, если товар недоступен для покупки.

### `IBuyer`

```ts
interface IBuyer {
    payment: TPayment | null;
    email: string;
    phone: string;
    address: string;
}
```

Текущее состояние данных покупателя. До выбора оплаты `payment` равен `null`.

### `TBuyerErrors`

```ts
type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;
```

Объект ошибок валидации. Если поле корректно, соответствующее свойство отсутствует.

### `IProductsResponse`

```ts
interface IProductsResponse {
    total: number;
    items: IProduct[];
}
```

Ответ сервера с каталогом товаров.

### `TOrder`

```ts
interface TOrder extends IBuyer {
    total: number;
    items: string[];
}
```

Заказ, отправляемый на сервер: данные покупателя, итоговая стоимость и массив идентификаторов товаров. Валидность полей покупателя до отправки проверяется моделью `Buyer`.

### `IOrderResponse`

```ts
interface IOrderResponse {
    id: string;
    total: number;
}
```

Ответ сервера после успешного оформления заказа.

### Типы представления

- `IGalleryData` — массив DOM-элементов карточек каталога;
- `IHeaderData` — счётчик товаров корзины;
- `IModalData` — содержимое модального окна;
- `ICardData` — общие данные карточки;
- `ICatalogCardData` — данные карточки каталога;
- `IPreviewCardData` — данные подробной карточки;
- `IBasketCardData` — данные карточки корзины;
- `IBasketViewData` — список карточек корзины, итоговая сумма и доступность оформления;
- `IFormState` — валидность формы и текст ошибок;
- `TOrderFormData` — данные первого шага заказа;
- `TContactsFormData` — данные второго шага заказа;
- `ISuccessData` — сумма успешно оформленного заказа.

### Типы данных событий

- `IProductIdEvent` — `id` товара;
- `IPaymentChangeEvent` — выбранный способ оплаты;
- `IInputChangeEvent` — строковое значение поля формы.

## Базовые классы

### `Component<T>`

Абстрактная основа компонентов View.

**Конструктор**

`constructor(container: HTMLElement)` — принимает корневой DOM-элемент компонента.

**Поля**

- `container: HTMLElement` — корневой элемент разметки.

**Методы**

- `render(data?: Partial<T>): HTMLElement` — применяет переданные данные и возвращает корневой элемент;
- `setImage(element: HTMLImageElement, src: string, alt?: string): void` — устанавливает `src` и `alt` изображения.

### `EventEmitter`

Брокер событий, реализующий `IEvents`.

**Поля**

- `_events: Map<EventName, Set<Subscriber>>` — коллекция подписчиков.

**Методы**

- `on<T extends object>(eventName, callback): void` — подписка на событие;
- `off(eventName, callback): void` — удаление подписки;
- `emit<T extends object>(eventName, data?): void` — генерация события;
- `onAll(callback): void` — подписка на все события;
- `offAll(): void` — очистка всех подписок;
- `trigger<T extends object>(eventName, context?): (data: T) => void` — создание функции-триггера.

### `Api`

Базовый HTTP-клиент, реализующий `IApi`.

**Конструктор**

`constructor(baseUrl: string, options: RequestInit = {})`.

**Поля**

- `baseUrl: string` — базовый адрес сервера;
- `options: RequestInit` — общие параметры запросов.

**Методы**

- `get<T extends object>(uri: string): Promise<T>` — GET-запрос;
- `post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>` — запрос с JSON-телом;
- `handleResponse<T>(response: Response): Promise<T>` — обработка ответа.

## Модели данных

### `Products`

Хранит каталог товаров и выбранный для подробного просмотра товар.

**Конструктор**

`constructor(events: IEvents)` — принимает брокер событий.

**Поля**

- `items: IProduct[]` — товары каталога;
- `selectedItem: IProduct | null` — выбранный товар;
- `events: IEvents` — брокер событий.

**Методы**

- `setItems(items: IProduct[]): void` — сохраняет каталог и генерирует `products:changed`;
- `getItems(): IProduct[]` — возвращает копию каталога;
- `getItem(id: string): IProduct | undefined` — находит товар по `id`;
- `setSelectedItem(item: IProduct | null): void` — сохраняет выбранный товар и генерирует `products:selected-changed`;
- `getSelectedItem(): IProduct | null` — возвращает выбранный товар.

### `Basket`

Хранит товары, выбранные для покупки.

**Конструктор**

`constructor(events: IEvents)` — принимает брокер событий.

**Поля**

- `items: IProduct[]` — товары корзины;
- `events: IEvents` — брокер событий.

**Методы**

- `getItems(): IProduct[]` — возвращает копию товаров корзины;
- `addItem(item: IProduct): void` — добавляет товар и генерирует `basket:changed`;
- `removeItem(item: IProduct): void` — удаляет товар и генерирует `basket:changed`;
- `clear(): void` — очищает корзину и генерирует `basket:changed`;
- `getTotalPrice(): number` — считает итоговую стоимость;
- `getItemsCount(): number` — возвращает количество товаров;
- `hasItem(id: string): boolean` — проверяет наличие товара.

### `Buyer`

Хранит данные покупателя, позволяет частично их обновлять и валидировать.

**Конструктор**

`constructor(events: IEvents)` — принимает брокер событий.

**Поля**

- `data: IBuyer` — текущие данные покупателя;
- `events: IEvents` — брокер событий.

Начальное состояние:

```ts
{
    payment: null,
    email: '',
    phone: '',
    address: ''
}
```

**Методы**

- `setData(data: Partial<IBuyer>): void` — частично обновляет данные и генерирует `buyer:changed`;
- `getData(): IBuyer` — возвращает копию данных;
- `clear(): void` — возвращает начальное состояние и генерирует `buyer:changed`;
- `validate(): TBuyerErrors` — проверяет непустое значение каждого поля.

## Слой коммуникации

### `WebLarekApi`

Предметный API приложения. Использует экземпляр `IApi` через композицию.

**Конструктор**

`constructor(api: IApi)`.

**Поля**

- `api: IApi` — HTTP-клиент.

**Методы**

- `getProducts(): Promise<IProductsResponse>` — GET `/product/`;
- `createOrder(order: TOrder): Promise<IOrderResponse>` — POST `/order/`.

## Компоненты представления

### `Gallery`

Отвечает за блок каталога `.gallery`.

**Конструктор**

`constructor(container: HTMLElement)`.

**Сеттеры**

- `items: HTMLElement[]` — заменяет содержимое каталога переданными карточками.

### `Header`

Отвечает за шапку и индикатор корзины.

**Конструктор**

`constructor(container: HTMLElement, events: IEvents)`.

**Поля**

- `basketButton: HTMLButtonElement` — кнопка корзины;
- `counterElement: HTMLElement` — счётчик товаров.

**Сеттеры**

- `counter: number` — обновляет число товаров.

Клик по корзине генерирует `basket:open`.

### `Modal`

Управляет общим модальным контейнером. Класс не имеет наследников.

**Конструктор**

`constructor(container: HTMLElement, events: IEvents)`.

**Поля**

- `closeButton: HTMLButtonElement` — крестик закрытия;
- `contentElement: HTMLElement` — контейнер содержимого.

**Сеттеры и методы**

- `content: HTMLElement` — заменяет содержимое;
- `open(): void` — добавляет модификатор `modal_active`;
- `close(): void` — удаляет `modal_active`.

Клик по крестику или оверлею генерирует `modal:close`.

### `Card<T>`

Абстрактный общий класс карточек.

**Поля**

- `titleElement: HTMLElement` — заголовок;
- `priceElement: HTMLElement` — цена.

**Сеттеры**

- `id: string` — сохраняет идентификатор в `dataset` корневого элемента;
- `title: string` — отображает название;
- `price: number | null` — отображает цену или «Бесценно».

### `CatalogCard`

Карточка товара в каталоге. Наследуется от `Card<ICatalogCardData>`.

**Поля**

- `categoryElement: HTMLElement` — категория;
- `imageElement: HTMLImageElement` — изображение.

**Сеттеры**

- `category: string` — устанавливает текст и CSS-модификатор из `categoryMap`;
- `image: string` — формирует полный URL изображения через `CDN_URL`.

Клик по карточке генерирует `card:select` с `id` товара.

### `PreviewCard`

Подробная карточка товара. Наследуется от `Card<IPreviewCardData>`.

**Поля**

- `categoryElement`, `imageElement` — категория и изображение;
- `descriptionElement: HTMLElement` — описание;
- `actionButton: HTMLButtonElement` — кнопка покупки/удаления.

**Сеттеры**

- `category`, `image`, `description` — отображают сведения о товаре;
- `buttonText: string` — подпись кнопки;
- `buttonDisabled: boolean` — доступность кнопки.

Клик по кнопке генерирует `product:toggle`.

### `BasketCard`

Компактная карточка товара корзины. Наследуется от `Card<IBasketCardData>`.

**Поля**

- `indexElement: HTMLElement` — номер позиции;
- `deleteButton: HTMLButtonElement` — кнопка удаления.

**Сеттеры**

- `index: number` — отображает номер товара.

Клик удаления генерирует `basket:remove`.

### `BasketView`

Отвечает за содержимое корзины.

**Поля**

- `listElement: HTMLElement` — список товаров;
- `totalElement: HTMLElement` — итоговая стоимость;
- `checkoutButton: HTMLButtonElement` — кнопка оформления.

**Сеттеры**

- `items: HTMLElement[]` — заменяет элементы списка;
- `total: number` — выводит сумму;
- `valid: boolean` — включает/отключает кнопку оформления.

Клик «Оформить» генерирует `basket:checkout`.

### `Form<T>`

Абстрактный общий класс форм.

**Конструктор**

`constructor(container: HTMLFormElement, events: IEvents, submitEvent: string)`.

**Поля**

- `submitButton: HTMLButtonElement` — кнопка отправки;
- `errorsElement: HTMLElement` — область ошибок.

**Сеттеры**

- `valid: boolean` — управляет `disabled` кнопки;
- `errors: string` — отображает текст ошибок.

При `submit` отменяется стандартная отправка формы и генерируется событие, имя которого передано в конструктор.

### `OrderForm`

Первый шаг оформления заказа. Наследуется от `Form<TOrderFormData>`.

**Поля**

- `paymentButtons: HTMLButtonElement[]` — кнопки выбора оплаты;
- `addressInput: HTMLInputElement` — адрес.

**Сеттеры**

- `payment: TPayment | null` — выделяет выбранную кнопку классом `button_alt-active`;
- `address: string` — обновляет поле адреса.

События: `order:payment-change`, `order:address-change`, `order:submit`.

### `ContactsForm`

Второй шаг оформления заказа. Наследуется от `Form<TContactsFormData>`.

**Поля**

- `emailInput: HTMLInputElement`;
- `phoneInput: HTMLInputElement`.

**Сеттеры**

- `email: string`;
- `phone: string`.

События: `contacts:email-change`, `contacts:phone-change`, `contacts:submit`.

### `Success`

Компонент успешного оформления заказа.

**Поля**

- `descriptionElement: HTMLElement` — текст списанной суммы;
- `closeButton: HTMLButtonElement` — кнопка завершения.

**Сеттеры**

- `total: number` — выводит сумму заказа.

Клик по кнопке генерирует `success:close`.

## События приложения

Имена событий находятся в `src/utils/events.ts`.

### События моделей

- `products:changed` — изменён каталог товаров;
- `products:selected-changed` — изменён выбранный товар;
- `basket:changed` — изменено содержимое корзины;
- `buyer:changed` — изменены данные покупателя.

### События представления

- `card:select` — выбрана карточка товара для просмотра;
- `product:toggle` — нажата кнопка покупки/удаления в подробной карточке;
- `basket:open` — нажата иконка корзины;
- `basket:remove` — нажата кнопка удаления товара из корзины;
- `basket:checkout` — нажата кнопка оформления;
- `order:payment-change` — выбран способ оплаты;
- `order:address-change` — изменён адрес;
- `order:submit` — выполнен переход к контактам;
- `contacts:email-change` — изменён email;
- `contacts:phone-change` — изменён телефон;
- `contacts:submit` — нажата кнопка оплаты;
- `modal:close` — пользователь закрыл модальное окно;
- `success:close` — пользователь закрыл окно успешного заказа.

## Презентер (`main.ts`)

Presenter создаёт экземпляры всех классов и содержит обработчики событий.

Основные сценарии:

1. После получения каталога API вызывает `Products.setItems()`. Модель генерирует `products:changed`, Presenter создаёт `CatalogCard` для каждого товара и передаёт карточки в `Gallery`.
2. `card:select` сохраняет товар как выбранный. Событие модели открывает `PreviewCard` в `Modal`.
3. `product:toggle` проверяет состояние корзины и вызывает `Basket.addItem()` либо `Basket.removeItem()`. После действия модальное окно закрывается.
4. `basket:changed` перерисовывает содержимое `BasketView` и счётчик `Header`.
5. `basket:open` открывает корзину, `basket:remove` удаляет товар, `basket:checkout` открывает первый шаг заказа.
6. Изменения форм передаются в `Buyer.setData()`. На `buyer:changed` Presenter вызывает `Buyer.validate()` и обновляет поля, ошибки и доступность кнопок.
7. `order:submit` при корректных оплате и адресе открывает `ContactsForm`.
8. `contacts:submit` при отсутствии ошибок формирует `TOrder` и отправляет его через `WebLarekApi.createOrder()`.
9. После успешного ответа корзина и данные покупателя очищаются, а в модальном окне отображается `Success` с итоговой суммой.


https://github.com/cameralumina/weblarek
