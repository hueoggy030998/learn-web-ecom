function getCart(){
    let arrCart = JSON.parse(localStorage.getItem("cart"));
    if(!arrCart){
        arrCart = [];
    }
    return arrCart;
}

function addCart(product){
    let arrCart = JSON.parse(localStorage.getItem("cart"));
    if(!arrCart){
        arrCart = [];
    }
    const includesProduct = arrCart.find(function (element){
        return element.id === product.id;
    });
    if(!includesProduct){
        product["quantity"]=1;
        arrCart.push(product);
        localStorage.setItem("cart", JSON.stringify(arrCart));
    }
}

function removeCart(arrCart, index){
    arrCart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(arrCart));
}

function updateCart(arrCart, index, quantity){
    let product = arrCart[index];
    product["quantity"] = quantity;
    localStorage.setItem("cart", JSON.stringify(arrCart));
}

function clearAllCart(){
    localStorage.setItem("cart", JSON.stringify([]));
}