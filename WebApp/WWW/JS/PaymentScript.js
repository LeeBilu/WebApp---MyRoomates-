function initPage()
{
    groupPermission();
}
function onCouponsSubmission() {

    let coupon = document.getElementById("CouponNumber").value;
    let cart_ID = document.getElementById("Cart_ID").value;
    if(coupon != null)
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
            if(data.type == "1"){
                RequestCart();
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
            return;
        }else{
            window.location.replace(data.url);

        }
    });
}