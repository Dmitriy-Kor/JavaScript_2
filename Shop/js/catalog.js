'use strict'
const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses'

// промис
const getData = (url) => {
    return  new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status !== 200) {
                reject(`${xhr.status}, ${xhr.statusText}`);

            } else {
                resolve(xhr.responseText);
            }
        }
    };
    xhr.send();
})};


class ProductList {
    constructor(container = '.products'){
        this.apiEnd = '/catalogData.json';
        this.container = container;
        this.goods = [];
        this.allRenderProducts = [];
        this.allProductsPrice = 0;

        // this._getProducts()
        //     .then(data => {
        //         this.goods = [...data];
        //         this._render();
        //         this._totalSum();
        //     });

        // получаем товары
        //getData('catalog.json')
        getData(API + this.apiEnd)
            .then((data) => {
                this.goods = JSON.parse(data);
                console.log(this.goods)
                this._render();
                this._totalSum();
            })
            .catch((Error) => console.log(Error));
    }

    // _getProducts() {
    //     return fetch(API + this.apiEnd)
    //         .then (response => response.json())
    //         .catch(error => {
    //             console.log(error);
    //         });
    // }

    _render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            const productObj = new ProductItem(product);
            this.allRenderProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj._render())
        }
    }

    // считаем стоимость всех товаров
    _totalSum() {

        this.allProductsPrice = this.allRenderProducts.reduce((sum, product) => sum + product.price, 0);
        console.log(`Цена всех товаров: ${this.allProductsPrice}`)
    }
}

class ProductItem{
    constructor(product){
        this.id = product.id_product || new Date().toISOString();
        this.title = product.product_name || 'Something for nothing';
        this.price = product.price || 0;
        this.img = product.img || 'https://via.placeholder.com/160x110/';
    }
    _render(){
        return `<div class="product-item">
                    <img class="product-item__img" src="${this.img}" alt="${this.title} image">
                    <div class="product-item__info">
                            <div>
                                <h3 class="product-item__title">${this.title}</h3>
                                <p class="product-item__price">${this.price}</p>
                            </div>
                            <button class="by-btn" data-id="${this.id}" data-img="${this.img}" data-name="${this.title}" data-price="${this.price}">Добавить в корзину</button>
                    </div>
                </div>`;
    }
}

// с наследованием не получилось((
// в рендер корзины пробрасывался не тот массив товаров
/*
class CartList extends ProductList{
    constructor(container = '.cart__items') {
        super(container);
        this.apiEnd = '/getBasket.json';
        this.visibilityCart = false;
        this.goods = [];
        this._getProducts()
            .then(data => {
                this.goods = [...data.contents];
                console.log(this.goods);
                this.writeToObj();
                this.showCart();
            });
    }

    _getProducts() {
        return fetch(API + this.apiEnd)
            .then (response => response.json())
            .catch(error => {
                console.log(error);
            });
    }

    _render(){
        const block = document.querySelector(this.container);
        // for (let product of this.goods){
        //     const productObj = new CartItem(product);
        //     this.allRenderProducts.push(productObj);
        //     block.insertAdjacentHTML('beforeend', productObj._render())
        // }
        console.log(this.goods);
        this.goods.forEach(good => {
            const productObj = new CartItem(good);
            this.allRenderProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj._render())
        })
    }
    _totalSum() {
        this.allProductsPrice = this.allRenderProducts.reduce((sum, product) => sum + product.price, 0);
        console.log(`Цена всех товаров карзины: ${this.allProductsPrice}`)
    }
    writeToObj(){
        let object = document.querySelector('.cart__price');
        object.insertAdjacentHTML('beforeend', this.allProductsPrice );
    }
    showCart(){
        document.querySelector('.head__btn').addEventListener('click',() => {
            if (this.visibilityCart === false){
                document.querySelector('.cart').style.display = 'block';
                this.visibilityCart = true;
            } else {
                document.querySelector('.cart').style.display = 'none';
                this.visibilityCart = false;
            }
        });
    }
}

class CartItem extends ProductItem{
    constructor(product){
        super(product);

        // сюда прилетает не тот this.goods (без quantity)

        this.id = product.id_product || new Date().toISOString();
        this.quantity = product.quantity || 0;
        this.img = product.img || 'https://via.placeholder.com/120x83/';
    }
    _render(){
        return `<div class="item-in-cart">
                    <div class="item-in-cart__box">
                        <img src="${this.img}" alt="${this.title} image" class="item-in-cart__img">
                        <div class="item-in-cart__info">
                            <h3 class="item-in-cart__title">${this.title}</h3>
                            <p class="item-in-cart__quantity">Колличество: ${this.quantity}</p>
                            <p class="item-in-cart__price">${this.price}&#x20BD</p>
                        </div>
                        <button class="item-in-cart__btnCross"><i class="fas fa-times"></i></button>
                    </div>
                </div>`;
    }

}
*/

// new ProductList();
// new CartList();


