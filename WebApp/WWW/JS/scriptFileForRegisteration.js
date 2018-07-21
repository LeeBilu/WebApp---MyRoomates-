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

function submitRegisterationFunction(){


    let name = document.getElementById("FullName").value;
    let password = document.getElementById("password").value;
    let passwordVerification = document.getElementById("passwordVerification").value;
    let userName = document.getElementById("userName").value;
    if(password === passwordVerification)
    {
        data = {
                "name": name,
                "user": userName,
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
    }

    else
    {
        prompt("The passwords are not the same");
    }

// Get the form data with our (yet to be defined) function.

}