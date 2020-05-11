const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
const main = new Vue ({
    el: '#app',
    data: {
        searchLine: '',
        serverError: null,
    },
    methods: {
        /**
         * Получаем данные с сервера
         * @param url
         * @param endApi окончание адреса сервера
         * @return {Promise<any>}
         * @private
         */
        _getDataFromServer(url)
        {
            return fetch(url ? url : API)
                .then(response => response.json())
                .catch(error => {
                    console.log(error);
                    this.serverError = error;
                });
        }
    },
})
Vue.component ('error',{
    template:`<h2>Ошибка сервера {{ $root.serverError.message }} </h2>`
})