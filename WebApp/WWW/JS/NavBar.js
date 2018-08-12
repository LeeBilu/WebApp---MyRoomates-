function initNavBar()
{
    let navBar = document.getElementById("navBar");
    navBar.innerHTML =  getNav();
}

function getNav()
{
    element =
    `<div class="navbar-collapse offcanvas-collapse" id="navbarsExampleDefault" dir="rtl">
        <ul class="navbar-nav navbar-right">
            <li class="nav-item">
                <a class="nav-link" href="#" onclick = NavButtonOnClick("http://localhost:8081/static/profilePage.html", this)> הפרופיל האישי </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick = NavButtonOnClick("http://localhost:8081/static/GroupPage.html", this)>הקבוצה הנוכחית</a>
            </li>
            <li class="nav-item active">
                <a class="nav-link" href="#" onclick = NavButtonOnClick("http://localhost:8081/static/My-Cart.html", this)>העגלה שלי</a>
            </li>
           <li class="nav-item ">
                <a class="nav-link" href="#" onclick = NavButtonOnClick("http://localhost:8081/static/PaymentMethod.html", this)>תשלום</a>
            </li>
        </ul>
        <ul class="navbar-nav mr-auto">
            <li class="nav-item">
                <a class="nav-link" href="http://localhost:8081/static/login.html" onclick="disconnectFromSite()">התנתקות</a>
            </li>
            <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#"
            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">הגדרות</a>
            </li>
        <li>
            <div class="dropdown-menu" aria-labelledby="dropdown01">
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
                <a class="dropdown-item" href="#">Something else here</a>
            </div>
        </li>
    </ul>
  
    </div>`;

    return element;
}

function disconnectFromSite() {

    let url = 'http://localhost:8081/users/logout/';
        fetch(url,
            {
                redirect: 'follow',
                credentials: "same-origin",
                method: "POST",
                headers: { 'Content-Type': 'application/json' }

            })
            .then(function (response) {

                if(response.redirected)
                {
                    window.location.replace(response.url);
                }
                return response.json();
            })
            .then(function (myJson) {
                if(myJson.type = 1)
                {
                    if(myJson.data.url)
                    {
                        window.location.replace(myJson.data.url);
                    }
                }
            })
            .catch(function (err) {
                console.log(err.toString());
            })
}

function NavButtonOnClick(url, this)
{
    window.location.replace(url + location.search);
    this.getParent().addClass('active');
}

function findGetParameter(parameterName) {
    let result = "",
        tmp = [];
    let items = location.search.substr(1).split("&");
    for (let index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName)
        {
            result = tmp[1];
        }
    }
    return result;
}