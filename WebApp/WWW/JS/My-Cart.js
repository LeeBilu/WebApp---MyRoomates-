function onLoadingPage() {

    LoadProductsListAndPrices();
    RequestCart();
}

function LoadProductsListAndPrices()
{
// let url = 'http://localhost:8081/RequestForProductListAndPrices/';
    // fetch(url,
    //     {
    //         redirect: 'follow',
    //         credentials: "same-origin",
    //         method: "POST",
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({
    //             "Coupon" : coupon.value,
    //               "Cart_id": cart.id

    //
    //         })})
    //     .then(function (response) {
    //
    //         if(response.redirected)
    //         {
    //             window.location.replace(response.url);
    //         }
    //         console.log("success");
    //         return response.json();
    //     })
    //     .then(function (myJson) {
    //
    //         if(myJson.approve != 1)
    //         {
    //             RequestNewCartList();
    //         }
    //         else
    //         {
    //             console.log('Not a valid coupon');
    //         }
    //     })
    //     .catch(function (err) {
    //         console.log(err.toString());
    //     })


    BuildProductListFromJson(ExampleForProductArray);
}
ExampleForProductArray = {
     "Product_List": {
        "0":
            {
                "product":
                    {
                        "productID" : "1",
                        "productName": "מלפפון",
                        "price": "5",
                        "description": "מה שבילו אוהב"

                    }
            },
        "1":
            {
                "product":
                    {
                        "productName": "עגבנייה",
                        "price": "4.80",
                        "description": "מה שדניאל אוהבת"

                    }
            },
         "2":
             {
                 "product":
                     {
                         "productName": "תפוא",
                         "price": "5.80",
                         "description": "מה שדניאל אוהבת"

                     }
             },
         "3":
             {
                 "product":
                     {
                         "productName": "חציל",
                         "price": "4.80",
                         "description": "מה שדניאל אוהבת"

                     }
             },
         "4":
             {
                 "product":
                     {
                         "productName": "מלפפון",
                         "price": "4.80",
                         "description": "מה שדניאל אוהבת"

                     }
             }
    }
};

function BuildProductListFromJson(jsonFile)
{
    let Products = jsonFile.Product_List;
    let Products_list = document.getElementById("list_Of_Products");
    //firstObject.innerHTML ="";
    let newElement="";
    for(let i in Products)
    {
        let product = Products[i].product;
        newElement +=
    `<div class="Product">
        <li class="list-group-item d-flex justify-content-between lh-condensed list-item-css ">
            <div>
                <h6 class="my-0 text-right">${product.productName}</h6>
                <small class="text-muted">>${product.description}</small>
            </div>
            <div class="addingToCartOption_div">
                <small class="text-muted">
                <button class="btn-primary cart_buttons" onclick="onChoosingProduct(this,'quantity_div')" >להוספה לסל</button></small>
            </div>
            <div class="quantity_div">
                <small class="text-muted">
                <input type="number small" placeholder="כמות" class="quantity_input" maxlength="4" size="4">
                <button class="btn-primary cart_buttons" onclick="onApprovingProduct(this,'addingToCartOption_div',1)" > לאישור</button>
                <button class="btn-danger cart_buttons" onclick="onCancelingProduct(this,'addingToCartOption_div')" > לביטול</button></small>
            </div>
            <span class="text-muted">12 &#8362</span>
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
        if (product_Name.toUpperCase().indexOf(filter) > -1) {
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
    let quantity = button.parentElement.getElementsByClassName("quantity_input")[0];
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
    if(quantity != undefined && Product_ID != undefined && quantity > 0)
    {
        let url = 'http://localhost:8081/Cart/AddProduct';
        let data = {
            "product_ID": Product_ID,
            "quantity" : quantity
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
            }
        });

    }

}
