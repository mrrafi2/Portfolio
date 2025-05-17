import React, { useState, useEffect, useRef } from 'react';
import styles from './Buttons.module.css';
import RetroSaveButton from './saved';
import click from "../../assets/click-sound.mp3";
import { gsap } from 'gsap'; 

const UniqueButtons = () => {
  const [touchActive, setTouchActive] = useState({
    button3D: false,
    neumorphic: false,
    liquid: false,
    glassmorphic: false,
    svgOutline: false,
    microInteraction: false,
    gradient: false,
    hapticFeedback: false,
  });
  const handleTouchStart = key => setTouchActive(prev => ({ ...prev, [key]: true }));
  const handleTouchEnd   = key => setTouchActive(prev => ({ ...prev, [key]: false }));

  // Audio + vibration feedback
  const handleAudioFeedback = () => {
    const audio = new Audio(click);
    audio.play();
    if (navigator.vibrate) navigator.vibrate(50);
  };

  // ——— Event Horizon (canvas particles + SVG filter) ———
  const eventCanvasRef = useRef();
  useEffect(() => {
    const canvas = eventCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];

    const spawn = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particles.push({ x, y, r: Math.random() * 1.5 + 0.5, alpha: 1 });
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.alpha -= 0.01;
        if (p.alpha <= 0) particles.splice(i, 1);
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.restore();
      });
      if (particles.length < 100) spawn();
      requestAnimationFrame(tick);
    };

    canvas.width = 200;
    canvas.height = 50;
    tick();
  }, []);

  // ——— Magnetic Repulsion ———
  const magRef = useRef();
  const [magnetPos, setMagnetPos] = useState({ x: 0, y: 0 });
  const handleMagneticMove = e => {
    const rect = magRef.current.getBoundingClientRect();
    const dx = rect.left + rect.width / 2 - e.clientX;
    const dy = rect.top + rect.height / 2 - e.clientY;
    const dist = Math.hypot(dx, dy) || 1;
    const maxForce = 20;
    const force = Math.min(maxForce, (maxForce * 100) / dist);
    setMagnetPos({ x: (dx / dist) * force, y: (dy / dist) * force });
  };
  const resetMagnet = () => setMagnetPos({ x: 0, y: 0 });


  // ——— Disco Disintegrate ———
  const handleDisco = (e) => {
    const btn = e.currentTarget;
    const { width, height } = btn.getBoundingClientRect();
    const pieces = [];
    const tileSize = 8;

    for (let x = 0; x < width; x += tileSize) {
      for (let y = 0; y < height; y += tileSize) {
        const div = document.createElement('div');
        div.className = 'tile';  // Make sure you have a CSS class to style the tile
        Object.assign(div.style, {
          width: `${tileSize}px`,
          height: `${tileSize}px`,
          left: `${x}px`,
          top: `${y}px`,
        });
        btn.appendChild(div);
        pieces.push(div);
      }
    }

    // Use GSAP for the animation
    gsap.fromTo(
      pieces,
      {
        opacity: 1,
        x: 0,
        y: 0,
      },
      {
        opacity: 0,
        x: () => gsap.utils.random(-100, 100),
        y: () => gsap.utils.random(-100, 100),
        stagger: 0.05,
        duration: 0.6,
        ease: 'expo.out',
        onComplete: () => pieces.forEach((p) => p.remove()),
      }
    );
  };

  
  return (
    <div className={styles.container}>

      {/* 1. 3D Morphing */}
      <button
        className={`${styles.button3D} ${touchActive.button3D ? styles.active3D : ''}`}
        onTouchStart={() => handleTouchStart('button3D')}
        onTouchEnd={() => handleTouchEnd('button3D')}
      >
        3D Morphing
      </button>

      {/* 2. Neumorphic Glow */}
      <button
        className={`${styles.neumorphic} ${touchActive.neumorphic ? styles.activeNeumorphic : ''}`}
        onTouchStart={() => handleTouchStart('neumorphic')}
        onTouchEnd={() => handleTouchEnd('neumorphic')}
      >
        Neumorphic Glow
      </button>

      {/* 3. Liquid Motion */}
      <button
        className={`${styles.liquid} ${touchActive.liquid ? styles.activeLiquid : ''}`}
        onTouchStart={() => handleTouchStart('liquid')}
        onTouchEnd={() => handleTouchEnd('liquid')}
      >
        Liquid Motion
      </button>

      {/* Retro Save */}
      <RetroSaveButton />

      {/* 4. Frosted Glass */}
      <button
        className={`${styles.glassmorphic} ${touchActive.glassmorphic ? styles.activeGlassmorphic : ''}`}
        onTouchStart={() => handleTouchStart('glassmorphic')}
        onTouchEnd={() => handleTouchEnd('glassmorphic')}
      >
        Frosted Glass
      </button>

      {/* 5. SVG Outline */}
      <button
        className={`${styles.svgOutline} ${touchActive.svgOutline ? styles.activeSvgOutline : ''}`}
        onTouchStart={() => handleTouchStart('svgOutline')}
        onTouchEnd={() => handleTouchEnd('svgOutline')}
      >
        <span style={{ position: 'relative', left: '-4px', fontSize: '14px' }}>
          SVG Outline
        </span>
        <svg
          className={styles.svgIcon}
          width="120" height="50"
          viewBox="0 0 120 50"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 5 H115 V45 H5 Z" />
        </svg>
      </button>

      {/* 6. Tiny Bounce */}
      <button
        className={`${styles.microInteraction} ${touchActive.microInteraction ? styles.activeMicroInteraction : ''}`}
        onTouchStart={() => handleTouchStart('microInteraction')}
        onTouchEnd={() => handleTouchEnd('microInteraction')}
      >
        Tiny Bounce
      </button>

      {/* 7. Color Shift */}
      <button
        className={`${styles.gradient} ${touchActive.gradient ? styles.activeGradient : ''}`}
        onTouchStart={() => handleTouchStart('gradient')}
        onTouchEnd={() => handleTouchEnd('gradient')}
      >
        Color Shift
      </button>

      {/* 8. Sensory Click */}
      <button
        className={`${styles.hapticFeedback} ${touchActive.hapticFeedback ? styles.activeHapticFeedback : ''}`}
        onClick={handleAudioFeedback}
        onTouchStart={() => handleTouchStart('hapticFeedback')}
        onTouchEnd={() => handleTouchEnd('hapticFeedback')}
      >
        Sensory Click
      </button>

      {/* ——— New: Event Horizon ——— */}
      <div className={styles.eventWrapper}>
        <canvas ref={eventCanvasRef} className={styles.eventCanvas} />
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <filter id="turbulence">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" />
          </filter>
        </svg>
        <button
          className={styles.eventHorizon}
          onTouchStart={() => handleTouchStart('eventHorizon')}
          onTouchEnd={() => handleTouchEnd('eventHorizon')}
        >
          Event Horizon
        </button>
      </div>

      {/* ——— New: Magnetic Repulsion ——— */}
      <div
        onMouseMove={handleMagneticMove}
        onMouseLeave={resetMagnet}
        style={{ display: 'inline-block' }}
      >
        <button
          ref={magRef}
          className={styles.magneticRepulsion}
          style={{ transform: `translate(${magnetPos.x}px, ${magnetPos.y}px)` }}
          onTouchStart={() => handleTouchStart('magneticRepulsion')}
          onTouchEnd={() => handleTouchEnd('magneticRepulsion')}
        >
          Magnetic Repulsion
        </button>
      </div>

      {/* ——— New: Disco Disintegrate ——— */}
      <button
        className={styles.discoDisintegrate}
        onClick={handleDisco}
        onTouchStart={() => handleTouchStart('discoDisintegrate')}
        onTouchEnd={() => handleTouchEnd('discoDisintegrate')}
      >
        Disco Disintegrate
      </button>

      {/* ——— New: Quantum Flicker ——— */}
      <button
        className={styles.quantumFlicker}
        style={{ '--rand': `${Math.random() * 200 + 100}ms` }}
        onTouchStart={() => handleTouchStart('quantumFlicker')}
        onTouchEnd={() => handleTouchEnd('quantumFlicker')}
      >
        Quantum Flicker
      </button>

    </div>
  );
};

export default UniqueButtons;
