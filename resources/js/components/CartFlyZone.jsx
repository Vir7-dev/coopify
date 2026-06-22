import React from "react";
import { useCart } from "../context/CartContext";
import FlyingProduct from "./FlyingProduct";

export default function CartFlyZone({ children }) {
    const { flyingProduct, onAnimationComplete } = useCart();

    return (
        <>
            {children}

            {/* Flying product animation */}
            {flyingProduct && (
                <FlyingProduct
                    product={flyingProduct}
                    onComplete={onAnimationComplete}
                />
            )}
        </>
    );
}
