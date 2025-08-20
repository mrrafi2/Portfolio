// src/components/WhyMe.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import styles from './WhyMe.module.css';

const cosmicFeatures = [
  {
    title: "Stellar Vision",
    icon: "",
    description:
      "Product-first planning: I map user journeys, edge cases and acceptance criteria up front so features land predictable and bugs stay grounded. Wireframes, flows and testable specs — planned like a mission manifest.",
    glowColor: "rgba(130, 88, 255, 0.6)",
    animationType: "stellar"
  },
  {
    title: "Warp-Speed Delivery",
    icon: "",
    description:
      "Fast, disciplined shipping: rapid prototypes, clear milestones and reliable CI/CD. I push meaningful iterations quickly without sacrificing code quality — ship smart, not sloppy.",
    glowColor: "rgba(0, 255, 204, 0.6)",
    animationType: "warp"
  },
  {
    title: "Gravity-Defying Creativity",
    icon: "",
    description:
      "Design that’s minimal but memorable. I combine clear UX patterns with signature moments that capture attention — considered visual language that elevates brand without noise.",
    glowColor: "rgba(255, 0, 204, 0.6)",
    animationType: "gravity"
  },
  {
    title: "Zero-Lag Orbit",
    icon: "",
    description:
      "Reliability-first engineering: observability, error handling and defensive patterns so your app stays steady under load. Fewer surprises, better uptime — production-grade from day one.",
    glowColor: "rgba(255, 204, 0, 0.6)",
    animationType: "orbit"
  },
  {
    title: "Orbiting Collaboration",
    icon: "",
    description:
      "You’re part of the loop. Regular demos, clear tickets, and fast feedback cycles keep stakeholders aligned and decisions rooted in reality — collaboration that actually moves the project forward.",
    glowColor: "rgba(0, 204, 255, 0.6)",
    animationType: "collaboration"
  },
  {
    title: "User-First Focus",
    icon: "",
    description:
      "People over pixels: accessibility, clarity and measured usability wins. I prioritize clear CTAs, straightforward flows and testing with real users so the product earns its keep.",
    glowColor: "#ffa500",
    animationType: "focus"
  },
  {
    title: "Future-Proof Solutions",
    icon: "",
    description:
      "Maintainable architecture: modular code, robust tests, typed contracts and readable docs. I build systems that stay flexible as requirements evolve — invest once, iterate forever.",
    glowColor: "rgba(75, 192, 192, 0.6)",
    animationType: "future"
  },
  {
    title: "Light-Year Performance",
    icon: "",
    description:
      "Perceived and actual speed: critical rendering paths, lazy loading, code-splitting and performance budgets. Pages that feel instant and stay fast at scale.",
    glowColor: "rgba(255, 99, 132, 0.6)",
    animationType: "performance"
  }
];



const CollaborationEffect = ({ inView }) => {
  return (
    <div className={`${styles.collabEffect} ${inView ? styles.active : ''}`} aria-hidden="true">
      <div className={styles.collabCenter} />
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={styles.collabNode}
          style={{
            ['--i']: i,
            ['--angle']: `${(360 / 6) * i}deg`,
            ['--delay']: `${i * 0.04}s`
          }}
        />
      ))}
    </div>
  );
};


const FocusEffect = ({ inView }) => {
  return (
    <div
      className={`${styles.focusEffect} ${inView ? styles.active : ''}`}
      data-focus-active={inView ? 'true' : 'false'}
      aria-hidden="true"
    >
      <div className={styles.focusRings}>
        <span style={{ ['--r']: 1 }} />
        <span style={{ ['--r']: 2 }} />
        <span style={{ ['--r']: 3 }} />
      </div>
      <div className={styles.focusDot} />
    </div>
  );
};


const FeatureCard = ({ feature, index, isVisible }) => {

 const [cardRef, cardInView] = useInView({
  threshold: 0.2,
  triggerOnce: false
});

useEffect(() => {
  if (cardInView) setIsAnimated(true);
}, [cardInView]);

  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    if (cardInView && !isAnimated) {
      setTimeout(() => {
        setIsAnimated(true);
      }, index * 150);
    }
  }, [cardInView, index, isAnimated]);

  return (
    <article
      ref={cardRef}
      className={`${styles.featureCard} ${isAnimated ? styles.animated : ''} ${styles[feature.animationType]}`}
      style={{
        '--glow-color': feature.glowColor,
        '--animation-delay': `${index * 0.15}s`
      }}
    >
      <div>
        {feature.animationType === 'stellar' && isAnimated && (
          <div className={styles.stellarEffect}>
            {[...Array(10)].map((_, i) => (
              <div key={i} className={styles.stellarParticle} style={{ ['--i']: i }} />
            ))}
          </div>
        )}

        {feature.animationType === 'warp' && isAnimated && (
          <div className={styles.warpEffect}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={styles.warpLine} style={{ ['--i']: i }} />
            ))}
          </div>
        )}

        {feature.animationType === 'gravity' && isAnimated && (
          <div className={styles.gravityEffect}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className={styles.floatingParticle} style={{ ['--i']: i }} />
            ))}
          </div>
        )}

        {feature.animationType === 'orbit' && isAnimated && (
          <div className={styles.orbitEffect}>
            <div className={styles.orbitRing} />
            <div className={styles.orbitParticle} />
          </div>
        )}

        {feature.animationType === 'collaboration' && isAnimated && (
          <CollaborationEffect inView={isAnimated} />
        )}

        {feature.animationType === 'focus' && isAnimated && (
          <FocusEffect inView={isAnimated} />
        )}

        {feature.animationType === 'future' && isAnimated && (
          <div className={styles.futureEffect}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className={styles.techGrid} style={{ ['--i']: i }} />
            ))}
          </div>
        )}

        {feature.animationType === 'performance' && isAnimated && (
          <div className={styles.performanceEffect}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={styles.speedTrail} style={{ ['--i']: i }} />
            ))}
          </div>
        )}
      </div>

      <h3 className={styles.cardTitle}>{feature.title}</h3>
      <p className={styles.cardDescription}>{feature.description}</p>
      <div className={styles.cardGlow} aria-hidden="true"></div>
    </article>
  );
};

const WhyMe = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const cursorTrailRef = useRef(null);
  const trailsRef = useRef([]);

  useEffect(() => {
    let animationId;

    const handleMouseMove = (e) => {
      if (!cursorTrailRef.current) return;

      const containerRect = cursorTrailRef.current.getBoundingClientRect();
      // Constrain position to container, helpful if layout shifts
      const x = e.clientX - containerRect.left;
      const y = e.clientY - containerRect.top;

      const trail = document.createElement('div');
      trail.className = styles.cursorTrail;
      trail.style.left = x + 'px';
      trail.style.top = y + 'px';

      cursorTrailRef.current.appendChild(trail);
      trailsRef.current.push(trail);

      setTimeout(() => {
        if (trail.parentNode) {
          trail.parentNode.removeChild(trail);
        }
        const idx = trailsRef.current.indexOf(trail);
        if (idx > -1) trailsRef.current.splice(idx, 1);
      }, 600);

      if (trailsRef.current.length > 8) {
        const oldTrail = trailsRef.current.shift();
        if (oldTrail && oldTrail.parentNode) oldTrail.parentNode.removeChild(oldTrail);
      }
    };

    const throttledMouseMove = (e) => {
      if (!animationId) {
        animationId = requestAnimationFrame(() => {
          handleMouseMove(e);
          animationId = null;
        });
      }
    };

    if (inView) {
      document.addEventListener('mousemove', throttledMouseMove, { passive: true });
    }

    return () => {
      document.removeEventListener('mousemove', throttledMouseMove);
      if (animationId) cancelAnimationFrame(animationId);
      trailsRef.current.forEach(trail => {
        if (trail.parentNode) trail.parentNode.removeChild(trail);
      });
      trailsRef.current = [];
    };
  }, [inView]);

  return (
    <section ref={ref} className={styles.cosmicSection} id="why-me">
      <div
        ref={cursorTrailRef}
        className={styles.cursorTrailContainer}
        aria-hidden="true"
      />

      {/* CSS-only starfield background */}
      <div className={styles.starfield} aria-hidden="true">
        <div className={styles.stars}></div>
        <div className={styles.starsSecondary}></div>
        <div className={styles.starsTertiary}></div>
      </div>

      {/* Nebula gradient overlay */}
      <div className={styles.nebulaOverlay} aria-hidden="true"></div>

      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={`${styles.title} ${inView ? styles.fadeInUp : ''}`}>
            Why Choose Me?
          </h2>
          <p className={`${styles.intro} ${inView ? styles.fadeInUp : ''}`}>
            Chart your course through the digital galaxy with code that orbits precision and innovation.
          </p>
        </header>

        <div className={styles.featuresGrid}>
          {cosmicFeatures.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
              isVisible={inView}
            />
          ))}
        </div>

        <div className={`${styles.cta} ${inView ? styles.fadeInUp : ''}`}>
          <p className={styles.ctaText}>
            Ready to launch your project into orbit?
          </p>
          <a href='#contact' style={{ color: "white", textDecoration: "none" }}>
            <button className={styles.ctaButton}>
              Initialize Mission
              <div className={styles.buttonGlow} aria-hidden="true"></div>
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhyMe;
