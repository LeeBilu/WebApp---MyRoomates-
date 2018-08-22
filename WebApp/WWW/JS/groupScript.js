function initPage()
{
    groupPermission();

}

function allMembersInGroup() {
    let url = 'http://localhost:8081/group/allMembers';
    let data = {};
    data.group_id = findGetParameter("group_id");
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
    }).then(function (data){
        if(data.type == "1") {
            showMember(data.data, data.data.length);
        }else{
            illegalOperation(data.url);
        }
    });
}


function someMembersInGroup() {
    let url = 'http://localhost:8081/group/allMembers';
    let data = {};
    data.group_id = findGetParameter("group_id");
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
    }).then(function (data){
        if(data.type == "1"){
            showMember(data.data, 3);
        }else{
            illegalOperation(data.url);
        }
    });
}

function showMember(data, amount) {
    let members = " ";
    let id;
    for(id = 0; id< data.length && id< amount; id++){

        members += `<div class="media text-muted pt-3">
               <img data-src="holder.js/32x32?theme=thumb&bg=007bff&fg=007bff&size=1" alt="" class="mr-2 rounded">
               <div class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
               <div class="d-flex justify-content-between align-items-center w-100">
               <strong class="text-gray-dark">${data[id].name}</strong>
               </div>
               <span class="d-block">${data[id].email}</span>
           </div>
           </div>`
    }
    if(document.getElementById("allMembersGroup")){
        document.getElementById("allMembersGroup").innerHTML = members;
    }if(document.getElementById("allMemberGroup")&& amount == 3){
        document.getElementById("allMemberGroup").innerHTML = members;
    }

}

function findGetParameter(parameterName) {
    let result = null,
        tmp = [];
    let items = location.search.substr(1).split("&");
    for (let index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

function addNewMember(){
    let newMemberEmail = document.getElementById("newMemberEmail").value;
    let url = 'http://localhost:8081/group/newMember';
    let data = {};
    data.email = newMemberEmail;
    data.group_id = findGetParameter("group_id");
    fetch(url,
        {
            credentials: "same-origin",
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
        return res.json();
    }).then(function (data) {
        if(data.type == "1"){
            let non_ex_div = document.getElementById("non_exists_error");
            let all_ex_div = document.getElementById("already_exists_error");

            if(data.data === "NEW_USER")
            {
                non_ex_div.style.display = "none";
                all_ex_div.style.display = "none";
                someMembersInGroup();
                getSomeNotificationsFromServer();
                $('#newMemberModal').modal('hide');
                location.reload();
            }
            else if(data.data === "ALREADY_EXIST")
            {
                non_ex_div.style.display = "none";
                all_ex_div.style.display = "inline";
            }
            else if(data.data === 'NON_EXIST_USER')
            {
                non_ex_div.style.display = "inline";
                all_ex_div.style.display = "none";
            }


        }else{
            illegalOperation(data.url);
        }
    });
}

function cancelError()
{
    let non_ex_div = document.getElementById("non_exists_error");
    let all_ex_div = document.getElementById("already_exists_error");
    non_ex_div.style.display = "none";
    all_ex_div.style.display = "none";

}
function leftGroup(){
    let url = 'http://localhost:8081/group/leftGroup';
    let data = {};
    data.group_id = findGetParameter("group_id");

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
    }).then(function (data){
        if(data.type == "1"){
            window.location.replace(data.url);
        }else{
            illegalOperation(data.url);
        }
    });
}


function getSomeNotificationsFromServer()
{
    let url = 'http://localhost:8081/group/getNotifications';
    let data = {};
    data.group_id = findGetParameter("group_id");
    fetch(url,
        {
            credentials: "same-origin",
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {

        return response.json();
    }).then(function (myJson) {
        if(myJson.type = 1)
        {
            BuildNotificationJSON(myJson.data, true);
        }
    })
        .catch(function (err) {
            console.log(err.toString());
        })
}


function BuildNotificationJSON(JSON_obj, is_limited)
{
    let notificationDiv = document.getElementById("notification-div");
    let notifications = `<h6 class="border-bottom border-gray pb-2 mb-0">העדכונים האחרונים בקבוצה</h6>`;
    let paymentsOfTheGroup = JSON_obj;
    let counter = 0;
    let amount;
    if(is_limited){
        amount = 5;
    } else{
        amount = Number.MAX_SAFE_INTEGER;
    }
    for(let i = paymentsOfTheGroup.length - 1; counter < amount && i >= 0; i--)
    {
        counter++;
        notifications += `<div class="media text-muted pt-3" dir="rtl">
          <p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
          <strong class="d-block text-gray-dark">${paymentsOfTheGroup[i].user.fullname}</strong>`
        if(paymentsOfTheGroup[i].type ==="PAID"){
            notifications += `<span dir="rtl">
               שילם על הסל  ${paymentsOfTheGroup[i].amount} ש"ח
                </span>`

        } else if(paymentsOfTheGroup[i].type ==="CLOSE"){
            notifications += `<span dir="rtl">
                סגר את ההזמנה
                </span>`
        } else if(paymentsOfTheGroup[i].type ==="NEW_MEMBER"){
            notifications += `<span dir="rtl">
                הצטרף לקבוצה
                </span>`

        }
        notifications +=`</p>
          </div>`
    }
    notificationDiv.innerHTML = notifications;

    if(document.getElementById("all_notifications")){
        document.getElementById("all_notifications").innerHTML = notifications;
    }

}

function groupPermission(){
    let url = 'http://localhost:8081/users/groupPage';
    let data = {"groupNum": findGetParameter("group_id")};
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
            someMembersInGroup();
            initNavBar();
            getSomeNotificationsFromServer();
            return;
        }else{
            illegalOperation(data.url);

        }
    });
}
