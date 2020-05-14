Vue.component('search',{
    data(){
        return{
            userSearchRequest: '',
            filteredGoods: [],
        }
    },
    template:`<div>
                <form action="#" class="head__search-form">
                    <input type="text" class="head__search" v-model="userSearchRequest"><button type="submit" class="head__btn_search"
                    @click="filter(userSearchRequest)"><i class="fas fa-search"></i></button>
                </form>
              </div>`,

    methods: {
        /**
         * Метод поиска товара
         * @param value - поисковый запрос
         */
        filter(value){
            const regexp = new RegExp(value, 'i');
            this.filteredGoods = this.$root.$refs.products.catalogGoods.filter(product => regexp.test(product.product_name));
            console.log(`Поисковый запрос(патерн): ${regexp}`);
            console.log(this.filteredGoods);

            this.$root.$refs.products.catalogGoods.forEach( el => {
                const block = document.querySelector(`.product-item[data-name="${el.product_name}"]`);

                if (!this.filteredGoods.includes(el)){
                    block.classList.add('invisible');
                } else {
                    block.classList.remove('invisible')
                }
           });
        },
    },
})