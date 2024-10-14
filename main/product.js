
const productList = document.getElementById("product-list");
const productListFooter = document.getElementById("product-list-footer");
const numOfItems = document.getElementById("num-of-items");
const perPageInput = document.getElementById("per-page-input");
const viewTypeGrid = document.getElementById("view-type-grid");
const viewTypeList = document.getElementById("view-type-list");
const productFilterSearch = document.getElementById("product-filter-search");
let viewType = "GRID";
let limit = 12;
let skip = 0;
let orderBy = "";
let search = "";

showProductList(viewType, search, limit, skip, orderBy);
perPageInput.addEventListener("input", function(){
    console.log("input:", perPageInput.value);
    if(perPageInput.value != "" && perPageInput.value >= 0){
        limit = perPageInput.value;
    }else{
        limit = 12;
    }
    showProductList(viewType, search, limit, skip, orderBy);
})

const listOptions = document.querySelectorAll(".dropdown-content span");
const dropdownValue = document.querySelector(".dropdown-value");
for (const option of listOptions) {
    option.addEventListener("click", function() {
        let optionActive = document.querySelector(".active");
        if(optionActive !== null){
            optionActive.classList.remove("active");
        }
        option.classList.add("active");
        dropdownValue.textContent=option.textContent;
        orderBy = option.getAttribute("value");
        showProductList(viewType, search, limit, skip, orderBy);
    });
}

viewTypeGrid.addEventListener("click", function(){
    viewType="GRID";
    changeBanner(viewType);
    showProductList(viewType, search, limit, skip, orderBy);
})

viewTypeList.addEventListener("click", function(){
    viewType="LIST";
    changeBanner(viewType);
    showProductList(viewType, search, limit, skip, orderBy);
})

function changeBanner(viewType){
    const bannerTitle = document.getElementById("banner-title");
    const bannerDes = document.getElementById("banner-des");
    if(viewType==="GRID"){
        bannerTitle.textContent = "Shop Grid Default";
        bannerDes.textContent = "Home . Pages . Shop Grid Default";
    }else{
        bannerTitle.textContent = "Shop List";
        bannerDes.textContent = "Home . Pages . Shop List";
    }
}

productFilterSearch.addEventListener("input", function(){
    console.log("eeee:", productFilterSearch.value)
    search = productFilterSearch.value;
    showProductList(viewType, search, limit, skip, orderBy);
})

async function showProductList(viewType, search, limit, skip, orderBy){ 
    let sortBy="";
    let order="";
    switch (orderBy) {
        case "PRICE_ASC":
            sortBy="price";
            order="asc";    
            break;
        case "PRICE_DESC":
            sortBy="price";
            order="desc";
            break;
        case "NAME_ASC":
            sortBy="title";
            order="asc";
            break;        
        case "NAME_DESC":
                sortBy="title";
                order="desc";
                break;    
        default:
            break;
    }

    productList.innerHTML = "";
    if(viewType==="GRID"){
        productList.classList.remove("product-list-list");
        productList.classList.add("product-list-grid");
    }else{
        productList.classList.remove("product-list-grid");
        productList.classList.add("product-list-list");
    }
    const response = await fetch(apiSearchProducts + `?limit=${limit}&skip=${skip}&sortBy=${sortBy}&order=${order}&q=${search}`);
    const data = await response.json();
    const listProducts = data.products;
    console.log("listProducts: ", listProducts);
    console.log("productList before ", productList);
    for (let i=0; i<listProducts.length; i++) {
        productList.appendChild(createProductItem(listProducts[i], viewType));
    }
    console.log("productList after ", productList);
    showNumOfItems(data.total);
    if(data.total % limit === 0){
        showFooter(data.total / limit);
    } else {
        showFooter(Math.floor(data.total / limit) + 1);
    }
}

function showFooter(numberOfPages){
    productListFooter.innerHTML="";
    for(let i=0; i<numberOfPages; i++){
        let dotElement = document.createElement("span");
        dotElement.classList.add("dot");
        if(i===skip/limit){
            dotElement.classList.add("dot-active");
        }
        productListFooter.appendChild(dotElement);  
        dotElement.addEventListener("click", function(){
            skip = i * limit;
            showProductList(viewType, search, limit, skip, orderBy);      
        })
    }
}

function showNumOfItems(number){
    if(number<=1){
        numOfItems.textContent=`About ${number} result`;
    }else{
        numOfItems.textContent=`About ${number.toLocaleString("en-US")} results`;
    }
}

function createProductItem(product, viewType){
    let productItem = document.createElement("div");
    if(viewType==="GRID"){
        productItem.classList.add("product-item-card");
        productItem.innerHTML = 
        `<div class="product-image">
                    <img class="product-thumbnail" src=${product.thumbnail}>
                    <div class="flex-column product-icon">
                        <div class="product-icon-item">
                            <img class="product-icon-cart" src="/file icon/products-page/add-cart-icon.png">
                        </div>
                        <div class="product-icon-item">
                            <img class="product-icon-search" src="/file icon/products-page/search-icon.png">
                        </div>
                        <div class="product-icon-item">
                            <img class="product-icon-heart" src="/file icon/products-page/heart-icon.png">
                        </div>
                    </div>
                </div>
                <div class="product-info">
                    <span class="josefin-sans-bold text-ellipsis product-name">${product.title}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="43" height="10" viewBox="0 0 43 10" fill="none">
                        <ellipse cx="5.09583" cy="5" rx="5.00404" ry="5" fill="#DE9034" />
                        <ellipse cx="21.1085" cy="5" rx="5.00403" ry="5" fill="#EC42A2" />
                        <ellipse cx="37.1217" cy="5" rx="5.00404" ry="5" fill="#8568FF" />
                    </svg>
                    <div class="josefin-sans flex justify-center">
                        <span
                            class="product-price-sale">$${parseFloat((product.price*(100-product.discountPercentage)/100).toFixed(2)).toLocaleString("en-US")}</span>
                        <span class="product-price">$${product.price.toLocaleString("en-US")}</span>
                    </div>
                </div>`;
    }else{
        productItem.classList.add("product-item-list");
        productItem.innerHTML = 
        `<img class="product-thumbnail" src=${product.thumbnail}>
        <div class="product-info">
            <div> 
                <span class="josefin-sans-bold text-ellipsis product-name">${product.title}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="43" height="10" viewBox="0 0 43 10" fill="none">
                    <ellipse cx="5.09583" cy="5" rx="5.00404" ry="5" fill="#DE9034" />
                    <ellipse cx="21.1085" cy="5" rx="5.00403" ry="5" fill="#EC42A2" />
                    <ellipse cx="37.1217" cy="5" rx="5.00404" ry="5" fill="#8568FF" />
                </svg> 
            </div>       
            <div class="josefin-sans flex product-info-price">
                <span class="product-price-sale">$${parseFloat((product.price*(100-product.discountPercentage)/100).toFixed(2)).toLocaleString("en-US")}</span>
                <span class="product-price">$${product.price.toLocaleString("en-US")}</span>    
                <div class="product-rating"></div>    
            </div>   
            <span class="lato-regular product-description">${product.description}</span>
            <div class="flex product-icon">
                <div class="product-icon-item">
                    <img class="product-icon-cart" src="/file icon/products-page/add-cart-icon.png">
                </div>
                <div class="product-icon-item">
                    <img class="product-icon-heart" src="/file icon/products-page/heart-icon.png">
                </div>  
                <div class="product-icon-item">
                    <img class="product-icon-search" src="/file icon/products-page/search-icon.png">
                </div>
                         
            </div>       
        </div>
        `;
    }
    return productItem;
}