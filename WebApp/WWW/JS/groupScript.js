function onCouponsSubmission() {

        console.log("Begin");
        let url = 'http://localhost:8081/ideas';
        fetch(url,
            {
                redirect: 'follow',
                credentials: "same-origin"
            })
            .then(function (response) {
                console.log("success");
                if(response.redirected)
                {
                    window.location.replace(response.url);
                }
                return response.json();
            })
            .then(function (myJson) {

                buildNewChartInHTMLFile(myJson);
            })

            .catch(function (err) {
                console.log(err.toString());
            })
    }

    function buildNewChartInHTMLFile(myJason)
    {
        let myObj = myJason;
        let firstObject = document.getElementById("contactsListID");
        firstObject.innerHTML ="";

        let newTable = `<table class="table table-hover table-striped table-condensed tasks-table">`;
        newTable +=  `<tr>
        <th scope="col">index</th>
        <th scope="col">idea</th>
        <th scope="col">Rename Idea</th>
        <th scope="col">Remove Idea</th>
        </tr>`

         let counter = 0;
         for(let i in myObj)
         {

             newTable +=  `<tr>
                <th scope="row">${counter}</th>
             <td>${myObj[i]}</td>
             <td><button class="btn btn-info"    id="buttonForUpdateIdea" name="${i}" onclick="updateAnIdeaFunc(this.name)">Change An Idea</button></td>
             <td><button class="btn btn-danger" id="deleteButtonID" name="${i}" onclick="deleteIdeaFunc(this.name)">Delete an idea</button></td>
             </tr>`;

             counter++;
         }

         newTable += `</table>`;
        firstObject.innerHTML = newTable;

    }

     function showFileNameFunc() {

        let value = document.getElementById("addTextID");
        prompt(value.value);
    }



    function deleteIdeaFunc(name) {

        let index = name;

        console.log("Begin");
        let url = 'http://localhost:8081/idea/' + index;
        fetch(url,
            {
                redirect: 'follow',
                credentials: "same-origin",
                method: "DELETE"

            })
            .then(function (response) {

                if(response.redirected)
                {
                    window.location.replace(response.url);
                }
                console.log("success");
                return response.json();
            })
            .then(function (myJson) {
                console.log(myJson);


                if(myJson.approve != 1)
                {
                    printAllDataFunc();
                }
                else
                {
                    console.log('Problem occured during delete from the array');
                }
            })
            .catch(function (err) {
                console.log(err.toString());
            })

    }

    function addNewIdeaFunc() {

        let value = prompt("add new idea");
        if(value != null)
        {
            console.log("Begin");
            let url = 'http://localhost:8081/idea';
            fetch(url,
                {
                    redirect: 'follow',
                    credentials: "same-origin",
                    method: "PUT",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        addTextID: value
                    })
                })
                .then(function (response) {

                    if(response.redirected)
                    {
                        window.location.replace(response.url);
                    }

                    console.log("success");
                    return response.json();
                })
                .then(function (myJson) {


                    if(myJson.approve != 1)
                    {
                        printAllDataFunc();
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

    }


function updateAnIdeaFunc(name) {

    let index = name;
    let newValue = prompt('Please enter a new idea');
    if(newValue!= null)
    {
        let url = 'http://localhost:8081/idea/' + index;
        fetch(url,
            {
                redirect: 'follow',
                credentials: "same-origin",
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    newValue: newValue

                })})
            .then(function (response) {

                if(response.redirected)
                {
                    window.location.replace(response.url);
                }
                console.log("success");
                return response.json();
            })
            .then(function (myJson) {

                if(myJson.ideaIndex != 1)
                {
                    printAllDataFunc();
                }
                else
                {
                    console.log('Problem occured during delete from the array');
                }
            })
            .catch(function (err) {
                console.log(err.toString());
            })
    }

}