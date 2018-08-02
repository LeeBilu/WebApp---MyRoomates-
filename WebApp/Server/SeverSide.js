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
        //In case there is no cookie and the user trying to get into an unpermitted place
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

app.use('/static', express.static('WWW'));

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
            return res.send(JSON.stringify({'url': "/static/GroupPage.html"}));
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
            return res.send(JSON.stringify({'url': "/static/GroupPage.html"}));
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

app.get('/group/allMembers', function (req, res) {
    let url = 'http://localhost:3000/groups/get';
    let data = {"group_id": 1};
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
    let group_id = 1;
    let emails = [];
    emails.push(req.body.email);
    console.log(emails);
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
        })  .then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
        if(data.type == "1"){
            return res.end();
        }
    });

});


let server = app.listen(8081, function () {
    let host = server.address().address
    let port = server.address().port

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



