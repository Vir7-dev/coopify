import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }) {
    const [cartCount, setCartCount] = useState(0);
    const [flyingProduct, setFlyingProduct] = useState(null);

    // Fetch cart count on mount
    useEffect(() => {
        fetchCartCount();
    }, []);

    const fetchCartCount = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await fetch("/api/keranjang", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                // Count total items
                const total = data.reduce((sum, item) => sum + item.jml_dikeranjang, 0);
                setCartCount(total);
            }
        } catch (err) {
            console.error("Failed to fetch cart count:", err);
        }
    }, []);

    const triggerFlyingAnimation = useCallback((productData, startPosition) => {
        setFlyingProduct({
            ...productData,
            startPosition,
            id: Date.now(),
        });
    }, []);

    const onAnimationComplete = useCallback(() => {
        setFlyingProduct(null);
        fetchCartCount();
    }, [fetchCartCount]);

    const addToCart = useCallback(async (productId, quantity = 1, startPosition = null, productData = null) => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
            return;
        }

        try {
            const res = await fetch("/api/keranjang", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id_produk: productId,
                    jumlah: quantity,
                }),
            });

            if (res.ok) {
                // Trigger flying animation if position provided
                if (startPosition && productData) {
                    triggerFlyingAnimation(productData, startPosition);
                } else {
                    fetchCartCount();
                }
                return { success: true };
            } else {
                const data = await res.json();
                return { success: false, message: data.message };
            }
        } catch (err) {
            return { success: false, message: "Gagal menambahkan ke keranjang" };
        }
    }, [triggerFlyingAnimation, fetchCartCount]);

    return (
        <CartContext.Provider
            value={{
                cartCount,
                flyingProduct,
                addToCart,
                onAnimationComplete,
                fetchCartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
