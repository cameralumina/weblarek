import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { Products } from './components/Models/Products';
import { WebLarekApi } from './components/Communication/WebLarekApi';
import { BasketCard } from './components/View/BasketCard';
import { BasketView } from './components/View/BasketView';
import { CatalogCard } from './components/View/CatalogCard';
import { ContactsForm } from './components/View/ContactsForm';
import { Gallery } from './components/View/Gallery';
import { Header } from './components/View/Header';
import { Modal } from './components/View/Modal';
import { OrderForm } from './components/View/OrderForm';
import { PreviewCard } from './components/View/PreviewCard';
import { Success } from './components/View/Success';
import type {
    IBuyer,
    IInputChangeEvent,
    IPaymentChangeEvent,
    IProductIdEvent,
    TBuyerErrors,
    TOrder,
} from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { appEvents } from './utils/events';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();

const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

const catalogCardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewCardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'));
const previewCard = new PreviewCard(
    cloneTemplate<HTMLElement>(previewCardTemplate),
    {
        onClick: () => events.emit(appEvents.productToggle),
    }
);
const basketView = new BasketView(
    cloneTemplate<HTMLElement>(basketTemplate),
    events
);
const orderForm = new OrderForm(
    cloneTemplate<HTMLFormElement>(orderTemplate),
    events
);
const contactsForm = new ContactsForm(
    cloneTemplate<HTMLFormElement>(contactsTemplate),
    events
);
const successView = new Success(
    cloneTemplate<HTMLElement>(successTemplate),
    events
);

const getErrorsText = (
    errors: TBuyerErrors,
    fields: (keyof IBuyer)[]
): string => fields
    .map((field) => errors[field])
    .filter((message): message is string => Boolean(message))
    .join('; ');

const openModal = (content: HTMLElement): void => {
    modal.render({ content });
    modal.open();
};

const renderBasket = (): void => {
    const basketItems = basketModel.getItems();
    const itemElements = basketItems.map((item, index) => {
        const card = new BasketCard(
            cloneTemplate<HTMLElement>(basketCardTemplate),
            {
                onClick: () => {
                    events.emit<IProductIdEvent>(appEvents.basketRemove, {
                        id: item.id,
                    });
                },
            }
        );

        return card.render({
            title: item.title,
            price: item.price,
            index: index + 1,
        });
    });

    basketView.render({
        items: itemElements,
        total: basketModel.getTotalPrice(),
        valid: basketItems.length > 0,
    });

    header.render({ counter: basketModel.getItemsCount() });
};

const renderOrderForm = (showErrors = true): void => {
    const buyer = buyerModel.getData();
    const errors = buyerModel.validate();

    orderForm.render({
        payment: buyer.payment,
        address: buyer.address,
        valid: !errors.payment && !errors.address,
        errors: showErrors
            ? getErrorsText(errors, ['payment', 'address'])
            : '',
    });
};

const renderContactsForm = (showErrors = true): void => {
    const buyer = buyerModel.getData();
    const errors = buyerModel.validate();

    contactsForm.render({
        email: buyer.email,
        phone: buyer.phone,
        valid: !errors.email && !errors.phone,
        errors: showErrors
            ? getErrorsText(errors, ['email', 'phone'])
            : '',
    });
};

const updateBuyerViews = (): void => {
    renderOrderForm();
    renderContactsForm();
};

events.on(appEvents.productsChanged, () => {
    const cards = productsModel.getItems().map((product) => {
        const card = new CatalogCard(
            cloneTemplate<HTMLElement>(catalogCardTemplate),
            {
                onClick: () => {
                    events.emit<IProductIdEvent>(appEvents.cardSelect, {
                        id: product.id,
                    });
                },
            }
        );

        return card.render({
            title: product.title,
            category: product.category,
            image: {
                src: product.image,
                alt: product.title,
            },
            price: product.price,
        });
    });

    gallery.render({ items: cards });
});

events.on<IProductIdEvent>(appEvents.cardSelect, ({ id }) => {
    const product = productsModel.getItem(id);
    if (product) {
        productsModel.setSelectedItem(product);
    }
});

events.on(appEvents.selectedProductChanged, () => {
    const product = productsModel.getSelectedItem();
    if (!product) {
        return;
    }

    const isInBasket = basketModel.hasItem(product.id);
    const isUnavailable = product.price === null;

    const cardElement = previewCard.render({
        title: product.title,
        category: product.category,
        image: {
            src: product.image,
            alt: product.title,
        },
        description: product.description,
        price: product.price,
        buttonText: isUnavailable
            ? 'Недоступно'
            : isInBasket
                ? 'Удалить из корзины'
                : 'Купить',
        buttonDisabled: isUnavailable,
    });

    openModal(cardElement);
});

events.on(appEvents.productToggle, () => {
    const product = productsModel.getSelectedItem();
    if (!product || product.price === null) {
        return;
    }

    if (basketModel.hasItem(product.id)) {
        basketModel.removeItem(product);
    } else {
        basketModel.addItem(product);
    }

    modal.close();
});

events.on(appEvents.basketChanged, () => {
    renderBasket();
});

events.on(appEvents.basketOpen, () => {
    renderBasket();
    openModal(basketView.render());
});

events.on<IProductIdEvent>(appEvents.basketRemove, ({ id }) => {
    const product = basketModel.getItems().find((item) => item.id === id);
    if (product) {
        basketModel.removeItem(product);
    }
});

events.on(appEvents.basketCheckout, () => {
    renderOrderForm(false);
    openModal(orderForm.render());
});

events.on<IPaymentChangeEvent>(appEvents.orderPaymentChange, ({ payment }) => {
    buyerModel.setData({ payment });
});

events.on<IInputChangeEvent>(appEvents.orderAddressChange, ({ value }) => {
    buyerModel.setData({ address: value });
});

events.on<IInputChangeEvent>(appEvents.contactsEmailChange, ({ value }) => {
    buyerModel.setData({ email: value });
});

events.on<IInputChangeEvent>(appEvents.contactsPhoneChange, ({ value }) => {
    buyerModel.setData({ phone: value });
});

events.on(appEvents.buyerChanged, () => {
    updateBuyerViews();
});

events.on(appEvents.orderSubmit, () => {
    renderContactsForm(false);
    openModal(contactsForm.render());
});

events.on(appEvents.contactsSubmit, () => {
    const buyer = buyerModel.getData();
    const order: TOrder = {
        ...buyer,
        total: basketModel.getTotalPrice(),
        items: basketModel.getItems().map((item) => item.id),
    };

    webLarekApi
        .createOrder(order)
        .then((response) => {
            basketModel.clear();
            buyerModel.clear();
            openModal(successView.render({ total: response.total }));
        })
        .catch(() => {
            contactsForm.render({
                errors: 'Не удалось оформить заказ. Попробуйте ещё раз.',
            });
        });
});

events.on(appEvents.successClose, () => {
    modal.close();
});

renderBasket();
renderOrderForm(false);
renderContactsForm(false);

webLarekApi
    .getProducts()
    .then((response) => {
        const products = response.items.map((product) => ({
            ...product,
            image: `${CDN_URL}${product.image}`,
        }));

        productsModel.setItems(products);
    })
    .catch((error: unknown) => {
        console.error('Ошибка загрузки каталога товаров:', error);
    });
