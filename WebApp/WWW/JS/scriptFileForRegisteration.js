function getQueryVariable(variable)
{
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    for (let i=0;i<vars.length;i++) {
        let pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

document.addEventListener("DOMContentLoaded", function(){

    let url = window.location.href;
    console.log(url);
    let c = getQueryVariable("variable");
    if(c)
    {
         showErrorMessage();
    }
});

function showErrorMessage(){

    document.getElementById("loginStatus").style.display = "inline";
    document.getElementById("submitbutton").style.marginTop= "6px";
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function submitRegisterationFunction(){


    let name = document.getElementById("FullName").value;
    let password = document.getElementById("password").value;
    let passwordVerification = document.getElementById("passwordVerification").value;
    let email = document.getElementById("email").value;
    let invalidEmail = document.getElementById("invalid-email");
    let difPassword = document.getElementById("invalid-password");
    let emptyName = document.getElementById("invalid-name");
    let emptyPassword = document.getElementById(("empty-password"))
    let error = 0;
        if (!validateEmail(email)) {
            error++;
            invalidEmail.style.display = "inline-block";

        }else{
            invalidEmail.style.display = "none";
        }
        if(!name){
            error++;
            emptyName.style.display = "inline-block";
        }else{
            emptyName.style.display = "none";
        }
        if(!password){
            error++;
            emptyPassword.style.display = "inline-block";
        }else{
            emptyPassword.style.display = "none";
        }
        if( password !== passwordVerification){
            error++;
            difPassword.style.display = "inline-block";
        }else{
            difPassword.style.display = "none";
        }

    if(error > 0){
            return;
    }


        let data = {
                "name": name,
                "user": email,
                "password": password

        };

        let myJSON = JSON.stringify(data);
        console.log(myJSON);
        let url = 'http://localhost:8081/users/register';
        fetch(url,
            {
                method: "POST",
                credentials: 'include',
                headers: { 'Content-Type': 'application/json','Cache': 'no-cache' },
                body: myJSON,

            })
            .then(function (response) {


                console.log("success");
                return response.json();
            })
            .then(function (myJson) {
                if(myJson.approve != 1)
                {
                    console.log('returing to login page');
                    window.location.replace("http://localhost:8081/static/login.html");
                }
                else
                {
                    console.log('Problem occured during addition to array');
                }
            })
            .catch(function (err) {
                console.log(err.toString());
            })


// Get the form data with our (yet to be defined) function.

}