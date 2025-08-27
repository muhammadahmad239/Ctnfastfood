// Cart Management System for CtN FastFood
class CartManager {
    constructor() {
        this.cart = this.getCart();
        this.initializeEventListeners();
        this.updateCartCount();
    }

    // Get cart from localStorage
    getCart() {
        const cart = localStorage.getItem('ctn-fastfood-cart');
        return cart ? JSON.parse(cart) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('ctn-fastfood-cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    // Add item to cart
    addItem(name, category, price, image) {
        const existingItem = this.cart.find(item => 
            item.name === name && item.category === category
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: Date.now() + Math.random(),
                name: name,
                category: category,
                price: parseFloat(price),
                image: image,
                quantity: 1
            });
        }

        this.saveCart();
        this.showSuccessMessage();
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { action: 'add', item: name } 
        }));
        
        return true;
    }

    // Remove item from cart
    removeItem(itemId) {
        const parsedId = parseFloat(itemId);
        this.cart = this.cart.filter(item => item.id !== parsedId);
        this.saveCart();
        this.displayCart();
        
        window.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { action: 'remove', itemId: itemId } 
        }));
    }

    // Update item quantity
    updateQuantity(itemId, newQuantity) {
        const parsedId = parseFloat(itemId);
        const item = this.cart.find(item => item.id === parsedId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(itemId);
            } else {
                item.quantity = parseInt(newQuantity);
                this.saveCart();
                this.displayCart();
            }
        }
    }

    // Clear entire cart
    clearCart() {
        if (this.cart.length === 0) {
            alert('Cart is already empty!');
            return;
        }

        if (confirm('Are you sure you want to clear your cart?')) {
            this.cart = [];
            this.saveCart();
            this.displayCart();
            
            window.dispatchEvent(new CustomEvent('cartUpdated', { 
                detail: { action: 'clear' } 
            }));
        }
    }

    // Calculate total
    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Update cart count in navbar
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'flex' : 'none';
        });
    }

    // Display cart items (for order page)
    displayCart() {
        const cartItemsContainer = document.getElementById('cartItems');
        const orderSummary = document.getElementById('orderSummary');
        const emptyCart = document.getElementById('emptyCart');
        const totalAmountElement = document.getElementById('totalAmount');

        if (!cartItemsContainer) return;

        if (this.cart.length === 0) {
            if (emptyCart) emptyCart.style.display = 'block';
            if (orderSummary) orderSummary.style.display = 'none';
            cartItemsContainer.innerHTML = '';
            return;
        }

        if (emptyCart) emptyCart.style.display = 'none';
        if (orderSummary) orderSummary.style.display = 'block';

        cartItemsContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item d-flex align-items-center" data-item-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="rounded">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-category text-muted">${item.category}</div>
                    <div class="cart-item-price">Rs ${item.price.toFixed(2)} each</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="cartManager.updateQuantity('${item.id}', ${item.quantity - 1})" 
                            ${item.quantity <= 1 ? 'title="Remove item"' : ''}>
                        <i class="fas ${item.quantity <= 1 ? 'fa-trash' : 'fa-minus'}"></i>
                    </button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="cartManager.updateQuantity('${item.id}', ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="ms-3">
                    <div class="fw-bold text-primary">Rs ${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="btn btn-sm btn-outline-danger mt-1" 
                            onclick="cartManager.removeItem('${item.id}')" 
                            title="Remove from cart">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');

        if (totalAmountElement) {
            totalAmountElement.textContent = this.getTotal().toFixed(2);
        }
    }

    // Show success message when item is added
    showSuccessMessage() {
        // Try to show Bootstrap modal first
        const modal = document.getElementById('successModal');
        if (modal) {
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
            return;
        }

        // Fallback to custom toast notification
        this.showToast('Item added to cart!', 'success');
    }

    // Show custom toast notification
    showToast(message, type = 'info') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.custom-toast');
        existingToasts.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `custom-toast alert alert-${type === 'success' ? 'success' : 'info'} position-fixed`;
        toast.style.cssText = `
            top: 100px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border: none;
            animation: slideInRight 0.3s ease-out;
        `;
        
        toast.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
                ${message}
                <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
        `;

        document.body.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => toast.remove(), 300);
            }
        }, 3000);

        // Add CSS for animations if not exists
        if (!document.querySelector('#toast-animations')) {
            const style = document.createElement('style');
            style.id = 'toast-animations';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Listen for cart updates
        window.addEventListener('cartUpdated', (event) => {
            // You can add analytics or other side effects here
            console.log('Cart updated:', event.detail);
        });

        // Handle page beforeunload to prevent data loss
        window.addEventListener('beforeunload', () => {
            this.saveCart();
        });
    }

    // Get cart data for order submission
    getCartData() {
        return {
            items: this.cart,
            total: this.getTotal(),
            itemCount: this.cart.reduce((sum, item) => sum + item.quantity, 0)
        };
    }

    // Import cart data (useful for merging carts or restoring)
    importCart(cartData) {
        if (Array.isArray(cartData)) {
            this.cart = cartData.map(item => ({
                ...item,
                id: item.id || Date.now() + Math.random(),
                price: parseFloat(item.price),
                quantity: parseInt(item.quantity)
            }));
            this.saveCart();
            this.displayCart();
        }
    }

    // Export cart data (useful for backup or sharing)
    exportCart() {
        return JSON.stringify(this.cart, null, 2);
    }
}

// Initialize cart manager
const cartManager = new CartManager();

// Global functions for easy access from HTML
function addToCart(name, category, price, image) {
    return cartManager.addItem(name, category, price, image);
}

function removeFromCart(itemId) {
    return cartManager.removeItem(itemId);
}

function updateCartQuantity(itemId, quantity) {
    return cartManager.updateQuantity(itemId, quantity);
}

function clearCart() {
    return cartManager.clearCart();
}

function getCart() {
    return cartManager.cart;
}

function getCartTotal() {
    return cartManager.getTotal();
}

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('PK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Export for module use if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CartManager, cartManager };
}