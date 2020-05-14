const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
const main = new Vue ({
    el: '#app',
    data: {
        searchLine: '',
        serverError: null,
    },
    methods: {
    //     /**
    //      * Получаем данные с сервера
    //      * @param url
    //      * @param endApi окончание адреса сервера
    //      * @return {Promise<any>}
    //      * @private
    //      */
    //     _getDataFromServer(url)
    //     {
    //         return fetch(url ? url : API)
    //             .then(response => response.json())
    //             .catch(error => {
    //                 console.log(error);
    //                 this.serverError = error;
    //             });
    //     }


        getJson(url){
            return fetch(url)
                .then(result => result.json())
                .catch(error => {
                    //this.$refs.error.setError(error);
                    console.log(error);
                    this.serverError = error;

                })
        },
        postJson(url, data) {
            return fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).then(result => result.json())
                .catch(error => {
                    //this.$refs.error.setError(error);
                    this.serverError = error;
                });
        },
        putJson(url, data) {
            return fetch(url, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).then(result => result.json())
                .catch(error => {
                    //this.$refs.error.setError(error);
                    this.serverError = error;
                });
        },
        delJson(url, data) {
            return fetch(url, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).then(result => result.json())
                .catch(error => {
                    //this.$refs.error.setError(error);
                    this.serverError = error;
                });
        },
    },
})

Vue.component ('error',{
    template:`<h2>Ошибка сервера {{ $root.serverError.message }} </h2>`
});
// Vue.component ('stats',{
//     //data(){},
//     methods:{
//     sendStats(element){
//         this.postJson('/api/stats', element);
//     }
//     },
// })