const listProductsContainer = document.getElementById("shopping-cart-list-products");
const clearCartBtn = document.getElementById("clear-cart-btn");
const subtotalsValue = document.querySelector(".cart-totals-container .subtotal-value");
const totalsValue = document.querySelector(".cart-totals-container .total-value");
showCart();
function showCart(){
    // lay du lieu tu localStorage
    let arrCart = getCart();
    listProductsContainer.innerHTML = "";
    if(arrCart && arrCart.length > 0){
        let subTotal = 0;
        for (let i=0; i<arrCart.length; i++) {
            subTotal += arrCart[i].quantity * arrCart[i].price;
            const productItem = createProductItem(arrCart[i]);
            listProductsContainer.appendChild(productItem);
            const clearProductItem = productItem.querySelector(".product-thumb-close");
            const productTotal = productItem.querySelector(".product-total");
            clearProductItem.addEventListener("click", function(){
                removeCart(arrCart, i);
                listProductsContainer.removeChild(productItem);
            })

            const decreaseProductItem = productItem.querySelector(".decrease-button");
            const quantityInput = productItem.querySelector(".product-quantity input");
            const increaseProductItem = productItem.querySelector(".increase-button");
            decreaseProductItem.addEventListener("click", function(){
                quantityInput.value=quantityInput.value-1;
                subTotal = subTotal - arrCart[i].price;
                showTotal(subTotal);
                updateCart(arrCart, i, +quantityInput.value);
                if(quantityInput.value <= 0){
                    removeCart(arrCart, i);
                    listProductsContainer.removeChild(productItem);
                    if(arrCart.length===0){
                        listProductsContainer.outerHTML = `<div class="josefin-sans no-data">No data</div>`;
                    }
                } else {
                    productTotal.innerHTML = `$${(quantityInput.value * arrCart[i].price).toLocaleString("en-US")}`;
                }
            });
            increaseProductItem.addEventListener("click", function(){
                quantityInput.value=+quantityInput.value+1;
                subTotal = subTotal + arrCart[i].price;
                showTotal(subTotal);
                updateCart(arrCart, i, +quantityInput.value);
                productTotal.innerHTML = `$${(quantityInput.value * arrCart[i].price).toLocaleString("en-US")}`;
            });

            quantityInput.addEventListener("input", function(){
                if(!isNaN(quantityInput.value) && quantityInput.value.trim() !== '' && quantityInput.value != 0){
                    subTotal = subTotal - (arrCart[i].quantity * arrCart[i].price) + (+quantityInput.value * arrCart[i].price);
                    showTotal(subTotal);
                    updateCart(arrCart, i, +quantityInput.value);
                    productTotal.innerHTML = `$${(quantityInput.value * arrCart[i].price).toLocaleString("en-US")}`;
                }else{
                    subTotal = subTotal - (arrCart[i].quantity * arrCart[i].price) + (+quantityInput.value * arrCart[i].price);
                    showTotal(subTotal);
                    quantityInput.value=1;
                    updateCart(arrCart, i, +quantityInput.value);
                    productTotal.innerHTML = `$${(quantityInput.value * arrCart[i].price).toLocaleString("en-US")}`;
                }
            })
        }
        showTotal(subTotal);
        
    }else{
        listProductsContainer.outerHTML = 
        `<div class="josefin-sans no-data">No data</div>`;
    }
}

function showTotal(subTotal){
    subtotalsValue.textContent = `$${subTotal.toLocaleString("en-US")}`;
    totalsValue.textContent = `$${subTotal.toLocaleString("en-US")}`;
}

function createProductItem(product){
    let productItem = document.createElement("tr");
    productItem.classList.add("josefin-sans");
    productItem.innerHTML = 
    `
    <td class="flex">
        <div class="product-image">
            <img src="${product.thumbnail}" class="product-thumbnail">
            <img src="/file icon/close-icon.png" class="product-thumb-close">
        </div>
        <div class="flex-column gap-8">
            <span class="product-name">${product.title}</span>
            <span class="product-color">Color: Brown</span>
            <span class="product-size">Size: XL</span>
        </div>
    </td>
    <td class="product-price">$${product.price.toLocaleString("en-US")}</td>
    <td class="product-quantity">
        <button type="button" class="decrease-button">-</button>
        <input type="text" value="${product.quantity.toLocaleString("en-US")}">
        <button type="button" class="increase-button">+</button>
    </td>
    <td class="product-total">$${(product.quantity * product.price).toLocaleString("en-US")}</td>                
    `;
    return productItem;
}

clearCartBtn.addEventListener("click", function(){
    let arrCart = getCart();
    if (arrCart && arrCart.length>0){
        clearAllCart();
        showCart();
    }
})