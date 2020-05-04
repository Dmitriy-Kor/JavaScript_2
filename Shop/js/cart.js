'use strict'
class CartList {
    constructor(container = '.cart__items') {
        this.container = container;
        this.goods = [];
        this.allRenderProducts = [];
        this.allProductsPrice = 0;
        this.apiEnd = '/getBasket.json';
        this.visibilityCart = false;

        this._getProducts()
            .then(data => {
                this.goods = [...data.contents];
                this._render();
                this._totalSum();
                this.writeToObj();
                this.showCart();
                this.clickToAdd();
                this.clickToRemove();
            });
    }
    // получаю товары с сервера
    _getProducts() {
        return fetch(API + this.apiEnd)
            .then (response => response.json())
            .catch(error => {
                console.log(error);
            });
    }

    _render() {
        this.allRenderProducts = [];
        const block = document.querySelector(this.container);
        this.goods.forEach(good => {
            const productObj = new CartItem(good);
            this.allRenderProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj._render());
        })
    }

    // обнуляет стоимость товаров и заново вычисляет
    _totalSum() {
        this.allProductsPrice = 0;
        this.allProductsPrice = this.allRenderProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);
        console.log(`Цена всех товаров карзины: ${this.allProductsPrice}`);


    }

    // записывает стоимость товаров в корзине
    writeToObj() {
        let object = document.querySelector('.cart__price');
        object.innerHTML = '';
        object.insertAdjacentHTML('beforeend', this.allProductsPrice );
    }

    // скрывает и показывает корзину
    showCart() {
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

    // по клику получаем кнопку (event) проверяем что кнопка и пробрассывае в следующий метод addToCart()
    clickToAdd() {
        // тут проблема с делегированием
        // let buttons = [];
        // buttons = document.querySelectorAll('.by-btn');
        // buttons.forEach(btn => { btn.addEventListener('click', (event) => {
        //     this.addToCart(event.target);})
        // });
        // а тут все ок
        document.querySelector('.products').addEventListener('click', (event) => {
            let target = event.target

            if (target.tagName == 'BUTTON'){
                this.addToCart(target)}
        });
    }

    // метод получает объект, сравнивает id с товарами в корзине. Если есть совпадение увеличивает количество.
    // Если нет совпадения запускает метод создания нового товара createNewProductInCart() и записывает в массив товаров корзины
    // заново отрисовывает корзину
    addToCart(target) {
        let id = target.dataset["id"];
        let foundProduct = this.goods.find(product => product.id_product == id);
        if (foundProduct) {
            foundProduct.quantity ++;
        } else {
            let newProduct = this.createNewProductInCart(target)
            this.goods.push(newProduct);
        };

        this.clearCart(); //очищаем корзину
        this._render(); // заново отрисовываем
        this._totalSum(); // считаем сумму товров в корзине
        this.writeToObj(); // записываем сумму
        this.clickToRemove(); //// добавляем возможность удалить товар из корзины

        // если добавляется товар показывает корзину
        if (this.visibilityCart === false){
            document.querySelector('.cart').style.display = 'block';
            this.visibilityCart = true;}
    }

    // метод очищает корзину
    clearCart() {
        document.querySelector(this.container).innerHTML = "";
    }

    // создает новый товар
    createNewProductInCart(target) {
        return {
            id_product: target.dataset["id"],
            product_name: target.dataset["name"],
            price: +target.dataset["price"],
            img: target.dataset["img"],
            quantity: 1
        }

    }
    // получаем кнопку удаления товара
    clickToRemove(){
        let buttons = [];
        buttons = document.querySelectorAll('.item-in-cart__btnCross');
        buttons.forEach(btn => { btn.addEventListener('click', (event) => {
            if (event.target.classList.contains("fas")){
                this.removeFromCart(event.target.parentElement);
            } else {
                this.removeFromCart(event.target);
            };
        });
        });

    }
    // уменьшает количество товара в корзине, если количество товара меньше 1 удаляет товар, скрывает пустую корзину
    removeFromCart(target) {
        let id = target.dataset["id"];
        let foundProduct = this.goods.find(product => product.id_product == id);
        if (foundProduct.quantity > 1) {
            foundProduct.quantity --;
        } else {
            this.goods.splice(this.goods.indexOf(foundProduct), 1);
        };

        this.clearCart(); // очищаем корзину
        this._render(); // заново отрисовываем
        this._totalSum(); // считаем сумму товаров
        this.writeToObj(); // записываем сумму
        this.clickToRemove(); // добавляем возможность удалить товар

        //проверка если корзина пустая скрываем ее
        if (this.allRenderProducts == ''){
            document.querySelector('.cart').style.display = 'none';
            this.visibilityCart = false;
        }
    }
}
class CartItem {
    constructor(product) {
        this.id = product.id_product || new Date().toISOString();
        this.title = product.product_name || 'Something for nothing';
        this.quantity = product.quantity || 0;
        this.price = product.price || 0;
        this.img = product.img || 'https://via.placeholder.com/160x110/';
    }
    _render() {
        return `<div class="item-in-cart">
                    <div class="item-in-cart__box">
                        <img src="${this.img}" alt="${this.title} image" class="item-in-cart__img">
                        <div class="item-in-cart__info">
                            <h3 class="item-in-cart__title">${this.title}</h3>
                            <p class="item-in-cart__quantity">Колличество: ${this.quantity}</p>
                            <p class="item-in-cart__price">${this.price}&#x20BD</p>
                        </div>
                        <button class="item-in-cart__btnCross" data-id="${this.id}"><i class="fas fa-times"></i></button>
                    </div>
                </div>`;
    }
}