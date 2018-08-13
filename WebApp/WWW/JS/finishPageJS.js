function init() {
    groupPermission();
    // initNavBar()
}

function groupPermission(){
    let url = 'http://localhost:8081/Cart/finishPage';
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
            initNavBar();
            return;
        }else{
            window.location.replace(data.url);

        }
    });
}