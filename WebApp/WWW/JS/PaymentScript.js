function onLoadingPage() {

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

}





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
