Vue.component('products', {
    data() {
        return {
            catalogGoods: [],
            serverErrors: false,
            catalogUrl: '/catalogDat.json',
            imgCatalog: 'https://via.placeholder.com/160x110/',
        };
    },

    template: `<div>
                <div class="products paddingLR" v-if="!serverErrors">
                <product class="product-item" v-for="item of catalogGoods" :key="item.id_product" :img="imgCatalog" :product="item" :data-name="item.product_name"></product>
                </div>
                <error v-else></error>
                <!--<h2 class="catalog__error paddingLR" v-else>Ошибка сервера:(</h2>-->
               </div>`,
    methods: {
        /**
         * Обрабатываем полученные данные с сервера (запись в массив)
         * @param data - данные полученные с сервера
         * @private
         */
        _workingWithData(data){
            this.catalogGoods = [...data];
            //console.log(this.catalogGoods);
        },

    },
    mounted() {
        this.$root._getDataFromServer('catalog.json').then(data => {
            this._workingWithData(data);
        }).catch(error => {
            console.log(error);
            this.serverErrors = true;
        });
    },
})

Vue.component ('product',{
    props: ['product', 'img'],
    template: `<div class="product-item">
                           <img class="product-item__img" :src="product.img" :alt="product.product_name">
                            <div class="product-item__info">
                                <div>
                                    <h3 class="product-item__title">{{product.product_name}}</h3>
                                    <p class="product-item__price">{{product.price}}</p>
                                </div>
                                <button class="by-btn" @click="$root.$refs.cart.addProduct(product)">Добавить в корзину</button>
                            </div>
                        </div>`,
})

