import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Download, Github, Linkedin, Mail, ChevronDown } from 'lucide-react';
import styles from './Hero.module.css';
import ProfileImg from "../assets/profile-pic-org.jpg";

const phrases = ["Web Application Developer", "UI/UX Designer", "Creative Technologist", "Problem Solver"];

const Hero = () => {

  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [typing, setTyping] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // put near top of Hero component
const profileRef = useRef(null);
const rafRef = useRef(null);

const [profileHover, setProfileHover] = useState(false);

useEffect(() => {
  return () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };
}, []);

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;

const target = { rx: 0, ry: 0, tx: 0, ty: 0, s: 1 };
const current = { rx: 0, ry: 0, tx: 0, ty: 0, s: 1 };

const animateProfile = () => {
  // damping factor, tweak for softness: smaller = slower
  const ease = 0.18;
  current.rx = lerp(current.rx, target.rx, ease);
  current.ry = lerp(current.ry, target.ry, ease);
  current.tx = lerp(current.tx, target.tx, ease);
  current.ty = lerp(current.ty, target.ty, ease);
  current.s = lerp(current.s, target.s, ease);

  const el = profileRef.current;
  if (el) {
    el.style.setProperty('--pf-rot-x', `${current.rx.toFixed(3)}deg`);
    el.style.setProperty('--pf-rot-y', `${current.ry.toFixed(3)}deg`);
    el.style.setProperty('--pf-translate-x', `${current.tx.toFixed(2)}px`);
    el.style.setProperty('--pf-translate-y', `${current.ty.toFixed(2)}px`);
    el.style.setProperty('--pf-scale', current.s.toFixed(3));
  }

  rafRef.current = requestAnimationFrame(animateProfile);
};

// start loop once component mounts
useEffect(() => {
  rafRef.current = requestAnimationFrame(animateProfile);
  return () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };
}, []);

// pointer handlers (only update target values)
const handleProfilePointer = (e) => {
  const el = profileRef.current;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const px = ((e.clientX - rect.left) / rect.width) - 0.5; // -0.5 .. 0.5
  const py = ((e.clientY - rect.top) / rect.height) - 0.5;

  const MAX_TILT = 8; // degrees
  const MAX_SHIFT = 10; // px
  const HOVER_SCALE = 1.035;

  target.rx = clamp(-py * MAX_TILT, -MAX_TILT, MAX_TILT);
  target.ry = clamp(px * MAX_TILT, -MAX_TILT, MAX_TILT);
  target.tx = clamp(-px * MAX_SHIFT, -MAX_SHIFT, MAX_SHIFT) * 0.8;
  target.ty = clamp(-py * (MAX_SHIFT * 0.6), -MAX_SHIFT, MAX_SHIFT) * 0.8;
  target.s = HOVER_SCALE;
};

const handleProfileEnter = () => {
  setProfileHover(true);
  target.s = 1.035;
};

const handleProfileLeave = () => {
  setProfileHover(false);
  target.rx = 0; target.ry = 0; target.tx = 0; target.ty = 0; target.s = 1;
};

const handleProfileTouchStart = (e) => {
  // set a subtle scale on touch
  target.s = 1.02;
};

  // Typing animation
  useEffect(() => {
    const phrase = phrases[phraseIndex];
    const timeout = setTimeout(() => {
      if (typing) {
        if (charIndex < phrase.length) {
          setDisplayText(prev => prev + phrase[charIndex]);
          setCharIndex(ci => ci + 1);
        } else {
          setTimeout(() => setTyping(false), 1600);
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(prev => prev.slice(0, -1));
          setCharIndex(ci => ci - 1);
        } else {
          setTyping(true);
          setPhraseIndex(pi => (pi + 1) % phrases.length);
        }
      }
    }, typing ? 100 : 60);

    return () => clearTimeout(timeout);
  }, [charIndex, typing, phraseIndex]);


  
const handleResumeDownload = async () => {
  
  const resumeUrl = new URL('/AS_Rafi_Resume_Main.pdf', import.meta.env.BASE_URL).href;

  try {
    let headRes;
    try {
      headRes = await fetch(resumeUrl, { method: 'HEAD' });
    } catch (err) {
      console.warn('HEAD request failed (might be blocked). Falling back to GET.', err);
      headRes = null;
    }

    const contentType = headRes?.headers?.get?.('content-type') ?? '';


    if (headRes && (!headRes.ok || !/pdf/i.test(contentType))) {
      console.error('HEAD check: server returned non-PDF or error:', headRes.status, contentType);
      alert('Resume not found as PDF on the server. Opening the path so you can inspect what was returned.');
      window.open(resumeUrl, '_blank', 'noopener');
      return;
    }

    
    if (headRes && headRes.ok && /pdf/i.test(contentType)) {
      const a = document.createElement('a');
      a.href = resumeUrl;
      a.download = 'Rafi_Resume.pdf';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }

    // If HEAD was unavailable (or inconclusive), fetch the resource and check Content-Type
    const getRes = await fetch(resumeUrl);
    const ct = getRes.headers.get('content-type') || '';

    if (!getRes.ok) {
      console.error('GET request failed:', getRes.status, ct);
      alert('Failed to fetch resume from server. Open the resume URL in a new tab to debug.');
      window.open(resumeUrl, '_blank', 'noopener');
      return;
    }

    if (!/pdf/i.test(ct)) {
    
      console.error('GET returned non-PDF content-type:', ct);
      alert('Server returned non-PDF content. Opening the URL so you can inspect what the server returned.');
      window.open(resumeUrl, '_blank', 'noopener');
      return;
    }

    
    const blob = await getRes.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = 'Rafi_Resume.pdf';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();

    // cleanup
    setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
  } catch (error) {
    console.error('Unexpected error while downloading resume:', error);
    
    window.open(resumeUrl, '_blank', 'noopener');
  }
};

const handleScrollToProjects = () => {
const target = document.querySelector('#projects');
if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

  const metrics = [
    { label: "Projects", value: "8+" },
    { label: "LOC", value: "45K+" },
    { label: "Hours Coded", value: "400+" },
  ];

  
  return (
    <div className={`${styles.heroContainer} ${isDark ? styles.dark : ''}`} data-theme={isDark ? 'dark' : 'light'}>

      {/* Cosmic background and decorative blobs */}
      <div className={styles.cosmicBackground} aria-hidden>
        <div className={styles.starField}></div>
        <div className={styles.blobOne}></div>
        <div className={styles.blobTwo}></div>
      </div>

     

      {/* Main content */}
      <main className={styles.heroContent}>
        <div className={styles.contentGrid}>

          {/* Left — Text, roles, metrics, CTAs */}
          <section className={styles.textSection}>
            <header className={styles.heroHeader}>
              <div className={styles.greetingRow}>
                <div className={styles.greetingText} >Hello, I'm</div>
               
              </div>

              <h1 className={styles.heroName}>
                <span className={styles.nameText}>RAFI</span>
                <span className={styles.nameSuffix}>.</span>
              </h1>

              <div className={styles.roleContainer}>
                <span className={styles.rolePrefix}>A </span>
                <span className={styles.dynamicRole}>{displayText}</span>
                <span className={styles.cursor}>|</span>
              </div>

             
            </header>

           

            {/* Performance Metrics */}
            <div className={styles.metricsGrid}>
              {metrics.map(({ label, value }) => (
                <div key={label} className={styles.metricCard}>
                  <div className={styles.metricValue}>{value}</div>
                  <span className={styles.metricLabel}>{label}</span>
                </div>
              ))}
            </div>

           <p className={styles.description}>
             I design and build web applications that blend creativity with engineering. By combining human-centered design with technical precision, I deliver fast, reliable, and engaging digital experiences.
         </p>

            {/* Action Controls */}
            <div className={styles.actionGrid}>
              <button className={styles.primaryAction} onClick={handleResumeDownload} aria-label="Download resume">
                <Download size={18} />
                <span>Download Resume</span>
              </button>

            

              <nav className={styles.socialNav} aria-label="social links">
                <a href="https://github.com/mrrafi2" className={styles.socialLink} target='_blank' rel='noreferrer'>
                  <Github size={18} />
                </a>
                <a href="https://www.linkedin.com/in/abdus-sayem-rafi-a01a25270/" className={styles.socialLink} target='_blank' rel='noreferrer'>
                  <Linkedin size={18} />
                </a>
                <a href="mailto:rafibd2290@gmail.com" className={styles.socialLink} target='_blank' rel='noreferrer'>
                  <Mail size={18} />
                </a>
              </nav>
            </div>
        
          </section>

          {/*  Visual / Profile with orbiters */}
          <section className={styles.visualSection}>
  <div
    className={styles.profileWrap}
    ref={(el) => (profileRef.current = el)}
    onMouseMove={handleProfilePointer}
    onMouseEnter={handleProfileEnter}
    onMouseLeave={handleProfileLeave}
    onTouchStart={handleProfileTouchStart}
    aria-hidden={false}
  >
    <div className={styles.orbiters} aria-hidden>
      <div className={`${styles.orbiter} ${styles.orbiterA}`}></div>
      <div className={`${styles.orbiter} ${styles.orbiterB}`}></div>
      <div className={`${styles.orbiter} ${styles.orbiterC}`}></div>
    </div>

    <div className={styles.profileFrame} role="img" aria-label="Rafi portrait">
      <div className={styles.gradientRing} />
      <div className={styles.rimLight} />
      <img
        src={ProfileImg}
        alt="Rafi - Web Developer"
        className={styles.profileImage}
        loading="eager"
        decoding="async"
        width="700"
        height="700"
      />
      <div className={styles.gloss} aria-hidden />
      <div className={styles.filmGrain} aria-hidden />
    </div>
  </div>
</section>

        </div>

    <div className={styles.scrollArea}>
<button className={styles.scrollIndicator} onClick={handleScrollToProjects} aria-label="See my work (scroll down)">
<div className={styles.mouse}><span className={styles.wheel}></span></div>
<div className={styles.scrollText}>See my works</div>
<ChevronDown className={styles.downIcon} size={18} />
</button>
</div>
       

      </main>


    </div>
  );
};

export default Hero;
