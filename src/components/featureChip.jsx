import React from "react";
import styles from "./FeatureChips.module.css";

export default function FeatureChips({ Keyfeature = [], maxVisible = 6 }) {
  if (!Keyfeature || Keyfeature.length === 0) return null;

  const visible = Keyfeature.slice(0, maxVisible);
  const overflowCount = Keyfeature.length - visible.length;

  return (
    <ul className={styles.list} aria-label="Project features">
      {visible.map((f, i) => (
        <li key={i} className={styles.chip} title={f} aria-label={f}>
          <span className={styles.text}>{f}</span>
        </li>
      ))}

      {overflowCount > 0 && (
        <li className={`${styles.chip} ${styles.overflow}`} aria-hidden>
          +{overflowCount}
        </li>
      )}
    </ul>
  );
}
