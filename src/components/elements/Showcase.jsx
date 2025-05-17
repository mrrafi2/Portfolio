import { useEffect, useRef } from "react";
import classes from "./Showcase.module.css";
import { AdvancedAudioVisualizer } from "./Audio";
import { InteractiveLightShadow } from "./LightShadow";
import { ParametricEquationPlayground } from "./Parametric";
import { ParticleCanvas } from "./Particle";
import RoboticRubiksCube from "./terrain";
import MiniGame404Runner from "./Runner";
import UniqueButtons from "./UniqueButton";

export default function ShowcaseBox() {

  
  return (
    <div className={`${classes.showcaseBox} `}>
      <div className={classes.showcaseRow}>
        <InteractiveLightShadow />
      </div>
      <div className={classes.showcaseRow}>
        <ParticleCanvas />
      </div>
      <div className={classes.showcaseRow}>
        <AdvancedAudioVisualizer />
        <ParametricEquationPlayground />
      </div>
      <div className={classes.showcaseRow}>
      <RoboticRubiksCube />
      <MiniGame404Runner/>
      </div>
<br />
      <div className={classes.showcaseRow}>
          <UniqueButtons/>
     </div>
    </div>
  );
}
