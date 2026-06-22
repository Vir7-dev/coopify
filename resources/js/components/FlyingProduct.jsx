import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";

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

        // Find cart icon
        const cartIcon = document.querySelector('[data-cart-icon]');
        if (!cartIcon) {
            console.warn("Cart icon not found");
            setIsAnimating(false);
            onComplete();
            return;
        }

        const cartRect = cartIcon.getBoundingClientRect();
        endPosRef.current = {
            x: cartRect.left + cartRect.width / 2,
            y: cartRect.top + cartRect.height / 2
        };

        startTimeRef.current = performance.now();

        // Start animation on next frame
        animFrameRef.current = requestAnimationFrame(animate);

        function animate(currentTime) {
            const start = startPosRef.current;
            const end = endPosRef.current;

            // Calculate distance and duration
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const duration = Math.max(200, Math.min(400, distance * 0.5));

            const elapsed = currentTime - startTimeRef.current;
            let progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);

            // Calculate position
            const currentX = start.x + dx * eased;
            const arcHeight = -Math.abs(dy) * 0.15 * Math.sin(progress * Math.PI);
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
                }, 250);
            } else {
                animFrameRef.current = requestAnimationFrame(animate);
            }
        }

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

        return () => {
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
        };
    }, []);

    if (!isAnimating) return null;

    return ReactDOM.createPortal(
        <div
            style={{
                position: "fixed",
                left: position.x,
                top: position.y,
                transform: `translate(-50%, -50%) scale(${isShrinking ? 0 : 1})`,
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(23, 102, 211, 0.3)",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                zIndex: 99999,
                pointerEvents: "none",
                opacity: isShrinking ? 0 : 1,
                transition: isShrinking ? "transform 0.2s ease-in, opacity 0.2s ease-in" : "none",
            }}
        >
            <img
                src={product.gambar?.[0]?.url_gambar || "/img/default.png"}
                alt={product.nama_produk || "Product"}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
                onError={(e) => {
                    e.target.style.display = "none";
                }}
            />
        </div>,
        document.body
    );
}
