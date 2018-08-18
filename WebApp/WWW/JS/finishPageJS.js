function init() {
    groupPermission();
    let coupon_text = localStorage['coupon_st']
    if(coupon_text && coupon_text != '{}'){
        let coupon = JSON.parse(coupon_text);
        let div = document.getElementById("text_info");
        div.value += `<h2 class="text-muted"><b>קיבלתם קופון על סך ${coupon.price}, קוד קופון: ${coupon.product_ID}</b></h2>`;

    }
    // initNavBar()
}

function groupPermission(){
    let url = 'http://localhost:8081/Cart/finishPage';
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
            illegalOperation(data.url);
        }
    });
}