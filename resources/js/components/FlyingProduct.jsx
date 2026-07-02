import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { API_BASE_URL } from "../api";

export default function FlyingProduct({ product, onComplete }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isAnimating, setIsAnimating] = useState(true);
    const [isShrinking, setIsShrinking] = useState(false);
    const animFrameRef = useRef(null);
    const startTimeRef = useRef(0);
    const startPosRef = useRef({ x: 0, y: 0 });
    const endPosRef = useRef({ x: 0, y: 0 });
    const hasRunRef = useRef(false);

    useEffect(() => {
        // Prevent multiple runs
        if (hasRunRef.current) return;
        hasRunRef.current = true;

        // Initialize positions
        const startX = product.startPosition?.x || 0;
        const startY = product.startPosition?.y || 0;

        startPosRef.current = { x: startX, y: startY };
        setPosition({ x: startX, y: startY });

        function triggerCartShake() {
            const styleId = "flying-cart-shake";
            let styleEl = document.getElementById(styleId);
            if (!styleEl) {
                styleEl = document.createElement("style");
                styleEl.id = styleId;
                document.head.appendChild(styleEl);
            }
            styleEl.textContent = `
                [data-cart-icon] * {
                    animation: flyingCartShake 0.4s ease-in-out;
                }
                [data-cart-icon] {
                    animation: flyingCartShake 0.4s ease-in-out;
                }
                @keyframes flyingCartShake {
                    0%, 100% { transform: scale(1); }
                    25% { transform: scale(1.3); }
                    50% { transform: scale(0.9); }
                    75% { transform: scale(1.1); }
                }
            `;
        }

        function animate(currentTime) {
            const start = startPosRef.current;
            const end = endPosRef.current;

            // Calculate distance and duration
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const duration = Math.max(300, Math.min(600, distance * 0.8));

            const elapsed = currentTime - startTimeRef.current;
            let progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);

            // Calculate position with arc
            const currentX = start.x + dx * eased;
            const arcHeight = -Math.abs(dy) * 0.2 * Math.sin(progress * Math.PI);
            const currentY = start.y + dy * eased + arcHeight;

            setPosition({ x: currentX, y: currentY });

            if (progress >= 1) {
                // Animation complete - start shrink
                setIsShrinking(true);
                triggerCartShake();

                // Clean up after shrink
                setTimeout(() => {
                    setIsAnimating(false);
                    onComplete();
                }, 300);
            } else {
                animFrameRef.current = requestAnimationFrame(animate);
            }
        }

        // Small delay to ensure DOM is ready
        const findCartAndAnimate = () => {
            // Find cart icon - check both desktop and mobile versions
            let cartIcon = document.querySelector('[data-cart-icon]');

            // If cart icon found but might be hidden, try to find visible one
            if (cartIcon) {
                const rect = cartIcon.getBoundingClientRect();
                // Check if element is visible (not hidden, has dimensions)
                if (rect.width === 0 || rect.height === 0 || rect.top < 0) {
                    // Element might be hidden in mobile, look for visible one
                    const allCartIcons = document.querySelectorAll('[data-cart-icon]');
                    for (const icon of allCartIcons) {
                        const r = icon.getBoundingClientRect();
                        if (r.width > 0 && r.height > 0 && r.top >= 0) {
                            cartIcon = icon;
                            break;
                        }
                    }
                }
            }

            if (!cartIcon) {
                console.warn("Cart icon not found");
                setIsAnimating(false);
                onComplete();
                return;
            }

            const cartRect = cartIcon.getBoundingClientRect();

            // Verify cart is in visible viewport
            if (cartRect.width === 0 || cartRect.height === 0 || cartRect.top < 0 || cartRect.left < 0) {
                console.warn("Cart icon not visible in viewport");
                setIsAnimating(false);
                onComplete();
                return;
            }

            endPosRef.current = {
                x: cartRect.left + cartRect.width / 2,
                y: cartRect.top + cartRect.height / 2
            };

            startTimeRef.current = performance.now();

            // Start animation on next frame
            animFrameRef.current = requestAnimationFrame(animate);
        };

        // Small delay to ensure DOM is fully rendered
        const timeoutId = setTimeout(findCartAndAnimate, 10);

        return () => {
            clearTimeout(timeoutId);
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
        };
    }, []);

    if (!isAnimating) return null;

    // Get product image URL
    const getImageUrl = () => {
        if (product.gambar && product.gambar.length > 0) {
            return `${API_BASE_URL}/storage/${product.gambar[0].url_gambar}`;
        }
        return "/img/default.png";
    };

    return ReactDOM.createPortal(
        <div
            style={{
                position: "fixed",
                left: position.x,
                top: position.y,
                transform: `translate(-50%, -50%) scale(${isShrinking ? 0 : 1})`,
                width: "72px",
                height: "72px",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(23, 102, 211, 0.4)",
                background: "linear-gradient(135deg, #1766D3 0%, #3D8FFF 100%)",
                zIndex: 99999,
                pointerEvents: "none",
                opacity: isShrinking ? 0 : 1,
                transition: isShrinking ? "transform 0.25s ease-in, opacity 0.25s ease-in" : "none",
            }}
        >
            <img
                src={getImageUrl()}
                alt={product.nama_produk || "Product"}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
                onError={(e) => {
                    e.target.src = "/img/default.png";
                }}
            />
        </div>,
        document.body
    );
}
