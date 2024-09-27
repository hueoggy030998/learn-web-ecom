const featuredProducts = document.getElementById("featured-products");
const featuredFooter = document.getElementById("featured-footer");

function showProduct(product){
    return `<div class="product">
                <img class="product-image" src=${product.thumbnail}>
                <div class="product-info">
                    <span class="product-name">${product.title}</span>
                    <span class="product-code">Code - ${product.sku}</span>
                    <span class="product-price">$${product.price}</span>
                </div>
            </div>`;        
}

function showFeaturedPage(listProducts){
    if(listProducts.length === 0){
        featuredProducts.innerHTML = "No data";
    } else {
        featuredProducts.innerHTML = "";
        for (const element of listProducts) {
            featuredProducts.innerHTML += showProduct(element);
        }
    }
}

async function showFeaturedProducts(){
    const numberFeaturedProducts = 12;
    const numberPerPage = 4;
    const response = await fetch(apiGetAllProducts + `?limit=${numberPerPage}&skip=0`);
    const data = await response.json();
    const listProductsFirstPage = data.products;
    const numOfProducts = data.total;

    // tinh tong so trang hien thi
    const numOfPages = numOfProducts > numberFeaturedProducts ? (numberFeaturedProducts / numberPerPage) : Math.floor(numOfProducts / 4);
    // hien thi trang dau tien
    showFeaturedPage(listProductsFirstPage);

    // show footer
    for(let i=0; i<numOfPages; i++){
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

            const response = await fetch(apiGetAllProducts + `?limit=${numberPerPage}&skip=${i*numberPerPage}`);
            const data = await response.json();
            const listProducts = data.products;
            showFeaturedPage(listProducts);
        })
    }
}
// hien thi Featured Products
showFeaturedProducts();


