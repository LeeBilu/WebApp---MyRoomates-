// Creating new Array
let array = [];
let mappingRandToCookieNumber = {};
require("isomorphic-fetch");

let express = require('express');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let app = express();
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set a cookie
app.use(function (req, res, next) {
    // check if client sent cookie
    let cookie = req.cookies;
    let notAValidCookie = false;
    if(cookie != undefined)
    {
        // In case that the user sent a cookie , make sure it is a valid one
        notAValidCookie = !(mappingRandToCookieNumber.hasOwnProperty(cookie.cookieName)) ;
    }

    if (cookie === undefined || notAValidCookie)
    {
        // In case there is no cookie and the user trying to get into an unpermitted place
        if(req.originalUrl === "/static/login.html" || req.originalUrl === "/users/login"||
            req.originalUrl.endsWith(".css")||req.originalUrl.endsWith(".jpg") || req.originalUrl.endsWith(".js") ||
              req.originalUrl === "/static/register.html" || req.originalUrl === "/users/register" || req.originalUrl === "/static/register.html?login=failed")
        {
            next();
            return;
        }
        res.redirect('/static/register.html');
        return;
    }
    else
    {
            let d = new Date();
            if (d.getTime() < mappingRandToCookieNumber[cookie.cookieName].date) {
                let randomNum = Math.random().toString();
                randomNum = randomNum.substring(2, randomNum.length);
                let username = mappingRandToCookieNumber[cookie.cookieName].username;
                let options = {
                    maxAge: 1000 * 60 * 30, // would expire after 30 minutes
                    httpOnly: true, // The cookie only accessible by the web server
                };
                mappingRandToCookieNumber[randomNum] = {"username": username, "date": d.getTime() + options.maxAge};
                res.cookie('cookieName',randomNum, options);
        }
        // else {
            next();
        // }
    }
});


app.use('/static', express.static('../WWW'));

app.post('/users/register', function (req, res) {
    // if(!req.body.user || ! req.body.password || !req.body.name|| !req.body.phone){
    //     return res.send(JSON.stringify({'error': "ERROR", 'approve' : 0}));
    // }
    let url = 'http://localhost:3000/users/register';
    let data = {};
    data.email = req.body.user;
    data.password = req.body.password;
    data.username = req.body.name;
    data.phone = req.body.phone;
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
    }).then(function (data) {
        if(data.type == "1"){
            array = [];
            return res.send(JSON.stringify({'url': "/static/login.html", 'approve' : 1}));
        } else if(!data.type){
            if(data.data =="USER_EXISTS"){
                return res.send(JSON.stringify({'error': "USER_EXISTS", 'approve' : 0}));
            } else {
                return res.send(JSON.stringify({'error': "ERROR", 'approve' : 0}));
            }
        }
    })
});

app.post('/users/login', function (req, res) {
    // if(!req.body.user || !req.body.password){
    //     return res.send(JSON.stringify({'approve' : 0}));
    // }
    let url = 'http://localhost:3000/users/login';
    let data = {};
    data.email = req.body.user;
    data.password = req.body.password;
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
    }).then(function (data) {
        if(data.type == "1"){
            let randomNumber=Math.random().toString();
            randomNumber=randomNumber.substring(2,randomNumber.length);
            let options = {
                maxAge: 1000 * 60 * 30, // would expire after 30 minutes
                httpOnly: true, // The cookie only accessible by the web server
            };
            let d = new Date();
            res.cookie('cookieName',randomNumber, options);
            mappingRandToCookieNumber[randomNumber] = {"username" : data.data.id, "date" : d.getTime()+options.maxAge};
            return res.send(JSON.stringify({'url': "/static/profilePage.html", 'approve' : 1}));
        }else{
            return res.send(JSON.stringify({'approve' : 0}));
        }
    })
});

app.post('/users/newGroup', function (req, res) {
    // if(!req.body.groupName || !Number.isInteger(req.body.groupName)){
    //     res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
    // }
    let groupName = req.body.groupName;
    let data = {};
    let username = mappingRandToCookieNumber[req.cookies.cookieName].username;
    data.name = groupName;
    data.user_id = username;
    let url = 'http://localhost:3000/groups/add';
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
            return res.send(JSON.stringify({'url': ("/static/GroupPage.html?group_id=" + data.data.id)}));
        }else{
            res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
        }
    });

});

app.get('/users/allGroups', function (req, res) {
    let url = 'http://localhost:3000/groups/getall';
    let username = mappingRandToCookieNumber[req.cookies.cookieName].username;
    let data = {"user_id": username};
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
        if(data.type){
            return res.send(JSON.stringify({"type" : 1 ,'data': data.data}));
        }else{
            res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
        }
    });

});

function groupPermission(group_id, username){
    let url = 'http://localhost:3000/users/user';
    let data = {"id": username};
    return fetch(url,
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
            for(let i = 0; i < data.data.groups_id.length; i++){

                if(data.data.groups_id[i] == group_id){

                    return true;
                }
            }
            return false;
        }
        return false;

    });
}

app.post('/users/groupPage', function (req, res) {
    // if(!req.body.groupNum || !Number.isInteger(req.body.groupNum)){
    //     res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
    // }
    let group_id = req.body.groupNum;
    let username = mappingRandToCookieNumber[req.cookies.cookieName].username;
    let data = {};
    data.group_id = group_id;
    // let url = 'http://localhost:3000/groups/get';
    // fetch(url,
    //     {
    //         credentials: "same-origin",
    //         method: "POST",
    //         body: JSON.stringify(data),
    //         headers: {
    //             "Content-Type": "application/json"
    //         }
    //     })
    //     .then(function (response) {
    //     return response.json();
    // }).then(function (data) {
    //     if(data.type == "1"){
           return groupPermission(group_id, username)
    .then(function (data) {
        if(data){
            res.send(JSON.stringify({"type" : 1, 'url': ("/static/GroupPage.html?group_id=" + group_id)}));
        }else{
            res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
        }
    });


});

app.get('/users/myDetails', function (req, res) {
    let url = 'http://localhost:3000/users/user';
    let username = mappingRandToCookieNumber[req.cookies.cookieName].username;
    let data = {"id": username};
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
            return res.send(JSON.stringify({"type" : 1 ,"data":data.data}));
        }else{
            return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
        }
    });
});

app.post('/group/allMembers', function (req, res) {
    // if(!req.body.group_id || !Number.isInteger(req.body.group_id)){
    //     return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
    // }
    let url = 'http://localhost:3000/groups/get';
    let data = {"group_id": req.body.group_id};
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
            return res.send(JSON.stringify({"type" : 1 ,"data":data.data}));
        }else{
            return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
        }
    });

});

app.post('/group/newMember', function (req, res) {
    // if(!req.body.group_id || !req.body.email || !Number.isInteger(req.body.group_id)){
    //     return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
    // }
    let group_id = req.body.group_id;
    let emails = [];
    emails.push(req.body.email);
    let data = {};
    data.group_id = group_id;
    data.emails = emails;
    let url = 'http://localhost:3000/groups/update';
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
    }).then(function (data) {
        if(data.type == "1"){

            return res.send(JSON.stringify({"type" : 1}));
        }else{
            return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
        }
    });

});

app.post('/group/leftGroup', function (req, res) {
    // if(!req.body.group_id || !Number.isInteger(req.body.group_id) ){
    //     return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
    // }
    let group_id = req.body.group_id;
    let username = mappingRandToCookieNumber[req.cookies.cookieName].username;
    let data = {};
    data.group_id = group_id;
    data.user_id = username;
    let url = 'http://localhost:3000/groups/remove';
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
    }).then(function (data) {
        if(data.type == "1"){

            return res.send(JSON.stringify({"type" : 1, 'url': ("/static/profilePage.html")}));
        }else{
            return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
        }
    });

});



app.post('/Cart/cartPage', function (req, res) {
    // if(! req.body.groupNum  || !Number.isInteger(req.body.groupNum)){
    //     return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
    // }
    let group_id = req.body.groupNum;
    let username = mappingRandToCookieNumber[req.cookies.cookieName].username;
    let data = {};
    data.group_id = group_id;
    return groupPermission(group_id, username)
        .then(function (data) {
            if(data){
               return res.send(JSON.stringify({"type" : 1, 'url': ("/static/My-Cart.html?group_id=" + group_id)}));
            }else{
                return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
            }
        });
});

app.post('/Cart/paymentPage', function (req, res) {
    // if(!req.body.groupNum  || !Number.isInteger(req.body.groupNum)){
    //     return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
    // }
    let group_id = req.body.groupNum;
    let username = mappingRandToCookieNumber[req.cookies.cookieName].username;
    let data = {};
    data.group_id = group_id;
    return groupPermission(group_id, username)
        .then(function (data) {
            if(data){
                return res.send(JSON.stringify({"type" : 1, 'url': ("/static/PaymentMethod.html?group_id=" + group_id)}));
            }else{
                return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
            }
        });
});


app.post('/Cart/closeOrderPage', function (req, res) {
    // if(!req.body.groupNum || !Number.isInteger(req.body.groupNum)){
    //     return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
    // }
    let group_id = req.body.groupNum;
    let username = mappingRandToCookieNumber[req.cookies.cookieName].username;
    let data = {};
    data.group_id = group_id;
    return groupPermission(group_id, username)
        .then(function (data) {
            if(data){
                return res.send(JSON.stringify({"type" : 1, 'url': ("/static/closeOrder.html?group_id=" + group_id)}));
            }else{
                return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
            }
        });
});

app.post('/Cart/finishPage', function (req, res) {
    // if(!req.body.groupNum  || !Number.isInteger(req.body.groupNum)){
    //     return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
    // }
    let group_id = req.body.groupNum;
    let username = mappingRandToCookieNumber[req.cookies.cookieName].username;
    let data = {};
    data.group_id = group_id;
    console.log(data.group_id);
    return groupPermission(group_id, username)
        .then(function (data) {
            if(data){
                return res.send(JSON.stringify({"type" : 1, 'url': ("/static/finishPage.html?group_id=" + group_id)}));
            }else{
               return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
            }
        });
});


app.post('/Cart/LoadProductsListAndPrices', function (req, res) {
    let url = 'http://localhost:3000/products/get';
    fetch(url,
        {
            credentials: "same-origin",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })  .then(function (response) {
        return response.json();
    }).then(function (data) {
        if(data.type){
            return res.send({"type" : 1, "Product_List" : data.data});
        } else{
            return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
        }
    });

});

app.post('/Cart/RequestCart', function (req, res) {
    // if(!req.body.group_id || !Number.isInteger(req.body.group_id)){
    //     res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
    //     return;
    // }
    let data = {group_id : req.body.group_id}
    let url = 'http://localhost:3000/cart/get';
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
        if(data.type){
            return res.send({"type" : 1, "order" : data.data});
        } else{
            return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
        }
    });

});

app.post('/Cart/DeleteProduct', function (req, res) {
    // if(!req.body.product_ID  || !req.body.cart_id || !Number.isInteger(req.body.cart_id)|| !Number.isInteger(req.body.product_ID)){
    //     res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
    //     return;
    // }

    let url = 'http://localhost:3000/Cart/deleteProduct';
    fetch(url,
        {
            credentials: "same-origin",
            method: "POST",
            body: JSON.stringify(req.body),
            headers: {
                "Content-Type": "application/json"
            }
        })  .then(function (response) {
        return response.json();
    }).then(function (data) {
        if(data.type){
            return res.send({"type" : 1});
        } else{
            return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
        }
    });

});


app.post('/Cart/AddProduct', function (req, res) {
    // if(!req.body.product_id || !req.body.amount ||!req.body.cart_id||
    //     !Number.isInteger(req.body.cart_id) || !Number.isInteger(req.body.product_id) || !Number.isInteger(req.body.amount)||
    //     req.body.amount < 0 ){
    //     res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
    //     return;
    // }

    let url = 'http://localhost:3000/Cart/editProduct';
    fetch(url,
        {
            credentials: "same-origin",
            method: "POST",
            body: JSON.stringify(req.body),
            headers: {
                "Content-Type": "application/json"
            }
        })  .then(function (response) {
        return response.json();
        }).then(function (data) {
        if(data.type){
            return res.send({"type" : 1});
        } else{
            return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
        }
    });

});

let validatePayment = function(data){
    if(!data.firstName || !data.lastName || !data.email || !data.partOrFullPayment || !data.group_id||
    !Number.isInteger(data.group_id)){
        return false;
    }
    if(!data.group_id || !data.cart_id || !data.AmountOfMoney || !data.paymentMethod||
        !Number.isInteger(data.AmountOfMoney) || data.AmountOfMoney < 0)
        return false;

    if(data.paymentMethod === "credit"){
        if(!data.OwnerID || !data.VisaNumber || !data.cc_cvv||!data.monthOfExpiration){
            return false;
        }
    }

    return true;


};


app.post('/Cart/RequestToPay', function (req, res) {
    // if(!validatePayment(req.body)){
    //     res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
    //     return;
    // }

    let paymant_data ={
        "firstName" : req.body.firstName,
        "lastName" : req.body.lastName,
        "email" : req.body.email,
        "partOrFullPayment" : req.body.partOrFullPayment
    };
    if(req.body.paymentMethod === "credit"){

        paymant_data.OwnerID = req.body.OwnerID,
        paymant_data.VisaNumber = req.body.VisaNumber,
        paymant_data.VisaOwner = req.body.VisaOwner,
        paymant_data.cc_cvv = req.body.cc_cvv,
        paymant_data.monthOfExpiration = req.body.monthOfExpiration

    }
    let group_id = req.body.group_id;
    let data = {
        "group_id" : group_id,
        "cart_id" : req.body.cart_id,
        "amount" : req.body.AmountOfMoney,
        "type" : req.body.paymentMethod,
        "payment_data" : paymant_data,
        "user_id" : mappingRandToCookieNumber[req.cookies.cookieName].username

    };
    let url = 'http://localhost:3000/order/place';
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
        if(data.type){
            if(Math.floor(data.remainToPay) == 0){
                return res.send({"type" : 1, "url" : "/static/closeOrder.html?group_id=" + group_id});
            }
            return res.send({"type" : 1, "url" : "/static/PaymentMethod.html?group_id=" + group_id});
        } else{
            return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
        }
    });

});

app.post('/users/editProfileDetails', function (req, res) {
    let url = 'http://localhost:3000/users/edit';
    let body = req.body;
    let data = {};
    let username = mappingRandToCookieNumber[req.cookies.cookieName].username;
    data.user_id = username;
    if(typeof(body.email) !== "undefined"){
       data.email = body.email;
    }if(typeof(body.fullname) !== "undefined"){
        data.fullname = body.fullname;
    }if(typeof(body.phone) !== "undefined"){
        data.phone = body.phone;
    }

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
        if(data.type){
            return res.send({"type" : 1, "url" : "/static/profilePage.html"});
        } else{
            return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
        }
    });

});

let validateCloseOrder = function(data){
    if(!data.group_id || !Number.isInteger(data.group_id) || !data.cart_id || !Number.isInteger(data.cart_id)||
    !data.city || ! data.street || ! data.numOfHouse || ! data.phone) {
        return false;
    }

    return true;
};

app.post('/Cart/Close', function (req, res) {
    // if(!validateCloseOrder(req.body)){
    //     return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
    // }
    let url = 'http://localhost:3000/order/close';
    let body = req.body;
    let username = mappingRandToCookieNumber[req.cookies.cookieName].username;
    let data = {};
    //TODO: Validation.
    let group_id = body.group_id;
    data.group_id = group_id;
    data.user_id = username;
    data.cart_id =body.cart_id;
    data.shipments_data = {};
    data.shipments_data.city = body.city;
    data.shipments_data.street = body.street;
    data.shipments_data.numOfHouse = body.numOfHouse;
    data.shipments_data.phone = body.phone;
    if(typeof(body.enter) !== "undefined"){
        data.shipments_data.enter = body.enter;
    } if(typeof(body.floor) !== "undefined"){
        data.shipments_data.floor = body.floor;
    }

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
        if(data.type){

            return res.send(JSON.stringify({"type" : 1, "url":"http://localhost:8081/static/finishPage.html?group_id=" + group_id}));
        } else{
            return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
        }
    });

});
app.post('/Cart/RequestForCoupon', function (req, res) {
    let url = 'http://localhost:3000/coupons/checkandset';
    let body = req.body;
    // if(!body.Cart_ID || !Number.isInteger(body.Cart_ID) || ! body.Coupon_ID || !Number.isInteger(body.Coupon_ID)){
    //     return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
    // }
    let data = {};
    data.cart_id = body.Cart_ID;
    data.coupon = body.Coupon_ID;

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
        if(data.type){
            return res.send({"type" : 1, "data" : 1});
        } else{
            return res.send(JSON.stringify({"type" : 0 ,'url': ("/static/profilePage.html")}));
        }
    });

});

app.post('/users/logout/', function (req, res) {
    res.clearCookie("cookieName");
    res.end();
});

app.post('/group/getNotifications', function (req, res) {
    let url = 'http://localhost:3000/groups/notifications';
    let body = req.body;
    // if(!body.group_id || !Number.isInteger(body.group_id)){
    //     return res.json({"type" : 0, "data" : "GROUP_ID"});
    // }
    let data = {"group_id" : body.group_id};
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
        if(data.type){
            return res.send({"type" : 1, "data" : data.data});
        } else{
            return res.json({"type" : 0, "data" : "DB_ERROR"});
        }
    });
});



let server = app.listen(8081, function () {
    let host = server.address().address;
    let port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
});
