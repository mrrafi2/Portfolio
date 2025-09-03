import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './Projects.module.css';
import ProjectOverlay from './ProjectOverlay';
import projectDataRaw from '../data/projects.json';


const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;



// cosmic bg component--- 

const CosmicCanvas = ({ paused = false }) => {

  const canvasRef = useRef(null);
  const offscreenNebulaRef = useRef(null);
  const rafRef = useRef(null);
  const starfieldRef = useRef([]);
  const shootingRef = useRef([]);
  const lastSpawnRef = useRef(0);
  const pointerRef = useRef({ x: 0.5, y: 0.5 }); // normalized pointer
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const BASE_STAR_DENSITY = 1 / 8000; // star per px^2 (area-based)
  const MAX_STARS = 160;
  const NEBULA_OPACITY = 0.22;
  const SHOOTING_PROBABILITY_PER_SEC = 0.08; // chance per second to spawn a shooting star
  const SHOOTING_SPEED_MIN = 1100; // px/sec
  const SHOOTING_SPEED_MAX = 1900;
  const TWINKLE_FREQ = 0.0035; // twinkle variation speed

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let width = 0;
    let height = 0;
    let dpr = Math.max(1, window.devicePixelRatio || 1);

    // Resize handler: recalculates canvas pixel size and (re)builds stars & nebula
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.max(1, window.devicePixelRatio || 1);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // compute star count based on area (clamped)
      const area = width * height;
      const idealStars = Math.min(MAX_STARS, Math.floor(area * BASE_STAR_DENSITY));
      buildStars(idealStars, width, height);
      buildNebula(width, height, dpr);
    };

    // Build nebula once into an offscreen canvas for reuse (cheap drawImage)
    const buildNebula = (w, h, dprLocal) => {
      const off = document.createElement('canvas');
      off.width = Math.floor(w * dprLocal);
      off.height = Math.floor(h * dprLocal);
      const ox = off.getContext('2d');
      ox.setTransform(dprLocal, 0, 0, dprLocal, 0, 0);

      // subtle layered radial gradients and color blending
      const g1 = ox.createRadialGradient(
        w * 0.15, h * 0.75, 0,
        w * 0.15, h * 0.75, Math.max(w, h) * 0.9
      );
      g1.addColorStop(0, 'rgba(0, 255, 255, 0.41)');
      g1.addColorStop(0.5, 'rgba(0, 20, 40, 0.15)');
      g1.addColorStop(1, 'rgba(0, 0, 0, 0.14)');

      const g2 = ox.createRadialGradient(
        w * 0.85, h * 0.25, 0,
        w * 0.85, h * 0.25, Math.max(w, h) * 0.8
      );
      g2.addColorStop(0, 'rgba(255,0,255,0.18)');
      g2.addColorStop(0.6, 'rgba(10,2,25,0.03)');
      g2.addColorStop(1, 'rgba(0,0,0,0)');

      // paint base
      ox.clearRect(0, 0, w, h);
      ox.globalCompositeOperation = 'screen';
      ox.fillStyle = g1;
      ox.fillRect(0, 0, w, h);
      ox.fillStyle = g2;
      ox.fillRect(0, 0, w, h);

      // paint a soft noise overlay (very cheap): tiny translucent lines
      ox.globalCompositeOperation = 'overlay';
      ox.fillStyle = 'rgba(255,255,255,0.01)';
      for (let i = 0; i < Math.floor((w * h) / 30000); i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const s = 1 + Math.random() * 2;
        ox.fillRect(x, y, s, s);
      }

      offscreenNebulaRef.current = off;
    };

    // star builder
    const buildStars = (count, w, h) => {
      const stars = [];
      for (let i = 0; i < count; i++) {
        const z = 0.3 + Math.random() * 1.7; // depth factor -> 0.3..2.0
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z, // used for parallax and size
          baseSize: Math.min(2.6, 0.4 + Math.random() * 2.2),
          twinkleSeed: Math.random() * 1000,
          hue: 180 + (Math.random() * 160 - 80), // a spread across cyan-magenta-ish
        });
      }
      starfieldRef.current = stars;
    };

    // spawn shooting star
    const spawnShooting = (w, h) => {
      const dirLeft = Math.random() > 0.5;
      const startX = dirLeft ? w + 30 : -30;
      const startY = Math.random() * h * 0.6; // upper area
      const angle = (Math.random() * 20 + 10) * (Math.PI / 180) * (dirLeft ? Math.PI : -Math.PI);
      const speed = SHOOTING_SPEED_MIN + Math.random() * (SHOOTING_SPEED_MAX - SHOOTING_SPEED_MIN);
      shootingRef.current.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        ttl: 0.7 + Math.random() * 0.6,
        length: 80 + Math.random() * 140,
        hue: 50 + Math.random() * 40,
      });
    };

    // animation loop
    let lastTime = performance.now();
    let nebulaOffset = 0;
    const step = (now) => {
      if (paused) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      const dt = Math.min(0.040, (now - lastTime) / 1000); // clamp dt to 40ms
      lastTime = now;

      // chance to spawn shooting star (time-based)
      if (!reducedMotion) {
        const since = (now - lastSpawnRef.current) / 1000;
        const prob = 1 - Math.exp(-SHOOTING_PROBABILITY_PER_SEC * since);
        if (Math.random() < prob) {
          spawnShooting(width, height);
          lastSpawnRef.current = now;
        }
      }

      // clear
      ctx.clearRect(0, 0, width, height);

      // nebula: draw pre-rendered with slow offset
      if (offscreenNebulaRef.current) {
        nebulaOffset += dt * 6; // px per second drift
        // use modulo for wrap
        const off = offscreenNebulaRef.current;
        const dx = (nebulaOffset % width) - width;
        ctx.globalAlpha = NEBULA_OPACITY;
        ctx.globalCompositeOperation = 'screen';
        // draw two copies for seamless wrap
        ctx.drawImage(off, dx, 0, width, height);
        ctx.drawImage(off, dx + width, 0, width, height);
      }

      // stars
      const stars = starfieldRef.current;
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        // twinkle via sin function using time and seed
        const tw = 0.5 + 0.5 * Math.sin(now * TWINKLE_FREQ * (1 + s.twinkleSeed * 0.0007) + s.twinkleSeed);
        const size = s.baseSize * (0.6 + 0.6 * tw) * (s.z < 1 ? 0.9 : 1.15);
        const alpha = 0.25 + 0.75 * tw * (s.z / 2.0);

        // slight parallax toward pointer (cheap)
        const px = (pointerRef.current.x - 0.5) * (10 * (1 / s.z));
        const py = (pointerRef.current.y - 0.5) * (8 * (1 / s.z));
        const x = s.x + px;
        const y = s.y + py;

        // draw glow via small radial
        ctx.beginPath();
        const grad = ctx.createRadialGradient(x, y, 0, x, y, Math.max(1.5, size * 3));
        grad.addColorStop(0, `rgba(255,255,255,${(alpha * 0.9).toFixed(3)})`);
        grad.addColorStop(0.6, `hsla(${s.hue}, 80%, 65%, ${(alpha * 0.12).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(x - size * 3, y - size * 3, size * 6, size * 6);
      }

      // shooting stars (fast lines)
      for (let i = shootingRef.current.length - 1; i >= 0; i--) {
        const st = shootingRef.current[i];
        st.life += dt;
        const t = st.life / st.ttl;
        const alpha = 1 - t;
        const trail = st.length * (1 - t * 0.85);
        const x = st.x + st.vx * dt;
        const y = st.y + st.vy * dt;
        st.x = x;
        st.y = y;

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = `hsla(${st.hue}, 90%, 60%, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - st.vx / 60 * trail, y - st.vy / 60 * trail);
        ctx.stroke();

        // bright head
        ctx.fillStyle = `rgba(255,255,255,${(0.9 * alpha).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, 2.6 * (1 - t * 0.8), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (st.life > st.ttl || x < -200 || x > width + 200 || y < -200 || y > height + 200) {
          shootingRef.current.splice(i, 1);
        }
      }

      // subtle vignette to frame the scene (cheap rectangle with gradient)
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.035;
      const vg = ctx.createRadialGradient(width / 2, height / 2, Math.max(width, height) * 0.4, width / 2, height / 2, Math.max(width, height) * 0.9);
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,0.65)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, width, height);

      // restore alpha
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(step);
    };

    // pointer follow (normalized). Debounce heavy work — only update a small object
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      let x = 0.5, y = 0.5;
      if (e.touches && e.touches[0]) {
        x = (e.touches[0].clientX - rect.left) / rect.width;
        y = (e.touches[0].clientY - rect.top) / rect.height;
      } else {
        x = (e.clientX - rect.left) / rect.width;
        y = (e.clientY - rect.top) / rect.height;
      }
      pointerRef.current.x = Math.max(0, Math.min(1, x));
      pointerRef.current.y = Math.max(0, Math.min(1, y));
    };

    // attach listeners
    window.addEventListener('resize', resize);
    // only add pointer tracking on non-touch devices (touch will be less helpful)
    if (!('ontouchstart' in window)) {
      canvas.addEventListener('mousemove', onMove);
    } else {
      canvas.addEventListener('touchmove', onMove, { passive: true });
    }

    // initial setup + start loop
    resize();
    lastTime = performance.now();
    rafRef.current = requestAnimationFrame(step);

    // cleanup
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      if (!('ontouchstart' in window)) {
        canvas.removeEventListener('mousemove', onMove);
      } else {
        canvas.removeEventListener('touchmove', onMove);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, BASE_STAR_DENSITY, MAX_STARS]);

  // Respect reduced motion: show static frame if needed by rendering once
  useEffect(() => {
    if (reducedMotion) {
      // draw a single static frame once
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      if (offscreenNebulaRef.current) {
        ctx.globalAlpha = 0.12;
        ctx.drawImage(offscreenNebulaRef.current, 0, 0, rect.width, rect.height);
        ctx.globalAlpha = 1;
      }
    }
  }, [reducedMotion]);

  // If user prefers reduced motion OR narrow screen -> pause heavy animation
  const smallScreen = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
  const showCanvas = !(reducedMotion || smallScreen) || true; // we still render canvas but animation can be paused upstream via `paused` prop

  return (
    <canvas
      ref={canvasRef}
      className={styles.cosmicCanvas}
      aria-hidden="true"
      style={{ display: showCanvas ? 'block' : 'none', width: '100%', height: '100%' }}
    />
  );
};


//----------------------------------------------------------------------



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
          <p className={styles.projectDesc}>{project.description}</p>

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
      {/* Cosmic background canvas */}
      <div className={styles.cosmicBackground}>
        <CosmicCanvas paused={!visible} />
      </div>

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