
function onCouponsSubmission() {

    let coupon = document.getElementById("CouponNumber").value;
    let cart_ID = document.getElementById("Cart_ID").value;
    if(coupon.value != null)
    {
        let url = 'http://localhost:8081/Cart/RequestForCoupon';
        let data = {
            "Coupon_ID": coupon.value,
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
1
    });
    //gets the radio button val
    let paymentMethod = document.getElementsByName('paymentMethod');
    let paymentMethod_value;
    for(let i = 0; i < paymentMethod.length; i++){
        if(paymentMethod[i].checked){
            paymentMethod_value = paymentMethod[i].value;
        }
    }
    newJSON["paymentMethod"] = paymentMethod_value;

}
function sendPaymentDetailsToServer(elementsToSend) {

    let data = CreateJSONFromElements(elementsToSend);

        /*let url = 'http://localhost:8081/RequestToPay/';
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
*/
}
