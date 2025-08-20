// src/components/Projects.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Projects.module.css';
import ProjectOverlay from './ProjectOverlay';
import projectDataRaw from '../data/projects.json';

const CosmicShapes = () => (
  <div className={styles.cosmicShapes}>
    <svg className={styles.starfield} width="100%" height="100%" aria-hidden>
      {[...Array(200)].map((_, i) => {
        const cx = Math.random() * 100;
        const cy = Math.random() * 100;
        const r = Math.random() * 0.5 + 0.2;
        const opacity = Math.random() * 0.8 + 0.2;
        return <circle key={i} cx={`${cx}%`} cy={`${cy}%`} r={r} fill="white" opacity={opacity} />;
      })}
    </svg>

    <svg className={styles.neutronStar} viewBox="0 0 100 100" aria-hidden>
      <defs>
        <radialGradient id="neutronGradient">
          <stop offset="0%" stopColor="#fffae6" />
          <stop offset="70%" stopColor="#ff4500" />
          <stop offset="100%" stopColor="#2b0000" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="12" fill="url(#neutronGradient)" />
      <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="3s" repeatCount="indefinite" />
    </svg>

    <svg className={styles.planetOrbit} viewBox="0 0 100 100" aria-hidden>
      <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.12)" />
      <path id="orbitPath" d="M80,50 A30,30 0 1,1 49.9,50" fill="none" />
      <circle cx="80" cy="50" r="5" fill="#00aaff">
        <animateMotion dur="12s" repeatCount="indefinite">
          <mpath xlinkHref="#orbitPath" />
        </animateMotion>
      </circle>
    </svg>

    <svg className={styles.asteroid} viewBox="0 0 50 50" aria-hidden>
      <circle cx="25" cy="25" r="6" fill="#a1a1a1" />
      <animateTransform attributeName="transform" type="translate" values="0,0;10,10;0,0;10,-10;0,0" dur="8s" repeatCount="indefinite" />
    </svg>
  </div>
);

const ProjectCard = ({ project, index, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const rotation = Number(project.rotation) || 0;

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 28, rotateY: -8 }}
      animate={{
        opacity: 1,
        y: 0,
        rotateY: 0,
        rotateZ: isHovered ? rotation * 0.35 : rotation
      }}
      transition={{
        default: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] },
        rotateZ: { type: 'spring', stiffness: 80, damping: 12 }
      }}
      whileHover={{ scale: 1.035, 
        rotateY: 5, 
        transition: { duration: 0.28 } 
      }
    }
      whileTap={{ scale: 0.98, 
        rotateY: -5, 
        transition: { duration: 0.15 } }
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Open project ${project.title}`}
    >
      <div className={styles.cardGlow} />
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
          />
          <div className={styles.imageOverlay} />
        </div>

        <div className={styles.cardContent}>
          <motion.h3
            className={styles.projectTitle}
            animate={{ textShadow: isHovered ? '0 0 20px #00ffff' : '0 0 8px #00ffff' }}
          >
            {project.title}
          </motion.h3>

          <p className={styles.projectDesc}>{project.description}</p>

          <div className={styles.cardFooter}>
            <motion.button
              className={styles.exploreBtn}
              whileHover={{ scale: 1.06, boxShadow: '0 0 20px #ff00ff' }}
              whileTap={{ scale: 0.96 }}
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              aria-label={`Explore ${project.title}`}
            >
              <span>Explore</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // Vite asset resolver: adjust glob path if your component folder is different
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
      { threshold: 0.18 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className={`${styles.projectsSection} ${visible ? styles.visible : ''}`}>
      <CosmicShapes />

      <div className={styles.contentWrapper}>

        <motion.div
        className={styles.headerSection}
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -18 }}
        transition={{ duration: 0.6, ease: [0.2,0.8,0.2,1] }}
        >

          <h2 className={styles.heading}>
            <span className={styles.headingGlow}>Cosmic</span> Projects
          </h2>

          <div className={styles.headingLine} />

          <p className={styles.subheading}>
            Crafting digital worlds where creativity orbits around innovation.
            </p>
            
        </motion.div>

        <div className={styles.projectsGrid}>
          <AnimatePresence>
            {projects.map((project, index) => (
              <ProjectCard key={project.id ?? index} project={project} index={index} onClick={() => setSelectedProject(project)} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && <ProjectOverlay project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
