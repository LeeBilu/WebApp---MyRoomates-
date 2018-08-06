function getQueryVariable(variable) {


    let query = window.location.search.substring(1);
    console.log(query);

    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}

function findGetParameter(parameterName) {
    let result = null,
        tmp = [];
    let items = location.search.substr(1).split("&");
    for (let index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

document.addEventListener("DOMContentLoaded", function () {
    console.log(window.location.search);
    let url = window.location.href;
    console.log(url);
    let c = findGetParameter("variable");
    if (c) {

        showErrorMessage();
    }
});

function showErrorMessage() {

    document.getElementById("loginStatus").style.display = "inline";
    document.getElementById("submitbutton").style.marginTop = "6px";
}

function validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
    let isnum = /^\d+$/;
    if(phone.length != 10 || phone.substring(0,2) != "05" ||  !isnum.test(phone)){
        return false;
    }
    return true;
}

function submitRegisterationFunction() {


    let name = document.getElementById("FullName").value;
    let password = document.getElementById("password").value;
    let passwordVerification = document.getElementById("passwordVerification").value;
    let email = document.getElementById("email").value;
    let invalidEmail = document.getElementById("invalid-email");
    let existEmail = document.getElementById("exist-email");
    let phone = document.getElementById("phone").value;
    let invalidPhone = document.getElementById("invalid-phone");
    let difPassword = document.getElementById("invalid-password");
    let emptyName = document.getElementById("invalid-name");
    let emptyPassword = document.getElementById(("empty-password"))
    let error = 0;
    if (!validateEmail(email)) {
        error++;
        invalidEmail.style.display = "inline-block";

    } else {
        invalidEmail.style.display = "none";
    }
    if (!validatePhone(phone)) {
        error++;
        invalidPhone.style.display = "inline-block";

    } else {
        invalidPhone.style.display = "none";
    }
    if (!name) {
        error++;
        emptyName.style.display = "inline-block";
    } else {
        emptyName.style.display = "none";
    }
    if (!password) {
        error++;
        emptyPassword.style.display = "inline-block";
    } else {
        emptyPassword.style.display = "none";
    }
    if (password !== passwordVerification) {
        error++;
        difPassword.style.display = "inline-block";
    } else {
        difPassword.style.display = "none";
    }
    existEmail.style.display = "none";
    if (error > 0) {
        return;
    }


    let data = {
        "name": name,
        "user": email,
        "password": password,
        "phone": phone

    };

    let myJSON = JSON.stringify(data);
    console.log(myJSON);
    let url = 'http://localhost:8081/users/register';
    fetch(url,
        {
            method: "POST",
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'Cache': 'no-cache'},
            body: myJSON,

        })
        .then(function (response) {


            console.log("success");
            return response.json();
        })
        .then(function (myJson) {
            if (myJson.approve == 1) {
                console.log('returing to login page');
                window.location.replace(myJson.url);
            }
            else {
                if(myJson.error == "USER_EXISTS"){
                    existEmail.style.display = "inline-block";
                }
                console.log('Problem occured during addition to array');
            }
        })
        .catch(function (err) {
            console.log(err.toString());
        })


// Get the form data with our (yet to be defined) function.

}