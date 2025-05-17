import React, { useRef, useEffect, useState } from "react";
import styles from "./Audio.module.css";

export function AdvancedAudioVisualizer() {
  const [enabled, setEnabled] = useState(false);
  const [audioCtx, setAudioCtx] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const canvasRef = useRef(null);

  // Initialize audio only when enabled
  useEffect(() => {
    if (enabled && !audioCtx) {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const analyserNode = context.createAnalyser();
      analyserNode.fftSize = 256; // more resolution than 128
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const source = context.createMediaStreamSource(stream);
          source.connect(analyserNode);
          setAudioCtx(context);
          setAnalyser(analyserNode);
        })
        .catch(err => console.error(err));
    }
  }, [enabled, audioCtx]);

  // Drawing loop for the advanced Fourier visualizer
  useEffect(() => {
    let animationFrame;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    if (!analyser) return; // exit if audio is not running

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrame = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = 50;
      const barCount = bufferLength;
      const sliceAngle = (2 * Math.PI) / barCount;

      // Compute average amplitude for a background pulsation effect
      let avg = dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;
      const pulseRadius = baseRadius + avg / 5;

      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fill();

      for (let i = 0; i < barCount; i++) {
        const amplitude = dataArray[i] / 255; // normalize
        const angle = i * sliceAngle;
        const barLength = amplitude * 100;
        const xStart = centerX + Math.cos(angle) * baseRadius;
        const yStart = centerY + Math.sin(angle) * baseRadius;
        const xEnd = centerX + Math.cos(angle) * (baseRadius + barLength);
        const yEnd = centerY + Math.sin(angle) * (baseRadius + barLength);

        ctx.strokeStyle = `hsl(${(i / barCount) * 360}, 100%, 50%)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xEnd, yEnd);
        ctx.stroke();
      }
    };

    draw();
    return () => cancelAnimationFrame(animationFrame);
  }, [analyser]);

  // Toggle functionality to cleanly shut down audio
  const toggleAudio = () => {
    if (enabled) {
      if (audioCtx) {
        audioCtx.close();
      }
      setEnabled(false);
      setAudioCtx(null);
      setAnalyser(null);
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    } else {
      setEnabled(true);
    }
  };

  return (
    <div className={styles.container}>
     
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className={styles.canvas}
      />
      <br />

     <button className={styles.toggleButton} onClick={toggleAudio}>
        {enabled ? "Turn Off Audio" : "Turn On Audio"}
      </button>
    </div>
  );
}
