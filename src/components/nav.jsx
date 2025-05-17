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
        <div className={styles.logo}>
          <img src={logo} alt="Rafi" />
        </div>

        <div className={styles.morphButton} onClick={toggleMenu}>
          <div
            className={`${styles.morphIcon} ${menuOpen ? styles.open : ""}`}
          ></div>
        </div>
      </nav>

      <div
        className={`${styles.morphOverlay} ${
          menuOpen ? styles.expanded : ""
        }`}
      >
        {menuOpen && (
          <>
            <div className={styles.closeButton} onClick={toggleMenu}>
              &times;
            </div>
            <ul className={styles.overlayNav}>
              <li>
                <a href="#about" onClick={toggleMenu}>
                  About Me
                </a>
              </li>
              <li>
                <a href="#projects" onClick={toggleMenu}>
                  Projects
                </a>
              </li>
              
              <li>
                <a href="#contact" onClick={toggleMenu}>
                  Message
                </a>
              </li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
