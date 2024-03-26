const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModal = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addresswarn = document.getElementById("address-warn");

let cart = [];

cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex";
});

cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

closeModal.addEventListener("click", function () {
  cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
  let parenButton = event.target.closest(".add-to-cart-btn");
  if (parenButton) {
    const name = parenButton.getAttribute("data-name");
    const price = parseFloat(parenButton.getAttribute("data-price"));
    addToCart(name, price);
  }
});

function addToCart(name, price) {
  const itemExist = cart.find((item) => item.name === name);

  if (itemExist) {
    itemExist.quantity += 1;
    return;
  }

  cart.push({
    name,
    price,
    quantity: 1,
  });

  updateCartModal();
}

function updateCartModal() {
  cartContainer.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );
    cartItemElement.innerHTML = `
      < class="flex items-center justify-between">
        <div>
          <p class="font-medium">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">${item.price} Kz</p>
        </div>
        
        <button class="remove-from-cart-btn" data-name="${item.name}">
          Remover
        </button>
        
      </div>
    `;
    total += item.price * item.quantity;
    cartContainer.appendChild(cartItemElement);
  });
  cartTotal.textContent = total.toLocaleString("pt", {
    style: "currency",
    currency: "ANG",
  });

  cartCounter.innerHTML = cart.length;
}

cartContainer.addEventListener("click", function () {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");
    removeItem(name);
  }
});

function removeItem(name) {
  const index = cart.findIndex((item) => item.name === name);
  if (index !== -1) {
    const item = cart[index];
    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }
    cart.splice(index, 1);
    updateCartModal();
  }
}

addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;
  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addresswarn.classList.add("hidden");
  }
});

checkoutBtn.addEventListener("click", function () {
  const isOpen = checkRestaurantOpen();

  if (!isOpen) {
    Toastify({
      text: "O restaurante se Encontra fechado neste momento",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }

  if (cart.length === 0) return;
  if (addressInput.value === "") {
    addresswarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  const cartItems = cart
    .map((item) => {
      return ` Nome: ${item.name} Quantidade: ${item.quantity} Preço: ${item.price} |`;
    })
    .join("");
  const message = encodeURIComponent(cartItems);
  const phone = "957629858";
  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,
    "_blank"
  );
  cart = [];
  updateCartModal();
});

function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 15 && hora < 23;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
}
