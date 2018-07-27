function showUserDetails(){


}

function showAllGroups(){
    
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



