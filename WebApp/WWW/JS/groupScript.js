function getAllGroupMembers(url = "www.youtube.com", title = "my title", w = "300", h = "250")
{


        var left = (screen.width/2)-(w/2);
        var top = (screen.he    ight/2)-(h/2);
        window.open(url, title, 'toolbar=no, ' +
            'location=no, directories=no, status=no, menubar=no, ' +
            'scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);

    // //let coupon = document.getElementById("CouponNumber");
    // if(coupon.value != null)
    // {
    //     // let url = 'http://localhost:8081/RequestForCoupon/';
    //     // fetch(url,
    //     //     {
    //     //         redirect: 'follow',
    //     //         credentials: "same-origin",
    //     //         method: "POST",
    //     //         headers: { 'Content-Type': 'application/json' },
    //     //         body: JSON.stringify({
    //     //             Coupon : coupon.value
    //     //
    //     //         })})
    //     //     .then(function (response) {
    //     //
    //     //         if(response.redirected)
    //     //         {
    //     //             window.location.replace(response.url);
    //     //         }
    //     //         console.log("success");
    //     //         return response.json();
    //     //     })
    //     //     .then(function (myJson) {
    //     //
    //     //         if(myJson.approve != 1)
    //     //         {
    //     //             RequestNewCartList();
    //     //         }
    //     //         else
    //     //         {
    //     //             console.log('Not a valid coupon');
    //     //         }
    //     //     })
    //     //     .catch(function (err) {
    //     //         console.log(err.toString());
    //     //     })
    //
    //     coupon = "";
    //
    //
    // }


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
        //             Coupon : coupon.value
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
