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

function highlightLine(line) {
  const esc = (s) =>
    s.replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  return esc(line);
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
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: false });
  const containerRef = useRef(null);

  const allSkills = useMemo(() => extractSkills(lines), [lines]);

  useEffect(() => {
    if (!inView) return;
    let mounted = true;
    let timerId = null;
    const speed = 20;

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
          timerId = setTimeout(step, speed + 40);
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
          timerId = setTimeout(step, 800);
        }, 6500);
      }
    };

    timerId = setTimeout(step, 100);

    return () => {
      mounted = false;
      if (timerId) clearTimeout(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, lines]);

  const renderedCodeHtml = currentCode
    .split('\n')
    .map((ln, idx, arr) => {
      const isLast = idx === arr.length - 1;
      return `<div data-line="${idx}">${highlightLine(ln)}${
        isLast ? `<span class="${styles.cursor}">|</span>` : ''
      }</div>`;
    })
    .join('');

  return (
    <div
      ref={containerRef}
      className={`${styles.codeEditor} ${isDark ? styles.dark : styles.light} ${expanded ? styles.expandedEditor : ''}`}
      aria-live="polite"
    >
      <div className={styles.editorHeader}>
        <div className={styles.editorButtons}>
          <span className={styles.editorBtn} style={{ backgroundColor: '#ff5f56' }} />
          <span className={styles.editorBtn} style={{ backgroundColor: '#ffbd2e' }} />
          <span className={styles.editorBtn} style={{ backgroundColor: '#27ca3f' }} />
        </div>
        <div className={styles.headerRight}>
          <button className={styles.copyBtn} onClick={() => navigator.clipboard.writeText(lines.join('\n'))}>Copy</button>
          <button className={styles.expandBtn} onClick={() => setExpanded((v) => !v)} aria-pressed={expanded}>
            {expanded ? 'Exit' : 'Focus'}
          </button>
        </div>
      </div>

      <div ref={ref} className={styles.editorBody}>
        <pre
          className={styles.codePre}
          dangerouslySetInnerHTML={{ __html: renderedCodeHtml }}
        />
        <div className={styles.skillRail}>
          <div className={styles.skillHeader}>Skills</div>
          <div className={styles.skillList}>
            <AnimatePresence>
              {revealedSkills.map((s, i) => (
                <motion.div
                  key={s + i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className={styles.skillChip}>{s}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className={styles.editorFooter}>
        <small>Tip: use Focus to expand the editor for presentations.</small>
      </div>
    </div>
  );
}
