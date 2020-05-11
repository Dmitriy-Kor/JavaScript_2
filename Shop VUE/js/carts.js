Vue.component('cart',{
    data(){
        return{
            cartGoods: [],
            cartVisibility: false,
            serverErrors: false,
            cartUrl: '/getBasket.json',
            imgCart: 'https://via.placeholder.com/160x110/'
        }
    },
    template:`<div class="head__cart">
                <button type="button" class="head__btn" @click="cartVisibility=!cartVisibility">Корзина</button>
                <div class="cart" :class="{invisible: !cartVisibility, visible: cartVisibility}">
                    <h3 class="cart__title">Товары:</h3>
                    <div class="cart__items" v-if="!serverErrors">
                        <cartItem class="item-in-cart" v-for="item of cartGoods"
                        :key="item.id_product"
                        :data-id="item.id_product"
                        :product="item"
                        :img="imgCart"
                        @remove="removeProduct"></cartItem>
                    </div>
                    <!--<h2 class="cart__error" v-else>Ошибка сервера:(</h2>-->
                    <error v-else></error>
                    <h3 class="cart__sum">Сумма:<span class="cart__price">{{calcSumAll()}}</span>&#x20BD</h3>
                </div>
               </div>`,
    methods: {
        calcSumAll() {
            return this.cartGoods.reduce((sum, product) => sum + product.price * product.quantity, 0);
        },

        /**
         * метод добавляет товар в корзину
         * @param element
         */
        addProduct(element) {
            this.$root._getDataFromServer(`${API}/addToBasket.json`)
                .then(data => {
                    //проверка ответа
                    if (data.result === 1){
                        //let id = element.target.dataset["id"];
                        let foundProduct = this.cartGoods.find(product => product.id_product === +element.id_product);
                        if (foundProduct) {
                            foundProduct.quantity ++;
                        } else {
                            let newProduct = Object.assign({quantity: 1}, element)
                            this.cartGoods.push(newProduct);
                        }
                    }
                }).catch(error => {
                console.log(error)});

            // показывает корзину когда добовляют товар
            document.querySelector('.cart').classList.add('visible');
            document.querySelector('.cart').classList.remove('invisible');
            this.cartVisibility = true;
        },

        /**
         * метод удаляет товар из корзины
         * @param element
         */
        removeProduct(element) {
            this.$root._getDataFromServer(`${API}/deleteFromBasket.json`)
                .then(data => {
                    if (data.result === 1){

                        let foundProduct = this.cartGoods.find(product => product.id_product === +element.id_product);
                        if (foundProduct.quantity > 1) {
                            foundProduct.quantity --;
                        } else {
                            let index =this.cartGoods.indexOf(foundProduct)
                            this.cartGoods.splice(index, 1);

                            // скрывает корзину если она пуста
                            if (this.cartGoods.length === 0){
                                document.querySelector('.cart').classList.remove('visible');
                                document.querySelector('.cart').classList.add('invisible');
                                this.cartVisibility = false;
                            }

                        };
                    }
                }).catch(error => {
                console.log(error)});

        },

        /**
         * Обрабатываем полученные данные с сервера (запись в массив)
         * @param data - данные полученные с сервера
         * @private
         */
        _workingWithData(data){
            this.cartGoods = [...data];
            //console.log(this.cartGoods);
        },

    },

    mounted(){
        this.$root._getDataFromServer('cart.json').then(data => {
            this._workingWithData(data.contents);
        }).catch(error => {
            console.log(error);
            this.serverErrors = true;
        });
    }
})



Vue.component('cartItem',{
    props: ['product','img'],
    template:`<div class="item-in-cart" :data-id="product.id_product">
                            <div class="item-in-cart__box">
                                <img :src="product.img " :alt="product.product_name" class="item-in-cart__img">
                                <div class="item-in-cart__info">
                                    <h3 class="item-in-cart__title">{{product.product_name}}</h3>
                                    <p class="item-in-cart__quantity">Колличество: {{product.quantity}}</p>
                                    <p class="item-in-cart__price">{{product.price * product.quantity}} &#x20BD</p>
                                </div>
                                <button class="item-in-cart__btnCross" @click="$emit('remove',product)"><i class="fas fa-times"></i></button>
                            </div>
                        </div>`,

})

