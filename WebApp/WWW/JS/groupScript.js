function initPage()
{
    someMembersInGroup();
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

//
// function disconnectFromSite() {
//
//     let url = 'http://localhost:8081/DisconnectFromUser/';
//         fetch(url,
//             {
//                 redirect: 'follow',
//                 credentials: "same-origin",
//                 method: "POST",
//                 headers: { 'Content-Type': 'application/json' }
//
//             })
//             .then(function (response) {
//
//                 if(response.redirected)
//                 {
//                     window.location.replace(response.url);
//                 }
//                 return response.json();
//             })
//             .then(function (myJson) {
//                 if(myJson.approve = 1)
//                 {
//
//                 }
//             })
//             .catch(function (err) {
//                 console.log(err.toString());
//             })
// }

function someMembersInGroup() {
    let url = 'http://localhost:8081/group/allMembers';
    data = {};
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
        showMember(data, 3);
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

    fetch(url,
        {
            credentials: "same-origin",
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })  .then(function () {

        someMembersInGroup();
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
        if(data){
            window.location.replace(data.url);
        }
    });
}

someMembersInGroup();
