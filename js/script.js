
let userInfo = document.querySelector ("#user_info")
let userD = document.querySelector ("#user")
let links = document.querySelector ("#links")

if (localStorage.getItem("email")){
    links.remove()
    userInfo.style.display ="flex"
    userInfo.style.justifyContent = "space-around";
    userD.innerHTML =`WELCOME ${localStorage.getItem("fName").toUpperCase()}` 
}
let logOutBtn = document.querySelector("#logout")
logOutBtn.addEventListener("click", function (){
    localStorage.clear();
    setTimeout(() => {
        window.location = "login.html";
    } , 1500)
})
////////////////////////////////////////////////////////////////////////////////
let allProducts = document.querySelector(".products")
let products = [
    {
        id:1,
        title: "Pink Jacket",
        price: "100",
        imageUrl : "images/1.svg",
        category: "Clothes" 

    },
    {
        id:2,
        title: "Keyboard",
        price: "50",
        imageUrl : "images/2.svg",
        category: "Computer Accessories"
    },
    {
        id:3,
        title: "Lenovo Laptop ",
        price: "7000",
        imageUrl :"images/3.svg" ,
        category:"Technology"
    },
    {
        id:4,
        title: "Blue jacket",
        price: "300",
        imageUrl : "images/4.svg",
        category: "Clothes"
    },
    {
        id:5,
        title: "Monitor",
        price: "700",
        imageUrl : "images/5.svg",
        category: "Technology"
    },
    {
        id:6,
        title: "Arm Control",   
        price: "50",
        imageUrl : "images/6.svg",
        category: "Computer Accessories"
    },   
    {
        id:7,
        title: "Speaker",
        price: "400",
        imageUrl :"images/7.svg",
        category:"Computer Accessories" 
    },
    {
        id:8,
        title: "Chair",
        price: "300",
        imageUrl :"images/8.svg",
        category:"furniture" 
    },
    {
        id:9,
        title: "Bookshelf",
        price: "500",
        imageUrl : "images/9.svg",
        category:"furniture"   
    }
]


function drawItems (){
    let y = products.map((item) => {
        return `
      <div class="product_item card">
                        <img src="${item.imageUrl}" alt="" >
                        <p>Product : ${item.title}</p>
                        <p>price : ${item.price} $</p>
                        <p>Category : ${item.category}</p>
                        <div class="card-foot product_item_action">
                            <button class="btn add_to_cart" onClick="addToCart(${item.id})">Add To Card</button>
                            <i class="fa-regular fa-heart" ></i>
                        </div><!-- card-foot -->
        </div><!-- product_item -->
        `
    }).join('');
    allProducts.innerHTML = y;
}
drawItems ()

// ==================================================================================================

window.onload = function () {
    let btnsAdd = document.querySelectorAll(".add_to_cart");
    let badge = document.querySelector(".badge");
    let addedItem = JSON.parse(localStorage.getItem("ProductsInCart")) || [];


    updateCounter(addedItem.length);
    renderCart();

    btnsAdd.forEach((btn, index) => {
        const product = products[index]; 
        const itemInCart = addedItem.find(item => item.id === product.id);

        updateButtonState(btn, !!itemInCart);
        btn.addEventListener("click", function () {

            if (!localStorage.getItem("email")) {
                localStorage.setItem("redirectToCart", "true");
                window.location = "login.html"; 
                return;
            }

            if (btn.innerText === "Add To Cart") {
                addToCart(index);
            } else {
                removeFromCart(index);
            }

            const updatedItemInCart = addedItem.find(item => item.id === product.id);
            updateButtonState(btn, !!updatedItemInCart);
        });
    });


    if (localStorage.getItem("redirectToCart") === "true") {
        localStorage.removeItem("redirectToCart");
        location.reload(); 
    }

    function updateButtonState(button, inCart) {
        if (inCart) {
            button.style.backgroundColor = "rgb(255, 0, 0)";
            button.innerText = "Remove From Cart";
        } else {
            button.style.backgroundColor = "";
            button.innerText = "Add To Cart";
        }
    }

    function updateCounter(count) {
        badge.style.display = count > 0 ? "block" : "none";
        badge.innerHTML = count;
    }

    function addToCart(index) {
        let choosenItem = products[index];
        let existingItem = addedItem.find(item => item.id === choosenItem.id);

        if (!existingItem) {
            choosenItem.quantity = 1;
            addedItem.push(choosenItem);
        } else {
            existingItem.quantity++;
        }

        updateLocalStorage();
        renderCart();
        updateCounter(addedItem.length);
    }

    function removeFromCart(index) {
        let choosenItem = products[index];
        addedItem = addedItem.filter(item => item.id !== choosenItem.id);

        updateLocalStorage();
        renderCart();
        updateCounter(addedItem.length);
    }

    function updateLocalStorage() {
        localStorage.setItem("ProductsInCart", JSON.stringify(addedItem));
    }

    function renderCart() {
        let cartProductDiv = document.querySelector(".carts_products div");
        cartProductDiv.innerHTML = "";
        if (addedItem.length > 0) {
            addedItem.forEach(item => {
                cartProductDiv.innerHTML += `
                    <div class="cart-item">
                        <div class="item-info">
                            <span>${item.title}</span>
                            <p>Quantity: <span class="item-counter">${item.quantity}</span></p>
                        </div>
                        <div class="item-actions">
                            <button class="plus" data-id="${item.id}">+</button>
                            <button class="minus" data-id="${item.id}">-</button>
                            <button class="remove" data-id="${item.id}">Remove</button>
                        </div>
                    </div>
                `;
            });

            document.querySelectorAll(".plus").forEach(button => {
                button.addEventListener("click", function () {
                    increaseQuantity(parseInt(this.dataset.id));
                });
            });

            document.querySelectorAll(".minus").forEach(button => {
                button.addEventListener("click", function () {
                    decreaseQuantity(parseInt(this.dataset.id));
                });
            });

            document.querySelectorAll(".remove").forEach(button => {
                button.addEventListener("click", function () {
                    removeFromCartById(parseInt(this.dataset.id));
                });
            });
        } else {
            cartProductDiv.innerHTML = "<p>Your cart is empty.</p>";
        }
    }

    function increaseQuantity(id) {
        let item = addedItem.find(item => item.id === id);
        if (item) {
            item.quantity++;
            updateLocalStorage();
            renderCart();
            updateCounter(addedItem.length);
        }
    }

    function decreaseQuantity(id) {
        let item = addedItem.find(item => item.id === id);
        if (item) {
            item.quantity--;
            if (item.quantity === 0) {
                removeFromCartById(id);
            } else {
                updateLocalStorage();
                renderCart();
                updateCounter(addedItem.length);
            }
        }
    }

    function removeFromCartById(id) {
        addedItem = addedItem.filter(item => item.id !== id);

        updateLocalStorage();
        renderCart();
        updateCounter(addedItem.length);

        btnsAdd.forEach((btn, index) => {
            const product = products[index];
            const itemInCart = addedItem.find(item => item.id === product.id);
            updateButtonState(btn, !!itemInCart);
        });
    }
};
// ==================================================================================================================

let cartProductDiv = document.querySelector(".carts_products div");
let badge = document.querySelector(".badge");

let addedItem = localStorage.getItem("ProductsInCart") ? JSON.parse(localStorage.getItem("ProductsInCart")) : [];

renderCart();

function checkLoginAndAddToCart(id) {
    if (localStorage.getItem("username")) {
        addToCart(id);
    } else {
        window.location = "login.html"; 
    }
}

function addToCart(id) {
    let choosenItem = products.find((item) => item.id === id);
    let existingItem = addedItem.find((item) => item.id === id);

    if (!existingItem) {
        choosenItem.quantity = 1;
        addedItem.push(choosenItem);
        updateLocalStorage();
        renderCart();
    }
}

function increaseQuantity(id) {
    let item = addedItem.find(item => item.id === id);
    if (item) {
        item.quantity += 1;
        updateLocalStorage();
        renderCart();
    }
}

function decreaseQuantity(id) {
    let item = addedItem.find(item => item.id === id);
    if (item) {
        item.quantity -= 1;
        if (item.quantity === 0) {
            removeFromCart(id);
        } else {
            updateLocalStorage();
            renderCart();
        }
    }
}

function removeFromCart(id) {
    addedItem = addedItem.filter(item => item.id !== id);
    updateLocalStorage();
    renderCart();

    let btnIndex = products.findIndex(product => product.id === id);
    if (btnIndex !== -1) {
        let btn = document.querySelectorAll(".add_to_cart")[btnIndex];
        btn.style.backgroundColor = "";
        btn.innerText = "Add To Cart";

        const btnState = {
            text: "Add To Cart",
            backgroundColor: ""
        };
        localStorage.setItem(`btnState_${btnIndex}`, JSON.stringify(btnState));
    }
}


function updateLocalStorage() {
    localStorage.setItem("ProductsInCart", JSON.stringify(addedItem));
}

function renderCart() {
    cartProductDiv.innerHTML = "";
    if (addedItem.length > 0) {
        addedItem.forEach(item => {
            cartProductDiv.innerHTML += `
                <div class="cart-item">
                    <div class="item-info">
                        <span>${item.title}</span>
                        <p>Quantity: <span class="item-counter">${item.quantity}</span></p>
                    </div>
                    <div class="item-actions">
                        <button class="plus" onclick="increaseQuantity(${item.id})">+</button>
                        <button class="minus" onclick="decreaseQuantity(${item.id})">-</button>
                        <button class="remove" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            `;
        });

        badge.style.display = "block";
        badge.innerHTML = addedItem.length;
    } else {
        badge.style.display = "none"; 
        cartProductDiv.innerHTML = "<p>Your cart is empty.</p>";
    }

    products.forEach((product, index) => {
        let btn = document.querySelectorAll(".add_to_cart")[index];
        let itemInCart = addedItem.find(item => item.id === product.id);
        if (itemInCart) {
            btn.style.backgroundColor = "rgb(255, 0, 0)";
            btn.innerText = "Remove From Cart";
        } else {
            btn.style.backgroundColor = "";
            btn.innerText = "Add To Cart";
        }
    });
}
// ========================favourites==============

document.addEventListener("DOMContentLoaded", function () {
    let heartIcons = document.querySelectorAll(".fa-heart");
    let likedItems = JSON.parse(localStorage.getItem("likedItems")) || [];
    let products = [
        { id: 1, title: "Pink Jacket", price: 100, category: "Clothes", imageUrl: "images/1.svg" },
        { id: 2, title: "Keyboard", price: 50, category: "Computer Accessories", imageUrl: "images/2.svg" },
        { id: 3, title: "Lenovo Laptop", price: 7000, category: "Technology", imageUrl: "images/3.svg" },
        { id: 4, title: "Blue Jacket", price: 300, category: "Clothes", imageUrl: "images/4.svg" },
        { id: 5, title: "Monitor", price: 700, category: "Technology", imageUrl: "images/5.svg" },
        { id: 6, title: "Arm Control", price: 50, category: "Computer Accessories", imageUrl: "images/6.svg" },
        { id: 7, title: "Speaker", price: 400, category: "Computer Accessories", imageUrl: "images/7.svg" },
        { id: 8, title: "Chair", price: 300, category: "Furniture", imageUrl: "images/8.svg" },
        { id: 9, title: "Bookshelf", price: 500, category: "Furniture", imageUrl: "images/9.svg" }
    ];

    heartIcons.forEach((icon, index) => {
        let product = products[index];

        if (likedItems.some(item => item.id === product.id)) {
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
            icon.style.color = "red";
        }

        icon.addEventListener("click", function () {
            if (!localStorage.getItem("email")) {
                window.location = "login.html";
                return;
            }

            if (icon.classList.contains("fa-regular")) {
                icon.classList.remove("fa-regular");
                icon.classList.add("fa-solid");
                icon.style.color = "red";

                likedItems.push(product);
            } else {
                icon.classList.remove("fa-solid");
                icon.classList.add("fa-regular");
                icon.style.color = "";

                likedItems = likedItems.filter(item => item.id !== product.id);
            }

            localStorage.setItem("likedItems", JSON.stringify(likedItems));
        });
    });
});
// ==========================end favourites=====================================
let shoppingCartIcon = document.querySelector(".shopping_cart i");
let sortDown = document.querySelector(".fa-sort-down");
let cartsProducts = document.querySelector(".carts_products");

shoppingCartIcon.addEventListener("click", opencart);

function opencart() {
    if (cartProductDiv.innerHTML != "") {
        if (cartsProducts.style.display == "block") {
            cartsProducts.style.display = "none";
            sortDown.classList.remove("fa-sort-up");
            sortDown.classList.add("fa-sort-down");
        } else {
            cartsProducts.style.display = "block";
            sortDown.classList.remove("fa-sort-down");
            sortDown.classList.add("fa-sort-up");
        }
    }
}

//===================================00000000000search0000000000======================

let search = document.querySelector("#srch");
let searchInput = search.value;
let searchByProductTitle = function (searchInput){
    let filteredProducts = products.filter((item) => {
        return item.title.toLowerCase().includes(searchInput.toLowerCase()) || item.category.toLowerCase().includes(searchInput.toLowerCase());
    });
if (filteredProducts.length === 0) {
    allProducts.innerHTML = `<p>No result found.</p>`;
}else{
    let x = filteredProducts.map((item) => {
        return `
        <div class="product_item card">
            <img src="${item.imageUrl}" alt="" >
            <p>Product : ${item.title}</p>
            <p>Price : ${item.price} $</p>
            <p>Category : ${item.category}</p>
            <div class="card-foot product_item_action">
                <button class="btn add_to_cart" onClick="addToCart(${item.id})">Add To Cart</button>
                <i class="fa-regular fa-heart"></i>
            </div><!-- card-foot -->
        </div><!-- product_item -->
        `;
    }).join('');
    allProducts.innerHTML = x;
} }
search.addEventListener('input', (e) => {
    searchByProductTitle(e.target.value);
});
searchByProductTitle('');
// ==============================000000Category-list000000000======================
let list = document.querySelector("#category-list");
let searchByProductCategory = function (categorySelected){

        if (categorySelected === "Search By Category Name") {
            allProducts.innerHTML = `<p>Please select a category to search by.</p>`;
            return;
        }
    let filteredProducts = products.filter((item) => {
    if (!categorySelected) {
        return true;
    }
    return item.category.toLowerCase() === categorySelected.toLowerCase();
    });
    let x = filteredProducts.map((item) => {
        return `
        <div class="product_item card">
            <img src="${item.imageUrl}" alt="" >
            <p>Product : ${item.title}</p>
            <p>Price : ${item.price} $</p>
            <p>Category : ${item.category}</p>
            <div class="card-foot product_item_action">
                <button class="btn add_to_cart" onClick="addToCart(${item.id})">Add To Cart</button>
                <i class="fa-regular fa-heart"></i>
            </div><!-- card-foot -->
        </div><!-- product_item -->
        `;
    }).join('');
    allProducts.innerHTML = x;
}
list.addEventListener('change', (e) => {
    searchByProductCategory(e.target.value); 
});
searchByProductCategory('');
