import React, { useState, useEffect, useRef } from 'react';
import styles from './Projects.module.css';
import ProjectOverlay from './ProjectOverlay';
import brainiac from "../assets/brainiac.png"
import blogB2 from "../assets/blogB2.png"
import blogB3 from "../assets/blogP2.jpg"
import blogChallange from "../assets/blogChall.png"

import project1Img from "../assets/quiz1.png";
import quizzer from "../assets/quizzer.png"
import quizA1 from "../assets/quizA2.png"
import QuizChallange from '../assets/quizChall.png';

import NeonMart from "../assets/neon-mart.png"
import NeonP1 from "../assets/neonP1.jpg"
import NeonP2 from "../assets/neonP2.jpg"
import neonChallenge from '../assets/neonChall.png'

import QuiverImg from "../assets/quiver.png"
import  chatp1 from "../assets/chatP1.jpg"
import chatP2 from "../assets/chatP2.jpg"
import QuiverChallange from "../assets/quiverChall.png";

const projectData = [
  {
    id: 1,
    title: 'Quiz',
    previewLink:'https://quezzer.vercel.app/',
    description: 'A dynamic, modern quiz app that turns learning into a classic and engaging adventure.',

     details: [
      'Quazzer is a meticulously crafted quiz platform built upon the robust foundations of React and Firebase, enriched by subtle yet striking CSS animations. From the very first interaction, users are greeted by a refined interface that balances elegance with intuitive usability.',
      'Each quiz category is adorned with its own bespoke gradient and animated labels, evoking a sense of discovery as participants progress. Behind the scenes, every response is recorded in real time, allowing for instantaneous feedback and a seamless, engaging experience.',
      'The architecture is designed for both performance and scale: Firebase Realtime Database ensures that scores, user profiles, and earned badges are synchronized across devices without delay. Meanwhile, the authentication flows—powered by Firebase Auth—offer rock‑solid security while remaining elegantly unobtrusive.'
    ],

    features: [
     [<strong>Quiz Categories & Sequential Labels: </strong> , 
      [
        'Distinct categories such as Arts & Culture, History, and Science & Nature',
        'Sequential progression enforces mastery — each label must be completed before advancing',
        'Dynamic label animations guide users through the learning path'
      ]
     ],
     [
       <strong>Progress Overview & Milestone Rewards: </strong> ,
      [
        'Animated progress bar fills smoothly with each completed label',
        'Ribbon awarded at 20%, Star at 50%, and Crown at 85% — each with celebratory effects',
        'Subtle confetti bursts and sound cues mark every milestone'
      ]
    ],

    [
      <strong>Real‑Time Leaderboards & Neon Styling: </strong> ,
      [
        'Global ranking updates instantly as users submit answers',
        'Leaderboards display avatars, usernames, and cumulative scores',
        'Top performers receive exclusive neon-glow effects and animated badges'
      ],
    ],
    [
      <strong>User Account Management & Personalization: </strong> ,
      [
        'Secure sign‑up, login, and logout via Firebase Authentication',
        'Customizable profiles: choose avatar icons and background colors',
        'Dark mode toggle for comfortable viewing in any light condition'
      ],
    ],

      <strong>Technology Stack & Libraries :</strong>,
      
        'React v19.0.0 with React Router DOM v7.1.5 for seamless navigation',
        'Firebase Auth & Realtime Database for secure, real‑time data handling',
        'Framer Motion v12.4.7 for advanced, fluid component animations',
        'Bootstrap v5 and CSS Modules for responsive layouts and scoped styling',
        'React Icons v5.5.0 to enrich the UI with vector graphics'
      
    ],

    challenges: [
      'Maintaining buttery‑smooth 60fps animations on a wide spectrum of devices—from flagship phones to low‑end browsers—required rigorous profiling and strategic code‑splitting.',
      'Building reliable real‑time features (leaderboards, progress sync) demanded careful coordination between client and Firebase, plus robust offline support to handle flaky network conditions.',
      
      
        'Designing secure Firebase rules to prevent unauthorized data access or tampering',
        'Implementing atomic score updates and avoiding race conditions under heavy load',
        'Ensuring CSS animations gracefully degrade on older browsers or low‑power devices',
        'Managing complex state flows in React for sequential quiz progression',
        'Developing the logic and crafted unique label‑card animations that truly embody each category’s theme',
        'Architecting a responsive layout that adapts to phones, tablets, and desktops without visual glitches',
        'Handling image gallery loading and caching for optimal performance',
        'Writing end‑to‑end tests and mocking real‑time database events for CI pipelines',
        'Configuring continuous deployment to minimize downtime and support instant rollbacks',
        'Balancing bundle size—keeping initial load under 200KB while delivering rich interactions',
        'Localizing content for different regions and managing right‑to‑left layouts where needed',
        'Monitoring production errors and performance with real‑time alerts and analytics'
      
    ],

    future: [
  'Looking forward, Quazzer will evolve into a truly adaptive learning platform—where each quiz molds itself to your strengths and weaknesses in real time. Imagine voice‑activated questions you can answer hands‑free, AR overlays that turn your surroundings into interactive study zones, and AI‑driven question generators that craft fresh challenges on the fly.'],

  gallery: [
      project1Img,
      quizA1,
      QuizChallange
    ],
    image: quizzer,
    rotation: 5, 
  },
  {
    id: 2,
    title: 'Content/Blog',
    previewLink: 'https://brainiac-lime.vercel.app/',
    description: 'A futuristic blogging platform that blends classic writing with cutting‑edge engagement.',

    details:  [
      'Brainiac Blogsite is a modern, responsive platform built on React and Firebase, designed for both writers and readers who crave interactivity and real‑time feedback.',
      'From the moment you log in, you’ll notice the seamless integration of rich‑text editing, cover‑image uploads, and category tags—every part of the writing experience feels intuitive and polished.',
      'Behind the scenes, Firebase Realtime Database powers instant updates to comments, likes, and view counts, while Firebase Authentication ensures secure, hassle‑free account management.'
    ],

    features: [
      [ 
        <strong>User Authentication & Account Management: </strong>,
        [
          'Register and sign in with email/password or Google OAuth',
          'Edit display name and profile details stored in Firebase',
          'Persistent sessions and secure logout flows'
        ]
      ],

      [
        <strong>Blogging Functionality: </strong>,

        [
          'Create, edit, and delete posts with a rich‑text + multimedia editor',
        'Attach cover images and organize posts by categories',
        'Live preview mode to see exactly how your post will look'
        ]
      ],

      [
        <strong>Interactive Engagement: </strong>,

        [
          'Like posts and leave threaded comments with edit/delete support',
          'Real‑time view (seen) counters that exclude author views',
          'Bookmark posts for later reading, with toggleable “Bookmark”/“Bookmarked” states'
        ]
      ],

      [
        <strong>Personalized Reading History: </strong>,

        [
          'Automatically tracks which posts you’ve read by date',
        'Groups daily reads, showing only your latest view per day',
        'Futuristic loading spinner while fetching reading history'
        ]
      ],

      [
        <strong>Trending & Ranking: </strong>,

        [
          'Dynamic trending algorithm factoring views, likes, comments, and time decay',
        'Blogger leaderboard with unique HSL‑generated avatars',
        'Highlight trending posts on a dedicated page'
        ]
      ],

      [
        <strong>Advanced Search & Navigation: </strong>,

        [
          'Instant search by title, category, or keyword with animated overlay',
        'Responsive off‑canvas menu and cyberpunk‑inspired modals',
        'Fully mobile‑friendly layout and fast transitions'
        ]
      ],

      <strong>Tech Stack & Libraries: </strong>,

     'React for dynamic UI and React Router for seamless navigation',
        'Firebase Auth & Realtime Database for secure, live data',
        'CSS Modules + custom animations for scoped, futuristic styles',
        'React Portals to render overlays outside the main DOM flow',
        'Font Awesome for crisp, customizable icons'

    ],

    challenges: [' Achieving cross-browser compatibility to ensure a seamless experience across all major platforms',
      'Scaling real‑time engagement features—likes, comments, and view counts—without sacrificing latency.',

      'Architecting a robust commenting system with support for likes, edits, and deletions—balancing user flexibility with backend sanity.',

      'Designing a reliable bookmarking system, complete with a dedicated page to help users revisit saved articles effortlessly.',

      'Building a user reading history page that accurately logs and displays reading activity—down to the exact date.',

      'Crafting a trending section powered by a custom algorithm—this was a beast to get right, but it paid off with accurate and dynamic content surfacing.'

    ],

    future: [
      'Looking ahead, Brainiac will evolve into a truly intelligent platform: expect AI‑powered writing suggestions, voice‑to‑text composition modes, and personalized article recommendations that learn your interests over time.',

    ],


  
    gallery: [
     blogB2,
     blogB3,
     blogChallange
    ],
    image: brainiac,
    rotation: -4,
  },
  {
    id: 3,
    title: 'E-commerce',
    previewLink:'https://neon-cart.vercel.app/',
    description: 'Neon‑mart is your electrifying one‑stop e‑commerce bazaar—where every click pulses with neon energy.',

    details: [
      'Step into Neon‑mart and feel the buzz: a neon‑soaked marketplace built on React and Firebase, designed to dazzle from the very first pixel.',
      'Our UI bursts with life—powered by Bootstrap, Framer Motion, and GSAP—so that cards glow, buttons morph, and modals slide in rhythm with your scroll.',
      'Under the hood, lazy‑loading and Intersection Observer keep performance lightning‑fast: images fire up only when you need them, so every page feels instant.'
    ],
    
    
    features: [
      '💡 Electrifying Animations – Micro‑interactions that flicker, pulse, and glow like a live neon sign.',
      '🔍 Blazing-Fast Routing – React Router DOM makes every page transition seamless and frame-perfect.',
      '📦 Live Product Feeds – Search, filter, and add to cart with real‑time updates—no page reloads needed.',
      '🔔 Instant Alerts – EmailJS notifications pop up like neon buzzes to keep you in the loop.',
      '🔒 Rock‑Solid Security – Firebase Auth & Firestore lock down your data with zero friction.',
      '⚡ Speed Hacks – Lazy loading + Intersection Observer supercharge load times.',
      '📱 Device‑Ready – A responsive design that shines on phones, tablets, and desktops alike.',
      '🌱 Neon Nostalgia – Retro‑inspired vibes fused with cutting‑edge UX for a shopping trip like no other.',

      ['TechStack: ' [
        'React (^18.2.0)',
        'React DOM (^18.2.0)',
        'React Router DOM (^7.3.0)',
        'Bootstrap (^5.3.3)',
        'Framer Motion (^12.5.0)',
        'GSAP (^3.12.7)',
        'Axios (^1.8.4)',
        'Firebase (^11.4.0)',
        'EmailJS (@emailjs/browser ^4.4.1)',
        'React Icons (^5.5.0)',
        'React Intersection Observer (^9.16.0)'
      ],
    ]
    ],

    challenges: [
      'Tackling my first full‑scale e‑commerce marketplace was a steep learning curve—architecting complex business logic from scratch forced me to level up fast, and AI‑powered tools became my secret weapon.',
      'Setting up secure, scalable image storage for product assets challenged me to design robust upload pipelines and configure cloud buckets with precision.',
      'Building a dynamic star‑rating system tested my skills in aggregating user reviews into an accurate average score and rendering it beautifully with animated star icons.'
    ],

    future: 'No future Vision.',
    gallery: [
      NeonP1,
      NeonP2,
      neonChallenge
    ],
    image: NeonMart,
    rotation: 3,
  },



  {
    id: 3,
    title: 'Quiver',
    previewLink: 'https://quiver-chat.vercel.app/',
    description: 'Quiver is the ultimate real‑time chat playground—where bursts of conversation fly fast, and every message zhiiings with personality. ',

    details: [
      `At its core, Quiver is built on a lightning‑fast React front end and Firebase’s rock‑solid backend, ensuring every message, sketch, and audio clip arrives in under 50ms—even under heavy load. This real‑time foundation makes conversations feel immediate, reliable, and effortlessly in sync across all your devices.`,
    
      `Quiver’s integrated sketch canvas—powered by react‑sketch‑canvas and Fabric.js—lets you doodle, annotate, or brainstorm visually in the middle of a chat. Every stroke is broadcast live to other participants, giving your discussions a creative spark that text alone can’t match.`,
    
      `Voice messages get a playful twist thanks to Tone.js: record a clip, apply filters and effects, and hear your friends’ remixed replies in seconds. Behind the scenes, we optimize audio buffers and effect chains so you get studio‑quality sound without lag or glitches.`,
    
      `Media uploads—whether screenshots, sketches, or voice snippets—are handled by Cloudinary, with secure Firebase Storage falling back when needed. Coupled with carefully crafted Firestore rules, Quiver keeps your data safe, your privacy intact, and your chat history perfectly synchronized, no matter how long the conversation runs.`
    ],

    features: [
      '⚡ Instant Vibes – Real‑time messaging with Socket.IO for zero‑lag conversations.',
      '🎨 Sketch & Share – Draw and send art in‑chat using react‑sketch‑canvas & Fabric.js.',
      '🔊 Voice Remix – Record, process, and play audio snippets with Tone.js effects.',
      '✨ Glow & Pop – Eye‑candy animations and particles courtesy of Framer Motion & tsparticles.',
      '☁️ Cloud‑Power – Fast, reliable media storage with Cloudinary.',
      '🔒 Rock‑Solid Backend – Firebase Auth, Firestore & Storage for bulletproof security.',
      '📱 Responsive UI – Seamless experience on phone, tablet, or desktop.',
      [ <strong>Tech Stack:</strong>, 
        'React (^18.2.0)',
        'React Router DOM (^7.5.0)',
        'Bootstrap (^5.3.5)',
        'Socket.IO Client (^4.8.1)',
        'Firebase Auth & Firestore (^11.6.0)',
        'Cloudinary (^2.6.0)',
        'React‑sketch‑canvas (^6.2.0)',
        'Fabric.js (^5.5.2)',
        'Tone.js (^15.0.4)',
        'Framer Motion (^12.6.5)',
        'Tsparticles (^3.8.1)',
        'React‑tsparticles (^2.12.2)',
        'React Icons (^5.5.0)',
        'Lucide‑React (^0.503.0)',
      ]
    ],

    

    challenges: [
      'Guaranteeing rock‑solid, low‑latency delivery under real‑world conditions—handling spotty networks, reconnections, and race conditions without dropping a single message.',
      'Crafting a collaborative sketch canvas that syncs brush strokes and layers live across multiple devices, while keeping both performance and memory usage in check.',
      'Engineering the Tone.js voice‑remix feature to support layered effects, instant playback, and file‑size constraints—across Chrome, Safari, and mobile browsers.',
      'Securing every pixel and audio clip with Firebase Auth rules and Cloudinary policies, ensuring user media is private by default and only shared with explicit permission.',
      'Optimizing bundle size and resource loading so the app boots in under two seconds on mid‑range phones—lazy‑loading noncritical code and prefetching only what’s needed for your next interaction.'
    ],

    future: 'No future Vision.',

    gallery: [
      chatp1,
      chatP2,
      QuiverChallange
    ],

    image: QuiverImg,
    rotation: 2
  }



];

const ProjectCard = ({ project, mousePos, factor, onClick }) => {
  const style = {
    transform: `rotate(${project.rotation}deg) translate(${mousePos.x * factor}px, ${mousePos.y * factor}px)`,
    transition: 'transform 0.1s ease',
    cursor: 'pointer',
  };

  return (
    <div 
      className={styles.card} 
      style={style}
      onClick={onClick}
    >
      <img 
        src={project.image} 
        alt={project.title} 
        className={styles.projectImage} 
      />
      <div className={styles.cardOverlay}>
        <h3 className={styles.projectTitle}>{project.title}</h3>
        <p className={styles.projectDesc}>{project.description}</p>
      </div>
    </div>
  );
};

const Projects = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedProject, setSelectedProject] = useState(null);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos({ x, y });
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className={`${styles.projectsSection} ${visible ? styles.visible : ''}`}
      onMouseMove={handleMouseMove}
    >
      <h2 className={styles.heading}>Projects Desk</h2>
      <br />
      <div className={styles.cardContainer}>
        {projectData.map((project, index) => (
          <ProjectCard 
            key={project.id}
            project={project}
            mousePos={mousePos}
            factor={index % 2 === 0 ? 0.03 : -0.03}
            onClick={() => setSelectedProject(project)}
          />
        ))}
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
