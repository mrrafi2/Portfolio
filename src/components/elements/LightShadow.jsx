import React, { useRef, useEffect } from "react";
import styles from "./LightShadow.module.css";

export function InteractiveLightShadow() {
  const canvasRef = useRef(null);
  const trailsRef = useRef([]);
  const lastTouchTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animationFrame;

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      trailsRef.current.forEach((p) => {
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        const hue = ((p.x / canvas.width) * 360).toFixed(0);
        gradient.addColorStop(0, `hsla(${hue}, 100%, 80%, ${p.alpha})`);
        gradient.addColorStop(0.5, `hsla(${hue}, 90%, 60%, ${p.alpha * 0.7})`);
        gradient.addColorStop(1, `hsla(${hue}, 80%, 30%, 0)`);
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x + 6, p.y + 6, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(30, 30, 30, ${p.alpha * 0.4})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x - 4, p.y - 4, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${p.alpha * 0.3})`;
        ctx.fill();
      });

      trailsRef.current = trailsRef.current
        .map(p => ({ ...p, alpha: p.alpha * 0.97 }))
        .filter(p => p.alpha > 0.05);

      animationFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const addParticle = (x, y) => {
    trailsRef.current.push({ x, y, radius: 8, alpha: 1 });
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    addParticle(x, y);
    e.preventDefault();
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); 
    const now = Date.now();
    if (now - lastTouchTimeRef.current < 16) return;
    lastTouchTimeRef.current = now;

    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    addParticle(x, y);
  };

  return (
    <div className={styles.lightContainer}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      />
      <p className={styles.infoText}>
         Touch and move your cursor to cast digital shadows
      </p>
    </div>
  );
}
