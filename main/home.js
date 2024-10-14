const featuredProducts = document.getElementById("featured-products");
const featuredFooter = document.getElementById("featured-footer");
//show Featured Products
let slideFeaturedIndex = 0;
let listFeaturedProducts;
let numOfFeaturedPage;
showFeaturedProducts();

//show Latest Products
const latestMenu = document.getElementById("latest-menu");
const latestProducts = document.getElementById("latest-products");
showLatestProducts();

//show Trending Products
const trendingProducts = document.getElementById("trending-products");
showTrendingProducts();

//show Top Categories
const topCategories = document.getElementById("top-categories");
const topCategoriesFooter = document.getElementById("top-categories-footer");
showTopCategories();

async function showFeaturedProducts(){
    const numberFeaturedProducts = 12;
    const numberPerPage = 4;
    const response = await fetch(apiGetAllProducts + `?limit=${numberFeaturedProducts}&skip=0`);
    const data = await response.json();
    listFeaturedProducts = data.products;
    
    // tinh tong so trang hien thi, neu it hon 12 sp thi hien thi dung so trang 
    if (listFeaturedProducts.length < numberFeaturedProducts) {
        numOfFeaturedPage = Math.floor(listFeaturedProducts.length / numberPerPage) + 1;
    } else {
        numOfFeaturedPage = numberFeaturedProducts / numberPerPage;
    }

    // show footer
    for(let i=0; i<numOfFeaturedPage; i++){
        // tạo dot
        let dotElement = document.createElement("span");
        dotElement.classList.add("dot");
        featuredFooter.appendChild(dotElement);
        if(i===0){
            dotElement.classList.add("dot-active");
        }
        dotElement.addEventListener("click", async function (){
            const activeDot = featuredFooter.querySelector(".dot-active");
            activeDot.classList.remove("dot-active");
            dotElement.classList.add("dot-active");

            const listProducts = listFeaturedProducts.slice(i*4,i*4+4);
            showListProducts(featuredProducts, listProducts, createFeaturedProductItem);
            slideFeaturedIndex=i+1;
        })
    }
    showFeaturedProductsSlide();
}


async function showFeaturedProductsSlide() {
    slideFeaturedIndex++;
    if(slideFeaturedIndex > numOfFeaturedPage) {
        slideFeaturedIndex=1;
    }
    // hien thi page
    const listProducts = listFeaturedProducts.slice((slideFeaturedIndex-1)*4,(slideFeaturedIndex-1)*4+4);
    showListProducts(featuredProducts, listProducts, createFeaturedProductItem);
    // active dot 
    const listDots = featuredFooter.getElementsByClassName("dot");
    for (const dot of listDots) {
        dot.classList.remove("dot-active");
    }
    listDots[slideFeaturedIndex-1].classList.add("dot-active");
    setTimeout(showFeaturedProductsSlide, 3000);
}

function createFeaturedProductItem(product){
    const productItem = document.createElement("div");
    productItem.classList.add("featured-product");
    productItem.innerHTML =
    `<div class="featured-product-image">
        <img class="featured-product-thumbnail" src=${product.thumbnail}>
        <div class="featured-product-icon">
            <div class="product-icon-item">
                <img src="/file icon/add-cart-product.png" class="product-icon-item-cart">
            </div>
            <div class="product-icon-item">
                <img src="/file icon/heart-product.png" class="product-icon-item-heart">
            </div>
            <div class="product-icon-item">
                <img src="/file icon/search-product.png" class="product-icon-item-search">
            </div>
        </div>
        <button class="josefin-sans-medium featured-product-view-detail-btn">View Details</button>
    </div>
    <div class="featured-product-info">
        <span class="lato-bold featured-product-name text-ellipsis">${product.title}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="52" height="4" viewBox="0 0 52 4" fill="none">
            <rect width="14" height="4" rx="2" fill="#05E6B7"/>
            <rect x="19" width="14" height="4" rx="2" fill="#F701A8"/>
            <rect x="38" width="14" height="4" rx="2" fill="#00009D"/>
        </svg>
        <span class="josefin-sans featured-product-code">Code - ${product.sku}</span>
        <span class="lato-regular featured-product-price">$${product.price}</span>
    </div>`;
    return productItem;        
}

async function showLatestProducts(){
    const response = await fetch(apiGetAllProductCategories);
    const data = await response.json();
    createLatestProductsTab(data.slice(0,4));
}

async function createLatestProductsTab(listCategories){  
    for(let i=0; i<listCategories.length; i++){
        const tabItem = document.createElement("div");
        tabItem.classList.add("latest-menu-item");
        if(i===0){
            tabItem.classList.add("latest-menu-item-active");
            const response = await fetch(listCategories[i].url);
            const data = await response.json();
            const listProducts = data.products;
            showListProducts(latestProducts, listProducts, createLatestProductItem);
        }
        tabItem.textContent=listCategories[i].name;
        latestMenu.appendChild(tabItem);

        tabItem.addEventListener("click", async function(){
            // inactive cac tab cu
            const tabActive = latestMenu.querySelector(".latest-menu-item-active");
            tabActive.classList.remove("latest-menu-item-active");
            // active tab vua chon
            tabItem.classList.add("latest-menu-item-active");
            //show list product
            const response = await fetch(listCategories[i].url);
            const data = await response.json();
            const listProducts = data.products.slice(0,6);
            showListProducts(latestProducts, listProducts, createLatestProductItem);
        })
    }
    
}

function createLatestProductItem(product){
    const productItem = document.createElement("div");
    productItem.classList.add("latest-product");
    productItem.innerHTML = 
    `<div class="latest-product-image">
        <img class="latest-product-thumbnail" src=${product.thumbnail}>
        <img class="product-icon-sale child" src="/file icon/sale-product.png">
        <div class="latest-product-icon">
            <div class="product-icon-item">
                <img src="/file icon/add-cart-product.png">
            </div>
            <div class="product-icon-item">
                <img src="/file icon/heart-product.png">
            </div>
            <div class="product-icon-item">
                <img src="/file icon/search-product.png">
            </div>
        </div>
    </div>
    <div class="josefin-sans latest-product-info">
        <span class="text-ellipsis latest-product-name">${product.title}</span>
        <div>
            <span class="latest-product-price-sale">$${parseFloat((product.price*(100-product.discountPercentage)/100).toFixed(2)).toLocaleString("en-US")}</span>
            <span class="latest-product-price">$${product.price.toLocaleString("en-US")}</span>
        </div>       
    </div>`;
    return productItem;
}

async function showTrendingProducts () {
    // lay danh sach trending products
    const response = await fetch(apiGetAllProducts +`?limit=100&skip=0`);
    const data = await response.json();
    const listTrendingProducts = getNewRandomArray(data.products, 4) ;
    showListProducts(trendingProducts, listTrendingProducts, createTrendingProductItem);
}

function createTrendingProductItem(product){
    const productItem = document.createElement("div");
    productItem.classList.add("trending-product");
    
    productItem.innerHTML = 
    `<img class="trending-product-thumbnail" src=${product.thumbnail}>
    <div class="flex-column trending-product-info">
        <span class="lato-bold text-ellipsis trending-product-name">${product.title}</span>
        <div class="josefin-sans">
            <span class="trending-product-price-sale">$${parseFloat((product.price*(100-product.discountPercentage)/100).toFixed(2)).toLocaleString("en-US")}</span>
            <span class="trending-product-price">$${product.price.toLocaleString("en-US")}</span>
        </div>       
    </div>`;
    return productItem;
}

function showListProducts(container, listProducts, createProductItem){
    if(listProducts.length === 0){
        container.innerHTML = "No data";
    } else {
        container.innerHTML = "";
        for (const element of listProducts) {
            const productItem = createProductItem(element);
            container.appendChild(productItem);
        }
    }
}

async function showTopCategories() {
    // lay danh sach top categories
    const response = await fetch(apiGetAllProductCategories);
    const data = await response.json();
    const listCategories = getNewRandomArray(data, 2);
    let listTopCategoriesProducts = [];
    for (const element of listCategories) {
        const response = await fetch(element.url);
        const data = await response.json();
        listTopCategoriesProducts = listTopCategoriesProducts.concat(data.products);
    }
    console.log("listTopCategoriesProducts: ", listTopCategoriesProducts);

    const numberPerPage = 4;
    let numOfTopPage = 0;
    if (listTopCategoriesProducts.length % numberPerPage === 0){
        numOfTopPage = listTopCategoriesProducts.length / numberPerPage;
    } else {
        numOfTopPage = Math.floor(listTopCategoriesProducts.length / numberPerPage) + 1
    }
   

    // show footer
    for(let i=0; i<numOfTopPage; i++){
        // tạo dot
        let dotElement = document.createElement("span");
        dotElement.classList.add("top-dot");
        topCategoriesFooter.appendChild(dotElement);
        if(i===0){
            dotElement.classList.add("top-dot-active");
            showListProducts(topCategories, listTopCategoriesProducts.slice(i*4,i*4+4), createTopCategoriesProductItem);
        }
        dotElement.addEventListener("click", async function (){
            const activeDot = topCategoriesFooter.querySelector(".top-dot-active");
            activeDot.classList.remove("top-dot-active");
            dotElement.classList.add("top-dot-active");

            const listProducts = listTopCategoriesProducts.slice(i*4,i*4+4);
            showListProducts(topCategories, listProducts, createTopCategoriesProductItem);
        })
    }
}

function createTopCategoriesProductItem(product){
    const productItem = document.createElement("div");
    productItem.classList.add("top-category-product");
    productItem.innerHTML = 
    `<div class="top-category-product-image">
        <img class="top-category-product-thumbnail" src=${product.thumbnail}>
        <button class="josefin-sans top-category-button">View Product</button>
     </div>
    
    <div class="josefin-sans top-category-product-info">
        <span class="text-ellipsis top-category-product-name">${product.title}</span>
        <span class="top-category-product-price">$${product.price.toLocaleString("en-US")}</span>     
    </div>`;
    return productItem;
}

// lấy ngẫu nhiên x phần tử thuộc mảng arr
function getNewRandomArray(arr, x){
    let result = [];
    let newArr = [...arr];
    for(let i=0; i<x; i++){
        let index = Math.floor(Math.floor(Math.random() * newArr.length));
        result.push(newArr[index]);
        newArr.splice(index, 1);
    }
    return result;  
}

