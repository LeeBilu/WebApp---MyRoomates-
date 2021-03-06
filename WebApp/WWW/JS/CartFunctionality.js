let amountLeft;

function RequestCart() {

    let url = 'http://localhost:8081/Cart/RequestCart';
    let group_id = findGetParameter("group_id");
    let data_to_send = {
        "group_id" : group_id
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
           illegalOperation(data.url)
        }
    });


//    loadCartFromJSON(jsonFile); //comment
}

function loadCartFromJSON(jsonFile)
{
    let CART = jsonFile.cart;
    let my_cart = document.getElementById("my-cart");
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
                <strong dir="ltr" >&#8362 ${jsonFile.total_amount}</strong>
                </li></div>`

    element+=`<div><li class="list-group-item d-flex justify-content-between">
                <span>סכום ששולם</span>
                <strong dir="ltr">&#8362 ${jsonFile.total_amount_paid}</strong>
                </li></div>`
    element+=`<div dir="rtl"><li class="list-group-item d-flex justify-content-between">
                <span>סכום שנשאר</span>
                <strong dir="ltr">&#8362 ${jsonFile.total_amount - jsonFile.total_amount_paid}    </strong>
                </li></div>`
    amountLeft = jsonFile.total_amount - jsonFile.total_amount_paid;
    element+=`<input type="hidden" id="Cart_ID" name="Cart_ID" value=${jsonFile.Cart_ID}>`
    my_cart.innerHTML = element;

    let numberOfProducts = document.getElementById("numberOfProducts");
    if(numberOfProducts){
        numberOfProducts.innerText = numberOfTotalProducts.toString();
    }
    let urlWithoutVariable = window.location.href.split("?")[0];
    if(urlWithoutVariable === "http://localhost:8081/static/PaymentMethod.html")
    {
        initPaymentPage(jsonFile.total_amount);
    }
}
function initPaymentPage(amount)
{
    if(amount === 0)
    {
        document.getElementById("submitPayment").disabled = true ;
        document.getElementById("empty_cart_error_div").style.display = "inline";
    }

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
                localStorage['Want_to_Finish_Order'] = "No";
                RequestCart();
            } else{
                illegalOperation(data.url)
            }
        });
    }
}