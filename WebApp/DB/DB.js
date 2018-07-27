// Creating new Array
let array = [];
let userData = {};
let mappingRandToCookieNumber = {};

let express = require('express');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
const fs = require('fs');
let users_id;
let group_id;

let app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));



let server = app.listen(3000, function () {
    let host = server.address().address
    let port = server.address().port
    loadDBData();
    console.log("Example app listening at http://%s:%s", host, port)
});
//Login
app.post('/users/login', function (req, res) {
    let body = req.body;
    let users = getFromFile("users.txt");
    if(!users){
        res.send(0);
        return;
    }
    for(let id in users) {
        if(users[id].email == body.email && users[id].password==body.password){
            res.json(users[id]);
            return;
        }
    }

    res.send(0);
    return;

});
//Register
app.post('/users/register', function (req, res) {
        let body = req.body;
        let users = getFromFile("users.txt");
        if (!users) {
            res.send(0);
            return;
        }
        for(let id in users){
            if(users[id].email == body.email){
                res.send(0);
                return;
            }
        }

        users[users_id] = {"id":users_id, "email":body.email, password:body.password, "fullname": body.username, "phone": body.phone, "groups_id" : []};
        if(!insertToFile(users, "users.txt", users_id)){
            res.send(0);
            return;
        }
        updateDBData();
        res.send(1);
        return;
        
    });

//Get user
app.post('/users/user', function (req, res) {
    let body = req.body;
    let users = getFromFile("users.txt");
    if(!users){
        res.send(0);
        return;
    }
    for(let id in users) {
        if(id == body.id){
            res.json(users[id]);
            return;
        }
    }

    res.send(0);
    return;
});

//New group
app.post('/groups/add', function (req, res) {
    let body = req.body;
    let groups = getFromFile("groups.txt");
    let users = getFromFile("users.txt");
    if(!groups){
        res.end(0);
        return;
    }
    if(!users){
        res.end(0);
        return;
    }
    groups[group_id] = {"id" : group_id, "name" : body.name, "admin_id" : body.user_id};
    if(!insertToFile(groups, "groups.txt", group_id)){
        res.send(0);
        return;
    }
    for(let id in users){
        if(id == body.user_id){
            users[id].groups.push(group_id-1);
        }
    }
    updateDBData();
    res.send(1);
});

//Update group users
app.post('/groups/update', function (req, res) {
    let body = req.body;
    let users = getFromFile("users.txt");
    if(!users){
        res.end(0);
    }
    for(let id in users){
        if(body.emails.includes(users[id].email)){
            users[id].groups.push(body.group_id);
        }
    }
    if(!insertToFile(users,"users.txt", false)){
        res.send(0);
        return;
    }
    res.send(1);
    return;
});

//Get group data by group id
app.post('/groups/get', function (req, res) {
    let body = req.body;
    let groups = getFromFile("groups.txt");
    let users = getFromFile("users.txt")
    if(!groups || ! users){
        res.end(0);
        return;
    }
    let group_data = {};
    let admin_id = 0;
    for(let id in groups){
        if(groups[id] == body.group_id){
            group_data['name'] = groups[id].name;
            admin_id =groups[id].admin_id;
        }
    }
    let users_to_send = [];
    for(let id in users){
        let user = {};
        if(users[id].groups.includes(body.group_id)){
            user.name = users[id].fullname;
            user.phone = users[id].phone;
            user.email = users[id].email;
        }
        if(id == admin_id){
            user.is_admin = 1;
        } else{
            user.is_admin = 0;
        }
        users_to_send.push(user);
    }

    res.json(users_to_send);
});




let loadDBData = function () {
    fs.readFile("DBdata.text", function (err, data) {
        if(err){
            console.log("DBdata error");
        }
        try{
            let db_data = JSON.parse(data);
            users_id = db_data.users_id;
            group_id = db_data.group_id;
        } catch {
            console.log("DBdata error");
        }
    })
};

let updateDBData = function(){
    let data = {"users_id" : users_id, "group_id" : group_id};
    fs.writeFile("DBdata.text", data, 'utf8', function (err) {
        if(err){
            return false;
        }
        return true;
    })
};


let insertToFile = function(data, filename, counter) {
    fs.writeFile(filename, data, 'utf8', function (err) {
        if(err){
            return false;
        }
        if(counter){
            counter++;
        }
        return true;
    })
};


let getFromFile = function (filename) {
    fs.readFile(filename, function (err, data) {
        if(err){
            return false;
        }
        try{
            let db_data = JSON.parse(data);
            return db_data;

        } catch{
            return false;
        }
    })
};