function initNavBar()
{
    let navBar = document.getElementById("navBar");
    navBar.innerHTML =  getNav();
    initActivationBar();


}
function initActivationBar()
{
    let urlWithoutVariable = window.location.href.split("?")[0];
    let NavDictionary = JSON.parse(localStorage.getItem('nav_keys'));
    let elementID = NavDictionary[urlWithoutVariable];
    let parentE = document.getElementById("nav" +elementID).parentElement;

    if(parentE)
    {
        parentE.classList.add('active');
    }
}

function getNav()
{
    let element = `<div class="navbar-collapse offcanvas-collapse" id="navbarsExampleDefault" dir="rtl">
        <ul class="navbar-nav navbar-right">
            <li class="nav-item">
                <a class="nav-link" id = "nav1" href="#" onclick = NavButtonOnClick("http://localhost:8081/static/profilePage.html")>
                 <span class="d-none d-md-inline">הפרופיל האישי</span>
                 <span class="d-md-none"><i class="fa fa-address-card"></i></span>
                 </a>
            </li>`;
        if(findGetParameter("group_id") != ''){
        element += ` <li class="nav-item">
                <a class="nav-link" id = "nav2" href="#" onclick = NavButtonOnClick("http://localhost:8081/static/GroupPage.html",this.id)>
                                 <span class="d-none d-md-inline">הקבוצה הנוכחית</span>
                 <span class="d-md-none"><i class="fa fa-group"></i></span>
           
                </a>
            </li>
            <li class="nav-item">
                    <a class="nav-link" id = "nav3" href="#" onclick = NavButtonOnClick("http://localhost:8081/static/My-Cart.html",this.id)>
            <span class="d-none d-md-inline">העגלה שלי</span>
                 <span class="d-md-none"><i class="fa fa-cart-plus"></i></span>
                
             </a>
            </li>
           <li class="nav-item ">
                <a class="nav-link" id = "nav4" href="#" onclick = NavButtonOnClickPaymentPage("http://localhost:8081/static/PaymentMethod.html",this.id)>
                <span class="d-none d-md-inline">תשלום</span>
                 <span class="d-md-none"><i class="fa fa-money"></i></span>
                </a>
            </li>
        </ul>
        `;
        }
        else
        {
            element += `</ul>`
        }
        element += `<ul class="navbar-nav mr-auto">
            <li class="nav-item">
                <a class="nav-link" href="http://localhost:8081/static/login.html" onclick="disconnectFromSite()">התנתקות</a>
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

function NavButtonOnClick(url, elementID = false)
{
    if(elementID){
        window.location.replace(url + location.search);
        localStorage['active-nav'] = elementID;

    } else{
        window.location.replace(url);
    }
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

function NavButtonOnClickPaymentPage()
{
    let finishedBefore = localStorage.getItem('Want_to_Finish_Order');
    if(finishedBefore && finishedBefore ==="Yes")
    {
        let url = "http://localhost:8081/static/closeOrder.html";
        window.location.replace(url + location.search);
    }
    else
    {
        wasCartFullyPaid();
    }
}

function wasCartFullyPaid()
{
    let url = 'http://localhost:8081/Cart/getStatus';
    let data = {"group_id": findGetParameter("group_id")};

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
    }).then(function (data){
        if(data.type == "1") {

            let url = "http://localhost:8081/static/PaymentMethod.html";
            if(data.data)
            {
                let paymentData = data.data;
                if(paymentData.total_amount != 0 && paymentData.total_amount - paymentData.paid <= 0 )
                {
                    localStorage['Want_to_Finish_Order'] = "Yes";
                    url = "http://localhost:8081/static/closeOrder.html";
                    window.location.replace(url + location.search);
                }
                else
                {
                    url = "http://localhost:8081/static/PaymentMethod.html";
                    window.location.replace(url + location.search);
                }
            }


        }
        else{
            illegalOperation(data.url);
            return false;
        }


    });
}
