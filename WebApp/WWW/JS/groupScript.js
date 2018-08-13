function initPage()
{
    groupPermission();

}



function getAllGroupMembers(url = "AllMyGroupMembers.html?group_id=" + findGetParameter("group_id") , title = "my title", w = "600", h = "500")

{


    let left = (screen.width/2)-(w/2);
    let top = (screen.height/2)-(h/2);
    window.open(url, title, 'toolbar=no, ' +
        'location=no, directories=no, status=no, menubar=no, ' +
        'scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);

    // //let coupon = document.getElementById("CouponNumber");
    // if(coupon.value != null)
    // {
    //     // let url = 'http://localhost:8081/RequestForCoupon/';
    //     // fetch(url,
    //     //     {
    //     //         redirect: 'follow',
    //     //         credentials: "same-origin",
    //     //         method: "POST",
    //     //         headers: { 'Content-Type': 'application/json' },
    //     //         body: JSON.stringify({
    //     //             Coupon : coupon.value
    //     //
    //     //         })})
    //     //     .then(function (response) {
    //     //
    //     //         if(response.redirected)
    //     //         {
    //     //             window.location.replace(response.url);
    //     //         }
    //     //         console.log("success");
    //     //         return response.json();
    //     //     })
    //     //     .then(function (myJson) {
    //     //
    //     //         if(myJson.approve != 1)
    //     //         {
    //     //             RequestNewCartList();
    //     //         }
    //     //         else
    //     //         {
    //     //             console.log('Not a valid coupon');
    //     //         }
    //     //     })
    //     //     .catch(function (err) {
    //     //         console.log(err.toString());
    //     //     })
    //
    //     coupon = "";
    //
    //
    // }


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
           <!--<button type="button" class="btn btn-danger deleteButtons">להסרה</button>-->
               </div>
               <span class="d-block">${data[id].email}</span>
           </div>
           </div>`
    }
    if(document.getElementById("allMemberGroup")){
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
    console.log(data.group_id);
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
                someMembersInGroup();
            }else{
                illegalOperation(data.url);
            }
    });
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

function getAllNotificationsFromServer()
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
                BuildNotificationJSON(myJson.data);
            }
        })
        .catch(function (err) {
            console.log(err.toString());
        })
}

function BuildNotificationJSON(JSON_obj)
{
    let notificationDiv = document.getElementById("notification-div");
    let element = `<h6 class="border-bottom border-gray pb-2 mb-0">העדכונים האחרונים בקבוצה</h6>`;
    let paymentsOfTheGroup = JSON_obj;
    for(let i =0; i < 5 && i <paymentsOfTheGroup.length; i++)
    {
        element += `<div class="media text-muted pt-3" dir="rtl">
          <p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
          <strong class="d-block text-gray-dark">${paymentsOfTheGroup[paymentsOfTheGroup.length - i - 1].user.fullname}</strong>`
          if(paymentsOfTheGroup[paymentsOfTheGroup.length - i - 1].type ==="PAID"){
              element += `<span dir="rtl">
               שילם על הסל  ${paymentsOfTheGroup[paymentsOfTheGroup.length - i - 1].amount}
                </span>`

          } else if(paymentsOfTheGroup[paymentsOfTheGroup.length - i - 1].type ==="CLOSE"){
              element += `<span dir="rtl">
                סגר את ההזמנה
                </span>`
          }
            element +=`</p>
          </div>`
    }


    //
    // element +=` <small class="d-block text-right mt-3">
    //         <a href="#">לכל עדכוני הקבוצה</a>
    //     </small>`
    notificationDiv.innerHTML = element;

}

someMembersInGroup();
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
            getAllNotificationsFromServer();
            return;
        }else{
            illegalOperation(data.url);

        }
    });
}
