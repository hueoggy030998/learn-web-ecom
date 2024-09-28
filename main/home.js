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
            showFeaturedPage(listProducts);
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
    showFeaturedPage(listProducts);

    // active dot 
    const listDots = featuredFooter.getElementsByClassName("dot");
    for (const dot of listDots) {
        dot.classList.remove("dot-active");
    }
    listDots[slideFeaturedIndex-1].classList.add("dot-active");

    // setTimeout(showFeaturedProductsSlide, 3000);
}

function showFeaturedPage(listProducts){
    if(listProducts.length === 0){
        featuredProducts.innerHTML = "No data";
    } else {
        featuredProducts.innerHTML = "";
        for (const element of listProducts) {
            const productItem = createProductItem(element);
            featuredProducts.appendChild(productItem);
        }
    }
}

function createProductItem(product){
    const productItem = document.createElement("div");
    productItem.classList.add("featured-product");
    productItem.innerHTML =
    `<div class="featured-product-image">
        <img class="featured-product-thumbnail" src="https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png">
        <div class="featured-product-icon">
            <img class="product-icon-cart" src="/file icon/add-cart-product.png">
            <img class="product-icon-heart" src="/file icon/heart-product.png">
            <img class="product-icon-search" src="/file icon/search-product.png">
        </div>
        <button class="featured-product-view-detail-btn">View Details</button>
    </div>
    <div class="featured-product-info">
        <span class="featured-product-name">Essence Mascara Lash Princess</span>
        <span class="featured-product-code">Code - RCH45Q1A</span>
        <span class="featured-product-price">$9.99</span>
    </div>`;
    return productItem;        
}


//show Latest Product
const latestMenu = document.getElementById("latest-menu");
const latestProducts = document.getElementById("latest-products");
showLatestProducts();

function showLatestProducts(){
    showListCategoriesMenu();
    showListLatestProduct();
}

async function showListCategoriesMenu(){
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
            showListLatestProduct(listProducts);
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
            showListLatestProduct(listProducts);
        })
    }
    
}

function showListLatestProduct(listProducts){
    latestProducts.innerHTML="";
    for(let i=0; i<listProducts.length; i++){
        latestProducts.appendChild(createLatestProductItem(listProducts[i]));
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






