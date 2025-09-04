import React, { useReducer, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styles from './ProjectOverlay.module.css';

const initialState = { showFuture: false, lightboxImg: null };
function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_VIEW':
      return { ...state, showFuture: action.payload };
    case 'LIGHTBOX':
      return { ...state, lightboxImg: action.payload };
    default:
      return state;
  }
}

export default function ProjectOverlay({ project = {}, onClose }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const contentRef = useRef(null);
  const progressRef = useRef(null);
  const closeButtonRef = useRef(null);
  const rafRef = useRef(null);
  const portalRoot = typeof document !== 'undefined' ? (document.getElementById('portal-root') || document.body) : null;

  // lock scroll and handle escape
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (state.lightboxImg) dispatch({ type: 'LIGHTBOX', payload: null });
        else onClose?.();
      }
    };

    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => closeButtonRef.current?.focus(), 120);

    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [state.lightboxImg, onClose]);

  // efficient scroll progress updater (no state churn)
  useEffect(() => {
    const el = contentRef.current;
    if (!el || !progressRef.current) return;

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const { scrollTop, scrollHeight, clientHeight } = el;
        const denom = Math.max(scrollHeight - clientHeight, 1);
        const pct = Math.min(Math.max(scrollTop / denom, 0), 1) * 100;
        progressRef.current.style.width = pct + '%';
        rafRef.current = null;
      });
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    // init
    onScroll();

    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const asArray = (v, fallback) => {
    if (!v) return fallback;
    return Array.isArray(v) ? v : [v];
  };

  const timelineData = [
    { title: 'Overview', content: asArray(project.discovery, ['Project overview not available.']), images: Array.isArray(project.gallery) ? project.gallery.slice(0, 1) : [], label: 'Discovery' },

    { title: 'Planning', content: asArray(project.planning, ['Planning details not available.']), images: Array.isArray(project.gallery) ? project.gallery.slice(1, 2) : [], label: 'Planning' },

    { title: 'Features', content: asArray(project.features, ['Features not listed.']), images: Array.isArray(project.gallery) ? project.gallery.slice(2, 3) : [], label: 'Features' },

    { title: 'Tech Stack', content: asArray(project.techStack, ['Technology stack not specified.']), images: [], label: 'Technology' },

   { title: 'Challenges', content: asArray(project.challenges, ['Challenges not specified.']), images: Array.isArray(project.gallery) ? project.gallery.slice(3,4) : [], label: 'Challenges tackled' } ,

    { title: 'Problems & Solutions', content: asArray(project.problemSolve, ['Problems not specified.']), images: Array.isArray(project.gallery) ? project.gallery.slice(3,4) : [], label: 'Solutions' } ,

    { title: 'Future Plans', content: asArray(project.future, ['Future developments not specified.']), images: Array.isArray(project.gallery) ? project.gallery.slice(5) : [], label: 'Roadmap' }
  ];

  const renderContent = (block, i) => {
    if (Array.isArray(block)) return (
      <ul key={i} className={styles.bulletList}>
        {block.map((item, idx) => <li key={idx}>{item}</li>)}
      </ul>
    );
    return <p key={i} className={styles.chapterText}>{block}</p>;
  };

  const overlay = (
    <div className={styles.overlay} role="presentation" onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className={styles.dim} aria-hidden="true" />

      {/* progress bar (updated via ref) */}
      <div className={styles.progressWrap} aria-hidden="true">
        <div ref={progressRef} className={styles.scrollProgress} />
      </div>

      {state.lightboxImg && (
        <div className={styles.lightbox} onClick={() => dispatch({ type: 'LIGHTBOX', payload: null })} role="button" tabIndex={0} aria-label="Close image">

          <img src={state.lightboxImg} alt={`${project.title} preview`} className={styles.lightboxImage} onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <div className={styles.content} role="dialog" aria-modal="true" aria-label={project.title || 'Project details'}>

        <button ref={closeButtonRef} className={styles.closeButton} onClick={onClose} aria-label="Close project overlay">×</button>

        <header className={styles.header}>
          <h2 className={styles.projectTitle}>{project.title || 'Untitled Project'}</h2>
          <div className={styles.projectMeta}>
            <span className={styles.projectType}>{project.type || 'Digital Experience'}</span>
            <span className={styles.projectStatus}>{project.status || (project.previewLink ? 'Live' : 'Prototype')}</span>
          </div>
        </header>

        <div className={styles.mainGrid}>
          <aside className={styles.aside}>
            <div className={styles.previewCard}>
              {Array.isArray(project.gallery) && project.gallery.slice(0, 3).map((src, i) => (
                <img key={i} src={src} alt={`${project.title} ${i + 1}`} className={styles.previewImage} loading="lazy" onClick={() => dispatch({ type: 'LIGHTBOX', payload: src })} />
              ))}
            </div>

            <nav className={styles.sideNav}>
              <button className={`${styles.sideButton} ${!state.showFuture ? styles.sideActive : ''}`} onClick={() => dispatch({ type: 'TOGGLE_VIEW', payload: false })} aria-pressed={!state.showFuture}>Details</button>
              <button className={`${styles.sideButton} ${state.showFuture ? styles.sideActive : ''}`} onClick={() => dispatch({ type: 'TOGGLE_VIEW', payload: true })} aria-pressed={state.showFuture}>Future</button>
              {project.previewLink && <a className={styles.sideLink} href={project.previewLink} target="_blank" rel="noreferrer">View Live</a>}
            </nav>

            <div className={styles.metaList}>
              {project.role && <div><strong>Role</strong><div>{project.role}</div></div>}
              {project.timeline && <div><strong>Timeline</strong><div>{project.timeline}</div></div>}
            </div>
          </aside>

          <section className={styles.scrollArea} ref={contentRef} tabIndex={0}>
            <div className={styles.timeline}>
              {timelineData.map((item) => {
                const isFuture = item.title === 'Future Plans';
                if (state.showFuture !== isFuture) return null;
                return (
                  <article key={item.title} className={styles.timelineItem}>
                    <div className={styles.sectionHeader}>
                      <h3 className={styles.chapterTitle}>{item.title}</h3>
                      <span className={styles.sectionLabel}>{item.label}</span>
                    </div>

                    {item.images && item.images.length > 0 && (
                      <div className={styles.imageGallery}>
                        {item.images.slice(0, 3).map((src, i) => (
                          <img key={i} src={src} alt={`${project.title} screenshot ${i + 1}`} className={styles.galleryImage} loading="lazy" onClick={() => dispatch({ type: 'LIGHTBOX', payload: src })} />
                        ))}
                      </div>
                    )}

                    <div className={styles.contentBody}>
                      {item.content.map(renderContent)}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  if (!portalRoot) return null;
  return ReactDOM.createPortal(overlay, portalRoot);
}


