function clean()
{
    let url = 'http://localhost:8081/data/clean';
    fetch(url,
        {
            credentials: "same-origin",
            method: "GET",
        })  .then(function (response) {
        return response.json();
    }).then(function (data) {

        if(data.type == "1"){

                console.log("working");
            }

    });

}


function persist()
{
    let url = 'http://localhost:8081/data/persist';
    fetch(url,
        {
            credentials: "same-origin",
            method: "GET",
        })  .then(function (response) {
        return response.json();
    }).then(function (data) {

        if(data.type == "1"){

            console.log("working");
        }

    });
}