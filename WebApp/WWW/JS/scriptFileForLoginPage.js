function submitLogIn() {


    let password = document.getElementById("password").value;

    let userName = document.getElementById("userName").value;

    data = {

        "user": userName,
        "password": password

    };

    let myJSON = JSON.stringify(data);
    console.log(myJSON);
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
            console.log(myJson);
            if (myJson.approve != 1) {

                window.location.replace("http://localhost:8081/static/ideas.html");
            }
            else {
                console.log(myJson.approve);
                console.log('Wrong User');
                    window.location.replace("http://localhost:8081/static/register.html"+'?variable=value');
            }
        })
        .catch(function (err) {
            console.log(err.toString());
        })


}


// Get the form data with our (yet to be defined) function.