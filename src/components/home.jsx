import React, { useEffect, useState } from 'react';
import styles from "./home.module.css";
import Hero from './Hero';
import About from './About';
import Project from './Projects';
import ShowcaseBox from './elements/Showcase';
import Contact from './Contact';
export default function Home() {
  return (
    <div>

      <Hero />
      
      <About />
     
     <Project/>
<br />
     <ShowcaseBox/>
 <Contact/>
     

    </div>
  );
}
