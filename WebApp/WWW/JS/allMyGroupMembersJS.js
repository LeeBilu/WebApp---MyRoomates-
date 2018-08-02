
function allMembersInGroup() {
    let url = 'http://localhost:8081/group/allMembers';
    fetch(url,
        {
            credentials: "same-origin",
            method: "GET",
        })  .then(function (response) {
        return response.json();
    }).then(function (data){
        showMember(data, data.length);
    });

}

allMembersInGroup();