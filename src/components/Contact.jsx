
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import emailjs from 'emailjs-com';
import styles from './Contact.module.css';

// Custom Confetti Component for better performance
const CustomConfetti = ({ show, containerRef }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!show) return;

    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
    const shapes = ['circle', 'square', 'triangle'];
    
    const newParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      size: Math.random() * 8 + 4,
      velocity: {
        x: (Math.random() - 0.5) * 4,
        y: Math.random() * 3 + 2
      },
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10
    }));

    setParticles(newParticles);

    // Cleanup after animation
    const cleanup = setTimeout(() => {
      setParticles([]);
    }, 4000);

    return () => clearTimeout(cleanup);
  }, [show]);

  if (particles.length === 0) return null;

  return (
    <div className={styles.confettiContainer}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`${styles.confettiParticle} ${styles[particle.shape]}`}
          style={{
            '--start-x': `${particle.x}%`,
            '--start-y': `${particle.y}%`,
            '--velocity-x': particle.velocity.x,
            '--velocity-y': particle.velocity.y,
            '--rotation': `${particle.rotation}deg`,
            '--rotation-speed': `${particle.rotationSpeed}deg`,
            '--size': `${particle.size}px`,
            '--color': particle.color,
            animationDelay: `${Math.random() * 0.5}s`
          }}
        />
      ))}
    </div>
  );
};

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

  return (
    <div className={styles.contactSection} ref={containerRef} id='contact'>
      <CustomConfetti show={sent} containerRef={containerRef} />

      <div className={styles.contactContainer}>
        <div className={styles.ambientBackground}>
          <div className={styles.floatingParticles}>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className={styles.floatingParticle} style={{ animationDelay: `${i * 0.5}s` }} />
            ))}
          </div>
        </div>

        <header className={styles.header}>
          <h2>Start the Conversation. I'll Catch the Paper Plane.</h2>
          <div className={styles.headerGlow}></div>
        </header>

        {showBox && (
          <div className={`${styles.paperBox} ${clicked ? styles.boxClicked : ''}`} onClick={handleBoxClick}>
            <div className={styles.boxShadow}></div>
            <svg
              className={styles.boxSVG}
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="lidGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e3d4b8" />
                  <stop offset="100%" stopColor="#d4c4a8" />
                </linearGradient>
                <filter id="boxShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#7f5f2a" floodOpacity="0.3"/>
                </filter>
              </defs>
              
              {/* Box base */}
              <rect
                x="20" y="80" width="160" height="80"
                fill="#d4c4a8" stroke="#7f5f2a" strokeWidth="2" rx="8" ry="8"
                filter="url(#boxShadow)"
              />
              
              {/* Box lid */}
              <polygon
                points="20,80 180,80 160,60 40,60"
                fill="url(#lidGradient)" stroke="#7f5f2a" strokeWidth="2"
                className={styles.boxLid}
              />
              
              {/* Papers inside */}
              <rect
                className={`${styles.paperSheet} ${clicked ? styles.paperOut3 : ''}`}
                x="40" y="40" width="120" height="30"
                fill="#fdfaf1" stroke="#b48b36" strokeWidth="1.5" rx="3" ry="3"
                opacity="0.9"
              />
              <rect
                className={`${styles.paperSheet} ${clicked ? styles.paperOut2 : ''}`}
                x="35" y="45" width="130" height="30"
                fill="#fefcf5" stroke="#b48b36" strokeWidth="1.5" rx="3" ry="3"
                opacity="0.95"
              />
              <rect
                className={`${styles.paperSheet} ${clicked ? styles.paperOut : ''}`}
                x="30" y="50" width="140" height="30"
                fill="#fdfaf1" stroke="#b48b36" strokeWidth="1.5" rx="3" ry="3"
              />
              
              {/* Box label */}
              <text
                x="100" y="110" textAnchor="middle"
                fill="#7f5f2a" fontFamily="'Courier New', monospace" fontSize="12" fontWeight="bold"
              >
                Contact Forms
              </text>
              
              {/* Decorative elements */}
              <circle cx="50" cy="110" r="3" fill="#b48b36" opacity="0.6" />
              <circle cx="150" cy="110" r="3" fill="#b48b36" opacity="0.6" />
            </svg>
            
            <div className={styles.boxGlow}></div>
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
              <div className={styles.inputUnderline}></div>
            </div>
            <small className={styles.inputHint}>Your full name, please</small>

            <div className={styles.formGroup}>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} required placeholder=" "
                className={styles.inputField}
              />
              <label className={styles.inputLabel}>Email</label>
              <div className={styles.inputUnderline}></div>
            </div>
            <small className={styles.inputHint}>Active Email, So I can get back to you</small>

            <div className={styles.formGroup}>
              <textarea
                name="message" value={formData.message}
                onChange={handleChange} required placeholder=" "
                rows="4" className={styles.inputField}
              />
              <label className={styles.inputLabel}>Message</label>
              <div className={styles.inputUnderline}></div>
            </div>
            <small className={styles.inputHint}>Tell me what you need help building</small>

            <button
              type="submit"
              className={`${styles.sendButton} ${sending ? styles.sending : ''}`}
              disabled={sending}
            >
              <span className={styles.buttonText}>
                {sending ? 'Sending…' : 'Send'}
              </span>
              <div className={styles.buttonRipple}></div>
            </button>
          </form>
        )}

        {showPlane && (
          <div className={styles.planeContainer}>
            <div className={styles.planeTrail}></div>
            <svg
              className={styles.planeSVG}
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="planeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fdfaf1" />
                  <stop offset="50%" stopColor="#e3d4b8" />
                  <stop offset="100%" stopColor="#b48b36" />
                </linearGradient>
                <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f0ead6" />
                  <stop offset="100%" stopColor="#d4c4a8" />
                </linearGradient>
                <filter id="planeShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="2" dy="2" stdDeviation="4" floodColor="#7f5f2a" floodOpacity="0.4"/>
                </filter>
              </defs>
              
              {/* Main body */}
              <path
                d="M30,100 L170,70 L30,130 Z"
                fill="url(#planeGradient)" 
                stroke="#7f5f2a" 
                strokeWidth="2"
                filter="url(#planeShadow)"
                className={styles.planeBody}
              />
              
              {/* Wings */}
              <path
                d="M30,100 L80,85 L30,70 Z"
                fill="url(#wingGradient)" 
                opacity="0.9"
                className={styles.planeWing}
              />
              <path
                d="M30,100 L80,115 L30,130 Z"
                fill="url(#wingGradient)" 
                opacity="0.8"
                className={styles.planeWing}
              />
              
              {/* Fold lines */}
              <line x1="30" y1="100" x2="80" y2="85" stroke="#7f5f2a" strokeWidth="1" opacity="0.6" />
              <line x1="30" y1="100" x2="80" y2="115" stroke="#7f5f2a" strokeWidth="1" opacity="0.6" />
              <line x1="50" y1="100" x2="120" y2="80" stroke="#7f5f2a" strokeWidth="1" opacity="0.4" />
            </svg>
            
            {/* Particle effects */}
            <div className={styles.planeParticles}>
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className={styles.planeParticle} style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
