/**
 * описавыем базовые класс "List"
 */
class List {
    constructor(container, endAPI, list = listContext) {
    this.container = container;
    this.list = list; // словарь
    this.goods = [];
    this.API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
    this.endAPI = endAPI; // окончание адреса сервера API
    this.allRenderProducts = [];
    this.filtredProducts = []; // найденные товары (отфильтрованные)
    this._init();
    }
    _init() {
        return false
    }

    /**
     * Получаем данные с сервера
     * @param url
     * @return {Promise<any>}
     * @private
     */
    _getDataFromServer(url) {
        return fetch(url ? url: `${this.API + this.endAPI}`)
            .then (response => response.json())
            .catch(error => {
                console.log(error);
            });
    }

    /**
     * Обрабатываем полученные данные с сервера (запись в массив и запускаем отрисовку в html)
     * @param data - данные полученные с сервера
     * @private
     */
    _workingWithData(data){
        this.goods = [...data];
        this._render();
        //console.log(this.allRenderProducts);

    }

    /**
     * Вычисляем и возвращаем стоимость товаров
     * @return {*}
     * @private
     */
    _calcSum() {
        return this.allRenderProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);
    }

    /**
     * Метод поиска товара
     * @param value - поисковый запрос
     */
    filter(value){
        const regexp = new RegExp(value, 'i');
        this.filtredProducts = this.allRenderProducts.filter(product => regexp.test(product.name));
        console.log(this.filtredProducts);
        this.allRenderProducts.forEach( el => {
            const block = document.querySelector(`.product-item[data-id="${el.name}"]`);
            console.log(block);
            if (!this.filtredProducts.includes(el)){
                block.classList.add('invisible');
            } else {
                block.classList.remove('invisible')
            }
        });
    }

    /**
     * Метод определяет конструктор, создает объект и отрисовывает его в контейнер
     * @private
     */
    _render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            //console.log(this.constructor.name)
            const productObj = new this.list[this.constructor.name](product);
            //console.log(productObj);
            this.allRenderProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj._render())
            ;
        }
    }
}

/**
 * описываем базовый класс "Item"
 */
class Item {
    constructor(product) {
        this.id = +product.id_product || new Date().getTime();
        this.name = product.product_name || 'Something for nothing';
        this.price = +product.price || 0;
        this.img = product.img || 'https://via.placeholder.com/160x110/';
    }

    /**
     * метод создает разметку для html
     * @return {string}
     * @private
     */
    _render() {
        return `<div class="product-item" data-id="${this.name}" >
                    <img class="product-item__img" src="${this.img}" alt="${this.name} image">
                    <div class="product-item__info">
                            <div>
                                <h3 class="product-item__title">${this.name}</h3>
                                <p class="product-item__price">${this.price}</p>
                            </div>
                            <button class="by-btn" data-id="${this.id}" data-img="${this.img}" data-name="${this.name}" data-price="${this.price}">Добавить в корзину</button>
                    </div>
                </div>`;
    }
}

/**
 * Описываем класс ProductList - список товаров
 * Наследуется от баззового класса LIST
 */
class ProductList extends List {
    constructor(cart, container = '.products', endAPI = '/catalogData.json') {
        super(container, endAPI);
        this.cart = cart; // ссылка на корзину
        this._getDataFromServer('catalog.json')
            .then(data => {this._workingWithData(data)})
            .catch(error => {
                console.log(error);
            });
    }

    /**
     * Метод инициализации (начальный метод)
     * Получает элементы и назначает обработчики события
     * @private
     */
    _init() {
        // обработчик на кнопку "добавить в корзину"
        document.querySelector(this.container).addEventListener('click', event => {
            if (event.target.classList.contains('by-btn')) {
                this.cart.addProduct(event.target);
            }
        });
        // обработчик для формы поиска
        document.querySelector('.head__search-form').addEventListener('submit', (event) => {
          event.preventDefault();
          this.filter(document.querySelector('.head__search').value);
        });

    }
}

/**
 * описываем класс
 * наследуется из базового класса Item
 */
class ProductItem extends Item {
    constructor(product) {
        super(product);
    }
}

/**
 * описываем класс Корзины
 * наследуется из базового класса list
 */
class CartList extends List {
    constructor(container = '.cart__items', endAPI ='/getBasket.json') {
        super(container, endAPI);
        this.allRenderProducts = [];
        this._getDataFromServer('cart.json')
            .then(data => {this._workingWithData(data.contents);
                this.cartSum();
            })
            .catch(error => {
            console.log(error);

        });

    }

    /**
     * Метод получает ответ с сервера и добовляет товар в корзину
     * Если товар есть в корзине, увеличивает колличество
     * Если товара нет создает новый и записывае в корзину
     * @param element
     */
    addProduct(element) {
        this._getDataFromServer(`${this.API}/addToBasket.json`)
            .then(data => {
                //проверка ответа
                if (data.result === 1){
                    let id = element.dataset["id"];
                    // здесь неработает через сравнение(===)
                    let foundProduct = this.allRenderProducts.find(product => product.id == id);
                    if (foundProduct) {
                        foundProduct.quantity ++;
                        this._updateCart(foundProduct);
                        this.showCart(); // показыват корзину
                    } else {
                        let newProduct = this.createNewProductInCart(element)
                        this.goods.push(newProduct);

                        // console.log('это массив GOODS:');
                        // console.log(this.goods)
                        // console.log('это массив AllRendersProducts:');
                        // console.log(this.allRenderProducts);

                        this.allRenderProducts = [];
                        document.querySelector(this.container).innerHTML = '';
                        this._render();
                        this.cartSum();
                        this.showCart();
                    };
                }
            }).catch(error => {
            console.log(error)});

    }

    /**
     * метод создает новый товар
     * @param element
     * @return {{img: string | undefined, id_product: number, quantity: number, price: number, product_name: string | undefined}}
     */
    createNewProductInCart(element){
        return {
            id_product: +element.dataset["id"],
            product_name: element.dataset["name"],
            price: +element.dataset["price"],
            quantity: 1,
            img: element.dataset["img"]
        }
    }

    /**
     * метод удаляет товар из корзины
     * @param element
     */
    removeProduct(element) {
        this._getDataFromServer(`${this.API}/deleteFromBasket.json`)
            .then(data => {
                if (data.result === 1){
                    let id = element.dataset["id"];
                    let foundProduct = this.allRenderProducts.find(product => product.id == id);
                    if (foundProduct.quantity > 1) {
                        foundProduct.quantity --;
                        this._updateCart(foundProduct);
                    } else {
                        let index =this.allRenderProducts.indexOf(foundProduct)
                        this.allRenderProducts.splice(index, 1);
                        this.goods.splice(index, 1);
                        document.querySelector(`.item-in-cart[data-id="${id}"]`).remove();
                        this.cartSum();

                        // скрывает корзину если она пуста
                        if (this.allRenderProducts.length == 0){
                            document.querySelector('.cart').classList.toggle('show');
                        }

                    };
                }
            }).catch(error => {
            console.log(error)});

    }

    /**
     * Метод выводит данные в html
     * @param product
     * @private
     */
    _updateCart(product) {
        let block = document.querySelector(`.item-in-cart[data-id="${product.id}"]`);
        block.querySelector('.item-in-cart__quantity').textContent = `Колличество: ${product.quantity}`;
        block.querySelector('.item-in-cart__price').textContent = `${product.price * product.quantity} ₽`;
        this.cartSum();
    }

    /**
     * Метод показывает или скрывает корзину
     */
    showCart(){
        if (!document.querySelector('.cart').classList.contains('show')) {
            document.querySelector('.cart').classList.toggle('show');
        }
    }

    /**
     * метод записсывает сумму товаров в корзине
     */
    cartSum(){
        document.querySelector('.cart__price').textContent = this._calcSum()
    }

    /**
     * метод назначает обработчики событий
     * @private
     */
    _init() {
        // для кнопки корзины
        document.querySelector('.head__btn').addEventListener('click', () => {
            document.querySelector('.cart').classList.toggle('show')
        });
        // для кнопки удалить
        document.querySelector(this.container).addEventListener('click', event => {
            if (event.target.classList.contains('item-in-cart__btnCross')) {
                this.removeProduct(event.target);}
            //если кликнули по крестику fontawesome
            if (event.target.classList.contains('fa-times')) {
                this.removeProduct(event.target.parentElement);
            }
        })
    }
}

/**
 * описывае класс
 * наследуется из базового класса Item
 */
class CartItem extends Item {
    constructor(product) {
        super(product);
        this.quantity = product.quantity || 0
    }
    /**
     * метод создает разметку для html
     * @return {string}
     * @private
     */
    _render(){
        return `<div class="item-in-cart" data-id="${this.id}">
                    <div class="item-in-cart__box">
                        <img src="${this.img}" alt="${this.name} image" class="item-in-cart__img">
                        <div class="item-in-cart__info">
                            <h3 class="item-in-cart__title">${this.name}</h3>
                            <p class="item-in-cart__quantity">Колличество: ${this.quantity}</p>
                            <p class="item-in-cart__price">${this.price} &#x20BD</p>
                        </div>
                        <button class="item-in-cart__btnCross" data-id="${this.id}"><i class="fas fa-times"></i></button>
                    </div>
                </div>`;
    }
}

// словарь
const listContext = {
    ProductList : ProductItem,
    CartList: CartItem
}


