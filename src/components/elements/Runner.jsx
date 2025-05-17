import React, { useRef, useEffect, useState } from "react";
import styles from "./Runner.module.css";

export default function MiniGame404Runner() {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const drawRoundedRect = (ctx, x, y, width, height, radius, fillStyle) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
  };

  useEffect(() => {
    if (!gameStarted) return; 

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cw = canvas.width;
    const ch = canvas.height;

    // Runner properties
    let runnerY = ch - 30;
    const runnerHeight = 20;
    const runnerWidth = 20;
    let jumpVelocity = 0;
    const gravity = 0.6;
    let isJumping = false;

    // Obstacle properties
    let obstacleX = cw;
    const obstacleWidth = 20;
    const obstacleHeight = 30;
    let obstacleSpeed = 4;

    let scoreInterval;
    let animationFrame;

    setScore(0);
    setGameOver(false);

    const updateScore = () => {
      setScore((prev) => prev + 1);
    };

    scoreInterval = setInterval(updateScore, 500);

    const animate = () => {
      ctx.clearRect(0, 0, cw, ch);

      // Draw ground
      ctx.fillStyle = "#333";
      ctx.fillRect(0, ch - 10, cw, 10);

      // Draw runner with gradient fill
      let runnerGradient = ctx.createLinearGradient(50, runnerY, 70, runnerY + runnerHeight);
      runnerGradient.addColorStop(0, "#FFD700");
      runnerGradient.addColorStop(1, "#FFAA00");
      drawRoundedRect(ctx, 50, runnerY, runnerWidth, runnerHeight, 4, runnerGradient);

      // Draw obstacle with gradient
      let obstacleGradient = ctx.createLinearGradient(obstacleX, ch - 10 - obstacleHeight, obstacleX, ch - 10);
      obstacleGradient.addColorStop(0, "#FF6347");
      obstacleGradient.addColorStop(1, "#FF4500");
      drawRoundedRect(ctx, obstacleX, ch - 10 - obstacleHeight, obstacleWidth, obstacleHeight, 3, obstacleGradient);

      // Move the obstacle
      obstacleX -= obstacleSpeed;
      if (obstacleX < -obstacleWidth) {
        obstacleX = cw;
        obstacleSpeed += 0.3; 
      }

      // Collision detection
      if (
        50 < obstacleX + obstacleWidth &&
        50 + runnerWidth > obstacleX &&
        runnerY + runnerHeight > ch - 10 - obstacleHeight
      ) {
        setGameOver(true);
        clearInterval(scoreInterval);
        return; 
      }

      // Jump logic
      if (isJumping) {
        runnerY -= jumpVelocity;
        jumpVelocity -= gravity;
        if (runnerY >= ch - 30) {
          runnerY = ch - 30;
          isJumping = false;
          jumpVelocity = 0;
        }
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    // Handler for spacebar jump
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (!isJumping) {
          isJumping = true;
          jumpVelocity = 12;
        }
      }
    };

    // Handler for touch jump
    const handleTouchStart = (e) => {
      e.preventDefault(); // Prevents mobile scrolling or other default behaviors
      if (!isJumping) {
        isJumping = true;
        jumpVelocity = 12;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("touchstart", handleTouchStart);
      clearInterval(scoreInterval);
      cancelAnimationFrame(animationFrame);
    };
  }, [gameStarted]);

  const handleStart = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
  };

  const handleRestart = () => {
    setGameStarted(false);
    setTimeout(() => {
      setGameStarted(true);
      setScore(0);
      setGameOver(false);
    }, 10);
  };

  return (
    <div className={styles.runnerContainer}>
      {!gameStarted && (
        <div className={styles.startOverlay}>
          <button onClick={handleStart} className={styles.startButton}>
            Start Game
          </button>
        </div>
      )}
      {gameOver && (
        <div className={styles.gameOverOverlay}>
          <p>Game Over! Score: {score}</p>
          <button onClick={handleRestart}>Restart</button>
        </div>
      )}
      <canvas ref={canvasRef} className={styles.canvas} width={400} height={200} />
      <p className={styles.score}>Score: {score}</p>
      <p className={styles.instructions}>Press Spacebar or tap the canvas to jump!</p>
    </div>
  );
}
