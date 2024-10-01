const featuredProducts = document.getElementById("featured-products");
const featuredFooter = document.getElementById("featured-footer");
// hien thi Featured Products
let slideFeaturedIndex = 0;
let listFeaturedProducts;
let numOfFeaturedPage;
showFeaturedProducts();

async function showFeaturedProducts(){
    const numberFeaturedProducts = 12;
    const numberPerPage = 4;
    const response = await fetch(apiGetAllProducts + `?limit=${numberFeaturedProducts}&skip=0`);
    const data = await response.json();
    listFeaturedProducts = data.products;
    
    // tinh tong so trang hien thi, neu nhieu hon 3 trang thi chi hien thi 3
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
            const listDots = featuredFooter.getElementsByClassName("dot");
            for (const dot of listDots) {
                dot.classList.remove("dot-active");
            }
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
            <img class="product-icon-cart" src="/file icon/add-cart-product.png">
            <img class="product-icon-heart" src="/file icon/heart-product.png">
            <img class="product-icon-search" src="/file icon/search-product.png">
        </div>
        <button class="featured-product-view-detail-btn">View Details</button>
    </div>
    <div class="featured-product-info">
        <span class="featured-product-name">${product.title}</span>
        <span class="featured-product-code">Code - ${product.sku}</span>
        <span class="featured-product-price">$${product.price}</span>
    </div>`;
    return productItem;        
}


//show Latest Product
const latestMenu = document.getElementById("latest-menu");
const latestProducts = document.getElementById("latest-products");
showLatestProducts();

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
            console.log("tabActive: ", tabActive);
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
            <img class="product-icon-cart" src="/file icon/add-cart-product.png">
            <img class="product-icon-heart" src="/file icon/heart-product.png">
            <img class="product-icon-search" src="/file icon/search-product.png">
        </div>
    </div>
    <div class="latest-product-info">
        <span class="latest-product-name">${product.title}</span>
        <div>
            <span class="latest-product-price-sale">$${(product.price*(100-product.discountPercentage)/100).toFixed(2).toLocaleString("en-US")}</span>
            <span class="latest-product-price">$${product.price.toFixed(2).toLocaleString("en-US")}</span>
        </div>       
    </div>`;
    return productItem;
}


const trendingProducts = document.getElementById("trending-products");
showTrendingProducts();

async function showTrendingProducts () {
    // lay danh sach trending products
    const response = await fetch(apiGetAllProducts +`?limit=4&skip=0`);
    const data = await response.json();
    const listTrendingProducts = data.products;
    showListProducts(trendingProducts, listTrendingProducts, createTrendingProductItem);
}

function createTrendingProductItem(product){
    const productItem = document.createElement("div");
    productItem.classList.add("trending-product");
    productItem.innerHTML = 
    `<img class="trending-product-thumbnail" src=${product.thumbnail}>
    <div class="trending-product-info">
        <span class="trending-product-name">${product.title}</span>
        <div>
            <span class="trending-product-price-sale">$${(product.price*(100-product.discountPercentage)/100).toFixed(2).toLocaleString("en-US")}</span>
            <span class="trending-product-price">$${product.price.toFixed(2).toLocaleString("en-US")}</span>
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







