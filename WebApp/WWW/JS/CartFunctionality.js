jsonFile = {
    "Cart_ID": "1",
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
    "total_amount": "18.80",
    "total_amount_paid": "300"
}

function RequestCart() {

    let url = 'http://localhost:8081/Cart/RequestCart';
    //TODO - get the group ID out of the URL
    let data_to_send = {
        "group_id" : "33"
    };
    fetch(url,
        {
            credentials: "same-origin",
            method: "POST",
            body: JSON.stringify(data_to_send),
            headers: {
                "Content-Type": "application/json"
            }
        })  .then(function (response) {
        return response.json();
    }).then(function (data) {
        if(data.type == "1"){
            loadCartFromJSON(data.order);
        } else{
            //TODO - Problem with cart request
        }
    });


//    loadCartFromJSON(jsonFile); //comment
}

function loadCartFromJSON(jsonFile)
{
    //let CART = cartJSON.cart
    console.log(jsonFile);
    let CART = jsonFile.cart;
    let my_cart = document.getElementById("my-cart");
    //firstObject.innerHTML ="";
    let element ="";
    let numberOfTotalProducts = 0;
    for(let i in CART)
    {
        if(CART[i] !== "undefined"){
            numberOfTotalProducts++;
            let product = CART[i].product;
            let amount = CART[i].amount;
            element += `<div><li class="list-group-item d-flex justify-content-between lh-condensed list-item-css ">

                            <button type="button" class="close" aria-label="Close" onclick="deleteProductFromCart(${product.product_ID},${amount})">
                              <span aria-hidden="true">&times;</span>
                            </button>
                            <div class="col-md-5 order-md-0 mb-2 text-right">
                                <h6 class="my-0 ">${product.productName}</h6>
                                <small class="text-muted">${product.description}</small>
                            </div>
                            <!--<small class="text-muted">
                            <button class="btn-danger cart_buttons" onclick="deleteProductFromCart(${product.product_ID},${amount})" >  X </button>
                            </small>-->
                        <div class="col-md-5 order-md-1 mb-4">
                         <span class="text-muted"> ${roundPrice(amount * product.price)} &#8362 =  ${amount} * ${product.price} &#8362    </span>
                         </div>
                    </li>
                    </div>`;

        }
    }
     let Coupon = jsonFile.coupon;
    // console.log(jsonFile);
    // console.log(jsonFile.coupon);
    // console.log(Coupon);
    if(Coupon && Coupon.productName) {
        element += `<div><li class="list-group-item d-flex justify-content-between bg-light">
                    <div class="text-success">
                    <h6 class="my-0">${Coupon.productName}</h6>
                <small>${Coupon.description}</small>
                </div>
                <span class="text-success">${Coupon.price}- &#8362</span>
                </li></div>`;
    }
    element+=`<div><li class="list-group-item d-flex justify-content-between">
                <span>סכום כולל</span>
                <strong>${jsonFile.total_amount} &#8362   </strong>
                </li></div>`

    element+=`<div><li class="list-group-item d-flex justify-content-between">
                <span>סכום ששולם</span>
                <strong>${jsonFile.total_amount_paid} &#8362   </strong>
                </li></div>`
    element+=`<div><li class="list-group-item d-flex justify-content-between">
                <span>סכום שנשאר</span>
                <strong>${jsonFile.total_amount - jsonFile.total_amount_paid} &#8362   </strong>
                </li></div>`

    element+=`<input type="hidden" id="Cart_ID" name="Cart_ID" value=${jsonFile.Cart_ID}>`
    my_cart.innerHTML = element;

    let numberOfProducts = document.getElementById("numberOfProducts");
    numberOfProducts.innerText = numberOfTotalProducts.toString();
}

function roundPrice(totalPriceProduct){
    return Math.round(totalPriceProduct * 100) / 100;
}


function deleteProductFromCart(Product_ID, quantity)
{
    if(isNaN(quantity) == false && isNaN(Product_ID) == false  && Number.parseInt(quantity) > 0)
    {
        let url = 'http://localhost:8081/Cart/DeleteProduct';
        let cart_ID = document.getElementById("Cart_ID").value;
        let data = {
            "product_ID": Product_ID,
            "quantity" : quantity,
            "cart_id" : cart_ID
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
            } else{
                //TODO: error
            }
        });
    }
}