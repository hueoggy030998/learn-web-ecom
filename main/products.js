
const productList = document.getElementById("product-list");
const productListFooter = document.getElementById("product-list-footer");
const numOfItems = document.getElementById("num-of-items");
const perPageInput = document.getElementById("per-page-input");
const viewTypeGrid = document.getElementById("view-type-grid");
const viewTypeList = document.getElementById("view-type-list");
const productFilterSearch = document.getElementById("product-filter-search");
let viewType = "GRID";
let limit = 12;
let currentPage = 1;
let skip = 0;
let orderBy = "";
let search = "";

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

// mac dinh show trang dau tien
showProductList(viewType, search, limit, skip, orderBy);

perPageInput.addEventListener("input", debounce(function(){
    if(perPageInput.value != "" && perPageInput.value >= 0){
        limit = perPageInput.value;
    }else{
        limit = 12;
    }
    showProductList(viewType, search, limit, skip, orderBy);
}))

viewTypeGrid.addEventListener("click", function(){
    viewType="GRID";
    changeBanner(viewType);
    productList.classList.remove("product-list-list");
    productList.classList.add("product-list-grid");
})

viewTypeList.addEventListener("click", function(){
    viewType="LIST";
    changeBanner(viewType);
    productList.classList.remove("product-list-grid");
    productList.classList.add("product-list-list");
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

productFilterSearch.addEventListener("input", debounce(function(){
    console.log("search:", productFilterSearch.value)
    search = productFilterSearch.value;
    showProductList(viewType, search, limit, skip, orderBy);
}))

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
    productListFooter.innerHTML = "";

    const response = await fetch(apiSearchProducts + `?limit=${limit}&skip=${skip}&sortBy=${sortBy}&order=${order}&q=${search}`);
    const data = await response.json();
    const listProducts = data.products;
    console.log("listProducts: ", listProducts);
    if(listProducts.length===0){
        productList.classList.remove("product-list-list", "product-list-grid");
        productList.classList.add("no-data");
        productList.textContent="No data";
    }else{
        if(viewType==="GRID"){
            productList.classList.remove("product-list-list");
            productList.classList.add("product-list-grid");
        }else{
            productList.classList.remove("product-list-grid");
            productList.classList.add("product-list-list");
        }
        for (let i=0; i<listProducts.length; i++) {
            const productItem = createProductItem(listProducts[i]);
            productList.appendChild(productItem);
            productItem.addEventListener("click", function(){
                window.location.href = `/product_details.html?id=${listProducts[i].id}`;
            })
        }
    }
    showNumOfItems(data.total);
    if(data.total % limit === 0){
        showFooter(data.total / limit);
    } else {
        showFooter(Math.floor(data.total / limit) + 1);
    }
}

function showFooter(numberOfPages){
    productListFooter.innerHTML="";
    if(numberOfPages > 1) {
        let prevElement = document.createElement("button");
        prevElement.classList.add("prev-icon");
        // prevElement.innerHTML = `&#8592;`;
        prevElement.innerHTML = 
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path d="M14 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
        productListFooter.appendChild(prevElement); 
        console.log("currentPage: ", currentPage);
        if(currentPage === 1) {
            prevElement.disabled = true;
        } else {
            prevElement.addEventListener("click", function(){
                currentPage = currentPage - 1;
                skip = (currentPage-1) * limit;
                showProductList(viewType, search, limit, skip, orderBy);
            })
        }
    }
    
    /*
    let i=0;
    while(i<numberOfPages){
        let dotElement = document.createElement("span");
        dotElement.classList.add("dot", "josefin-sans");
        
        if(numberOfPages > 6 && i >= 3){
            dotElement.textContent = "...";
            i = numberOfPages - 3;
        }else {
            dotElement.textContent = i+1;
            if(i===skip/limit){
                dotElement.classList.add("dot-active");
            }
            i++;
        }
        productListFooter.appendChild(dotElement);
    }
    */
    
    for(let i=0; i<numberOfPages; i++){
        let dotElement = document.createElement("span");
        dotElement.classList.add("dot", "josefin-sans");
        dotElement.textContent = i+1;
        if(i===skip/limit){
            dotElement.classList.add("dot-active");
        }
        productListFooter.appendChild(dotElement);  
        dotElement.addEventListener("click", function(){
            skip = i * limit;
            currentPage = i+1;
            showProductList(viewType, search, limit, skip, orderBy);      
        })
    }

    if(numberOfPages > 1){
        let nextElement = document.createElement("button");
        nextElement.classList.add("next-icon");
        // nextElement.innerHTML = `&#8594;`;
        nextElement.innerHTML = 
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path d="M10 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`        
        productListFooter.appendChild(nextElement); 
        if(currentPage === numberOfPages) {
            nextElement.disabled = true;
        } else {
            nextElement.addEventListener("click", function(){
                currentPage = currentPage + 1;
                skip = (currentPage-1) * limit;
                showProductList(viewType, search, limit, skip, orderBy);
            })
        }
    }
}

function showNumOfItems(number){
    if(number<=1){
        numOfItems.textContent=`About ${number} result`;
    }else{
        numOfItems.textContent=`About ${number.toLocaleString("en-US")} results`;
    }
}

function createProductItem(product){
    let productItem = document.createElement("div");
    productItem.classList.add("product-item");
    let productRating = "";
    // show rating 
    for(let i=1; i<=5; i++){
        if(i<=product.rating){
            productRating += `<span class="star-full">&#9733;</span>`;
        }else if(i-1<product.rating && product.rating < i){
            productRating += `<span class="star-half">&#9733;</span>`;
        }else {
            productRating += `<span class="star">&#9733;</span>`;
        }
    }
        
    productItem.innerHTML = 
    `<img class="product-thumbnail" src=${product.thumbnail}>
    <div class="product-info">
        <div class="product-info-name-color">
            <span class="josefin-sans-bold text-ellipsis product-name">${product.title}</span>
            <svg class="product-color" xmlns="http://www.w3.org/2000/svg" width="43" height="10" viewBox="0 0 43 10" fill="none">
                <ellipse cx="5.09583" cy="5" rx="5.00404" ry="5" fill="#DE9034" />
                <ellipse cx="21.1085" cy="5" rx="5.00403" ry="5" fill="#EC42A2" />
                <ellipse cx="37.1217" cy="5" rx="5.00404" ry="5" fill="#8568FF" />
            </svg>
        </div>
        <div class="josefin-sans product-info-price">
            <span class="product-price-sale">$${parseFloat((product.price*(100-product.discountPercentage)/100).toFixed(2)).toLocaleString("en-US")}</span>
            <span class="product-price">$${product.price.toLocaleString("en-US")}</span>
            <div class="product-rating">${productRating}</div>
        </div>
        <span class="lato-regular product-description">${product.description}</span>
    </div>
    <div class="product-icon">
        <div class="product-icon-item">
            <img src="/file icon/add-cart-product.png" class="product-icon-item-cart">
        </div>
        <div class="product-icon-item">
            <img src="/file icon/heart-product.png" class="product-icon-item-heart">
        </div>
        <div class="product-icon-item">
            <img src="/file icon/search-product.png" class="product-icon-item-search">
        </div>
    </div>`;
    return productItem;
}

function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}