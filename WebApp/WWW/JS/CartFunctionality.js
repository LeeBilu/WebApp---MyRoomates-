
jsonFile = {
    "CartID": "1",
    "cart": {
        "0":
            {
                "product":
                    {
                        "productName": "מלפפון",
                        "price": "5",
                        "description": "מה שבילו אוהב"

                    },
                "amount": "3"
            },
        "1":
            {
                "product":
                    {
                        "productName": "עגבנייה",
                        "price": "4.80",
                        "description": "מה שדניאל אוהבת"

                    },
                "amount": "1"
            }
    },
    "coupon" : {

        "productName": "הנחת סטודנט",
        "price": "1",
        "description": "לבינתחומי יש רק שקל הנחה מצטערים"

    },
    "total sum": "18.80",
    "total amount paid": "300"
}

function loadCartFromJSON(cartJSON)
{
    //let CART = cartJSON.cart
    let CART = jsonFile.cart;
    let my_cart = document.getElementById("my-cart");
    //firstObject.innerHTML ="";
    let element ="";
    for(let i in CART)
    {
        let product = CART[i].product;
        let amount = CART[i].amount;
        element += `<li class="list-group-item d-flex justify-content-between lh-condensed list-item-css ">
                    <div>
                        <h6 class="my-0 text-right">${product.productName}</h6>
                        <small class="text-muted">${product.description}</small>
                    </div>
                    <span class="text-muted"> ${product.price} &#8362  * ${amount} = ${amount * product.price} &#8362</span>
                </li>`;
    }

    let Coupon = jsonFile.coupon;
    element+= `<li class="list-group-item d-flex justify-content-between bg-light">
                    <div class="text-success">
                    <h6 class="my-0">${Coupon.productName}</h6>
                <small>${Coupon.description}</small>
                </div>
                <span class="text-success">${Coupon.price}- &#8362</span>
                </li>`;

    element+=`<li class="list-group-item d-flex justify-content-between">
                <span>סכום כולל</span>
                <strong>${jsonFile["total sum"]} &#8362   </strong>
                </li>`
    my_cart.innerHTML = element;
}