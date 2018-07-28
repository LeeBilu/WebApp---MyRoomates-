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
                "amount": "1000"
            },
        "1":
            {
                "product":
                    {
                        "productName": "עגבנייה",
                        "price": "4.80",
                        "description": "מה שדניאל אוהבת"

                    },
                "amount": "2"
            }
    },
    "coupon" : {

        "productName": "הנחת סטודנט",
        "price": "10",
        "description": "מבצע לכבוד סוף עונה"

    },
    "total sum": "1000",
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
                    <span class="text-muted">${product.price} * ${amount} = ${amount * product.price} &#8362</span>
                </li>`;
    }

    my_cart.innerHTML = element;

}



//TODO fix the function


function onCouponsSubmission() {

    let coupon = document.getElementById("CouponNumber");
    if(coupon.value != null)
    {
        // let url = 'http://localhost:8081/RequestForCoupon/';
        // fetch(url,
        //     {
        //         redirect: 'follow',
        //         credentials: "same-origin",
        //         method: "POST",
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({
        //             "Coupon" : coupon.value,
        //               "Cart_id": cart.id

        //
        //         })})
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
        //             RequestNewCartList();
        //         }
        //         else
        //         {
        //             console.log('Not a valid coupon');
        //         }
        //     })
        //     .catch(function (err) {
        //         console.log(err.toString());
        //     })

        coupon = "";


    }
}
function getPaymentMethod(value){

    let visaDetailsDiv = document.getElementById("PayByVisa");
    if(value == "credit")
    {
        visaDetailsDiv.style.display = "block";
    }
    else
    {
        visaDetailsDiv.style.display = "none";
    }
}
function OnSubmitPayment() {

        let approve = true;
        let elements = document.getElementsByClassName("form-control");
        let VisaDiv = document.getElementById ("PayByVisa");
        let isPaidByVisa = document.getElementById("credit").checked;
        // Loop over them and prevent submission in case there is an empty field
         Array.prototype.forEach.call(elements, function(element) {
             let invalidFeedbackBlock  = element.parentElement.getElementsByClassName("my-invalid-feedback")[0];
             if(invalidFeedbackBlock)
             {
                 if(element.value == "" && (VisaDiv.contains(element) == false || isPaidByVisa))
                 {
                     approve = false;
                     invalidFeedbackBlock.style.display = "block";
                 }
                 else
                 {
                     invalidFeedbackBlock.style.display = "none";
                 }

             }

        });
    if(approve)
    {
        sendPaymentDetailsToServer(elements);
    }
}

function CreateJSONFromElements(elements)
{
    let newJSON = {};
    Array.prototype.forEach.call(elements, function(element) {

        newJSON[element.id] = element.value;

    });
    //gets the radio button val
    let paymentMethod = document.getElementsByName('paymentMethod');
    let paymentMethod_value;
    for(let i = 0; i < paymentMethod.length; i++){
        if(paymentMethod[i].checked){
            paymentMethod_value = paymentMethod[i].value;
        }
    }
    newJSON[paymentMethod] = paymentMethod_value;

}
function sendPaymentDetailsToServer(elementsToSend) {

    let JSONTOSend = CreateJSONFromElements(elementsToSend);

    console.log("here");

    // let url = 'http://localhost:8081/RequestToPay/';
    // fetch(url,
    //     {
    //         redirect: 'follow',
    //         credentials: "same-origin",
    //         method: "POST",
    //         headers: { 'Content-Type': 'application/json' },
                //TODO - CHECK IF JSONTOSEND WAS SENT IN A PROPER MANNER
    //         body: JSON.stringify(JSONTOSEND)})
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
    //             RequestNewCartList();
    //         }
    //         else
    //         {
    //             console.log('Not a valid coupon');
    //         }
    //     })
    //     .catch(function (err) {
    //         console.log(err.toString());
    //     })

}
