function submitLogIn() {


    let password = document.getElementById("password").value;

    let email = document.getElementById("email").value;

    data = {

        "user": email,
        "password": password

    };

    let myJSON = JSON.stringify(data);
    let url = 'http://localhost:8081/users/login';
    fetch(url,
        {
            credentials: "same-origin",
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: myJSON
        })
        .then(function (response) {


            return response.json();

        })
        .then(function (myJson) {
            if (myJson.approve == 1) {

                initLocalMemory();
                window.location.replace(myJson.url);
            }
            else {

                let url = "http://localhost:8081/static/register.html" + "?login=failed";
                window.location.replace(url);
            }
        })
        .catch(function (err) {
            console.log(err.toString());
        })


}

function initLocalMemory()
{

    let nav_keys =
        {
            "http://localhost:8081/static/profilePage.html" : 1,
            "http://localhost:8081/static/GroupPage.html"   : 2,
            "http://localhost:8081/static/My-Cart.html" : 3,
            "http://localhost:8081/static/PaymentMethod.html" : 4
        };
    // Put the object into storage
    localStorage.setItem('nav_keys', JSON.stringify(nav_keys));

}

// Get the form data with our (yet to be defined) function.