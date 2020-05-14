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

        addProduct(element){
            let foundProduct = this.cartGoods.find( product => product.id_product === +element.id_product)
            if (foundProduct) {
                this.$root.putJson(`/api/cart/${foundProduct.id_product}`, {quantity: 1});
                foundProduct.quantity++;
                this.sendStats(foundProduct,'Увеличено количество этого товара')
            } else {
                let newAddProduct = Object.assign({quantity: 1}, element);
                this.$root.postJson('/api/cart/', newAddProduct)
                    .then(data => {
                        if (data.result === 1) {
                            this.cartGoods.push(newAddProduct);
                            this.sendStats(newAddProduct,'Добавлен этот товар');
                        }
                    });
            }
            // показывает корзину когда добовляют товар
            document.querySelector('.cart').classList.add('visible');
            document.querySelector('.cart').classList.remove('invisible');
            this.cartVisibility = true;
        },

        sendStats(element, message){
            let stat = Object.assign({action: message}, element)
            this.$root.postJson('/api/stats', stat).then(data => {
                    if (data.result === 1) {
                        console.log('send stat');
                    }
            })
        },

        removeProduct(element){
            let foundProduct = this.cartGoods.find( product => product.id_product === +element.id_product)
            if (foundProduct.quantity > 1) {
                this.$root.putJson(`/api/cart/${foundProduct.id_product}`, {quantity: -1});
                foundProduct.quantity--;
                this.sendStats(foundProduct,'Уменьшено количество этого товара')
            } else {
                this.$root.delJson(`/api/cart/${foundProduct.id_product}`, foundProduct)
                    .then(data => {
                        if (data.result === 1) {
                            let index =this.cartGoods.indexOf(foundProduct)
                            this.cartGoods.splice(index, 1);
                            this.sendStats(foundProduct,'Удален этот товар');

                            // скрывает корзину если она пуста
                            if (this.cartGoods.length === 0){
                                document.querySelector('.cart').classList.remove('visible');
                                document.querySelector('.cart').classList.add('invisible');
                                this.cartVisibility = false;
                            }
                        }
            })
            }
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
        this.$root.getJson('/api/cart').then(data => {
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

