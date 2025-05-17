import React from 'react';
import { useInView } from 'react-intersection-observer';
import styles from './About.module.css';
import profile from "../assets/profile.jpg";

// A reusable wrapper that fades in its children when in view
const FadeInSection = ({ children, className, delay = "0s" }) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const style = {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.6s ease ${delay}, transform 0.6s ease ${delay}`,
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
};

const TimelineItem = ({ delay, title, text, styleClass }) => {
  const [expanded, setExpanded] = React.useState(false);

  // Prepare content paragraphs
  const paragraphs = Array.isArray(text) ? text : [text];

  return (
    <FadeInSection className={`${styles.timelineItem} ${styleClass}`} delay={delay}>
      <div className={styles.timelineContent}>
        <h3>{title}</h3>

        {/* Container that handles collapse/expand */}
        <div className={`${styles.timelineText} ${expanded ? styles.expanded : styles.collapsed}`}>
          {paragraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        <button 
          onClick={() => setExpanded(!expanded)} 
          className={styles.seeMoreBtn}
        >
          {expanded ? "See Less" : "See More"}
          <i className={`fa-solid ${expanded ? "fa-chevron-up" : "fa-chevron-right"}`}></i>
        </button>
      </div>
    </FadeInSection>
  );
};

const About = () => {
  const timelineTexts = {
    beginnings: [
      `It all kicked off during those endless COVID-19 lockdown days, when my world shrank to the four walls of home and the infinite playground of the Internet. I found myself doom-scrolling social feeds, hopping from one blog to the next, and binge-watching tutorial after tutorial—wondering, “How do these apps actually work? Who crafts these slick animations?” That spark of curiosity turned into a full-blown obsession.`,


      `Armed with nothing but my hand-me-down laptop and an insatiable appetite for “just one more video,” I dove headfirst into HTML, CSS, and JavaScript. Every misplaced semicolon became a puzzle, every console error a mini mystery to solve. I’d celebrate like I’d just won the lottery when a stubborn bug finally bowed out, or when my first gradient-driven button animation came to life. Those late-night coding sessions felt like magic—an addictive blend of problem-solving and pure creativity.`,

      `Before long, I was sketching wireframes on napkins, dreaming up color palettes, and experimenting with fonts to craft just the right vibe. I taught myself responsive layouts, dabbled in React hooks, and fell in love with CSS transitions that felt like tiny digital fireworks. Each project—no matter how small—was a chance to flex my skills, learn new tricks, and push the envelope of what I thought was possible.`
    ],

    "Forging Foundations": `In those early days, I literally cut my teeth on plain-old HTML and CSS—think “copy, paste, tweak”—as I cloned basic templates and reverse-engineered every tag and selector until it felt like second nature. I wrestled floats like a blacksmith at the anvil, hammered out Flexbox layouts, and forged responsive grids that adapted to any screen. JavaScript then strode onto the scene like a trusty squire, and I laced up my boots to explore onclick handlers, DOM traversal, and event listeners. Every console.log was a small victory dance, every bug a riddle to solve—by candlelit nights, I’d leveled up from static wireframes to interactive mini-apps, laying rock-solid bedrock for the chapters yet to come.`,

    "Learning": `Fueled by that momentum, I next delved into CSS libraries and frameworks—the Armory of Web Dev. I stan’d Bootstrap’s grid system, low-key vibed with Tailwind’s utility classes, and admired Bulma’s elegant modifiers. But my heart truly ignited when React.js rolled into town: JSX felt like a modern parchment, hooks wrote new spells of state, and Context API bound components in harmonious synergy. I crafted reusable components, orchestrated data flows, and watched static views blossom into dynamic, single-page wonders. Then came the sparkly fun bit—animation libraries. I added Framer Motion for buttery transitions, Particles.js for starry-sky backgrounds, and even flirted with Three.js for 3D wizardry. Each npm install was a chance for a fresh “glow-up,” every docs page a treasured scroll. And the journey never ends—my toolbelt stays stocked, my curiosity forever lit, as I continue mining new libraries, tweaking legacy code, and stanning the endless possibilities of the web.`,

    "Crafting Real-World Projects":[` From humble logic puzzles and playful animations, I leveled up to full-blown, end-to-end web applications—each one a crucible for my growing craft. I tackled:`,

      `✔  I mastered user authentication, responsive layouts, RESTful APIs, and database design—then saw it all live by deploying to cloud hosts. No more “just a demo” code; these were production-ready builds, bulletproof and battle-tested.`,

      `✔  Next, I architected a dynamic quiz site with four distinct themes—each category glowing with its own custom animations and color palettes. Behind the scenes, I crafted star-rating logic by score, category-based scoring breakdowns, user rankings, and a full profile-editing system. Every interaction, from “Select Answer” to “View Results,” felt crisp and rewarding.
`,

  `✔  Hungry for content-heavy challenges, I forged a blogging platform where writers could compose, upload, and tag posts. I built like/comment/bookmark features, trending-post algorithms, category and author filters, and detailed reading history (complete with timestamps). View counts, reading-time estimates, and smooth pagination rounded out a rich, reader-first experience.
`,

`✔  Retail met code: I developed a marketplace with product catalogs, shopping carts, secure payments, order history, and admin dashboards. From AJAX-powered filters to PWA offline support, I made buying (and selling) feel effortless on any device.

`,

`✔  Lately, I’ve been weaving together sockets, canvas drawings, and audio snippets into a live-chat experience. Users can add and search friends, share images or hand-drawn sketches, leave voice notes—complete with reactive mood themes and playful micro-interactions that bring every conversation to life.`,

`I also sprinkled in playful micro-interactions and bite-sized mini-games—think hover-activated confetti bursts, draggable puzzle logins, and hidden easter-egg challenges—that turn routine clicks into delightful surprises and keep users coming back for more.`,


`Each project has been both a nod to time-honored engineering principles and a jump into the bleeding edge—melding classical rigor with Gen-Z flair. Through every deploy, bug fix, and feature roll-out, I sharpened my toolkit and learned that true innovation lives at the intersection of craftsmanship and creative curiosity.`

    ],
    
    Future: [
      `Looking ahead, I’m on a mission to blend timeless craftsmanship with tomorrow’s tech. I’ll be diving deeper into AI-driven experiences—think personalized content that adapts in real time, chatbots that feel genuinely human, and smart recommendation engines that learn as you click. At the same time, I’m championing performance-first design: lightning‑fast load times, obsessively optimized assets, and seamless offline support so every site feels as reliable as a well‑worn library.`,
      `I’m also committed to building with empathy and inclusivity. That means leveling up my accessibility game—voice navigation, high‑contrast themes, and keyboard‑first interactions—so no one gets left behind. And because the web never stops evolving, I’ll keep exploring emerging frameworks like Svelte and Solid.js, experimenting with WebAssembly for supercharged UIs, and harnessing the power of headless architectures to give clients ultimate flexibility.`,

      `Above all, my future projects will be driven by curiosity and care: marrying the elegance of traditional design principles with the playful spark of Gen Z innovation. Whether it’s crafting immersive micro‑interactions, architecting scalable platforms, or simply spinning up the next big idea, I’m here to turn tomorrow’s possibilities into today’s extraordinary experiences.`
    ]
  };

  return (
    <section id="about" className={styles.about}>
      <div className={styles.contentWrapper}>

        {/* Profile Card */}
        <FadeInSection className={styles.profileCard}>
          <div className={styles.profileFrame}>
            <img src={profile} alt="Profile" className={styles.profilePic} />
          </div>
          <h3 className={styles.fullName}>MD. Rafi</h3>
          <p className={styles.title}>Computer Science</p>
          <p className={styles.field}>
            Chittagong University of Engineering and Technology (CUET)
          </p>
          <p className={styles.location}>
            <i className="fa-sharp fa-solid fa-location-dot"></i>
            <span style={{ marginLeft: "4px" }}>Chittagong, Bangladesh</span>
          </p>
          <div className={styles.socialIcons}>
            <a href="https://www.facebook.com/share/15ZTKuVpQk/" target="_blank" rel="noreferrer" className={styles.socialIconBox}>
              <i className="fa-brands fa-facebook"></i>
            </a>

            <a href="https://x.com/rafi_khan111?t=J0g3Cj3pADckzzebbW9AKA&s=09" target="_blank" rel="noreferrer" className={styles.socialIconBox}>
              <i className="fa-brands fa-x-twitter"></i>
            </a>

            <a href="https://github.com/mrrafi2" target="_blank" rel="noreferrer" className={styles.socialIconBox}>
              <i className="fa-brands fa-github"></i>
            </a>

            <a href="https://www.linkedin.com/in/as-rafi-497a34365?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noreferrer" className={styles.socialIconBox}>
              <i className="fa-brands fa-linkedin"></i>
            </a>
          </div>
        </FadeInSection>

        {/* Animated Timeline Narrative */}
        <div className={styles.timeline}>
          <h2 className={styles.timelineHeading}>My Journey</h2>
          <ul className={styles.timelineList}>
            <TimelineItem 
              delay="0.3s"
              title="Beginnings"
              text={timelineTexts.beginnings}
              styleClass={styles.firstItem}
            />
            <TimelineItem 
              delay="0.6s"
              title="Forging Foundations"
              text={timelineTexts['Forging Foundations']}
              styleClass={styles.secondItem}
            />
            <TimelineItem 
              delay="1.2s"
              title="Continuous Learning"
              text={timelineTexts.Learning}
              styleClass={styles.thirdItem}
            />
            <TimelineItem 
              delay="1.8s"
              title="Crafting Real-World Projects"
              text={timelineTexts['Crafting Real-World Projects']}
              styleClass={styles.fourthItem}
            />

           <TimelineItem 
              delay="2.1s"
              title="Future"
              text={timelineTexts.Future}
              styleClass={styles.fifthItem}
            />

            
          </ul>
        </div>
      </div>
    </section>
  );
};

export default About;
