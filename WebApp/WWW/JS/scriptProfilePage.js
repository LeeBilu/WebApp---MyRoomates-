function showUserDetails(){
    let profilePage = ` `;
    document.getElementById("profileDetails").innerHTML = profilePage;
    let url = 'http://localhost:8081/users/myDetails';
    fetch(url,
        {
            credentials: "same-origin",
            method: "GET",
        })  .then(function (response) {
             return response.json();
        }).then(function (data){


            profilePage += `<li class="list-group-item d-flex justify-content-between lh-condensed list-item-css ">
                        <div>
                            <h6 class="my-0 text-right"><b>שם מלא</b></h6>
                        </div>
                        <span class="text-muted">${data.fullname}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between lh-condensed list-item-css">
                        <div>
                            <h6 class="my-0"><b>כתובת מייל </b></h6>
                        </div>
                        <span class="text-muted">${data.email}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between lh-condensed list-item-css ">
                        <div>
                            <h6 class="my-0 text-right"><b>מספר טלפון סלולרי</b></h6>
                        </div>
                        <span class="text-muted">${data.phone}</span>
                    </li>`
        document.getElementById("profileDetails").innerHTML = profilePage;
    });

}

function showAllGroups(){
    let myGroups = "";
    document.getElementById("myGroups").innerHTML = myGroups;
    let url = 'http://localhost:8081/users/allGroups';
    fetch(url,
        {
            credentials: "same-origin",
            method: "GET",
        })  .then(function (response) {
        return response.json();
    }).then(function (data) {
        if(data){
            let i;
            for(i in data){
                // if(i%2 == 0){
                    myGroups += `<li class="list-group-item d-flex justify-content-between lh-condensed list-item-css">
                            <div>
                                <h6 class="my-0 text-right"><b>${data[i].name}</b></h6>
                            </div>
                            <button class="btn-primary cart_buttons" data-pos="${data[i].id}" id="group${i}"  >עבור לדף הקבוצה</button></small>
                        </li>`
            }

            document.getElementById("myGroups").innerHTML = myGroups;
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
    let newGroup =`<input class="form-control" id="groupName" placeholder="שם הקבוצה" name="groupName" type="text">\n
        <div id="invalid-groupName" style="display: none; color: red"  >
                      דרוש שם קבוצה
                                     </div>
                                     
        `;

    document.getElementById("newGroup").innerHTML = newGroup;

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
}


function initPage()
{
    showUserDetails();
    showAllGroups();
    createNewGroup()
}
