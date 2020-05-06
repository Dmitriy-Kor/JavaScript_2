let app = new Vue({
    el: '#app',
    data: {

        filteredGoods: [],
        searchLine: '',
        cartVisibility: false,
        serverErrors:
            {
                cart: false,
                catalog: false,
            },
        goods:
            {
                catalogGoods: [],
                cartGoods: [],
            },
        API : 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses',
    },
    methods: {
        /**
         * Получаем данные с сервера
         * @param url
         * @param endApi окончание адреса сервера
         * @return {Promise<any>}
         * @private
         */
        _getDataFromServer(url) {
            return fetch(url ? url: this.API)
                .then (response => response.json())
                .catch(error => {
                    console.log(error);
                });
        },
        /**
         * Обрабатываем полученные данные с сервера (запись в массив)
         * @param data - данные полученные с сервера
         * @param array - имя массива объекта goods ( может быть: "catalogGoods" или "cartGoods")
         * @private
         */
        _workingWithData(data, array){
            this.goods[array] = [...data];
        },

        calcSumAll() {
            return this.goods.cartGoods.reduce((sum, product) => sum + product.price * product.quantity, 0);
        },

        /**
         * Метод поиска товара
         * @param value - поисковый запрос
         */
        filter(value){
            const regexp = new RegExp(value, 'i');
            this.filteredGoods = this.goods.catalogGoods.filter(product => regexp.test(product.product_name));
            console.log(`Поисковый запрос(патерн): ${regexp}`);

            this.goods.catalogGoods.forEach( el => {
                const block = document.querySelector(`.product-item[data-name="${el.product_name}"]`);

                if (!this.filteredGoods.includes(el)){
                    block.classList.add('invisible');
                } else {
                    block.classList.remove('invisible')
                }
            });
        },

        /**
         * метод добавляет товар в корзину
         * @param element
         */
        addProduct(element) {
            this._getDataFromServer(`${this.API}/addToBasket.json`)
                .then(data => {
                    //проверка ответа
                    if (data.result === 1){
                        let id = element.target.dataset["id"];
                        let foundProduct = this.goods.cartGoods.find(product => product.id_product === +id);
                        if (foundProduct) {
                            foundProduct.quantity ++;
                        } else {
                             let newProduct = this.createNewProductInCart(element.target)
                             this.goods.cartGoods.push(newProduct);
                        }
                    }
                }).catch(error => {
                console.log(error)});

            // показывает корзину когда добовляют товар
            document.querySelector('.cart').classList.add('visible');
            document.querySelector('.cart').classList.remove('invisible');
            this.cartVisibility = true;
        },

        createNewProductInCart(element){
            return {
                id_product: +element.dataset["id"],
                product_name: element.dataset["name"],
                price: +element.dataset["price"],
                quantity: 1,
                img: element.dataset["img"]
            }
        },

        /**
         * метод удаляет товар из корзины
         * @param element
         */
        removeProduct(element) {
            this._getDataFromServer(`${this.API}/deleteFromBasket.json`)
                .then(data => {
                    if (data.result === 1){
                        let id;
                        if (element.target.classList.contains("fas")) {
                             id = element.target.parentElement.dataset["id"];
                        } else{
                            id = element.target.dataset["id"];}
                        let foundProduct = this.goods.cartGoods.find(product => product.id_product === +id);
                        if (foundProduct.quantity > 1) {
                            foundProduct.quantity --;
                        } else {
                            let index =this.goods.cartGoods.indexOf(foundProduct)
                            this.goods.cartGoods.splice(index, 1);

                            // скрывает корзину если она пуста
                            if (this.goods.cartGoods.length === 0){
                                document.querySelector('.cart').classList.remove('visible');
                                document.querySelector('.cart').classList.add('invisible');
                                this.cartVisibility = false;
                            }

                        };
                    }
                }).catch(error => {
                console.log(error)});

        }
    },

    mounted(){
        // получаем данные для каталога
        this._getDataFromServer('catalog.json').then(data => {
            this._workingWithData(data, "catalogGoods");
            //console.log(this.goods.catalogGoods)
        }).catch(error => {
            console.log(error);
            this.serverErrors.catalog = true;
        });

        // получаем данные для корзины
        this._getDataFromServer('cart.json',).then(data => {
            this._workingWithData(data.contents, "cartGoods");
            //console.log(this.goods.cartGoods)
        }).catch(error => {
            console.log(error);
            this.serverErrors.cart = true;
        });


    },
    computed: {}

});





