'use strict'

class ProductList{
    constructor(container = '.products'){
        this.container = container;
        this.goods = [];
        this.allRenderProducts = [];
        this.allProductsPrice = 0;
        this._fetchProducts();
        this._render();
        this._totalSum();
    }
    _fetchProducts(){
        this.goods = [
            {id: 1, title: 'Notebook', price: 40000, img: 'https://via.placeholder.com/160x110/CAC2FF'},
            {id: 2, title: 'Mouse', price: 2000, img: 'https://via.placeholder.com/160x110/B0B8E8'},
            {id: 3, title: 'Keyboard', price: 4000, img: 'https://via.placeholder.com/160x110/CFE2FF'},
            {id: 4, title: 'Gamepad', price: 5000, img: 'https://via.placeholder.com/160x110/B0D5E8'},
            {id: 5, title: 'Monitor', price: 20000, img: 'https://via.placeholder.com/160x110/C2FAFF'},
            {id:6},
            {title: 'Error'}
        ];
    }
    _render(){
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            const productObj = new ProductItem(product);
            this.allRenderProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj._render())
        }
        console.log(this.allRenderProducts);
    }
    _totalSum(){
        this.allRenderProducts.forEach(element => {
        this.allProductsPrice += element.price;
        })
        console.log(`Цена всех товаров: ${this.allProductsPrice}`)
    }
}

class ProductItem{
    constructor(product){
        this.id = product.id || new Date().toISOString();
        this.title = product.title || 'Something for nothing';
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
                            <button class="by-btn">Добавить в корзину</button>
                    </div>
                </div>`;
    }
}

class CartList extends ProductList{
    constructor(container = '.cart__items') {
        super(container);
        this.visibilityCart = false;
        this.writeToObj();
        this.showCart()
    }
    _fetchProducts(){
        this.goods = [
            {id: 1, title: 'Notebook', price: 40000, quantity: 1, img: 'https://via.placeholder.com/120x83/CAC2FF'},
            {id: 2, title: 'Mouse', price: 2000, quantity: 1, img: 'https://via.placeholder.com/120x83/B0B8E8'},
            {title: 'Error'},
        ];
    }
    _render(){
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            const productObj = new CartItem(product);
            this.allRenderProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj._render())
        }
        console.log(this.allRenderProducts);
    }
    writeToObj(){
        let object = document.querySelector('.cart__price');
        object.insertAdjacentHTML('beforeend', this.allProductsPrice );
    }
    showCart(){
        document.querySelector('.head__btn').addEventListener('click',() => {
            if (this.visibilityCart == false){
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
    constructor(product) {
        super(product);
        this.id = product.id || new Date().toISOString();
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

new ProductList();
new CartList();

/*
class CartList {
    constructor(container = '.cart__items') {
        this.container = container;
        this.goods = [];
        this.allRenderProducts = [];
        this.allProductsPrice = 0;
        this.visibilityCart = false;
        this._fetchProducts();
        this._render();
        this._totalSum();
        this.writeToObj();
        this.showCart();
    }
    _fetchProducts() {
        this.goods = [
            {id: 1, title: 'Notebook', price: 40000, quantity: 1, img: 'https://via.placeholder.com/120x83/CAC2FF'},
            {id: 2, title: 'Mouse', price: 2000, quantity: 2, img: 'https://via.placeholder.com/120x83/B0B8E8'},
            {title: 'Error'},
        ];
    }
    _render(){
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            const productObj = new CartItem(product);
            this.allRenderProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj.render())
        }
        console.log(this.allRenderProducts);
    }
    _totalSum(){
        this.allRenderProducts.forEach(element => {
            this.allProductsPrice += element.price;
        })
        console.log(`Цена всех товаров: ${this.allProductsPrice}`)
    }
    writeToObj(){
        let object = document.querySelector('.cart__price');
        object.insertAdjacentHTML("beforeend", this.allProductsPrice );
    }

    // showCart(){
    //     let cart = document.querySelector('.cart');
    //     let btnCart = document.querySelector('.head__btn');
    //     btnCart.addEventListener('click',() => {
    //         if (this.visibilityCart == false){
    //             cart.classList.add('show');
    //             this.visibilityCart = true;
    //         } else {
    //             cart.classList.remove('show');
    //             this.visibilityCart = false;
    //         }
    //     });
    // }

    showCart(){
        document.querySelector('.head__btn').addEventListener('click',() => {
            if (this.visibilityCart == false){
                document.querySelector('.cart').style.display = 'block';
                this.visibilityCart = true;
            } else {
                document.querySelector('.cart').style.display = 'none';
                this.visibilityCart = false;
            }
        });
    }
}
class CartItem {
    constructor(product) {
        this.id = product.id || new Date().toISOString();
        this.title = product.title || 'Something for nothing';
        this.price = product.price || 0;
        this.quantity = product.quantity || 0;
        this.img = product.img || 'https://via.placeholder.com/120x83/';
    }
    render(){
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

