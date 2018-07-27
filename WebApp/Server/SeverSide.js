// Creating new Array
let array = [];
let usersAndPasswords =[];
let userData = {};
let mappingRandToCookieNumber = {};

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
    console.log(req.cookies);
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
        console.log('cookie exists', cookie);
        let user = mappingRandToCookieNumber[cookie];
        if(user != null)
        {
            console.log("user was read from table")
            console.log("the user name is : " + user);
            //sync with writing
            array = loadUserIdeasByName(user);
            if(array === undefined)
            {
                console.log("here");
                array = [];
            }
            next();
            updateUserIdeasByName(user);
            userData[user] = array ;
            //sync with writing
            updateUserFile(user);


        }
        else {
            console.log("user not found in system");
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
    console.log("body" + req.body );
    console.log("new value is" + newValue);
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

    console.log("starting registeration");
    console.log(JSON.stringify(req.body, null, 2));
    //TODO CHANGE 'A' TO THE USER LOGIN NAME
    console.log("This cookie name " +req.cookies.cookieName);
    let name = req.body.user;
    console.log("name is" + name);
    array = [];
    RegisterNewUserToFileSystem(req.body);
    updateUserFile(name);
    res.json({approve :0});
})

app.post('/users/login', function (req, res) {

    console.log("try to logIn");
    console.log("this is the login body" ,JSON.stringify(req.body, null, 2));
    let approval = ValidateUser(req.body);
    if(approval == 0)
    {
        let randomNumber=Math.random().toString();
        randomNumber=randomNumber.substring(2,randomNumber.length);
        let options = {
            maxAge: 1000 * 60 * 30, // would expire after 30 minutes
            httpOnly: true, // The cookie only accessible by the web server
        }

        res.cookie('cookieName',randomNumber, options);
        console.log("---------------------------------------");
        mappingRandToCookieNumber[randomNumber] = req.body.user;
        console.log("Random number" + randomNumber)
        console.log(mappingRandToCookieNumber[randomNumber]);
        console.log('cookie created successfully');
    }
    console.log("approval is" + approval);
    res.status(302);
    res.json({approve :approval});
})


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
        console.log("write new user to file");
       let data = JSON.stringify(userData);
       console.log("data variable" +  data);
        usersAndPasswords.push(data);
        let dataToSave = JSON.stringify(usersAndPasswords);
        console.log("trying to save" + dataToSave);
        fs.writeFile("output.json", dataToSave, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while register new user to the system.");
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

        console.log("Current user is " + currentUser);
        let obj = currentUser;
        console.log(currentUser.name + " is my name")
        if(IsJsonString(currentUser) == false)
        {
            console.log("not a json");
            obj = JSON.parse(currentUser);
        }

        console.log("obj is " +obj);
        if(obj.user === UserLogin.user && obj.password === UserLogin.password)
        {

            console.log("here");
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
        console.log("here");
        fs.readFile("output.json", function (err, data) {
            if (err) {
                console.log("An error occured while writing JSON Object to File");
                return;
            }
            else {
                try {
                    let dataFromFile = JSON.parse(data);
                    usersAndPasswords = dataFromFile;
                    /*let dataFormFile = JSON.parse(data);
                    usersAndPasswords.push(dataFormFile);*/
                    console.log(usersAndPasswords);
                }
                catch (err) {
                    console.log('ofir');
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
        console.log(indexOfProperty);
        console.log(array.length);

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
        console.log(array.toString());
        return 0;
    }

    return 1;
}

function IsJsonString(str) {


    return str instanceof Object;

}

function loadIdeaDataFromFile()
{

        console.log("begin to load idea data file");
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
                        console.log("data read from server");
                    }
                    catch(err)
                    {
                        // //try
                        // userData = data;
                        // console.log("can't parse user idea file to JSON format")
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
        console.log(array);
        if(array === undefined)
        {
            array = [];
        }
        userData[user] = array;
        console.log("userData is ", userData);
        let dataToSave = JSON.stringify(userData);
        console.log("data users in stringify mode", dataToSave);
        fs.writeFile("Userdata.json", dataToSave, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing the user idea array into the system");
                return console.log(err);
            }

            console.log("User idea was saved sucssesfully");
        });


}



