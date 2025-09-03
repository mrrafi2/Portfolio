import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from './CodeEditor.module.css';

const DEFAULT_LINES = [
  "const rafi_skill_set = {",
  "  skills: {",
  "    languages: ['JavaScript', 'CSS', 'HTML', 'TypeScript'],",
  "    frameworks: ['React', 'Next.js', 'Bootstrap'],",
  "    libraries: ['TailwindCSS', 'GSAP', 'Framer Motion'],",
  "    backend: ['Node.js', 'REST', 'Firebase', 'GraphQL', 'MongoDB'],",
  "    tools: ['Git', 'GitHub', 'Chrome DevTools', 'Vite', 'Vercel']",
  "  },",
  "  status: 'Always Learning'",
  "};",
  "",
  "// Building tomorrow's web today..."
];

// Robust highlighter: tokenize strings and comments first to avoid nested replacements
function highlightLine(line) {
  const esc = (s) =>
    s.replace(/&/g, "&amp;")
     .replace(/</g, "&lt;")
     .replace(/>/g, "&gt;");

  // start escaped so tags we inject are real HTML
  let text = esc(line);

  // Tokenize comments
  const commentTokens = [];
  text = text.replace(/(\/\/.*$)/, (m) => {
    const html = `<span class="${styles.comment}">${m}</span>`;
    commentTokens.push(html);
    return `@@COMMENT_${commentTokens.length - 1}@@`;
  });

  // Tokenize strings (single, double, backtick)
  const stringTokens = [];
  text = text.replace(/(['"`])((?:(?!\1)[^\\]|\\.)*)(\1)/g, (m, p1, p2, p3) => {
    const html = `<span class="${styles.string}">${p1}${p2}${p3}</span>`;
    stringTokens.push(html);
    return `@@STRING_${stringTokens.length - 1}@@`;
  });

  // Keywords (word boundaries to avoid partial matches)
  const kwRegex = /\b(const|let|var|function|return|if|else|for|while|class|extends|import|export|from|async|await|new)\b/g;
  text = text.replace(kwRegex, `<span class="${styles.keyword}">$1</span>`);

  // Object keys: match identifier before colon (preserve leading whitespace / separators)
  // Use a conservative pattern to avoid matching inside injected tokens
  text = text.replace(/(^|\s|,)([A-Za-z_][$\w]*)(\s*:)/g, (m, g1, g2, g3) => {
    return `${g1}<span class="${styles.property}">${g2}</span>${g3}`;
  });

  // Restore string tokens
  text = text.replace(/@@STRING_(\d+)@@/g, (m, idx) => stringTokens[Number(idx)] || '');

  // Restore comment tokens
  text = text.replace(/@@COMMENT_(\d+)@@/g, (m, idx) => commentTokens[Number(idx)] || '');

  return text;
}

// extract skills from quotes
const extractSkills = (lines = DEFAULT_LINES) => {
  const skills = [];
  const regex = /['"]([A-Za-z0-9.+#\- ]{2,50}?)['"]/g;
  lines.forEach((line) => {
    let m;
    while ((m = regex.exec(line)) !== null) {
      skills.push(m[1].trim());
    }
  });
  return skills;
};

export default function CodeEditor({ isDark = true, lines = DEFAULT_LINES }) {
  const [currentCode, setCurrentCode] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [revealedSkills, setRevealedSkills] = useState([]); 
  const [copied, setCopied] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: false });
  const containerRef = useRef(null);

  const allSkills = useMemo(() => extractSkills(lines), [lines]);

  useEffect(() => {
    if (!inView) return;
    let mounted = true;
    let timerId = null;
    const speed = 25;

    const stateRef = { line: lineIndex, char: charIndex };

    const step = () => {
      if (!mounted) return;

      const li = stateRef.line;
      const ci = stateRef.char;

      if (li < lines.length) {
        const line = lines[li];

        if (ci < line.length) {
          const nextChar = line.charAt(ci);
          setCurrentCode((prev) => prev + nextChar);

          // if a skill string is being closed, reveal it
          if (nextChar === "'" || nextChar === '"') {
            const partial = line.slice(0, ci + 1);
            const match = partial.match(/['"]([^'"]+)['"]$/);
            if (match && allSkills.includes(match[1]) && !revealedSkills.includes(match[1])) {
              setRevealedSkills((prev) => [...prev, match[1]]);
            }
          }

          stateRef.char = ci + 1;
          setCharIndex(stateRef.char);
          timerId = setTimeout(step, speed);
        } else {
          setCurrentCode((prev) => prev + '\n');
          stateRef.line = li + 1;
          setLineIndex(stateRef.line);
          stateRef.char = 0;
          setCharIndex(0);
          timerId = setTimeout(step, speed + 50);
        }
      } else {
        // reset loop
        timerId = setTimeout(() => {
          if (!mounted) return;
          setCurrentCode('');
          setRevealedSkills([]);
          stateRef.line = 0;
          stateRef.char = 0;
          setLineIndex(0);
          setCharIndex(0);
          timerId = setTimeout(step, 1000);
        }, 7000);
      }
    };

    timerId = setTimeout(step, 200);

    return () => {
      mounted = false;
      if (timerId) clearTimeout(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, lines]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Copy failed:', err);
    }
  };

  const renderedCodeHtml = currentCode
    .split('\n')
    .map((ln, idx, arr) => {
      const isLast = idx === arr.length - 1;
      const lineNumber = idx + 1;
      return `<div class="${styles.codeLine}" data-line="${idx}">
        <span class="${styles.lineNumber}">${lineNumber.toString().padStart(2, ' ')}</span>
        <span class="${styles.lineContent}">${highlightLine(ln)}${
          isLast ? `<span class="${styles.cursor}">|</span>` : ''
        }</span>
      </div>`;
    })
    .join('');

  return (
    <motion.div
      ref={containerRef}
      className={`${styles.codeEditor} ${isDark ? styles.dark : styles.light} ${expanded ? styles.expandedEditor : ''} ${copied ? styles.copied : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      aria-live="polite"
    >
      {/* Glassmorphism background layers */}
      <div className={styles.backgroundLayers}>
        <div className={styles.glassLayer}></div>
        <div className={styles.gradientLayer}></div>
      </div>

      <div className={styles.editorHeader}>
        <div className={styles.editorInfo}>
          <div className={styles.editorButtons}>
            <span className={styles.editorBtn} data-color="red" />
            <span className={styles.editorBtn} data-color="yellow" />
            <span className={styles.editorBtn} data-color="green" />
          </div>
          <div className={styles.fileInfo}>
            <span className={styles.filename}>skills.js</span>
            <span className={styles.fileStatus}>●</span>
          </div>
        </div>

        <div className={styles.headerRight}>
          <motion.button 
            className={`${styles.copyBtn} ${copied ? styles.success : ''}`}
            onClick={handleCopy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </motion.button>
          
        </div>
      </div>

      <div ref={ref} className={styles.editorBody}>
        <div className={styles.codeSection}>

          {/* IMPORTANT: set monospace + horizontal scrolling to prevent overlap */}
          <pre
            className={styles.codePre}
            style={{
              whiteSpace: 'pre',
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              paddingBottom: 8
            }}
            dangerouslySetInnerHTML={{ __html: renderedCodeHtml }}
          />
        </div>

        <motion.div 
          className={styles.skillRail}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className={styles.skillHeader}>
            <span className={styles.skillIcon}>⚡</span>
            <span>Skills Detected</span>
            <span className={styles.skillCount}>{revealedSkills.length}</span>
          </div>
          <div className={styles.skillList}>
            <AnimatePresence>
              {revealedSkills.map((skill, i) => (
                <motion.div
                  key={skill + i}
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: i * 0.1,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <span className={styles.skillChip}>
                    {skill}
                    <span className={styles.chipGlow}></span>
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div className={styles.editorFooter}>
        <div className={styles.footerLeft}>
          <span className={styles.statusIndicator}>●</span>
          <span>JavaScript</span>
          <span className={styles.separator}>|</span>
          <span>UTF-8</span>
        </div>
        <div className={styles.footerRight}>
          <span>Ln {lineIndex + 1}, Col {charIndex + 1}</span>
        </div>
      </div>
    </motion.div>
  );
}
