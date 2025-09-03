import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.paper}>

        {/* Top line: Name + Location */}
        <div className={styles.headerLine}>
          <span className={styles.name}>Abdus Sayem Rafi</span>
          <span className={styles.location}>Chittagong, Bangladesh</span>
        </div>

        {/* Middle: Tagline + Note */}
        <p className={styles.tagline}>
          Web Application & Full Stack Developer. <span className={styles.open}>Open to work.</span>
        </p>
        <p className={styles.note}>Available for freelance, part-time & full-time.</p>

        {/* Contact */}
        <a className={styles.email} href="mailto:rafibd2290@gmail.com">
          rafibd2290@gmail.com
        </a>

        {/* Actions */}
        <div className={styles.actions}>
          <a className={styles.resume} href="/AS_Rafi_Resume_Main.pdf" download>
             Resume
          </a>

          <a
            className={styles.iconLink}
            href="https://github.com/mrrafi2"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub — Abdus Sayem Rafi"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M8 0.5C3.866 0.5 0.5 3.866 0.5 8c0 3.338 2.164 6.166 5.169 7.164.378.07.516-.164.516-.364 0-.18-.006-.78-.01-1.41-2.102.456-2.546-1.012-2.546-1.012-.345-.876-.843-1.11-.843-1.11-.689-.47.052-.46.052-.46.762.054 1.164.783 1.164.783.677 1.16 1.776.825 2.208.63.068-.49.265-.825.482-1.015-1.678-.191-3.438-.839-3.438-3.734 0-.825.295-1.5.78-2.028-.078-.192-.338-.964.074-2.008 0 0 .638-.205 2.09.778A7.26 7.26 0 0 1 8 4.52c.646.003 1.296.087 1.903.255 1.45-.983 2.087-.778 2.087-.778.415 1.044.155 1.816.077 2.008.486.528.78 1.203.78 2.028 0 2.904-1.761 3.54-3.442 3.726.273.236.516.697.516 1.405 0 1.015-.009 1.835-.009 2.086 0 .2.136.438.52.362C13.838 14.16 16 11.332 16 8c0-4.134-3.366-7.5-8-7.5z" fill="currentColor"/>
            </svg>
          </a>

          <a
  className={styles.iconLink}
  href="https://www.linkedin.com/in/abdus-sayem-rafi" 
  target="_blank"
  rel="noopener noreferrer"
  aria-label="LinkedIn — Abdus Sayem Rafi"
>
  <svg
    width="18"
    height="18"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M2.667 5.333H5.2V13.333H2.667V5.333ZM3.933 2.667C3.067 2.667 2.4 3.333 2.4 4.133C2.4 4.933 3.067 5.6 3.933 5.6C4.8 5.6 5.467 4.933 5.467 4.133C5.467 3.333 4.8 2.667 3.933 2.667ZM6.933 5.333H9.333V6.4H9.367C9.733 5.733 10.533 5.067 11.733 5.067C13.733 5.067 14.133 6.467 14.133 8.4V13.333H11.6V8.933C11.6 7.867 11.333 7.067 10.267 7.067C9.2 7.067 8.8 7.867 8.8 8.933V13.333H6.267V5.333H6.933Z"
      fill="currentColor"
    />
  </svg>
</a>


        </div>

        {/* Bottom line */}
        <p className={styles.copy}>
          © 2025 — Typed with care by Rafi.
        </p>
      </div>
    </footer>
  );
}
