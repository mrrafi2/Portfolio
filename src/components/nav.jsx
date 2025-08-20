
import React, { useState, useEffect } from "react";
import logo from "../assets/rafilogo.png";
import styles from "./nav.module.css";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHideNav(true); // scroll down
      } else {
        setHideNav(false); // scroll up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div>
      <nav
        className={`${styles.stickyNav} ${
          hideNav ? styles.hide : styles.show
        }`}
      >
        {/* Holographic Grid Background */}
        <div className={styles.holoGrid}></div>
        <div className={styles.scanLine}></div>
        
        {/* Floating Particles */}
        <div className={styles.navParticles}>
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className={styles.particle}
              style={{
                '--delay': `${i * 0.8}s`,
                '--x': `${Math.random() * 100}%`,
                '--duration': `${8 + i * 2}s`
              }}
            ></div>
          ))}
        </div>

        {/* Logo Section */}
        <div className={styles.logoContainer}>
          <div className={styles.logoOrb}></div>
          <div className={styles.logo}>
            <img src={logo} alt="Rafi" />
          </div>
          <div className={styles.logoRipple}></div>
        </div>

     
        {/* Quantum Menu Button */}
        <div className={styles.quantumButton} onClick={toggleMenu}>
          <div className={styles.quantumCore}></div>
          <div className={styles.quantumRings}>
            <div className={styles.ring}></div>
            <div className={styles.ring}></div>
            <div className={styles.ring}></div>
          </div>
          <div className={`${styles.quantumIcon} ${menuOpen ? styles.open : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      <div className={`${styles.quantumOverlay} ${menuOpen ? styles.expanded : ""}`}>
        <div className={styles.overlayParticles}>
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className={styles.overlayParticle}
              style={{
                '--delay': `${i * 0.3}s`,
                '--x': `${Math.random() * 100}%`,
                '--y': `${Math.random() * 100}%`
              }}
            ></div>
          ))}
        </div>
        
        <div className={styles.overlayGrid}></div>
        
        {menuOpen && (
          <>
            <div className={styles.closeButton} onClick={toggleMenu}>
              <div className={styles.closeIcon}></div>
            </div>
            
            <div className={styles.overlayContent}>
              <div className={styles.menuTitle}>
                <span className={styles.titleGlitch}>NAVIGATION</span>
                <div className={styles.titleUnderline}></div>
              </div>
              
              <ul className={styles.overlayNav}>
                <li>
                  <a href="#about" onClick={toggleMenu}>
                    <span className={styles.navNumber}>01</span>
                    <span className={styles.navText}>About Me</span>
                    <div className={styles.navHover}></div>
                  </a>
                </li>
                <li>
                  <a href="#projects" onClick={toggleMenu}>
                    <span className={styles.navNumber}>02</span>
                    <span className={styles.navText}>Projects</span>
                    <div className={styles.navHover}></div>
                  </a>
                </li>
                <li>
                  <a href="#contact" onClick={toggleMenu}>
                    <span className={styles.navNumber}>03</span>
                    <span className={styles.navText}>Contact</span>
                    <div className={styles.navHover}></div>
                  </a>
                </li>
              </ul>
              
              
            </div>
          </>
        )}
      </div>
    </div>
  );
}
