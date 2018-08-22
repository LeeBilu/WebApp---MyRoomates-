function initPage()
{
    groupPermission();
}

function GetProfileDetails(){
    let url = 'http://localhost:8081/users/myDetails';
    fetch(url,
        {
            credentials: "same-origin",
            method: "GET",
        })  .then(function (response) {
        return response.json();
    }).then(function (data) {
        if(data.type == "1"){

           let name = data.data.fullname;
           let email = data.data.email;
           addDefaultDetailsToPaymentPage(name, email);
        }else{
            illegalOperation(data.url)
        }

    })
}

function addDefaultDetailsToPaymentPage(name, email)
{
    let name_div = document.getElementById("FullName");
    let email_div = document.getElementById("email");
    email_div.value = email;
    name_div.value = name;
}
function onCouponsSubmission() {

    let coupon = document.getElementById("CouponNumber").value;
    let cart_ID = document.getElementById("Cart_ID").value;
    let coupon_invalid_div= document.getElementById("coupon-invalid");
    let coupon_invalid_div_already_used= document.getElementById( "coupon-invalid_already_used");
    if(coupon === '')
    {
        coupon_invalid_div.style.display = "inline";
    }
    else if(coupon != null)
    {
        let url = 'http://localhost:8081/Cart/RequestForCoupon';
        let data = {
            "Coupon_ID": coupon,
            "Cart_ID" : cart_ID
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
            if(data.type == "1" ){
                if(data.data === "OK")
                {
                    coupon_invalid_div_already_used.display = "none";
                    coupon_invalid_div.style.display = "none";
                    RequestCart();
                }
                else if(data.data === "CART_HAS_COUPON")
                {
                    coupon_invalid_div_already_used.style.display = "inline";
                    coupon_invalid_div.style.display = "none";
                }
                else
                {
                    coupon_invalid_div.style.display = "inline";
                    coupon_invalid_div_already_used.display = "none";
                }
            }else{
                illegalOperation(data.url);
            }
        });
    }
        coupon = "";

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
        let paymentMethod_value = document.getElementById ("partOrFullPayment").value;
        // Loop over them and prevent submission in case there is an empty field
         Array.prototype.forEach.call(elements, function(element) {
             let invalidFeedbackBlock  = element.parentElement.getElementsByClassName("my-invalid-feedback")[0];
             if(invalidFeedbackBlock)
             {
                 if(element.value == "" && (VisaDiv.contains(element) == false || isPaidByVisa) && (paymentMethod_value != "partial" && element.id === "AmountOfMoney") == false)
                 {

                         approve = false;
                         invalidFeedbackBlock.style.display = "block";

                 }
                 else if(validateElement(element) == false && (VisaDiv.contains(element) == false || isPaidByVisa) && element.id != "AmountOfMoney")
                 {
                     approve = false;
                     invalidFeedbackBlock.style.display = "block";
                 }
                 else if(validateElement(element) == false && element.id === "AmountOfMoney")
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

function validateElement(element)
{
    if(element.id === "email")
    {
       return validateEmail(element.value);
    }
    else if(element.id === "VisaNumber")
    {
        return validateVisaNumber(element.value);
    }
    else if(element.id === "OwnerID")
    {
         return validateIDNumber(element.value);

    }
    else if(element.id === "AmountOfMoney")
    {
        let paymentMethod_value = document.getElementById ("partOrFullPayment").value;
        if(paymentMethod_value === "partial")
        {
            if(element.value < 0 || element.value > amountLeft)
            {
                return false;
            }

        }
        return true;
    }
    else if(element.id === "cc_cvv")
    {
        return validateCCV(element.value);
    }
    else
    {
        return true;
    }
}

function CreateJSONFromElements(elements)
{
    let newJSON = {};

    //TODO - CHANGE TO REGULAR FOR
    Array.prototype.forEach.call(elements, function(element) {

        newJSON[element.id] = element.value;

    });
    //gets the radio button val
    let paymentMethod_value = getPaymentMethodValue();
    newJSON["paymentMethod"] = paymentMethod_value;
    newJSON["cart_id"] = document.getElementById("Cart_ID").value;
    newJSON["group_id"] = findGetParameter("group_id");
    return newJSON;
}

function getPaymentMethodValue()
{
    let paymentMethod = document.getElementsByName('paymentMethod');
    let paymentMethod_value = "";
    for(let i = 0; i < paymentMethod.length; i++){
        if(paymentMethod[i].checked){
            paymentMethod_value = paymentMethod[i].value;
        }
    }

    return paymentMethod_value;
}
function sendPaymentDetailsToServer(elementsToSend) {
    let data = CreateJSONFromElements(elementsToSend);
        let url = 'http://localhost:8081/Cart/RequestToPay';
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
                window.location.replace(data.url);
            }else{
                illegalOperation(data.url)
            }
        });

}

function getAmount(value)
{
    let AmountDiv = document.getElementById("AmountOfMoneyDiv");
    if(value == "partial")
    {
        AmountDiv.style.display = "block";
    }
    else
    {
        AmountDiv.style.display = "none";
    }

}

function groupPermission(){
    let url = 'http://localhost:8081/Cart/paymentPage';
    let data = {"groupNum": findGetParameter("group_id")};
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
            initNavBar();
            RequestCart();
            GetProfileDetails();
            return;
        }else{
            illegalOperation(data.url);

        }
    });

    function initPaymentPage()
    {

        let isCartEmpty = document.getElementById("totalAmountCart");

        if(isCartEmpty === false)
        {
            document.getElementById("submitPayment").disabled = true ;
            document.getElementById("empty_cart_error_div").style.display = "inline";
        }

    }
}