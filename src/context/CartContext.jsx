import { createContext, useContext, useState } from "react";
import { getProductById } from "../data/products.js";

const CartContext = createContext(null);

export default function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    function addToCart(productId) {
        const existing = cartItems.find((item) => item.id === productId);
        if(existing){
            const currentQuantity = existing.quantity;
            const updatedCartItems = cartItems.map((item) => item.id === productId ? { id: productId, quantity: currentQuantity+1 } : item);
            setCartItems(updatedCartItems);
        } else {
            setCartItems([...cartItems, { id: productId, quantity: 1 }]);
        }
    }

    function getCartItemsWithProducts() {
        return cartItems.map((item) => ({
            ...item,
            product: getProductById(item.id)
        })).filter(item => item.product);
    }

    function removeFromCart(productId) {
        setCartItems(cartItems.filter((item) => item.id !== productId));
    }

    function getCartTotal() {
        const itemsWithProducts = getCartItemsWithProducts();
        return itemsWithProducts.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }

    function clearCart() {
        setCartItems([]);
    }

    function updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCartItems(
            cartItems.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    }
    
    return <CartContext.Provider value={{ cartItems, addToCart, getCartItemsWithProducts, updateQuantity, removeFromCart, getCartTotal, clearCart }}>{children}</CartContext.Provider>
}

export function useCart() {
    const context = useContext(CartContext);

    return context;
}