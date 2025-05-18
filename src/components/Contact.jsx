
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import emailjs from 'emailjs-com';
import Confetti from 'react-confetti';
import styles from './Contact.module.css';

const Contact = () => {
  const formRef = useRef(null);
  const containerRef = useRef(null);

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showPlane, setShowPlane] = useState(false);
  const [showBox, setShowBox] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBoxClick = () => {
    setClicked(true);
    setTimeout(() => {
      setShowBox(false);
      setShowForm(true);
      setClicked(false);
    }, 1000);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSending(true);

    emailjs
      .sendForm(
        'service_kefi9ql',
        'template_9cso8ed',
        formRef.current,
        'VE2iSZYr85KvBwxB1'
      )
      .then(
        () => {
          setSent(true);
          setTimeout(() => setShowPlane(true), 500);
          setTimeout(() => {
            setSent(false);
            setShowPlane(false);
            setFormData({ name: '', email: '', message: '' });
            setShowForm(false);
            setShowBox(true);
            setSending(false);
          }, 3500);
        },
        err => {
          console.error('EmailJS error:', err);
          alert('Something went wrong. Please try again.');
          setSending(false);
        }
      );
  };

  const { width, height } = containerRef.current
    ? containerRef.current.getBoundingClientRect()
    : { width: window.innerWidth, height: window.innerHeight };

  return (
    <div className={styles.contactSection} ref={containerRef} id='contact'>
      {sent && <Confetti width={width} height={height} recycle={false} />}

      <div className={styles.contactContainer}>
        <div className={styles.ambientBackground} />

        <header className={styles.header}>
          <h2>Start the Conversation. I’ll Catch the Paper Plane.</h2>
        </header>

        {showBox && (
          <div className={styles.paperBox} onClick={handleBoxClick}>
            <svg
              className={styles.boxSVG}
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="20" y="80" width="160" height="80"
                fill="#d4c4a8" stroke="#7f5f2a" strokeWidth="2" rx="8" ry="8"
              />
              <defs>
                <linearGradient id="lidGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e3d4b8" />
                  <stop offset="100%" stopColor="#d4c4a8" />
                </linearGradient>
              </defs>
              <polygon
                points="20,80 180,80 160,60 40,60"
                fill="url(#lidGradient)" stroke="#7f5f2a" strokeWidth="2"
              />
              <rect
                x="30" y="40" width="140" height="40"
                fill="#fdfaf1" stroke="#b48b36" strokeWidth="2" rx="3" ry="3"
              />
              <text
                x="100" y="110" textAnchor="middle"
                fill="#7f5f2a" fontFamily="'Courier New', monospace" fontSize="14"
              >
                Stamp Papers
              </text>
              <rect
                className={clicked ? styles.paperOut : ''}
                x="30" y="50" width="140" height="40"
                fill="#fdfaf1" stroke="#b48b36" strokeWidth="2" rx="3" ry="3"
              />
              <rect
                className={clicked ? styles.paperOut2 : ''}
                x="35" y="45" width="140" height="40"
                fill="#fefcf5" stroke="#b48b36" strokeWidth="2" rx="3" ry="3"
                opacity="0.9"
              />
              <rect
                className={clicked ? styles.paperOut3 : ''}
                x="40" y="40" width="140" height="40"
                fill="#fdfaf1" stroke="#b48b36" strokeWidth="2" rx="3" ry="3"
                opacity="0.8"
              />
            </svg>
          </div>
        )}

        {showForm && !showPlane && (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className={`${styles.contactForm} ${sent ? styles.sent : ''}`}
          >
            <div className={styles.formGroup}>
            
              <input
                type="text" name="name" value={formData.name}
                onChange={handleChange} required placeholder=" "
                className={styles.inputField}
              />
              <label className={styles.inputLabel}>Name</label>
            

            </div>
            <small className={styles.inputHint}>Your full name, please</small>

            <div className={styles.formGroup}>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} required placeholder=" "
                className={styles.inputField}
              />
              <label className={styles.inputLabel}>Email</label>
              <br/>
              
            </div>

            <small className={styles.inputHint}>Active Email, So I can get back to you
</small>

            <div className={styles.formGroup}>
              <textarea
                name="message" value={formData.message}
                onChange={handleChange} required placeholder=" "
                rows="4" className={styles.inputField}
              />
              <label className={styles.inputLabel}>Message</label>
              <br />
              
            </div>
            <small className={styles.inputHint}>Tell me what you need help building
</small>

<br />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={sending}
            >
              {sending ? 'Sending…' : 'Send'}
            </button>
          </form>
        )}

        {showPlane && (
          <div className={styles.planeContainer}>
            <svg
              className={styles.planeSVG}
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="planeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fdfaf1" />
                  <stop offset="100%" stopColor="#b48b36" />
                </linearGradient>
              </defs>
              <path
                d="M30,100 L170,70 L30,130 Z"
                fill="url(#planeGradient)" stroke="#7f5f2a" strokeWidth="3"
              />
              <path
                d="M30,100 L80,85 L30,70 Z"
                fill="#e0dcd1" opacity="0.8"
              />
            </svg>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default Contact;
