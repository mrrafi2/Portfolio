
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from './About.module.css';
import profile from "../assets/profile.jpg";
import timelineTexts from '../data/timeline.json';
import CodeEditor from './CodeEditor';

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, type: 'spring', bounce: 0.2 }
  }
};

const textVariants = {
 collapsed: {
    maxHeight: '5.5rem',
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeInOut' }
  },
  expanded: {
    maxHeight: '1000px',
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeInOut' }
  }
};

const TimelineItem = ({ delay, title, text, styleClass, isDark }) => {
  const [expanded, setExpanded] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const paragraphs = Array.isArray(text) ? text : [text];

  return (
    <motion.div
      ref={ref}
      className={`${styles.timelineItem} ${styleClass} ${isDark ? styles.dark : styles.light}`}
      variants={itemVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay: parseFloat(delay) }}
      layout
      whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}
    >
      
      <motion.h3
        className={styles.timelineTitle}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { delay: parseFloat(delay) + 0.2, duration: 0.4 } }
        }}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        layout
        style={{marginTop:"1rem", marginBottom:"1rem"}}
      >
        {title}
      </motion.h3>

      <motion.div
        className={styles.timelineText}
        variants={textVariants}
        initial="collapsed"
        animate={expanded ? 'expanded' : 'collapsed'}
        style={{ transformOrigin: 'top' }}
        layout
      >
        {paragraphs.map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}
      </motion.div>

      <motion.button
        className={styles.seeMoreBtn}
        onClick={() => setExpanded(prev => !prev)}
        whileTap={{ scale: 0.95 }}
        layout
      >
        {expanded ? 'Show Less' : 'Read More'}
        <motion.i
          className={`fa-solid ${expanded ? 'fa-chevron-down' : 'fa-chevron-right'}`}
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>
    </motion.div>
  );
};

// Optimized Profile Card
const ProfileCard = ({ isDark }) => {
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { 
        opacity: 1, 
        scale: 1,
        transition: { duration: 0.8 }
      } : {}}
      className={`${styles.profileCard} ${isDark ? styles.dark : styles.light}`}
    >
      <div className={styles.profileFrame}>
        <img src={profile} alt="Profile" className={styles.profilePic} />
        <div className={styles.holographicRing}></div>
      </div>
      
      <h3 className={styles.fullName}>Abdus Sayem Rafi</h3>
      <p className={styles.title}>Diploma In Engineering</p>
      <p className={styles.field}>Chittagong Polytechnich Institute (CPI)</p>
      <p className={styles.location}>
        <i className="fa-sharp fa-solid fa-location-dot"></i>
        <span style={{ marginLeft: "4px" }}>Chittagong, Bangladesh</span>
      </p>
      
      <div className={styles.socialIcons}>
        {[
         { href: "https://www.linkedin.com/in/abdus-sayem-rafi-a01a25270/" , icon: "fa-linkedin"},
          { href: "https://github.com/mrrafi2", icon: "fa-github" },
          { href: "https://www.facebook.com/share/15ZTKuVpQk/", icon: "fa-facebook" },
          { href: "https://x.com/rafi_khan111?t=J0g3Cj3pADckzzebbW9AKA&s=09", icon: "fa-x-twitter" },

        ].map((social, idx) => (
          <a
            key={idx}
            href={social.href}
            target="_blank"
            rel="noreferrer"
            className={styles.socialIconBox}
          >
            <i className={`fa-brands ${social.icon}`}></i>
          </a>
        ))}
      </div>
    </motion.div>
  );
};

const About = () => {
  const [isDark, setIsDark] = useState(true);


  return (

    <section id="about" className={`${styles.about} ${isDark ? styles.dark : styles.light}`}>

    <svg
      width="0"
      height="0"
      style={{ position: 'absolute' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
      {/* Enhanced Wireframe Cube with depth */}
      <symbol id="shape-cube" viewBox="0 0 100 100">
        <g stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M25,25 L70,25 L70,70 L25,70 Z" />
          <path d="M25,25 L35,15 L80,15 L70,25" />
          <path d="M70,25 L80,15 L80,60 L70,70" />
          <path d="M35,15 L35,60 L25,70" strokeOpacity="0.4" />
          <path d="M35,60 L80,60" strokeOpacity="0.4" />
        </g>
      </symbol>

      {/* Smooth 3D Sphere with layered gradients */}
      <symbol id="shape-sphere" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="grad-sphere-main" cx="0.3" cy="0.3">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" />
            <stop offset="40%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
          </radialGradient>
          <radialGradient id="grad-sphere-highlight" cx="0.25" cy="0.25">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="30%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="38" fill="url(#grad-sphere-main)" />
        <circle cx="42" cy="42" r="12" fill="url(#grad-sphere-highlight)" />
      </symbol>

      {/* Organic Dodecagon with flowing curves */}
      <symbol id="shape-dodec" viewBox="0 0 100 100">
        <g stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round">
          <path d="M50,8 C65,12 88,20 92,45 C88,70 65,88 50,92 C35,88 12,70 8,45 C12,20 35,12 50,8 Z" />
          <path d="M50,8 Q50,35 50,92" strokeOpacity="0.3" />
          <path d="M8,45 Q35,45 92,45" strokeOpacity="0.3" />
          <path d="M22,22 Q45,45 78,78" strokeOpacity="0.2" />
          <path d="M78,22 Q55,45 22,78" strokeOpacity="0.2" />
        </g>
      </symbol>

      {/* Elegant Star with curved points */}
      <symbol id="shape-star" viewBox="0 0 100 100">
        <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M50,5 C52,18 58,35 75,35 C62,42 55,55 62,75 C50,68 40,68 38,75 C45,55 38,42 25,35 C42,35 48,18 50,5 Z" />
          <circle cx="50" cy="50" r="3" fill="currentColor" opacity="0.6" />
        </g>
      </symbol>

      {/* Realistic Planet with atmospheric ring */}
      <symbol id="shape-planet" viewBox="0 0 100 100">
        <defs>
          <radialGradient id="grad-planet" cx="0.35" cy="0.35">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
            <stop offset="70%" stopColor="currentColor" stopOpacity="0.2" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
          </radialGradient>
        </defs>
        <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="50" cy="50" r="28" fill="url(#grad-planet)" />
          <ellipse cx="50" cy="50" rx="42" ry="8" transform="rotate(25 50 50)" opacity="0.4" />
          <ellipse cx="50" cy="50" rx="45" ry="6" transform="rotate(25 50 50)" opacity="0.2" />
          <path d="M30,45 Q40,35 60,40" strokeOpacity="0.3" strokeWidth="1" />
          <circle cx="42" cy="38" r="1.5" fill="currentColor" opacity="0.5" />
        </g>
      </symbol>

      {/* Crescent Moon with surface detail */}
      <symbol id="shape-moon" viewBox="0 0 100 100">
        <g fill="none" stroke="currentColor" strokeLinecap="round">
          <path
            d="M65,50 A28,28 0 1,1 42,22 A18,18 0 1,0 65,50 Z"
            strokeWidth="2.5"
          />
          <circle cx="45" cy="35" r="1.5" fill="currentColor" opacity="0.4" />
          <circle cx="55" cy="55" r="1" fill="currentColor" opacity="0.3" />
          <path d="M48,45 Q52,43 56,47" strokeWidth="1" strokeOpacity="0.2" />
        </g>
      </symbol>

      {/* Dynamic Comet with flowing tail */}
      <symbol id="shape-comet" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="grad-comet-tail" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.2" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="currentColor" strokeLinecap="round">
          <circle cx="25" cy="75" r="6" fill="currentColor" opacity="0.7" />
          <circle cx="25" cy="75" r="3" fill="currentColor" />
          <path d="M31,81 Q45,65 65,45 Q80,30 90,15" strokeWidth="2" stroke="url(#grad-comet-tail)" />
          <path d="M33,83 Q47,67 67,47 Q82,32 92,17" strokeWidth="1" strokeOpacity="0.3" />
          <path d="M29,79 Q43,63 63,43 Q78,28 88,13" strokeWidth="1" strokeOpacity="0.3" />
        </g>
      </symbol>

      {/* Constellation with connecting energy lines */}
      <symbol id="shape-constellation" viewBox="0 0 100 100">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g>
          {/* Connection lines with energy flow */}
          <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.4">
            <path d="M22,28 Q35,20 48,18" />
            <path d="M52,22 Q65,30 78,38" />
            <path d="M80,42 Q75,55 65,68" />
            <path d="M62,72 Q50,70 32,68" />
            <path d="M28,65 Q22,50 20,32" />
          </g>
          {/* Stars with subtle glow */}
          <g fill="currentColor" filter="url(#glow)">
            <circle cx="20" cy="30" r="2.5" />
            <circle cx="50" cy="18" r="2" />
            <circle cx="80" cy="40" r="2.5" />
            <circle cx="65" cy="70" r="2" />
            <circle cx="30" cy="67" r="2" />
          </g>
        </g>
      </symbol>

      {/* Bonus: Torus/Ring shape */}
      <symbol id="shape-torus" viewBox="0 0 100 100">
        <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <ellipse cx="50" cy="50" rx="35" ry="35" strokeOpacity="0.6" />
          <ellipse cx="50" cy="50" rx="20" ry="20" strokeOpacity="0.4" />
          <ellipse cx="50" cy="50" rx="35" ry="10" strokeOpacity="0.3" />
          <ellipse cx="50" cy="50" rx="35" ry="10" transform="rotate(90 50 50)" strokeOpacity="0.3" />
        </g>
      </symbol>
    </defs>

    </svg>

    {/* FLOATING BACKGROUND SHAPES */}
    <div className={styles.svgBackground}>
      {Array.from({ length: 120 }).map((_, i) => {
        const shapes = ['cube', 'sphere', 'dodec', 'torus', 'star','planet',  'moon','comet', 'constellation', ];
        const shape = shapes[i % shapes.length];
const size = 20 + Math.random() * 30;    
const left = Math.random() * 90;           
const top  = Math.random() * 90;          
const delay = Math.random() * 5;           
const duration = 10 + Math.random() * 10; 
        return (
          <svg
            key={i}
            className={styles.floatingShape}
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              top: `${top}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <use xlinkHref={`#shape-${shape}`} />
          </svg>
        );
      })}
    </div>

      {/* Theme Toggle */}
      <div className={styles.themeToggle}>
        <button
          onClick={() => setIsDark(!isDark)}
          className={styles.toggleBtn}
          style={{}}
        >
          <i className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
        </button>
      </div>

      
      {/* Floating Code Editor */}
      <div className={styles.floatingEditor}>
        <CodeEditor isDark={isDark} />
      </div>

      <br />

      <div className={styles.contentWrapper}>
        {/* Profile Card */}
        <ProfileCard isDark={isDark} />

        <div className={styles.timeline}>
          <motion.h2 
            className={styles.timelineHeading}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <span className={styles.glitchText}>My Detailed Journey</span>
          </motion.h2>
          
          <div className={styles.timelineList}>
            {Object.entries(timelineTexts).map(([title, text], index) => (
              <TimelineItem 
                key={title}
                delay={`${0.2 + index * 0.2}`}
                title={title === "Crafting Real-World Projects" ? "Crafting Real-World Projects" : 
                       title === "Forging Foundations" ? "Forging Foundations" :
                       title === "Learning" ? "Continuous Learning" : title}
                text={text}
                styleClass={`${styles[`item${index + 1}`]}`}
                index={index}
                isDark={isDark}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
