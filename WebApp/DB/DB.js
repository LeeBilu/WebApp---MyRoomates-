let express = require('express');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
const fs = require('fs');
let ids = Object;
let carts , shipments, orders, users, groups, products, coupons;

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
    for(let id in users) {
        if(users[id].email == body.email && users[id].password==body.password){
            let user = clone(users[id]);
            delete(user.password);
            res.json({"type": 1 , "data" :user});
            return;
        }
    }
    res.json({"type" : 0});
});
/**
 * Register
 * params: email , password, username, phone
 */
app.post('/users/register', function (req, res) {
    let body = req.body;
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
    res.json({"type" : 1});
});

/**
 * Edit
 * params: email , phone, user_id, password, fullname
 */
app.post('/users/edit', function (req, res) {
    let body = req.body;
    if(!body.user_id){
        res.json({"type" : 0});
        return;
}


let user = users[body.user_id];
if(typeof(body.email) !== "undefined"){
    user.email = body.email;
}
    if(typeof(body.phone) !== "undefined"){
        user.phone = body.phone;
    }
    if(typeof(body.fullname) !== "undefined"){
        user.fullname = body.fullname;
    }
    users[body.user_id] = user;

    if(!insertToFile(users, "users", false)){
        res.json({"type" : 0});
        return;
    }
    res.json({"type" : 1});
});

/**
 * Get user data
 * params: id
 */
app.post('/users/user', function (req, res) {
    let body = req.body;
    if(!users[body.id]){
        res.json({"type" : 0});
        return;
    }
    let user =  clone(users[body.id]);
    delete user.password;
    res.json({"type" : 1, "data" : user});
});
/**
 * New group
 * params: name, user_id
 */

app.post('/groups/add', function (req, res) {
    let body = req.body;
    if(!users[body.user_id]){
        res.json({"type" : 0});
        return;
    }
    groups[ids.group_id] = {"id" : ids.group_id, "name" : body.name, "admin_id" : body.user_id};
    let group_id = ids.group_id;
    if(insertToFile(groups, "groups", "group_id") === false){
        res.json({"type" : 0});
        return;
    }
    users[body.user_id].groups_id.push(group_id);
    insertToFile(users, "users", false);
    createCart(group_id);
    res.json({"type" : 1, "data" :  groups[group_id]});
});
/**
 * Update group users
 * params: group_id, emails (array of emails)
 */
app.post('/groups/update', function (req, res) {
    let body = req.body;

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

    if(!users[body.user_id]){
        res.json({"type" : 0});
        return;
    }
    for(let i =0; i< users[body.user_id].groups_id.length; i++) {
        if (body.group_id == users[body.user_id].groups_id[i]) {
            users[body.user_id].groups_id.splice(i,1);
        }
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
    if(!products){
        res.json({"type" : 0});
        return
    }
    res.json({"type" : 1, "data" : products});
});


/**
 *
 * cart_id, coupon
 */
app.post('/coupons/checkandset', function (req, res) {
    let body = req.body;

    if(!carts[body.cart_id] || !coupons[body.coupon] ){
        return res.json({"type" : 0, "data" : "DB_ERROR"});
    }

    let cart = carts[body.cart_id];
    if(cart.coupon && cart.coupon.product_ID){
        return res.json({"type" : 0, "data" : "CART_HAS_COUPON"});
    }
    cart.coupon = coupons[body.coupon];
    carts[body.cart_id] = cart;
    delete coupons[body.coupon];
    insertToFile(carts, "carts", false);
    insertToFile(coupons, "coupons", false);
    return res.json({"type" : 1, "data" : 1});

});

let createCart = function(group_id){
    for(let id in carts){
        if(carts[id].group_id ==group_id && carts.status == 1){
            return JSON.stringify({"type" : 0, "data" : "OPEN_CART"});
        }
    }

    carts[ids.carts_id] = {"Cart_ID": ids.carts_id, "status" : 1, "cart" : {}, "group_id" : group_id, "coupon" : {}};
    if(!insertToFile(carts, "carts", "carts_id")){
        return JSON.stringify({"type" : 0, "data" : "DB_ERROR"})
    }
    return JSON.stringify({"type" : 1, "data" : carts[ids.carts_id -1]});
}
/**
 * create new cart
 * params: group_id
 */
app.post('/cart/create', function (req, res) {
    let body = req.body;
    for(let id in carts){
        if(carts[id].group_id == body.group_id && carts.status == 1){
            res.json({"type" : 0, "data" : "OPEN_CART"})
        }
    }

    carts[ids.carts_id] = {"Cart_ID": ids.carts_id, "status" : 1, "cart" : {}, "group_id" : body.group_id, "coupon" : {}};
    if(!insertToFile(carts, "carts", "carts_id")){
        res.json({"type" : 0, "data" : "DB_ERROR"})
    }
    res.json({"type" : 1, "data" : carts[ids.carts_id -1]});
});

/**
 * get the cart
 * params: group_id
 */
app.post('/cart/get', function (req, res) {

    let body = req.body;
    if(body.group_id === "undefined"){
        res.json({"type" : 0, "data" : "BODY_ERROR"});
        return;
    }
    let cart = false;
    for(let i in carts ){
        if(carts[i].group_id == body.group_id){
            cart = carts[i];
            break;
        }
    }
    if(cart === false){
        res.json({"type" : 0, "data" : "CART_NOT_FOUND"});
        return;
    }

    let amount = getTotalAmount(cart);
    cart.total_amount = Math.round(amount * 100) / 100;
    let paid = getTotalPaid(cart.Cart_ID, orders);
    cart.total_amount_paid = paid;
    res.json({"type" : 1, "data" : cart});
});

let getTotalAmount = function(cart){
    let amount = 0.0;
    for(let i  in cart.cart){
        amount += parseFloat(cart.cart[i].product.price * cart.cart[i].amount);
    }
    if(cart.coupon && cart.coupon.productName){
        amount -= parseFloat(cart.coupon.price);
    }
    return amount;
}

let getTotalPaid = function(cart_id){
    let paid = 0.0;
    for(let i in orders){
        if(orders[i].cart_id == cart_id){
            paid += parseFloat( orders[i].amount);
        }
    }
    return paid;
}

/**
 * delete product from the cart
 * params: cart_id product_id
 */

app.post('/cart/deleteProduct', function (req, res) {
    let body = req.body;
    if(body.cart_id === "undefined" || body.product_ID === "undefined"){
        res.json({"type" : 0, "data" : "DB_ERROR"});
        return;
    }
    if(carts[body.cart_id] === "undefined" || carts[body.cart_id].cart[body.product_ID] === "undefined"){
        res.json({"type" : 0, "data" : "DB_ERROR"});
        return;
    }
    if(carts[body.cart_id].status === 0){
        res.json({"type" : 0, "data" : "CART_STATUS_INVALID"});
        return
    }
    delete carts[body.cart_id].cart[body.product_ID];
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
    let body = req.body;
    if(body.cart_id  === "undefined" || body.product_id  === "undefined" || body.amount === "undefined" ){
        res.json({"type" : 0, "data" : "DB_ERROR"});
        return;
    }
    if(carts[body.cart_id]  === "undefined"  || products[body.product_id]  === "undefined" ){
        res.json({"type" : 0, "data" : "DB_ERROR"});
        return;
    }
    if(carts[body.cart_id].status === 0){
        res.json({"type" : 0, "data" : "CART_STATUS_INVALID"});
        return
    }
    carts[body.cart_id].cart[body.product_id] = {"product" : products[body.product_id], "amount"  : body.amount};
    if(insertToFile(carts, "carts", false) === false){
        res.json({"type" : 0, "data" : "DB_ERROR"});
        return;
    }
    res.json({"type" : 1, "data" : 1});

});


/**
 * place an order with certain amount
 * params: cart_id, type, payment_data, amount, group_id
 */

app.post('/order/place', function (req, res) {
    let body = req.body;

    if(!body.group_id || !body.type || !body.amount || !body.type){
        res.json({"type" : 0, "data" : "DB_ERROR"});
        return;
    }

    if(carts[body.cart_id] === "undefined"){
        res.json({"type" : 0, "data" : "DB_ERROR"});
        return;
    }
    let paid = getTotalPaid(body.cart_id, orders);
    let total =  getTotalAmount(carts[body.cart_id]);
    if(body.payment_data.partOrFullPayment == "full"){
        body.amount = total - paid;
    } else {
        if(total  - (parseFloat(body.amount) + paid) < 0){
            body.amount = total - paid;
        }
    }
    let order = {"id" : ids.orders_id, "cart_id" : body.cart_id, "type" : body.type, "payment_data": body.payment_data, "amount": body.amount};
    orders[ids.orders_id] = order;
    if(insertToFile(orders, "orders", "orders_id") === false){
        res.json({"type" : 0, "data" : "DB_ERROR"});
        return;
    }

    res.json({"type" : 1, "data" : order});

});

/**
 * cart_id, user_id shipments_data
 */
app.post('/order/close', function (req, res) {
    let body = req.body;

    if(!body.cart_id || !body.user_id || ! body.shipments_data){
        res.json({"type" : 0, "data" : "DB_ERROR"});
        return;
    }

    if(!carts[body.cart_id]){
        res.json({"type" : 0, "data" : "DB_ERROR"});
        return;
    }
    let cart = carts[body.cart_id]
    let paid = getTotalPaid(body.cart_id);
    let total =  getTotalAmount(carts[body.cart_id]);
    if(paid - total != 0){
        return res.json({"type" : 0, "data" : "DB_ERROR"});
    }
    let shipment = {"id" : ids.shipments_id, "users_id" : body.user_id, "cart_data" : cart, "shipments_data" : body.shipments_data};
    shipments[ids.shipments_id] = shipment;
    if(!insertToFile(shipments, "shipments", "shipments_id")){
        res.json({"type" : 0, "data" : "DB_ERROR"});
        return
    }
    createCart(cart.group_id);
    delete carts[body.cart_id];
    if(!insertToFile(carts, "carts", false)){
        res.json({"type" : 0, "data" : "DB_ERROR"});
        return
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
        ids.orders_id = db_data.orders_id;
        ids.shipments_id = db_data.shipments_id;
        carts = JSON.parse(fs.readFileSync("carts").toString());
        orders = JSON.parse(fs.readFileSync("orders").toString());
        coupons = JSON.parse(fs.readFileSync("coupons").toString());
        groups = JSON.parse(fs.readFileSync("groups").toString());
        products = JSON.parse(fs.readFileSync("products").toString());
        users = JSON.parse(fs.readFileSync("users").toString());
        shipments = JSON.parse(fs.readFileSync("shipments").toString());
        return true;
    }
    catch(e){
        return false;
    }

};

let updateDBData = function(){
    let data = {"users_id" : ids.users_id, "group_id" : ids.group_id, "carts_id" : ids.carts_id, "orders_id" : ids.orders_id, "shipments_id" : ids.shipments_id};
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
            updateDBData();
        }
        return true;
    } catch (e) {
        return false;
    }

};


// let getFromFile = function (filename) {
//     try{
//         let data = fs.readFileSync(filename).toString();
//         return JSON.parse(data);
//     } catch(e){
//         return false;
//     }
// };
function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

let server = app.listen(3000, function () {
    let host = server.address().address;
    let port = server.address().port;
    loadDBData();
    console.log("DB listening at http://%s:%s", host, port)
});