jsonFile = {
    "CartID": "1",
    "cart": {
        "0":
            {
                "product":
                    {
                        "product_ID": "0",
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
                        "product_ID": "1",
                        "productName": "עגבנייה",
                        "price": "4.80",
                        "description": "מה שדניאל אוהבת"

                    },
                "amount": "1"
            },
        "2":
            {
                "product":
                    {
                        "product_ID": "2",
                        "productName": "מלפפון",
                        "price": "5",
                        "description": "מה שבילו אוהב"

                    },
                "amount": "3"
            },
        "3":
            {
                "product":
                    {
                        "product_ID": "3",
                        "productName": "מלפפון",
                        "price": "5",
                        "description": "מה שבילו אוהב"

                    },
                "amount": "3"
            },
        "0":
            {
                "product":
                    {
                        "product_ID": "4",
                        "productName": "מלפפון",
                        "price": "5",
                        "description": "מה שבילו אוהב"

                    },
                "amount": "3"
            },
    },
    "coupon" : {

        "product_ID": "1000",
        "productName": "הנחת סטודנט",
        "price": "1",
        "description": "לבינתחומי יש רק שקל הנחה מצטערים"

    },
    "total sum": "18.80",
    "total amount paid": "300"
}

function RequestCart() {

    // let url = 'http://localhost:8081/RequestForCart/';
    // fetch(url,
    //     {
    //         redirect: 'follow',
    //         credentials: "same-origin",
    //         method: "POST",
    //         headers: { 'Content-Type': 'application/json' },
    //TODO - CHECK IF JSONTOSEND WAS SENT IN A PROPER MANNER
    //         body:
    // JSON.stringify(JSONTOSEND)})
    //     .then(function (response) {
    //
    //         if(response.redirected)
    //         {
    //             window.location.replace(response.url);
    //         }
    //         console.log("success");
    //         return response.json();
    //     })
    //     .then(function (myJson) {
    //
    //         if(myJson.approve != 1)
    //         {
    //             LoadCartFromJSON(myJson.order);
    //         }
    //         else
    //         {
    //             console.log('Not a valid coupon');
    //         }
    //     })
    //     .catch(function (err) {
    //         console.log(err.toString());
    //     })

    loadCartFromJSON(jsonFile);
}

function loadCartFromJSON(jsonFile)
{
    //let CART = cartJSON.cart
    let CART = jsonFile.cart;
    let my_cart = document.getElementById("my-cart");
    //firstObject.innerHTML ="";
    let element ="";
    let numberOfTotalProducts = 0;
    for(let i in CART)
    {
        numberOfTotalProducts++;
        let product = CART[i].product;
        let amount = CART[i].amount;
        element += `<div><li class="list-group-item d-flex justify-content-between lh-condensed list-item-css ">
                        <div>
                            <h6 class="my-0 text-right">${product.productName}</h6>
                            <small class="text-muted">${product.description}</small>
                        </div>
                        <small class="text-muted">
                        <button class="btn-danger cart_buttons" onclick="deleteProductFromCart(${product.product_ID},${amount})" >  X </button>
                        </small>
                    
                     <span class="text-muted"> ${product.price} &#8362  * ${amount} = ${amount * product.price} &#8362</span>
                </li>
                </div>`;
    }

    let Coupon = jsonFile.coupon;
    element+= `<div><li class="list-group-item d-flex justify-content-between bg-light">
                    <div class="text-success">
                    <h6 class="my-0">${Coupon.productName}</h6>
                <small>${Coupon.description}</small>
                </div>
                <span class="text-success">${Coupon.price}- &#8362</span>
                </li></div>`;

    element+=`<div><li class="list-group-item d-flex justify-content-between">
                <span>סכום כולל</span>
                <strong>${jsonFile["total sum"]} &#8362   </strong>
                </li></div>`
    my_cart.innerHTML = element;

    let numberOfProducts = document.getElementById("numberOfProducts");
    numberOfProducts.innerText = numberOfTotalProducts.toString();
}


function deleteProductFromCart(Product_ID, quantity)
{
    if(quantity != undefined && Product_ID != undefined && quantity > 0)
    {
        let url = 'http://localhost:8081/Cart/DeleteProduct';
        let data = {
            "product_ID": Product_ID,
            "quantity" : quantity
        };

        fetch(url,
            {
                credentials: "same-origin",
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            })  .then(function (response) {
            return response.json();
        }).then(function (data) {
            if(data.type == "1"){
                RequestCart();
            }
        });
    }
}