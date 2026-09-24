import './scss/styles.scss';

import { Api } from './components/base/Api';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { Products } from './components/Models/Products';
import { WebLarekApi } from './components/Communication/WebLarekApi';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

const productsModel = new Products();
const basketModel = new Basket();
const buyerModel = new Buyer();

productsModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', productsModel.getItems());

const firstProduct = apiProducts.items[0];
const secondProduct = apiProducts.items[1];

console.log(
    'Товар, найденный в каталоге по id:',
    productsModel.getItem(firstProduct.id)
);

productsModel.setSelectedItem(firstProduct);
console.log(
    'Товар, выбранный для подробного отображения:',
    productsModel.getSelectedItem()
);

productsModel.setSelectedItem(null);
console.log(
    'Выбранный товар после очистки подробного отображения:',
    productsModel.getSelectedItem()
);

basketModel.addItem(firstProduct);
basketModel.addItem(secondProduct);
console.log('Товары в корзине после добавления:', basketModel.getItems());
console.log('Количество товаров в корзине:', basketModel.getItemsCount());
console.log('Общая стоимость товаров в корзине:', basketModel.getTotalPrice());
console.log(
    'Проверка наличия первого товара в корзине:',
    basketModel.hasItem(firstProduct.id)
);

basketModel.removeItem(firstProduct);
console.log('Товары в корзине после удаления:', basketModel.getItems());

basketModel.clear();
console.log('Корзина после очистки:', basketModel.getItems());

buyerModel.setData({ payment: 'card', address: 'Москва, ул. Примерная, 1' });
buyerModel.setData({ email: 'buyer@example.com', phone: '+7 900 000-00-00' });
console.log('Данные покупателя после заполнения:', buyerModel.getData());
console.log('Ошибки валидации заполненных данных покупателя:', buyerModel.validate());

buyerModel.clear();
console.log('Данные покупателя после очистки:', buyerModel.getData());
console.log('Ошибки валидации пустых данных покупателя:', buyerModel.validate());

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

webLarekApi
    .getProducts()
    .then((response) => {
        productsModel.setItems(response.items);
        console.log(
            'Каталог товаров после получения данных с сервера:',
            productsModel.getItems()
        );
    })
    .catch((error: unknown) => {
        console.error('Ошибка загрузки каталога товаров:', error);
    });
