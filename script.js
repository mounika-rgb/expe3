document.addEventListener('DOMContentLoaded', function() {
  const cart = [];
  const cartItemsList = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const totalPriceElement = document.getElementById('total-price');
  const clearCartBtn = document.getElementById('clear-cart');
  const checkoutBtn = document.getElementById('checkout-btn');
  const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
  
  // Add to cart functionality
  addToCartBtns.forEach(button => {
    button.addEventListener('click', function() {
      const product = this.closest('.product');
      const productName = product.dataset.name;
      const productPrice = parseFloat(product.dataset.price);
      
      // Check if product already exists in cart
      const existingItem = cart.find(item => item.name === productName);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          name: productName,
          price: productPrice,
          quantity: 1
        });
      }
      
      updateCart();
      
      // Add visual feedback
      this.textContent = 'Added!';
      this.style.backgroundColor = '#2ecc71';
      setTimeout(() => {
        this.textContent = 'Add to Cart';
        this.style.backgroundColor = '';
      }, 1000);
    });
  });
  
  // Clear cart functionality
  clearCartBtn.addEventListener('click', function() {
    if (cart.length > 0) {
      if (confirm('Are you sure you want to clear your cart?')) {
        cart.length = 0;
        updateCart();
      }
    }
  });
  
  // Checkout functionality
  checkoutBtn.addEventListener('click', function() {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add some items before checkout.');
    } else {
      alert(`Thank you for your purchase! Total: $${calculateTotal().toFixed(2)}`);
      cart.length = 0;
      updateCart();
    }
  });
  
  // Calculate total price
  function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  
  // Update cart display
  function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items list
    if (cart.length === 0) {
      cartItemsList.innerHTML = '<li>No items in cart</li>';
    } else {
      cartItemsList.innerHTML = '';
      cart.forEach(item => {
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
          <span>${item.name} (${item.quantity})</span>
          <span>$${(item.price * item.quantity).toFixed(2)}</span>
          <button class="remove-item" data-name="${item.name}" aria-label="Remove ${item.name} from cart">×</button>
        `;
        cartItemsList.appendChild(li);
      });
      
      // Add event listeners to remove buttons
      document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
          const productName = this.dataset.name;
          const itemIndex = cart.findIndex(item => item.name === productName);
          
          if (itemIndex !== -1) {
            if (cart[itemIndex].quantity > 1) {
              cart[itemIndex].quantity -= 1;
            } else {
              cart.splice(itemIndex, 1);
            }
            updateCart();
          }
        });
      });
    }
    
    // Update total price
    totalPriceElement.textContent = calculateTotal().toFixed(2);
    
    // Toggle checkout button
    checkoutBtn.style.display = cart.length > 0 ? 'block' : 'none';
  }
});