import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './Projects.module.css';
import ProjectOverlay from './ProjectOverlay';
import projectDataRaw from '../data/projects.json';
import FeatureChips from './featureChip';


const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;







const ProjectCard = ({ project, index, onClick }) => {
  const cardRef = useRef(null);
  const rafRef = useRef(null);

  // targets (updated by pointer events)
  const target = useRef({ rx: 0, ry: 0, sx: 1, ix: 0, iy: 0 });
  // current values (animated toward targets)
  const current = useRef({ rx: 0, ry: 0, sx: 1, ix: 0, iy: 0 });

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let lastTime = performance.now();

    const tick = (now) => {
      const dt = Math.min(32, now - lastTime); // clamp dt to avoid huge jumps
      lastTime = now;

      // tuning: ease factor (higher => snappier), use exponential smoothing
      const ease = 1 - Math.pow(0.001, dt / (16.67 * 6)); // ~damping feel; tweak multiplier "6" for stiffer/softer

      // interpolate each property
      current.current.rx = lerp(current.current.rx, target.current.rx, ease);
      current.current.ry = lerp(current.current.ry, target.current.ry, ease);
      current.current.sx = lerp(current.current.sx, target.current.sx, ease);
      current.current.ix = lerp(current.current.ix, target.current.ix, ease);
      current.current.iy = lerp(current.current.iy, target.current.iy, ease);

      // write CSS vars (only once per frame)
      const el = cardRef.current;
      if (el) {
        el.style.setProperty('--rx', `${current.current.rx.toFixed(3)}deg`);
        el.style.setProperty('--ry', `${current.current.ry.toFixed(3)}deg`);
        el.style.setProperty('--scale', `${current.current.sx.toFixed(4)}`);
        el.style.setProperty('--img-translate-x', `${current.current.ix.toFixed(2)}px`);
        el.style.setProperty('--img-translate-y', `${current.current.iy.toFixed(2)}px`);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // pointer handler: only update target values (no layout/paint heavy work)
  const handlePointerMove = (e) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;   // roughly -0.5 .. 0.5
    const dy = (e.clientY - cy) / rect.height;

    const maxTilt = 10;    // degrees
    const maxImgOffset = 14; // px
    const hoverScale = 1.035;

    // compute targets (invert X/Y as desired)
    target.current.rx = clamp(-dy * maxTilt, -maxTilt, maxTilt);
    target.current.ry = clamp(dx * maxTilt, -maxTilt, maxTilt);
    target.current.sx = isHovered ? hoverScale : 1;
    target.current.ix = clamp(-dx * maxImgOffset, -maxImgOffset, maxImgOffset);
    target.current.iy = clamp(-dy * (maxImgOffset * 0.75), -maxImgOffset, maxImgOffset);
  };

  const handleEnter = () => {
    setIsHovered(true);
    target.current.sx = 1.035; // start scale target immediately
  };

  const handleLeave = () => {
    setIsHovered(false);
    // return targets to neutral
    target.current.rx = 0;
    target.current.ry = 0;
    target.current.sx = 1;
    target.current.ix = 0;
    target.current.iy = 0;
  };

  return (
    <div
      ref={cardRef}
      className={styles.card}
      style={{ ['--index']: index }}
      onMouseEnter={handleEnter}
      onMouseMove={handlePointerMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onFocus={handleEnter}
      onBlur={handleLeave}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Open project ${project.title}`}
    >
      <div className={styles.cardInner}>
        <div className={`${styles.badge} ${styles[project.type?.toLowerCase?.().replace(/[^a-z0-9]/g, '') || '']}`}>
          {project.type}
        </div>

        <div className={styles.imageContainer}>
          <img
            src={project.image}
            alt={project.title}
            className={styles.projectImage}
            loading="lazy"
            decoding="async"
            width="600"
            height="360"
            style={{
              transform: 'translate(var(--img-translate-x,0), var(--img-translate-y,0))',
            }}
          />
          <div className={styles.imageOverlay} aria-hidden="true" />
        </div>

        <div className={styles.cardContent}>
          <h3 className={styles.projectTitle}>{project.title}</h3>

  <FeatureChips Keyfeature={project.Keyfeature} maxVisible={5} />

          <div className={styles.cardFooter}>
            <button
              className={styles.exploreBtn}
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              aria-label={`Explore ${project.title}`}
            >
              <span>Explore</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const images = useMemo(() => import.meta.glob('../assets/*.{png,jpg,jpeg,webp,svg}', { eager: true, as: 'url' }), []);

  const projects = useMemo(() => {
    const assetMap = {};
    Object.keys(images || {}).forEach((k) => {
      assetMap[k] = images[k];
    });

    return (projectDataRaw || []).map((p) => {
      const resolvedImage = assetMap[p.image] || p.image || '';
      const resolvedGallery = Array.isArray(p.gallery) ? p.gallery.map((g) => assetMap[g] || g) : [];
      return { ...p, image: resolvedImage, gallery: resolvedGallery };
    });
  }, [images]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className={`${styles.projectsSection} ${visible ? styles.visible : ''}`}>
      
      {/* Cosmic background  */}
      <div className={styles.cosmicBackground}>
         <div className={styles.starField}></div> 
         <div className={styles.nebula}></div> 
         </div>

      <div className={styles.contentWrapper}>
        <div className={styles.headerSection}>

          <h2 className={styles.heading}>
            <span className={styles.headingGlow}>Cosmic</span> Projects
          </h2>

          <div className={styles.headingLine} />
          <p className={styles.subheading}>
            Crafting digital worlds where creativity orbits around innovation.
          </p>
        </div>

        <div className={styles.projectsGrid}>
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.id ?? index} 
              project={project} 
              index={index} 
              onClick={() => setSelectedProject(project)} 
            />
          ))}
        </div>
      </div>

      {selectedProject && (
        <ProjectOverlay 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </section>
  );
};

export default Projects;