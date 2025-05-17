// ProjectOverlay.jsx
import React, { useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './ProjectOverlay.module.css';

// state & reducer
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

// simple click tone
function playClickSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'square';
  osc.frequency.value = 880;
  gain.gain.value = 0.05;
  osc.start();
  osc.stop(ctx.currentTime + 0.03);
}

const ProjectOverlay = ({ project, onClose }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const portalRoot = document.getElementById('portal-root') || document.body;

  // lock scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // handle Esc
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') {
        state.lightboxImg
          ? dispatch({ type: 'LIGHTBOX', payload: null })
          : onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.lightboxImg, onClose]);

  const timelineData = [
    { title: 'The Discovery', content: project.details || ['…'], images: project.gallery.slice(0,1) },
    { title: 'Features & Technology', content: project.features || ['…'], images: project.gallery.slice(1,2) },
    { title: 'Challenges', content: project.challenges || ['…'], images: project.gallery.slice(2,3) },
    { title: 'Journey Ahead', content: project.future || ['…'], images: project.gallery.slice(3) },
  ];

  const renderContent = (block, i) =>
    Array.isArray(block)
      ? (<ul key={i} className={styles.bulletList}>
          {block.map((li,j)=><li key={j}>{li}</li>)}
        </ul>)
      : (<p key={i} className={styles.chapterText}>{block}</p>);

  const overlay = (
    <div className={styles.overlay}>
      <div className={styles.bgAnimation} />

      {/* lightbox */}
      {state.lightboxImg && (
        <div className={styles.lightbox} onClick={()=>dispatch({type:'LIGHTBOX',payload:null})}>
          <img
            src={state.lightboxImg}
            alt="Zoom"
            className={styles.lightboxImage}
            loading="lazy"
          />
        </div>
      )}

      <div className={styles.content}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2 className={styles.projectTitle}>{project.title}</h2>

        <div className={styles.toggleContainer}>
          <button
            className={`${styles.toggleButton} ${!state.showFuture ? styles.active : ''}`}
            onClick={() => {
              playClickSound();
              dispatch({ type: 'TOGGLE_VIEW', payload: false });
            }}
          >
            Past Visions
          </button>

          <button
            className={`${styles.toggleButton} ${state.showFuture ? styles.active : ''}`}
            onClick={() => {
              playClickSound();
              dispatch({ type: 'TOGGLE_VIEW', payload: true });
           }}
          >
            Future Visions
          </button>

          {project.previewLink && (
            <a
              href={project.previewLink}
              target="_blank"
             rel="noreferrer"
              className={styles.toggleButton}
              onClick={playClickSound}
            >
              Preview
            </a>
          )}
        </div>

        <div className={styles.timeline}>
          {timelineData.map((item, idx) => {
            const isFuture = item.title === 'Journey Ahead';
            if (state.showFuture ^ isFuture) return null;
            return (
              <div key={idx} className={styles.timelineItem}>
                <div className={styles.timelineContent}>
                  {item.images.length>0 && (
                    <div className={styles.imageGallery}>
                      {item.images.map((src,i)=>(
                        <img
                          key={i}
                          src={src}
                          alt={`${item.title}-${i}`}
                          className={styles.galleryImage}
                          loading="lazy"
                          onClick={()=>dispatch({type:'LIGHTBOX',payload:src})}
                        />
                      ))}
                    </div>
                  )}
                  <h3 className={styles.chapterTitle}>{item.title}</h3>
                  {item.content.map(renderContent)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(overlay, portalRoot);
};

export default ProjectOverlay;
