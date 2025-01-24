let ProductsInCart = localStorage.getItem("ProductsInCart")
let allProducts = document.querySelector(".products")
let totalPriceContainer = document.querySelector(".total-price-container"); 

if(ProductsInCart){
    let item = JSON.parse(ProductsInCart) ;
    drawCartProducts(item);
}
function increaseQuantity(productId) {
    let products = JSON.parse(localStorage.getItem("ProductsInCart")) || [];
    products = products.map(item => {
        if (item.id === productId) {
            item.quantity += 1;
        }
        return item;
    });
    localStorage.setItem("ProductsInCart", JSON.stringify(products));
    drawCartProducts(products); 
}

function decreaseQuantity(productId) {
    let products = JSON.parse(localStorage.getItem("ProductsInCart")) || [];
    products = products.map(item => {
        if (item.id === productId) {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                return null;
            }
        }
        return item;
    }).filter(item => item !== null);

    localStorage.setItem("ProductsInCart", JSON.stringify(products));
    drawCartProducts(products); 
}

function removeFromCart(productId) {
    let products = JSON.parse(localStorage.getItem("ProductsInCart")) || [];
    products = products.filter(item => item.id !== productId);
    localStorage.setItem("ProductsInCart", JSON.stringify(products));
    drawCartProducts(products);
}

function drawCartProducts(products) {
    if (!products.length) {
        allProducts.innerHTML = "<p>Your cart is empty.</p>";
        totalPriceContainer.innerHTML = ""; 
        return;
    }

        let totalPrice = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
    let y = products.map((item) => `
        <div class="product_item card inCartPage">
            <div>
                <img src="${item.imageUrl}" alt="">
            </div>
            <div>
                <div>
                    <p>Product: ${item.title}</p>
                    <p>Category: ${item.category}</p>
                    <p>Price: ${item.price} $</p>
                </div>
                <div class="card-foot product_item_action">
                    <p><span class="item-counter" id="counter-${item.id}" style="font-size:20px">${item.quantity}</span></p>
                    <div class="item-cart">
                        <button class="plus" onclick="increaseQuantity(${item.id})">+</button>
                        <button class="minus" onclick="decreaseQuantity(${item.id})">-</button>
                        <button class="remove" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    allProducts.innerHTML = y;
    totalPriceContainer.innerHTML = `<p><strong>Total Price:</strong> ${totalPrice} $</p>`;
}

// ============================Show favourite===================

let favoritesContainer = document.querySelector(".favorites-products");
let likedItems = JSON.parse(localStorage.getItem("likedItems")) || [];
drawFavoriteProducts();

function drawFavoriteProducts() {
    if (!likedItems.length) {
        favoritesContainer.innerHTML = "<span>Your favorite list is empty.</span>";
        return;
    }

    favoritesContainer.innerHTML = `
        ${likedItems.map(item => `
            
                <div class="product_item card fav">
                    <img src="${item.imageUrl}" alt="${item.title}">
                    <div>
                        <p>Product: ${item.title}</p>
                        <div class="heart">
                            <p>Category: ${item.category}</p>
                            <i class="fa-solid fa-heart" style="color: red;" onclick="removeFromFavorites(${item.id})"></i>
                        </div>   
                    </div>
                </div>
        `).join('')}
    `;
}

window.removeFromFavorites = function (productId) {
    likedItems = likedItems.filter(item => item.id !== productId);
    localStorage.setItem("likedItems", JSON.stringify(likedItems));
    drawFavoriteProducts();
};

// ======================================end Show favourite================
  /* ============================== favourites scroll ============= */
const container = document.querySelector('.favorites-products');
const products = document.querySelectorAll('.fav');
container.addEventListener('scroll', () => {
    const products = document.querySelectorAll('.fav'); 
    products.forEach((product) => {

        const rect = product.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        if (
            rect.left >= containerRect.left &&
            rect.right <= containerRect.right
        ) {
            product.style.transform = 'scale(1.1)'; 
            product.style.opacity = '1';
            product.style.transform = 'scale(0.9)';  
            product.style.opacity = '0.5';  
        }
        });
    });
