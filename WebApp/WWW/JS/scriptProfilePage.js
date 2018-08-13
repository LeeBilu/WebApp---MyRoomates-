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


            profilePage += `  <ul class="list-group mb-3"  style="overflow: auto">
<li class="list-group-item d-flex justify-content-between lh-condensed list-item-css ">
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
                    </li> </ul>
<button type="submit" class="btn btn-secondary" onclick="editProfileDetails()">עריכת פרופיל אישי</button>`
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
                    myGroups += `<li class="list-group-item d-flex justify-content-between lh-condensed list-item-css">
                            <div>
                                <h6 class="my-0 text-right"><b>${data[i].name}</b></h6>
                            </div>
                            <small class="text-muted">
                            <button class="btn btn-primary  btn-sm cart_buttons" data-pos="${data[i].id}" id="group${i}" >עבור לדף הקבוצה</button>
                            </small>
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
                        if(data.type == "1"){
                            window.location.replace(data.url);
                        }else{
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

function editProfileDetails(){
    let url = 'http://localhost:8081/users/myDetails';
    fetch(url,
        {
            credentials: "same-origin",
            method: "GET",
        })  .then(function (response) {
        return response.json();
    }).then(function (data) {
        let profilePage = `  <ul class="list-group mb-3"  style="overflow: auto">
    <li class="list-group-item d-flex justify-content-between lh-condensed list-item-css ">
                                <div>
                                    <h6 class="my-0 text-right"><b>שם מלא</b></h6>
                                </div>
                                    <input type="text" id="InputFullName" placeholder=${data.fullname}>
                            </li>
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between lh-condensed list-item-css">
                                    <h6 class="my-0"><b>כתובת מייל </b></h6>
                                
                                    <input type="text" id="InputEmail" placeholder=${data.email}>
                                </div>
                                <div id="invalid-email" style="display: none">
                                   דרושה כתובת מייל חוקית
                                </div>
                            </li>
                            <li class="list-group-item">
                                <div class="d-flex justify-content-between lh-condensed list-item-css">
                                    <h6 class="my-0 text-right"><b>מספר טלפון סלולרי</b></h6>
                                    <input type="text" id="InputPhoneNumber" placeholder=${data.phone}>
                                 </div>
                                <div id="invalid-phone" style="display: none">
                                    דרוש מספר פלאפון חוקי
                                </div>
                            </li> </ul>
        <button type="submit" class="btn btn-secondary" onclick="changeDetails()">אישור</button>
            <button type="submit" class="btn btn-secondary" onclick="window.location.href='profilePage.html'">ביטול</button>`
        document.getElementById("profileDetails").innerHTML = profilePage;
    })
}

function changeDetails(){
    let fullname = document.getElementById("InputFullName").value;
    let email = document.getElementById("InputEmail").value;
    let phone = document.getElementById("InputPhoneNumber").value;
    let invalidEmail = document.getElementById("invalid-email");
    let invalidPhone = document.getElementById("invalid-phone");
    let error = 0;
    let data = {};


    if(fullname){
        data.fullname = fullname;
    }if(phone){
        if (!validatePhone(phone)) {
            invalidPhone.style.display = "inline-block";
            error++;
        } else {
            invalidPhone.style.display = "none";
            data.phone = phone;
        }

    }if(email){
        if (!validateEmail(email)) {
            invalidEmail.style.display = "inline-block";
            error++;
        } else {
            invalidEmail.style.display = "none";
            data.email = email;
        }

    }
    if (error > 0) {
        return;
    }
    let url = 'http://localhost:8081/users/editProfileDetails';
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
    createNewGroup();
    initNavBar();
}
