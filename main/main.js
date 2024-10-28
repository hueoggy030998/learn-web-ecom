
function addCart(product){
    let arrCart = JSON.parse(localStorage.getItem("cart"));
    if(!arrCart){
        arrCart = [];
    }
    const includesProduct = arrCart.find(function (element){
        return element.id === product.id;
    });
    if(!includesProduct){
        arrCart.push(product);
        localStorage.setItem("cart", JSON.stringify(arrCart));
    }
}