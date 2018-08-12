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


// Get the form data with our (yet to be defined) function.