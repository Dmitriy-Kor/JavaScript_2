'use strict'

const products = [
    {
        id: 1,
        title: 'Notebook',
        price: 40000,
        img: 'https://via.placeholder.com/160x110/CAC2FF'
    },
    {
        id: 2,
        title: 'Mouse',
        price: 2000,
        img: 'https://via.placeholder.com/160x110/B0B8E8'
    },
    {
        id: 3,
        title: 'Keyboard',
        price: 4000,
        img: 'https://via.placeholder.com/160x110/CFE2FF'
    },
    {
        id: 4,
        title: 'Gamepad',
        price: 5000,
        img: 'https://via.placeholder.com/160x110/B0D5E8'
    },
    {
        id: 5,
        title: 'Monitor',
        price: 20000,
        img: 'https://via.placeholder.com/160x110/C2FAFF'
    },
    {
        id:6
    }
];

const renderProduct = (title = 'Something for nothing', price = 0,img = 'https://via.placeholder.com/160x110/' ) =>{
    return `<div class="product-item">
                <img class="product-item__img" src="${img}" alt="${title} image">
                <div class="product-item__info">
                        <div>
                            <h3 class="product-item__title">${title}</h3>
                            <p class="product-item__price">${price}</p>
                        </div>
                        <button class="by-btn">Добавить в корзину</button>
                </div>
            </div>`;
};

const renderProducts = (list) => {
    const productList = list.map(good => renderProduct(good.title, good.price, good.img))
    document.querySelector('.products').innerHTML = productList.join('');
}

renderProducts(products);