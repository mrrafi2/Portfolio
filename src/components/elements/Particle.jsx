import React, { useRef, useEffect } from "react";
import styles from "./Particle.module.css";

export function ParticleCanvas() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const lastMouseMoveRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions based on element's size
    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    setCanvasSize();

    const createParticle = (x, y) => ({
      x,
      y,
      vx: (Math.random() - 0.5) * 2.5,
      vy: (Math.random() - 0.5) * 2.5,
      alpha: 1,
      radius: Math.random() * 3 + 2,
      hue: Math.floor(Math.random() * 360),
    });

    const animate = () => {
      // Draw a semi-transparent background to create trailing effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Switch to a "lighter" composite for the glowing particle effect
      ctx.globalCompositeOperation = "lighter";

      // Update and draw particles
      particlesRef.current = particlesRef.current
        .map((p) => {
          p.x += p.vx;
          p.y += p.vy;
          // Slower fade for smoother trails
          p.alpha -= 0.004;
          return p;
        })
        .filter((p) => p.alpha > 0.02);

      particlesRef.current.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.alpha})`;
        ctx.fill();
      });

      // Reset composite mode for future drawings if needed
      ctx.globalCompositeOperation = "source-over";

      requestAnimationFrame(animate);
    };
    animate();

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      for (let i = 0; i < 40; i++) {
        particlesRef.current.push(createParticle(x, y));
      }
    };

    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastMouseMoveRef.current < 20) return; // throttle to 20ms per event
      lastMouseMoveRef.current = now;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      for (let i = 0; i < 5; i++) {
        particlesRef.current.push(createParticle(x, y));
      }
    };

    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", setCanvasSize);

    return () => {
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.particleCanvas} />;
}
