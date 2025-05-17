import React, { useState } from 'react';
import styles from './save.module.css';

const RetroSaveButton = () => {
  const [status, setStatus] = useState('idle'); // 'idle' | 'saving' | 'saved'

  const handleClick = () => {
    if (status === 'idle') {
      setStatus('saving');
      // Simulate saving process
      setTimeout(() => {
        setStatus('saved');
        // Return to idle state after 2 seconds
        setTimeout(() => {
          setStatus('idle');
        }, 2000);
      }, 1500);
    }
  };

  return (
    <button
      className={`${styles.retroButton} ${
        status === 'saving' ? styles.flipping : ''
      } ${status === 'saved' ? styles.saved : ''}`}
      onClick={handleClick}
    >
      <div className={styles.buttonFace}>
        {status === 'idle' && 'Save'}
        {status === 'saving' && (
          <span className={styles.savingText}>Saving...</span>
        )}
        {status === 'saved' && (
          <span className={styles.savedText}>Saved!</span>
        )}
      </div>
      <div className={styles.diskette}>
        <div className={styles.diskBody}></div>
        <div className={styles.diskLight}></div>
      </div>
    </button>
  );
};

export default RetroSaveButton;
