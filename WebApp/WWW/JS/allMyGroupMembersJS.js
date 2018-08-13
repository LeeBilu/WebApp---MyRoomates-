
function allMembersInGroup() {
    let url = 'http://localhost:8081/group/allMembers';
    fetch(url,
        {
            credentials: "same-origin",
            method: "GET",
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

allMembersInGroup();