function showUserDetails(){
    let profilePage = `<h1>פרופיל אישי</h1> <br>`
    document.getElementById("profile-content").innerHTML = profilePage;

}

function showAllGroups(){
    let myGroups = `<h1>הקבוצות שלי</h1> <br>`
    document.getElementById("profile-content").innerHTML = myGroups;
    let url = 'http://localhost:8081/users/profilePage';
    fetch(url,
        {
            credentials: "same-origin",
            method: "GET",
        })  .then(function (response) {
        return response.json();
    }).then(function (data) {
        if(data){
            let i;
            myGroups += `<ol>`;
            for(i in data){
                myGroups += `<li>${data[i]}</li> <button id="group${i}" class="btn btn-danger btn-sm groups" data-pos="${i}">העבור לדף הקבוצה</button>`
            }

            document.getElementById("profile-content").innerHTML = myGroups;
            for(i in data) {
                let chooseGroup = document.getElementById("group" + i);
                chooseGroup.addEventListener('click', function(){

                    let i = this.dataset.pos;
                    console.log(i);
                    let url = 'http://localhost:8081/users/groupPage';
                    let data = {"groupNum": i};
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
                        if(data){
                            window.location.replace(data.url);
                        }
                    });
                });
            }
        }

    });


}




function createNewGroup() {
    let newGroup = `<h1>צור קבוצה חדשה</h1> <br>  <label><b>שם הקבוצה</b></label> \n
        <br> <input class="form-control" id="groupName" placeholder="שם הקבוצה" name="groupName" type="text">\n
        <div id="invalid-groupName" style="display: none; color: red"  >
                      דרוש שם קבוצה
                                     </div>
                                     <br>
        <button class="btn btn-danger btn-sm" onclick="addNewGroup()"> אישור </button>`;

    document.getElementById("profile-content").innerHTML = newGroup;

}

function addNewGroup() {
    let groupName = document.getElementById("groupName").value;
    let invalidGroupName = document.getElementById("invalid-groupName");
    if(!groupName){
        invalidGroupName.style.display = "inline-block";
        return;
    }
    invalidGroupName.style.display = "none";
    let url = 'http://localhost:8081/users/newGroup';
    let data = {"groupName": groupName};

    fetch(url,
        {
            credentials: "same-origin",
            method: "POST",
            body: JSON.stringify(data)
        })  .then(function (response) {
        return response.json();
        }).then(function (data) {
            if(data){
                window.location.replace(data.url);
            }
        });
}



