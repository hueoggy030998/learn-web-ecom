async function getProductData(){
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams.get("id"));
    const response = await fetch(`${apiGetSingleProduct}/${urlParams.get("id")}`);
    const data = await response.json();
    return data;
}

const infoContainer = document.getElementById("product-detail-general-info");
showProductDetailsPage();

async function showProductDetailsPage(){
    const data = await getProductData();
    showProductInfo(data);
    showProductTab(data);
    showRelatedProducts(data);

    const addCartButton = document.getElementById("add-cart-btn");
    addCartButton.addEventListener("click", function (event){
        event.stopPropagation();
        addCart(data);
        console.log("add cart success:", data);
    })
}

function showProductInfo(data){
    // danh sach image 
    const listImages = data.images;
    showProductImage(listImages)
    // ten san pham
    const productName = infoContainer.querySelector(".product-detail-name");
    productName.textContent = data.title;
    // rating
    const productRatingContainer = infoContainer.querySelector(".product-rating");
    productRatingContainer.innerHTML = showRating(data.rating);
    // so luot danh gia 
    const numOfReview = infoContainer.querySelector(".num-of-review");
    numOfReview.textContent = `(${data.reviews.length})`;
    // gia san pham
    const productPriceSale = infoContainer.querySelector(".product-price-sale");
    productPriceSale.textContent = `$${parseFloat((data.price*(100-data.discountPercentage)/100).toFixed(2)).toLocaleString("en-US")}`;
    const productPrice = infoContainer.querySelector(".product-price");
    productPrice.textContent=`$${data.price.toLocaleString("en-US")}`;
    // mo ta san pham
    const description = infoContainer.querySelector(".des-details");
    description.textContent = data.description;
    // category
    const category = infoContainer.querySelector(".product-categories-name");
    category.textContent = data.category.charAt(0).toUpperCase() + data.category.slice(1);
    // tags
    const tagsName = infoContainer.querySelector(".product-tags-name");
    for(let i=0; i<data.tags.length; i++){
        tagsName.innerHTML += `#${data.tags[i]} `;
    }
}

function showProductImage(listImages){
    if(listImages.length > 0){
        const productImgLeft = document.querySelector(".product-img-left");
        const productImgRight = document.querySelector(".product-img-right");
        const imageBig =  document.createElement("img");
        imageBig.src = listImages[0];
        productImgRight.appendChild(imageBig);
        for(let i=0; i<=listImages.length-1; i++){
            if(i===3){
                break;
            }
            let imgSmall = document.createElement("img");
            imgSmall.src = listImages[i];
            if(i===0){
                imgSmall.classList.add("img-active");
            }
            productImgLeft.appendChild(imgSmall);
            imgSmall.addEventListener("click", function(){
                imgSmallActive = productImgLeft.querySelector(".img-active");
                imgSmallActive.classList.remove("img-active");
                imgSmall.classList.add("img-active");
                imageBig.src = listImages[i];
            })
        }
        
    }
}

function showRating(rating){
    let listRatings = "";
    for(let i=1; i<=5; i++){
        if(i<=rating){
            listRatings += `<span class="star-full">&#9733;</span>`;
        }else if(i-1<rating && rating < i){
            listRatings += `<span class="star-half">&#9733;</span>`;
        }else {
            listRatings += `<span class="star">&#9733;</span>`;
        }
    }
    return listRatings;
}

function showProductTab(data){
    const desTab = document.getElementById("des-tab");
    const addInfoTab = document.getElementById("add-info-tab");
    const reviewTab = document.getElementById("review-tab");
    const videoTab = document.getElementById("video-tab");
    const tabDetails = document.getElementById("tab-details");
    // mac dinh show tab Description
    tabDetails.innerHTML = 
        `<div class="mt-10 flex-column gap-10 josefin-sans-semi-bold">
            <span class="tab-details-label">Product Code:</span>
            <span class="tab-details-des">${data.sku}</span>
        </div>
        <div class="mt-10 flex-column gap-10 josefin-sans-semi-bold">
            <span class="tab-details-label">Product Name:</span>
            <span class="tab-details-des">${data.title}</span>
        </div>
        <div class="mt-10 flex-column gap-10 josefin-sans-semi-bold">
            <span class="tab-details-label">Brand:</span>
            <span class="tab-details-des">${data.brand}</span>
        </div>
        <div class="mt-10 flex-column gap-10 align-baseline josefin-sans-semi-bold">
            <span class="tab-details-label">Description:</span>
            <span class="tab-details-des">${data.description}</span>
        </div>`;
    desTab.addEventListener("click", function(){
        tabDetails.innerHTML = "";
        const tabActive = document.querySelector(".tab-active");
        tabActive.classList.remove("tab-active");
        desTab.classList.add("tab-active");
        tabDetails.innerHTML = 
        `<div class="mt-10 flex-column gap-10 josefin-sans-semi-bold">
            <span class="tab-details-label">Product Code:</span>
            <span class="tab-details-des">${data.sku}</span>
        </div>
        <div class="mt-10 flex-column gap-10 josefin-sans-semi-bold">
            <span class="tab-details-label">Product Name:</span>
            <span class="tab-details-des">${data.title}</span>
        </div>
        <div class="mt-10 flex-column gap-10 josefin-sans-semi-bold">
            <span class="tab-details-label">Brand:</span>
            <span class="tab-details-des">${data.brand}</span>
        </div>
        <div class="mt-10 flex-column gap-10 align-baseline josefin-sans-semi-bold">
            <span class="tab-details-label">Description:</span>
            <span class="tab-details-des">${data.description}</span>
        </div>`;
    })
    addInfoTab.addEventListener("click", function(){
        tabDetails.innerHTML = "";
        const tabActive = document.querySelector(".tab-active");
        tabActive.classList.remove("tab-active");
        addInfoTab.classList.add("tab-active");
        tabDetails.innerHTML = 
        `<div class="mt-10 flex-column gap-10 josefin-sans-semi-bold">
            <span class="tab-details-label">Warranty Information:</span>
            <span class="tab-details-des">${data.warrantyInformation}</span>
        </div>
        <div class="mt-10 flex-column gap-10 josefin-sans-semi-bold">
            <span class="tab-details-label">Shipping Information:</span>
            <span class="tab-details-des">${data.shippingInformation}</span>
        </div>
        <div class="mt-10 flex-column gap-10 josefin-sans-semi-bold">
            <span class="tab-details-label">Availability Status:</span>
            <span class="tab-details-des">${data.availabilityStatus}</span>
        </div>
        <div class="mt-10 flex-column gap-10 align-baseline josefin-sans-semi-bold">
            <span class="tab-details-label">Return Policy:</span>
            <span class="tab-details-des">${data.returnPolicy}</span>
        </div>`;
    })
    reviewTab.addEventListener("click", function(){
        tabDetails.innerHTML = "";
        const tabActive = document.querySelector(".tab-active");
        tabActive.classList.remove("tab-active");
        reviewTab.classList.add("tab-active");
        tabDetails.classList.add("flex-column", "list-reviews");
    
        for(const review of data.reviews){
            const reviewerEmail = review.reviewerEmail.slice(0,3) + "***" + review.reviewerEmail.slice(review.reviewerEmail.length-3);
            const date = new Date(review.date);
            tabDetails.innerHTML += 
            `<div class="review">
                    <span class="reviewer-name">${review.reviewerName}</span>
                    <span class="josefin-sans reviewer-email">(${reviewerEmail}) | </span>
                    <span class="josefin-sans reviewer-date">${date.toLocaleString('en-US')}</span>
                    <div class="reviewer-product-rating">${showRating(review.rating)}</div>
                    <span class="josefin-sans-medium reviewer-comment">${review.comment}</span>
                </div>`;
        }
    })
    videoTab.addEventListener("click", function(){
        tabDetails.innerHTML = "";
        const tabActive = document.querySelector(".tab-active");
        tabActive.classList.remove("tab-active");
        videoTab.classList.add("tab-active");
        tabDetails.innerHTML = `Khong biet hien thi gi`;
    })
}

async function showRelatedProducts(data){
    // lay danh sach 4 san pham cung category
    const response = await fetch(`${apiGetProductsByACategory}/${data.category}?skip=0&limit=4`);
    const resData = await response.json();
    const listRelatedProducts = resData.products;
    console.log("listRelatedProducts ", listRelatedProducts);
    const relatedProductsContainer = document.getElementById("related-products");
    for (const element of listRelatedProducts) {
        let relatedProductItem = document.createElement("div");
        relatedProductItem.classList.add("flex-column", "related-product-item");
        relatedProductItem.innerHTML +=
        `<img class="related-product-item-thumb" src="${element.thumbnail}">
                <div class="flex justify-between align-baseline">
                    <span class="josefin-sans-semi-bold text-ellipsis related-product-item-name">${element.title}</span>
                    <div class="product-rating">
                        ${showRating(element.rating)}
                    </div>
                </div>
        <span class="josefin-sans related-product-item-price">$${element.price.toLocaleString("en-US")}</span>
        `;
        relatedProductsContainer.appendChild(relatedProductItem);
        relatedProductItem.addEventListener("click", function(){
            window.location.href = `/product_details.html?id=${element.id}`;
        })
    }
}

