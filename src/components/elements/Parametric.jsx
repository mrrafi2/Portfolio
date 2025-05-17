import React, { useState, useRef, useEffect } from "react";
import styles from "./Parametric.module.css";

export function ParametricEquationPlayground() {
  const canvasRef = useRef(null);
  const [params, setParams] = useState({
    a: 3,
    b: 2,
    delta: 0.5
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "#FF6EC4";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let t = 0; t <= Math.PI * 2; t += 0.01) {
        const x = width / 2 + Math.sin(params.a * t + params.delta) * (width / 2 - 20);
        const y = height / 2 + Math.sin(params.b * t) * (height / 2 - 20);
        if (t === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
    };
    draw();
  }, [params]);

  return (
    <div className={styles.playgroundContainer}>
      <canvas ref={canvasRef} width={300} height={300} className={styles.canvas} />
      <div className={styles.controls}>
        <label>
         <span style={{color:"whitesmoke"}}> a:</span>
          <input
            type="range"
            min="1"
            max="10"
            step="0.1"
            value={params.a}
            onChange={(e) =>
              setParams({ ...params, a: parseFloat(e.target.value) })
            }
          />
        </label>
        <label>
        <span style={{color:"whitesmoke"}}> b:</span>

          <input
            type="range"
            min="1"
            max="10"
            step="0.1"
            value={params.b}
            onChange={(e) =>
              setParams({ ...params, b: parseFloat(e.target.value) })
            }
          />
        </label>
        <label>
        <span style={{color:"whitesmoke"}}> δ:</span>
          <input
            type="range"
            min="0"
            max="6.28"
            step="0.01"
            value={params.delta}
            onChange={(e) =>
              setParams({ ...params, delta: parseFloat(e.target.value) })
            }
          />
        </label>
      </div>
    </div>
  );
}
