function validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid =  re.test(String(email).toLowerCase());
    return isValid;
}

function validatePhone(phone) {
    let isnum = /^\d+$/;
    if(phone.length != 10 || phone.substring(0,2) != "05" ||  !isnum.test(phone)){
        return false;
    }
    return true;
}

function validateVisaNumber(number)
{

    let isnum = /^\d+$/;
    let valid =  isnum.test(number);
    return valid;
}

function validateIDNumber(number)
{
    let isnum = /^\d+$/;
    return isnum.test(number)
}

function validateCCV(number)
{
    let isnum = /^\d+$/;
    return isnum.test(number)
}

function illegalOperation(url){
    alert("הפעולה איננה חוקית");
    window.location.replace(url);
}