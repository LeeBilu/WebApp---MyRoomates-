let express = require('express');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
const fs = require('fs');
let ids = Object;

let app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

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
            delete(users[id].password);

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
            res.json({"type" : 0, "data" : "ERROR"});
            return;
        }
        for(let id in users){
            if(users[id].email == body.email){
                res.json({"type" : 0, "data" : "USER_EXISTS"});
                return;
            }
        }

        users[ids.users_id] = {"id":ids.users_id, "email":body.email, password: body.password, "fullname": body.username, "phone": body.phone, "groups_id" : []};
        if(!insertToFile(users, "users", "users_id")){
            res.json({"type" : 0, "data" : "ERROR"});
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
    let user =  users[body.id];
    delete user.password;
    delete user.groups_id;
    res.json({"type" : 1, "data" : user});
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
    if(!users[body.user_id]){
        res.json({"type" : 0});
        return;
    }
    groups[ids.group_id] = {"id" : ids.group_id, "name" : body.name, "admin_id" : body.user_id};
    if(!insertToFile(groups, "groups", "group_id")){
        res.json({"type" : 0});
        return;
    }

    users[body.user_id].groups_id.push(ids.group_id - 1);
    insertToFile(users, "users", false);
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
        for(let i =0; i<body.emails.length; i++){
            if(body.emails[i] == users[id].email){
               users[id].groups_id.push(body.group_id);
            }
        }
    }
    if(!insertToFile(users,"users", false)){
        res.json({"type" : 0});
        return;
    }
    res.json({"type" : 1});
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
        for(let i = 0; i < users[id].groups_id.length; i ++){
            if(users[id].groups_id[i] == body.group_id){
                user.name = users[id].fullname;
                user.phone = users[id].phone;
                user.email = users[id].email;
                if(id == admin_id){
                    user.is_admin = 1;
                } else{
                    user.is_admin = 0;
                }
                users_to_send.push(user);
            }

        }
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
        return;
    }

    if(!users[body.user_id]){
        res.json({"type" : 0});
        return;
    }
    let groups_to_return = [];
    for(let id in groups){
       for(let i =0; i< users[body.user_id].groups_id.length; i++){
           if(id == users[body.user_id].groups_id[i]){
               groups_to_return.push(groups[id]);

           }
       }
    }

    res.json({"type": 1, "data" : groups_to_return});
});

/**
 * Exit from group
 * params: user_id, group_id
 */
app.post('/groups/remove', function (req, res) {
    let body = req.body;
    let users = getFromFile("users");
    let groups = getFromFile("groups");
    if(!users || ! groups){
        res.json({"type" : 0});
        return;
    }

    if(!users[body.user_id]){
        res.json({"type" : 0});
        return;
    }
    if(users[body.user_id].groups[body.group_id]){
        delete users[body.user_id].groups[body.group_id];
    }

    if(insertToFile(users, "users", false) === false){
        res.json({"type" : 0});
        return;
    }

    res.json({"type": 1});
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


app.post('/coupons/checkandset', function (req, res) {
    let body = req.body;


});


/**
 * create new cart
 * params: group_id
 */
app.post('/cart/create', function (req, res) {
    let carts = getFromFile("carts");
    let body = req.body;
    for(let id in carts){
        if(carts[id].group_id == body.group_id && carts.status == 1){
            res.json({"type" : 0, "data" : "OPEN_CART"})
        }
    }

    carts[ids.carts_id] = {"id": ids.carts_id, "status" : 1, "products" : [], "group_id" : body.group_id};
    if(!insertToFile(carts, "carts", "carts_id")){
        res.json({"type" : 0, "data" : "DB_ERROR"})
    }
    res.json(carts[ids.carts_id -1]);
});

/**
 * get the cart
 * params: cart_id
 */
app.post('/cart/get', function (req, res) {
    let carts = getFromFile("carts");
    if(!carts){
        res.json({"type" : 0, "data" : "CARTS_NOT_FOUND"});
        return;
    }
    let body = req.body;
    if(!carts[body.cart_id]){
        res.json({"type" : 0, "data" : "CART_NOT_FOUND"});
        return;
    }
    let cart = carts[body.cart_id];
    let amount = 0;
    for(let i = 0; i < cart.products.length; i++){
        amount += cart.products[i].product.price * cart.products[i].amount;
    }
    cart.total_amount = amount;
    res.json(cart);
});

/**
 * delete product from the cart
 * params: cart_id product_id
 */

app.post('/cart/deleteProduct', function (req, res) {
    let carts = getFromFile("carts");
    let body = req.body;
    if(!body.cart_id){
        res.json({"type" : 0, "data" : "DB_ERROR"});
        return;
    }
    if(carts === false ){
        res.json({"type" : 0, "data" : "DB_ERROR"});
        return;
    }
    if(!carts[body.cart_id] || !carts[body.cart_id].products[product_id]){
        res.json({"type" : 0, "data" : "DB_ERROR"});
        return;
    }
    delete carts[body.cart_id].products[body.product_id];
    if(insertToFile(carts, "carts", false) === false){
        res.json({"type" : 0, "data" : "DB_ERROR"});
        return;
    }
    res.json({"type" : 1, "data" : 1});
});

/**
 * edit product in the cart
 * params: cart_id product_id, amount
 */

app.post('/cart/editProduct', function (req, res) {
    let carts = getFromFile("carts");
    let products = getFromFile("products");
    let body = req.body;
    if(!body.cart_id || !body.product_id || !body.amount){
        res.json({"type" : 0, "data" : "DB_ERROR"});
        return;
    }
    if(carts === false || products === false){
        res.json({"type" : 0, "data" : "DB_ERROR"});
        return;
    }
    if(!carts[body.cart_id] || !products[product_id]){
        res.json({"type" : 0, "data" : "DB_ERROR"});
        return;
    }
    carts[body.cart_id].products[body.product_id] = {"product" : products[body.product_id], "amount"  : body.amount};
    if(insertToFile(carts, "carts", false) === false){
        res.json({"type" : 0, "data" : "DB_ERROR"});
        return;
    }
    res.json({"type" : 1, "data" : 1});

});

let loadDBData = function () {
    try{
        let data = fs.readFileSync("DBdata").toString();
        let db_data = JSON.parse(data);
        ids.users_id = db_data.users_id;
        ids.group_id = db_data.group_id;
        ids.carts_id = db_data.carts_id;
    }
    catch(e){
        return false;
    }

};

let updateDBData = function(){
    let data = {"users_id" : ids.users_id, "group_id" : ids.group_id, "carts_id" : ids.carts_id};
    try{
        fs.writeFileSync("DBdata", JSON.stringify(data), 'utf8');
        return true;
    } catch (e) {
        return false;
    }
};


let insertToFile = function(data, filename, counter) {
    try{
        fs.writeFileSync(filename,  JSON.stringify(data), 'utf8');
        if(counter){
            ids[counter]++;
        }
        return true;
    } catch (e) {
        return false;
    }

};


let getFromFile = function (filename) {
    try{
        let data = fs.readFileSync(filename).toString();
        return JSON.parse(data);
    } catch(e){
        console.log(e);
        return false;
    }
};

let server = app.listen(3000, function () {
    let host = server.address().address;
    let port = server.address().port;
    loadDBData();
    console.log("DB listening at http://%s:%s", host, port)
});