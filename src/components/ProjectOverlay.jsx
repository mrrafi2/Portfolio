import React, { useReducer, useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ProjectOverlay.module.css';

// reducer for small overlay state
const initialState = { showFuture: false, lightboxImg: null, activeSection: 0 };
function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_VIEW':
      return { ...state, showFuture: action.payload };
    case 'LIGHTBOX':
      return { ...state, lightboxImg: action.payload };
    case 'SET_ACTIVE_SECTION':
      return { ...state, activeSection: action.payload };
    default:
      return state;
  }
}

function playClickSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {
    console.warn('Audio context failed:', e)
  }
}

const ProjectOverlay = ({ project = {}, onClose }) => {
  
  const [state, dispatch] = useReducer(reducer, initialState);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef(null);
  const closeButtonRef = useRef(null);
  const portalRoot = typeof document !== 'undefined' ? (document.getElementById('portal-root') || document.body) : null;

  // lock body scroll + escape handler + focus management
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKey(e) {
      if (e.key === 'Escape') {
        if (state.lightboxImg) {
          dispatch({ type: 'LIGHTBOX', payload: null });
        } else {
          onClose?.();
        }
      }
    }

    window.addEventListener('keydown', handleKey);

    // focus close button quickly so keyboard users are positioned
    const t = setTimeout(() => closeButtonRef.current?.focus(), 60);

    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [state.lightboxImg, onClose]);

  // scroll progress tracking
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const denom = Math.max(scrollHeight - clientHeight, 1);
      const p = Math.min(Math.max(scrollTop / denom, 0), 1);
      setScrollProgress(p);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // safe normalizers: accept string or array, fallback message
  const asArray = (v, fallback) => {
    if (!v) return fallback;
    return Array.isArray(v) ? v : [v];
  };

  // timeline built from your specific keys
  const timelineData = [
    {
      title: 'The Discovery',
      content: asArray(project.discovery, ['No discovery notes provided.']),
      images: Array.isArray(project.gallery) ? project.gallery.slice(0, 1) : [],
      label: 'Discovery'
    },
    {
      title: 'Planning',
      content: asArray(project.planning, ['No planning notes provided.']),
      images: Array.isArray(project.gallery) ? project.gallery.slice(1, 2) : [],
      label: 'Planning'
    },
    {
  title: 'Features',
  content: asArray(project.features, ['No features listed.']),
  images: Array.isArray(project.gallery) ? project.gallery.slice(2, 3) : [],
  label: 'Features'
},
{
  title: 'Tech Stack',
  content: asArray(project.techStack, ['No tech stack listed.']),
  images: [], 
  label: 'Tech Stack'
},
    {
      title: 'Problems & Solutions',
      content: asArray(project.problemSolve, asArray(project.challenges, ['No challenges or problem-solving notes provided.'])),
      images: Array.isArray(project.gallery) ? project.gallery.slice(3, 4) : [],
      label: 'Problems'
    },
    {
      title: 'Journey Ahead',
      content: asArray(project.future, ['No future notes yet.']),
      images: Array.isArray(project.gallery) ? project.gallery.slice(4) : [],
      label: 'Future'
    }
  ];

  const renderContent = (block, i) => {
    if (Array.isArray(block)) {
      return (
        <ul key={i} className={styles.bulletList}>
          {block.map((li, j) => (
            <motion.li key={j} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: j * 0.06 }}>
              {li}
            </motion.li>
          ))}
        </ul>
      );
    }
    return (
      <motion.p key={i} className={styles.chapterText} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i }}>
        {block}
      </motion.p>
    );
  };

  const overlayContent = (
    <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
      <div className={styles.cosmicBg} aria-hidden />

      <div className={styles.scrollProgress} style={{ width: `${scrollProgress * 100}%` }} aria-hidden />

      <AnimatePresence>
        {state.lightboxImg && (
          <motion.div className={styles.lightbox} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} onClick={() => dispatch({ type: 'LIGHTBOX', payload: null })} role="button" tabIndex={0} aria-label="Close image">
            <motion.img src={state.lightboxImg} alt={project.title ? `${project.title} — image` : 'Zoomed image'} className={styles.lightboxImage} initial={{ scale: 0.96 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 280, damping: 28 }} onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className={styles.content} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.08, duration: 0.36 }} role="dialog" aria-modal="true" aria-label={project.title ? `${project.title} details` : 'Project details'}>
        <button ref={closeButtonRef} className={styles.closeButton} onClick={() => onClose?.()} aria-label="Close project overlay">
          ×
        </button>

        <div className={styles.header}>
          <h2 className={styles.projectTitle}>{project.title || 'Untitled Project'}</h2>
          <div className={styles.projectMeta}>
            <span className={styles.projectType}>{project.type || 'Digital Experience'}</span>
            <div className={styles.statusDot} />
            <span className={styles.projectStatus}>{project.status || (project.previewLink ? 'Live' : 'Prototype')}</span>
          </div>
        </div>

        <div className={styles.navigation}>
          <button className={`${styles.navButton} ${!state.showFuture ? styles.active : ''}`} onClick={() => { playClickSound(); dispatch({ type: 'TOGGLE_VIEW', payload: false }); }} aria-pressed={!state.showFuture}>
            Current
          </button>

          <button className={`${styles.navButton} ${state.showFuture ? styles.active : ''}`} onClick={() => { playClickSound(); dispatch({ type: 'TOGGLE_VIEW', payload: true }); }} aria-pressed={state.showFuture}>
            Future
          </button>

          {project.previewLink && (
            <motion.a href={project.previewLink} target="_blank" rel="noreferrer" className={styles.previewButton} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={playClickSound}>
              Launch
            </motion.a>
          )}
        </div>

        <div className={styles.scrollArea} ref={contentRef} tabIndex={0}>
          <motion.div className={styles.timeline} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
            <AnimatePresence mode="wait">
              {timelineData.map((item, idx) => {
                const isFuture = item.title === 'Journey Ahead';
                if (state.showFuture !== isFuture) return null;

                return (
                  <motion.div key={`${item.title}-${state.showFuture ? 'future' : 'current'}`} className={styles.timelineItem} initial={{ opacity: 0, y: 28, rotateX: -8 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} exit={{ opacity: 0, y: -28, rotateX: 8 }} transition={{ duration: 0.45, delay: idx * 0.08, type: 'spring', stiffness: 120 }}>
                    <div className={styles.timelineContent}>
                      {item.images && item.images.length > 0 && (
                        <div className={styles.imageGallery}>
                          {item.images.map((src, i) => (
                            <motion.img key={`${item.title}-img-${i}`} src={src} alt={`${project.title || 'project'} image ${i + 1}`} className={styles.galleryImage} loading="lazy" whileHover={{ scale: 1.03, rotate: 1.5 }} onClick={() => dispatch({ type: 'LIGHTBOX', payload: src })} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') dispatch({ type: 'LIGHTBOX', payload: src }); }} />
                          ))}
                        </div>
                      )}

                      <div className={styles.sectionHeader}>
                        <h3 className={styles.chapterTitle}>{item.title}</h3>
                        <span className={styles.sectionLabel}>{item.label}</span>
                      </div>

                      <div className={styles.contentBody}>{item.content.map(renderContent)}</div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );

  if (!portalRoot) return null;
  return ReactDOM.createPortal(overlayContent, portalRoot);
};

export default ProjectOverlay;
