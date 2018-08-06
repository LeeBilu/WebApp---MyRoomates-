// Creating new Array
let array = [];
let usersAndPasswords =[];
let userData = {};
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
    loadIdeaDataFromFile();
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
              req.originalUrl === "/static/register.html" || req.originalUrl === "/users/register")
        {

            next();
            return;
        }
        res.redirect('/static/register.html');
        return;
    }
    else
    {
        loadIdeaDataFromFile();
        // yes, cookie was already presented
        let cookie = req.cookies.cookieName;
        let user = mappingRandToCookieNumber[cookie];
        if(user != null)
        {

            //sync with writing
            array = loadUserIdeasByName(user);
            if(array === undefined)
            {
                array = [];
            }
            next();
            updateUserIdeasByName(user);
            userData[user] = array ;
            //sync with writing
            updateUserFile(user);


        }
        else {
            next();
        }
    }
});

app.use('/static', express.static('../WWW'));

app.get('/ideas', function (req, res) {

    createNewCookie(req, res);
    res.json(array);

})

app.put('/idea', function (req, res) {

    let newValue = req.body.addTextID;
    let responseFromAdditionFunc = addObjectAttribute(array, newValue);
    res.json({ideaIndex: responseFromAdditionFunc});
})

app.post('/idea/:id', function (req, res) {

    let id = req.param('id');
    let newValue = req.body.newValue;
    let responseValue = updateAnIdea(array, id, newValue);
    res.json({approve :responseValue});
})


app.delete('/idea/:id', function (req, res) {

    let id = req.param('id');
    let responseValue = deleteAnIdea(array,id);
    res.json({approve :responseValue});
})

//Ex2

app.post('/users/register', function (req, res) {

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
    //TODO CHANGE 'A' TO THE USER LOGIN NAME
})

app.post('/users/login', function (req, res) {
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
            }

            res.cookie('cookieName',randomNumber, options);
            mappingRandToCookieNumber[randomNumber] = req.body.user;
            return res.send(JSON.stringify({'url': "/static/profilePage.html", 'approve' : 1}));
        }else{
            return res.send(JSON.stringify({'approve' : 0}));
        }
    })
})

app.post('/users/newGroup', function (req, res) {
    let groupName = req.body.groupName;
    let data = {};
    data.name = groupName;
    data.user_id = 1;
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
        }
    });

});

app.get('/users/allGroups', function (req, res) {
    let url = 'http://localhost:3000/groups/getall';
    let data = {"user_id": 1};
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
            return res.send(data.data);
        }
    });

});

app.post('/users/groupPage', function (req, res) {
    let group_id = req.body.groupNum;
    let data = {};
    data.group_id = group_id;
    console.log(group_id);
    let url = 'http://localhost:3000/groups/get';
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
            return res.send(JSON.stringify({'url': "/static/GroupPage.html?group_id=" + group_id}));
        }
    });

});

app.get('/users/myDetails', function (req, res) {
    let url = 'http://localhost:3000/users/user';
    let data = {"id": 1};
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
            return res.send(data.data);
        }
    });
});

app.post('/group/allMembers', function (req, res) {
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

            return res.send(data.data);
        }
    });

});

app.post('/group/newMember', function (req, res) {
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

            return res.end();
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
            return res.json({"type" : 0});
        }
    });

});

app.post('/Cart/RequestCart', function (req, res) {
    if(req.body.group_id === "undefined"){
        res.json({"type" : 0});
        return;
    }

    let url = 'http://localhost:3000/cart/get';
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
            return res.send({"type" : 1, "order" : data.data});
        } else{
            return res.json({"type" : 0});
        }
    });

});

app.post('/Cart/DeleteProduct', function (req, res) {
    if(req.body.product_ID === "undefined"  || req.body.cart_id === "undefined"){
        res.json({"type" : 0});
        return;
    }

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
            return res.json({"type" : 0});
        }
    });

});


app.post('/Cart/AddProduct', function (req, res) {
    if(req.body.product_id === "undefined"  || req.body.amount  === "undefined"|| req.body.cart_id === "undefined"){
        res.json({"type" : 0});
        return;
    }

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
            return res.json({"type" : 0});
        }
    });

});


app.post('/Cart/RequestToPay', function (req, res) {

    if(req.body.product_id === "undefined"  || req.body.amount  === "undefined"|| req.body.cart_id === "undefined"){
        res.json({"type" : 0});
        return;
    }
    let paymant_data ={
        "firstName" : req.body.firstName,
        "lastName" : req.body.lastName,
        "email" : req.body.email,
        "partOrFullPayment" : req.body.partOrFullPayment
    };
    if(req.body.paymentMethod === "credit"){
        paymant_data.VisaNumber = req.body.VisaNumber,
        paymant_data.VisaOwner = req.body.VisaOwner,
        paymant_data.cc_cvv = req.body.cc_cvv,
        paymant_data.monthOfExpiration = req.body.monthOfExpiration

    }
    let data = {
        "cart_id" : req.body.cart_id,
        "amount" : req.body.AmountOfMoney,
        "type" : req.body.paymentMethod,
        "payment_data" : paymant_data

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
            return res.send({"type" : 1});
        } else{
            return res.json({"type" : 0});
        }
    });

});

app.post('/users/editProfileDetails', function (req, res) {
    let url = 'http://localhost:3000/users/edit';
    let body = req.body;
    let data = {};
    data.user_id = 1;
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
            return res.json({"type" : 0});
        }
    });

});


let server = app.listen(8081, function () {
    let host = server.address().address;
    let port = server.address().port;

    UpdateUserFromFile();
    console.log("Example app listening at http://%s:%s", host, port)
})




function RegisterNewUserToFileSystem(userData)
{
    try{

        //TODO ADD NEW INFORMATION TO USERDATA
        const fs = require('fs');

       let data = JSON.stringify(userData);

        usersAndPasswords.push(data);
        let dataToSave = JSON.stringify(usersAndPasswords);

        fs.writeFile("output.json", dataToSave, 'utf8', function (err) {
            if (err) {

                console.log(err);
            }

            console.log("User dataBase file has been saved.");
        });
    }
    catch(err)
    {
        console.log("Problem with writing new user in the system");
    }

}

function ValidateUser(UserLogin)
{
    let returnVal = 1;
    usersAndPasswords.forEach(function(currentUser) {


        let obj = currentUser;
        if(IsJsonString(currentUser) == false)
        {
            obj = JSON.parse(currentUser);
        }

        if(obj.user === UserLogin.user && obj.password === UserLogin.password)
        {

            returnVal = 0;
        }

    });
    return  returnVal;
}


function createNewCookie(req, res)
{

    let cookie = req.cookies.cookieName;
    let user = mappingRandToCookieNumber[cookie];
    let randomNumber=Math.random().toString();
    randomNumber=randomNumber.substring(2,randomNumber.length);
    let options = {
        maxAge: 1000 * 60 * 30, // would expire after 30 minutes
        httpOnly: true, // The cookie only accessible by the web server
    }

    mappingRandToCookieNumber[randomNumber] = user;
    res.cookie('cookieName',randomNumber, options);
}

//TODO
function UpdateUserFromFile()
{
        const fs = require('fs');
        fs.readFile("output.json", function (err, data) {
            if (err) {
                return;
            }
            else {
                try {
                    let dataFromFile = JSON.parse(data);
                    usersAndPasswords = dataFromFile;
                    /*let dataFormFile = JSON.parse(data);
                    usersAndPasswords.push(dataFormFile);*/
                }
                catch (err) {
                }


            }
        });
}

function addObjectAttribute(array, value)
{
    try{
        array.push(value);
        return (array.length - 1)
    }
    catch(err)
    {
        return -1;
    }

}

function updateAnIdea(array, indexOfProperty, newValue)
{
    if(indexOfProperty >= 0 && indexOfProperty <= array.length)
    {

        array[indexOfProperty] = newValue;
        return 0;
    }

    return 1;
}

function deleteAnIdea(array, indexOfProperty)
{

    if( indexOfProperty >=0 && indexOfProperty < array.length)
    {
        array.splice(indexOfProperty,1);
        return 0;
    }

    return 1;
}

function IsJsonString(str) {


    return str instanceof Object;

}

function loadIdeaDataFromFile()
{

        const fs = require('fs');
        fs.exists("Userdata.json", function(exists) {
        if (exists) {

            fs.readFile("Userdata.json", (err, data) => {
                if (err) {
                    console.log("An error occured while trying to read users idea file");
                }
                else {

                    //   let dataFormFile = JSON.parse(data);
                    //userData = data;
                    try{

                        userData = JSON.parse(data);
                    }
                    catch(err)
                    {
                        // //try
                        // userData = data;
                    }
                }


            });


            // Do something
        }
        else
        {
            console.log('file does not exists');
        }
        });



}

function loadUserIdeasByName(id)
{
    loadIdeaDataFromFile();
    return userData[id];
}

function updateUserIdeasByName(id)
{
    array = userData[id];
}

function updateUserFile(user)
{
        const fs = require('fs');
        if(array === undefined)
        {
            array = [];
        }
        userData[user] = array;
        let dataToSave = JSON.stringify(userData);
        fs.writeFile("Userdata.json", dataToSave, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }

        });


}



