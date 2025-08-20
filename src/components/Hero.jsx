
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sun, Moon, Download, Github, Linkedin, Mail } from 'lucide-react';
import styles from './Hero.module.css';
import Lottie from 'lottie-react';
import cyberCode from "../lottie.json"
import CountUp from 'react-countup';

const phrases = ["Web Application Developer", "UI/UX Designer", "Creative Technologist", "Problem Solver"];
const introLines = ["▌LOADING PORTFOLIO..."];

const Hero = () => {
  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [typing, setTyping] = useState(true);

  // Intro sequence
  const [showIntro, setShowIntro] = useState(true);
  const [introText, setIntroText] = useState("");
  const [introLineIndex, setIntroLineIndex] = useState(0);
  const [introCharIndex, setIntroCharIndex] = useState(0);
  const [introTyping, setIntroTyping] = useState(true);
  const introTimeoutRef = useRef(null);

  // Animation refs
  const heroRef = useRef(null);
  const parallaxRef = useRef(null);
  const rafRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });

  // Intro sequence effect
  useEffect(() => {
    if (!showIntro) return;
    const line = introLines[introLineIndex];
    if (introTyping) {
      if (introCharIndex < line.length) {
        introTimeoutRef.current = setTimeout(() => {
          setIntroText(prev => prev + line[introCharIndex]);
          setIntroCharIndex(i => i + 1);
        }, 80);
      } else {
        introTimeoutRef.current = setTimeout(() => setIntroTyping(false), 800);
      }
    } else {
      if (introLineIndex < introLines.length - 1) {
        introTimeoutRef.current = setTimeout(() => {
          setIntroLineIndex(i => i + 1);
          setIntroCharIndex(0);
          setIntroText("");
          setIntroTyping(true);
        }, 1000);
      } else {
        introTimeoutRef.current = setTimeout(() => setShowIntro(false), 1200);
      }
    }
    return () => clearTimeout(introTimeoutRef.current);
  }, [introCharIndex, introTyping, introLineIndex, showIntro]);

  // Typing animation effect
  useEffect(() => {
    if (showIntro) return;
    const phrase = phrases[phraseIndex];
    let t;
    if (typing) {
      if (charIndex < phrase.length) {
        t = setTimeout(() => {
          setDisplayText(prev => prev + phrase[charIndex]);
          setCharIndex(ci => ci + 1);
        }, 120);
      } else {
        t = setTimeout(() => setTyping(false), 2000);
      }
    } else {
      if (charIndex > 0) {
        t = setTimeout(() => {
          setDisplayText(prev => prev.slice(0, -1));
          setCharIndex(ci => ci - 1);
        }, 80);
      } else {
        setTyping(true);
        setPhraseIndex(pi => (pi + 1) % phrases.length);
      }
    }
    return () => clearTimeout(t);
  }, [charIndex, typing, phraseIndex, showIntro]);

  // Enhanced parallax with performance optimization
  useEffect(() => {
    const updateParallax = () => {
      if (parallaxRef.current) {
        const x = mousePos.current.x * 0.02;
        const y = mousePos.current.y * 0.02;
        parallaxRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    };

    const onMouseMove = (e) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 100,
        y: (e.clientY / window.innerHeight - 0.5) * 100
      };
      
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateParallax);
    };

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleResumeDownload = useCallback(() => {
    const resumeUrl = '/path/to/your/resume.pdf';
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'Rafi_Resume.pdf';
    link.click();
  }, []);

  if (showIntro) {
    return (
      <div className={styles.introOverlay} role="presentation">
        <div className={styles.introContainer}>
          <div className={styles.loadingSpinner} aria-label="Loading portfolio"></div>
          <pre className={styles.introText} aria-live="polite">
            {introText}
            <span className={styles.cursor} aria-hidden="true">|</span>
          </pre>
        </div>
      </div>
    );
  }

  const metrics = [
    { label: "Projects", value: "8+", goal: 10, color: "var(--cosmic-blue)" },
    { label: "LOC", value: "45K+", goal: 100, color: "var(--cosmic-purple)" },
    { label: "Hours Coded", value: "400+", goal:500, color: "var(--cosmic-pink)" },
  ];

  return (
    <div className={styles.heroContainer} ref={heroRef}>
      {/* Cosmic Background Layers */}
      <div className={styles.cosmicBackground} ref={parallaxRef} aria-hidden="true">
        <div className={styles.starField}></div>
        <div className={styles.nebulaField}></div>
        <div className={styles.cosmicGrid}></div>
      </div>

      {/* Floating Cosmic Particles */}
      <div className={styles.particleField} aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className={styles.cosmicParticle}
            style={{
              '--delay': `${i * 0.8}s`,
              '--duration': `${20 + i * 3}s`,
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`,
              '--size': `${2 + Math.random() * 4}px`
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <main className={styles.heroContent}>
        <div className={styles.contentGrid}>
          {/* Text Section */}
          <section className={styles.textSection}>
            <header className={styles.heroHeader}>
              <div className={styles.greeting}>
                <span className={styles.greetingText}>Hello, I'm</span>
              </div>
              
              <h1 className={styles.heroName}>
                <span className={styles.nameText}>RAFI</span>
                <div className={styles.nameGlow} aria-hidden="true"></div>
              </h1>

              <div className={styles.roleContainer}>
                <span className={styles.rolePrefix}>A </span>
                <span className={styles.dynamicRole} aria-live="polite">{displayText}</span>
                <span className={styles.cursor} aria-hidden="true">|</span>
              </div>
            </header>

            {/* Cosmic Skills Visualization */}
            <div className={styles.skillsConstellation} role="img" aria-label="Skills breakdown">
              <div className={styles.skillOrb} data-skill="Frontend Expertise" style={{'--skill-color': 'var(--cosmic-blue)' ,'--skill-percent':'95%' }}>
                <div className={styles.orbCore}></div>
                <div className={styles.orbRing}></div>
                <span className={styles.orbLabel}>{'95%'}</span>

              </div>
              <div className={styles.skillOrb} data-skill="Backend Expertise" style={{'--skill-color': 'var(--cosmic-purple)', '--skill-percent':'75%'}}>
                <div className={styles.orbCore}></div>
                <div className={styles.orbRing}></div>
                  <span className={styles.orbLabel}>{'75%'}</span>
              </div>
              <div className={styles.skillConnection} aria-hidden="true"></div>
            </div>

            {/* Performance Metrics */}
            <div className={styles.metricsGrid} role="group" aria-label="Key statistics">
              {metrics.map(({ label, value, goal, color }) => {
                const percent = Math.min(100, Math.round((parseInt(value) / goal) * 100));
                return (
                  <div key={label} className={styles.metricCard} aria-label={`${label}: ${value}`}>
                    <div className={styles.metricValue}>
                      <CountUp 
                        start={0} 
                        end={parseFloat(value)} 
                        duration={2.5} 
                        separator="," 
                        suffix={value.replace(/[\d.,]/g, '')}
                      />
                    </div>
                    <div className={styles.metricOrbit} aria-hidden="true">
                      <div 
                        className={styles.orbitPath}
                        style={{ 
                          '--progress': `${percent}%`,
                          '--metric-color': color
                        }}
                      ></div>
                    </div>
                    <span className={styles.metricLabel}>{label}</span>
                  </div>
                );
              })}
            </div>

            <p className={styles.description}>
              I design and build applications where creativity meets computation.  
              Leveraging the best of human intuition and machine precision, I turn ideas into seamless digital experiences that work smart and look sharp.
     </p>


            {/* Action Controls */}
            <div className={styles.actionGrid}>
              <button 
                className={styles.primaryAction}
                onClick={handleResumeDownload}
                aria-label="Download resume PDF"
              >
                <Download size={20} aria-hidden="true" />
                <span>Download Resume</span>
                <div className={styles.actionGlow} aria-hidden="true"></div>
              </button>
              
              <nav className={styles.socialNav} aria-label="Social media links">
                <a href="mailto:rafibd2290@gmail.com" className={styles.socialLink} aria-label="Send email">
                  <Mail size={18} aria-hidden="true" />
                </a>
                <a href="https://github.com/mrrafi2" className={styles.socialLink} aria-label="View GitHub profile">
                  <Github size={18} aria-hidden="true" />
                </a>
                <a href="https://www.linkedin.com/in/abdus-sayem-rafi-a01a25270/" className={styles.socialLink} aria-label="View LinkedIn profile">
                  <Linkedin size={18} aria-hidden="true" />
                </a>
              </nav>
            </div>
          </section>

          {/* Visual Section */}
          <section className={styles.visualSection}>
            <div className={styles.cosmicFrame}>
              <Lottie
                className={styles.heroVisual}
                animationData={cyberCode}
                loop
                autoplay
                aria-hidden="true"
              />
              <div className={styles.frameGlow} aria-hidden="true"></div>
            </div>
          </section>
        </div>
      </main>

      {/* Ambient Effects */}
      <div className={styles.ambientEffects} aria-hidden="true">
        <div className={styles.scanLines}></div>
        <div className={styles.cosmicNoise}></div>
      </div>
    </div>
  );
};

export default Hero;
