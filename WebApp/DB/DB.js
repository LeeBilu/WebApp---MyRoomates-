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
    let host = server.address().address;
    let port = server.address().port;
    loadDBData();
    console.log(users_id);
    console.log("DB listening at http://%s:%s", host, port)
});
/**
 * Login
 * params: email , password
 */
app.post('/users/login', function (req, res) {
    let body = req.body;
    let users = getFromFile("users");
    if(!users){
        res.json({"type" : 0});
        return;
    }
    for(let id in users) {
        if(users[id].email == body.email && users[id].password==body.password){
            res.json({"type": 1 , "data" :users[id]});
            return;
        }
    }

    res.json({"type" : 0});
    return;

});
/**
 * Register
 * params: email , password, username, phone
 */
app.post('/users/register', function (req, res) {
        let body = req.body;
        let users = getFromFile("users");
        if (!users) {
            res.json({"type" : 0});
            return;
        }
        for(let id in users){
            if(users[id].email == body.email){
                res.json({"type" : 0});
                return;
            }
        }

        users[users_id] = {"id":users_id, "email":body.email, password:body.password, "fullname": body.username, "phone": body.phone, "groups_id" : []};
        if(!insertToFile(users, "users", users_id)){
            res.json({"type" : 0});
            return;
        }
        updateDBData();
        res.json({"type" : 1});
        return;
        
    });

/**
 * Get user data
 * params: id
 */
app.post('/users/user', function (req, res) {
    let body = req.body;
    let users = getFromFile("users");
    if(!users){
        res.json({"type" : 0});
        return;
    }
    if(!users[body.id]){
        res.json({"type" : 0});
        return;
    }
    res.json({"type" : 1, "data" : users[body.id]});
});
/**
 * New group
 * params: name, user_id
 */

app.post('/groups/add', function (req, res) {
    let body = req.body;
    let groups = getFromFile("groups");
    let users = getFromFile("users");
    if(!groups){
        res.json({"type" : 0});
        return;
    }
    if(!users){
        res.json({"type" : 0});
        return;
    }
    groups[group_id] = {"id" : group_id, "name" : body.name, "admin_id" : body.user_id};
    if(!insertToFile(groups, "groups", group_id)){
        res.json({"type" : 0});
        return;
    }
    if(!users[body.user_id]){
        res.json({"type" : 0});
        return;
    }

    users[body.user_id].groups.push(group_id-1);
    updateDBData();
    res.json({"type" : 1});
});
/**
 * Update group users
 * params: group_id, emails (array of emails)
 */
app.post('/groups/update', function (req, res) {
    let body = req.body;
    let users = getFromFile("users");
    if(!users){
        res.json({"type" : 0});
    }
    for(let id in users){
        if(body.emails.includes(users[id].email)){
            users[id].groups.push(body.group_id);
        }
    }
    if(!insertToFile(users,"users", false)){
        res.json({"type" : 0});
        return;
    }
    res.json({"type" : 1});
    return;
});
/**
 * Get group data by group id
 * params: group_id
 */

app.post('/groups/get', function (req, res) {
    let body = req.body;
    let groups = getFromFile("groups");
    let users = getFromFile("users");
    if(!groups || ! users){
        res.json({"type" : 0});
        return;
    }
    let group_data = {};
    if(!groups[body.group_id]){
        res.json({"type" : 0});
        return;
    }
    group_data['name'] = groups[body.group_id].name;
    let admin_id =groups[body.group_id].admin_id;
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

    res.json({"type" : 1, "data": users_to_send});
});
/**
 * Get all groups of a user
 * params: user_id
 */
app.post('/groups/getall', function (req, res) {
    let body = req.body;
    let users = getFromFile("users");
    let groups = getFromFile("groups");
    if(!users || ! groups){
        res.json({"type" : 0});
    }

    if(!users[body.user_id]){
        res.json({"type" : 0});
    }
    let groups_to_return = [];
    for(let id in groups){
        if(users[body.user_id].groups_id.includes(id)){
            groups_to_return.push(groups[id]);
        }
    }

    res.json({"type": 1, "data" : groups_to_return});
});

/**
 * Get all products
 * params:
 */
app.post('/products/get', function (req, res) {
    let products = getFromFile("products");
    if(!products){
        res.json({"type" : 0});
        return
    }
    res.json({"type" : 1, "data" : products});
});


app.post('/orders/newcart', function (req, res) {

});



let loadDBData = function () {
    try{
        let data = fs.readFileSync("DBdata").toString();
        let db_data = JSON.parse(data);
        users_id = db_data.users_id;
        group_id = db_data.group_id;
    }
    catch{
        return false;
    }

};

let updateDBData = function(){
    let data = {"users_id" : users_id, "group_id" : group_id};
    fs.writeFileSync("DBdata", data, 'utf8', function (err) {
        if(err){
            return false;
        }
        return true;
    })
};


let insertToFile = function(data, filename, counter) {
    fs.writeFileSync(filename, data, 'utf8', function (err) {
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
    try{
        let data = fs.readFileSync(filename).toString();
        return JSON.parse(data);
    } catch{
        return false;
    }
};