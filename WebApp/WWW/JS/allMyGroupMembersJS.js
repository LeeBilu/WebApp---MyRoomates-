
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
            console.log("hi");
            showMember(data.data, data.data.length);
        }else{
            illegalOperation(data.url);
        }
    });
}

allMembersInGroup();