// Hero.jsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './Hero.module.css';

const phrases = ["Web Developer", "UI/UX Designer", "Creative Technologist"];
const introLines = [
  "▌LOADING ...",
  "▌READY >> Hello, World. RAFI is online."
];
const Hero = () => {
  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [typing, setTyping] = useState(true);

  // — Intro sequence
  const [showIntro, setShowIntro] = useState(true);
  const [introText, setIntroText] = useState("");
  const [introLineIndex, setIntroLineIndex] = useState(0);
  const [introCharIndex, setIntroCharIndex] = useState(0);
  const [introTyping, setIntroTyping] = useState(true);
  const introTimeoutRef = useRef(null);

  // — Parallax ref
  const bgLayerRef = useRef(null);

  useEffect(() => {
    if (!showIntro) return;
    const line = introLines[introLineIndex];
    if (introTyping) {
      if (introCharIndex < line.length) {
        introTimeoutRef.current = setTimeout(() => {
          setIntroText(prev => prev + line[introCharIndex]);
          setIntroCharIndex(i => i + 1);
        }, 100);
      } else {
        introTimeoutRef.current = setTimeout(() => setIntroTyping(false), 500);
      }
    } else {
      if (introLineIndex < introLines.length - 1) {
        introTimeoutRef.current = setTimeout(() => {
          setIntroLineIndex(i => i + 1);
          setIntroCharIndex(0);
          setIntroText("");
          setIntroTyping(true);
        }, 800);
      } else {
        introTimeoutRef.current = setTimeout(() => setShowIntro(false), 800);
      }
    }
    return () => clearTimeout(introTimeoutRef.current);
  }, [introCharIndex, introTyping, introLineIndex, showIntro]);

  useEffect(() => {
    if (showIntro) return;
    const phrase = phrases[phraseIndex];
    let t;
    if (typing) {
      if (charIndex < phrase.length) {
        t = setTimeout(() => {
          setDisplayText(prev => prev + phrase[charIndex]);
          setCharIndex(ci => ci + 1);
        }, 150);
      } else {
        t = setTimeout(() => setTyping(false), 1000);
      }
    } else {
      if (charIndex > 0) {
        t = setTimeout(() => {
          setDisplayText(prev => prev.slice(0, -1));
          setCharIndex(ci => ci - 1);
        }, 100);
      } else {
        setTyping(true);
        setPhraseIndex(pi => (pi + 1) % phrases.length);
      }
    }
    return () => clearTimeout(t);
  }, [charIndex, typing, phraseIndex, showIntro]);

  // Parallax background
  useEffect(() => {
    const onMove = e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      if (bgLayerRef.current) {
        bgLayerRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Show intro overlay or main hero
  if (showIntro) {
    return (
      <div className={styles.introOverlay}>
        <pre className={styles.introText}>
          {introText}
          <span className={styles.cursor}>|</span>
        </pre>
      </div>
    );
  }

  return (
    <div className={styles.heroContainer}>
      <div className={styles.backgroundLayer} ref={bgLayerRef}>
        <div className={styles.circuitLines}></div>
        <div className={styles.particleField}></div>
      </div>
      <div className={styles.asciiRain}></div>

      {/* Desktop Layout */}
      <div className={`${styles.heroContent} ${styles.desktopLayout}`}>
        <div className={styles.heroTextContainer}>
          <h2 className={styles.greeting}>HEY! I AM</h2>
          <h1 className={styles.name}>RAFI</h1>

          <div className={styles.levelBar}>
            <div className={styles.levelFill}></div>
          </div>
          <p className={styles.profession}>
            A <span className={styles.dynamic}>{displayText}</span>
            <span className={styles.cursor}>|</span>
          </p>
          <p className={styles.motto}>
          "I craft high-performing, scalable interfaces tailored for real users—balancing aesthetic, performance, and precision engineering."
          </p>
        </div>

       
      </div>

      {/* Mobile Overlay Layout */}
      <div className={`${styles.heroContent} ${styles.mobileOverlay}`}>
        <div className={styles.imageOverlayContainer}>
          <div className={styles.imageTextOverlay}>
            <h2 className={styles.greeting}>HEY! I AM</h2>
            <h1 className={styles.name}>RAFI</h1>
            <div className={styles.levelBar}>
              <div className={styles.levelFill}></div>
            </div>
            <p className={styles.profession}>
           <span style={{color:'#fff'}}>A</span>    <span className={styles.dynamic}>{displayText}</span>
              <span className={styles.cursor}>|</span>
            </p>
            <p className={styles.motto}>
              "Crafting immersive digital experiences with precision & creativity."
            </p>
          </div>
        </div>
      </div>

      <div className={styles.hologramEffects}></div>
    </div>
  );
};

export default Hero;
