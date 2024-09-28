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

    console.log("slideFeaturedIndex: ", slideFeaturedIndex);
    setTimeout(showFeaturedProductsSlide, 3000);
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
    productItem.classList.add("product");

    const productItemImage = document.createElement("div");
    productItemImage.classList.add("product-image");
    // productItemImage.style.backgroundImage=`url(${product.thumbnail})`;

    const productItemThumbnail = document.createElement("img");
    productItemThumbnail.classList.add("product-thumbnail");
    productItemThumbnail.src=product.thumbnail;

    const productItemIcon = document.createElement("div");
    productItemIcon.classList.add("product-icon", "display-none");

    const productItemIconCart = document.createElement("img");
    productItemIconCart.classList.add("product-icon-cart");
    productItemIconCart.src = "/file icon/add-cart-product.png";

    const productItemIconHeart = document.createElement("img");
    productItemIconHeart.classList.add("product-icon-heart");
    productItemIconHeart.src = "/file icon/heart-product.png";

    const productItemIconSearch = document.createElement("img");
    productItemIconSearch.classList.add("product-icon-search");
    productItemIconSearch.src = "/file icon/search-product.png";

    const productItemButtonDetail = document.createElement("button");
    productItemButtonDetail.classList.add("product-view-detail-btn", "display-none");
    productItemButtonDetail.textContent="View Details";

    const productItemInfo = document.createElement("div");
    productItemInfo.classList.add("product-info");

    const productItemName = document.createElement("span");
    productItemName.classList.add("product-name");
    productItemName.textContent = product.title;
    const productItemCode = document.createElement("span");
    productItemCode.classList.add("product-code");
    productItemCode.textContent = `Code - ${product.sku}`;
    const productItemPrice = document.createElement("span");
    productItemPrice.classList.add("product-price");
    productItemPrice.textContent = `$${product.price.toLocaleString('en-US')}`;

    productItem.appendChild(productItemImage);
    productItemImage.appendChild(productItemThumbnail);
    productItemImage.appendChild(productItemIcon);
    productItemImage.appendChild(productItemButtonDetail);
    productItem.appendChild(productItemInfo);
    
    productItemInfo.appendChild(productItemName);
    productItemInfo.appendChild(productItemCode);
    productItemInfo.appendChild(productItemPrice);

    productItemIcon.appendChild(productItemIconCart);
    productItemIcon.appendChild(productItemIconHeart);
    productItemIcon.appendChild(productItemIconSearch);

    productItem.addEventListener("mouseenter", function (){
        productItem.classList.add("product-hover");
        productItemIcon.classList.remove("display-none");
        productItemButtonDetail.classList.remove("display-none");
        productItemName.classList.add("product-info-hover");
        productItemCode.classList.add("product-info-hover");
        productItemPrice.classList.add("product-info-hover");
    })       
    
    productItem.addEventListener("mouseleave", function (){
        productItem.classList.remove("product-hover");
        productItemIcon.classList.add("display-none");
        productItemButtonDetail.classList.add("display-none");
        productItemName.classList.remove("product-info-hover");
        productItemCode.classList.remove("product-info-hover");
        productItemPrice.classList.remove("product-info-hover");
    }) 

    return productItem;        
}





