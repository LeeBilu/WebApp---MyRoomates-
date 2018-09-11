function initPage()
{
    groupPermission();

}

function onLoadingPage() {

    LoadProductsListAndPrices();
    RequestCart();
}

function LoadProductsListAndPrices()
{
 let url = 'http://localhost:8081/Cart/LoadProductsListAndPrices';
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
        if(data.type == '1'){

            BuildProductListFromJson(data);
        }else {
            illegalOperation(data.url);
        }
    });
}


function BuildProductListFromJson(jsonFile)
{
    let Products = jsonFile.Product_List;
    let Products_list = document.getElementById("list_Of_Products");
    //firstObject.innerHTML ="";
    let newElement="";
    for(let i in Products)
    {
        let product = Products[i];
        let productDescription = product.description.trim();

        newElement +=
    `<div class="Product">
        <li class="list-group-item d-flex justify-content-between lh-condensed list-item-css ">
            <div class="text-right div col-md-6  order-md-1 mb-0">
                <h6 class="my-0">${product.productName}</h6>
                <small class="text-muted" >${productDescription}</small>
            </div>
            <div class="addingToCartOption_div col-md-4 order-md-1 mb-0">
                <small class="text-muted">
                <button class="btn btn-primary btn-sm cart_buttons" onclick="onChoosingProduct(this,'quantity_div')" >להוספה לסל</button></small>
            </div>
            <div class="quantity_div col-md-4 order-md-1 mb-0">
                <small class="text-muted">
                <input type="number small" placeholder="כמות" class="quantity_input" maxlength="4" size="4">
                <button class="btn btn-primary btn-sm cart_buttons" onclick="onApprovingProduct(this,'addingToCartOption_div',${product.product_ID})" > לאישור</button>
                <button class="btn btn-danger btn-sm cart_buttons" onclick="onCancelingProduct(this,'addingToCartOption_div')" > לביטול</button></small>
            </div>  
            <span class="text-muted div col-md-3 order-md-1 mb-0">${product.price} &#8362</span>
        </li>
    </div>`
    }
    Products_list.innerHTML = newElement;
}

function searchInProductList() {
    // Declare variables
    let input, filter, product_list, products_Divs,  i;
    input = document.getElementById("InputOfTheSearchBox");
    filter = input.value.toUpperCase();
    product_list = document.getElementById("list_Of_Products");
    products_Divs = product_list.getElementsByClassName("Product");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < products_Divs.length; i++) {

        let product_Name = products_Divs[i].getElementsByTagName("h6")[0].textContent;
        let product_Description = products_Divs[i].getElementsByTagName("small")[0].textContent;
        if ((product_Name.toUpperCase().indexOf(filter) > -1) || (product_Description.toUpperCase().indexOf(filter) > -1)) {
            products_Divs[i].style.display = "";
            } else {
            products_Divs[i].style.display = "none";
            }
    }
}

function onChoosingProduct(button, DivToDisplay)
{
    replacingBetweenVisbleDivs(button, DivToDisplay);
}

function onApprovingProduct(button, DivToDisplay, Product_ID )
{
    replacingBetweenVisbleDivs(button, DivToDisplay);
    let quantity = button.parentElement.getElementsByClassName("quantity_input")[0].value;
    addNewProductToCart(Product_ID, quantity);
}

function onCancelingProduct(button, DivToDisplay)
{
    replacingBetweenVisbleDivs(button, DivToDisplay);
}

function replacingBetweenVisbleDivs(button, DivToDisplay)
{
    button.parentElement.parentElement.style.display = "none";
    let b_parent = button.parentElement.parentElement.parentElement;
    let quantity_div = b_parent.getElementsByClassName(DivToDisplay);
    quantity_div[0].style.display = "inline";
}

function addNewProductToCart(Product_ID, quantity)
{
     if(isNaN(quantity) == false && isNaN(Product_ID) == false  && Number.parseInt(quantity) > 0)
     {
         let cart_ID = document.getElementById("Cart_ID").value;

         let url = 'http://localhost:8081/Cart/AddProduct';
         let data = {
             "product_id": Product_ID,
             "amount" : quantity,
             "cart_id" :cart_ID
         };

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
                 RequestCart();
                 localStorage['Want_to_Finish_Order'] = "No";
             } else{
                 illegalOperation(data.url)
             }
         });

     }

}
function groupPermission(){
    let url = 'http://localhost:8081/Cart/cartPage';
    let data = {"groupNum": findGetParameter("group_id")};
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
            initNavBar();
            LoadProductsListAndPrices();
            RequestCart()
            return;
        }else{
           illegalOperation(data.url);

        }
    });
}
