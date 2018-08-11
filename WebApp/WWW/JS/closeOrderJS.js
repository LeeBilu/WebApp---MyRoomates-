let cart;
function init() {
    RequestCart();
    initNavBar();
    cart = RequestCart();
}

function OnSubmitShipments() {
    let city = document.getElementById("city").value;
    let street = document.getElementById("street").value;
    let numberOfHouse = document.getElementById("numberOfHouse").value;
    let numberOfHouseValidation = document.getElementById("numberOfHouseValidation");
    let enter = document.getElementById("enter").value;
    let floor = document.getElementById("floor").value;
    let phone = document.getElementById("phone").value;
    let phoneValidation = document.getElementById("phoneValidation");
    let emptyCity = document.getElementById("cityValidation");
    let emptyStreet = document.getElementById(("streetValidation"));
    let error = 0;
    if (!city) {
        error++;
        emptyCity.style.display = "inline-block";

    } else {
        emptyCity.style.display = "none";
    }
    if (!validatePhone(phone)) {
        error++;
        phoneValidation.style.display = "inline-block";

    } else {
        phoneValidation.style.display = "none";
    }
    if (!street) {
        error++;
        emptyStreet.style.display = "inline-block";
    } else {
        emptyStreet.style.display = "none";
    }
    if (!numberOfHouse) {
        error++;
        numberOfHouseValidation.style.display = "inline-block";
    } else {
        numberOfHouseValidation.style.display = "none";
    }
    if (error > 0) {
        return;
    }
    let data ={};
    data.city = city;
    data.street = street;
    data.numOfHouse = numberOfHouse;
    data.phone = phone;
    if(enter){
        data.enter = enter;
    } if(floor){
        data.floor = floor;
    }
    data.cart_id = document.getElementById("Cart_ID").value;
    let url = 'http://localhost:8081/Cart/Close';
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
        if(data.type == 1){
            window.location.replace(data.url);
        }
    });
}