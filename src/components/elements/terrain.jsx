
import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import styles from "./terrain.module.css";

export default function RoboticRubiksCube() {
  const mountRef = useRef(null);
  const [isGrabbing, setIsGrabbing] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Create scene and set background color to dark blue-black like the image
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f14);

    // Read container dimensions
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Set up camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(6, 6, 6);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5; // Increased for more brightness

    container.appendChild(renderer.domElement);

    // OrbitControls for interactive rotating/panning/zooming
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Add grab mechanism with cursor change
    container.addEventListener('mousedown', () => {
      setIsGrabbing(true);
      container.style.cursor = 'grabbing';
    });
    
    container.addEventListener('mouseup', () => {
      setIsGrabbing(false);
      container.style.cursor = 'grab';
    });
    
    container.addEventListener('mouseleave', () => {
      setIsGrabbing(false);
      container.style.cursor = 'default';
    });
    
    // Set default cursor to grab
    container.style.cursor = 'grab';
    
    // Create cube group to hold all cube parts
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);
    
    // Cube parameters
    const cubeSize = 3;
    const gap = 0.05; // Gap between small cubes
    const smallCubeSize = 1;
    
    // Materials for cube faces - Brighter colors
    const faceMaterials = {
      blue: new THREE.MeshStandardMaterial({ color: 0x2196F3, roughness: 0.3, metalness: 0.1 }), // Brighter blue
      white: new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.3, metalness: 0.1 }), // Pure white
      orange: new THREE.MeshStandardMaterial({ color: 0xFF9800, roughness: 0.3, metalness: 0.1 }), // Brighter orange
      black: new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.4, metalness: 0.5 }), // Slightly lighter black
      darkGray: new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.6, metalness: 0.7 }), // Slightly lighter gray
      frame: new THREE.MeshStandardMaterial({ 
        color: 0x555555, // Lighter metallic frame
        roughness: 0.3, 
        metalness: 0.8,
        envMapIntensity: 0.8
      })
    };
    
    // Frame thickness
    const frameThickness = 0.15;

    // Create the cube structure
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          // Skip center pieces
          if (x === 1 && y === 1 && z === 1) continue;
          
          // Create small cube
          const smallCubeGroup = new THREE.Group();
          
          // Base cube
          const baseGeometry = new THREE.BoxGeometry(smallCubeSize - 0.04, smallCubeSize - 0.04, smallCubeSize - 0.04);
          const baseCube = new THREE.Mesh(baseGeometry, faceMaterials.black);
          smallCubeGroup.add(baseCube);
          
          // Position calculations
          const posX = (x - 1) * (smallCubeSize + gap);
          const posY = (y - 1) * (smallCubeSize + gap);
          const posZ = (z - 1) * (smallCubeSize + gap);
          smallCubeGroup.position.set(posX, posY, posZ);
          
          // Add colored faces
          // We'll add faces only to visible sides
          
          // Front face (Z+)
          if (z === 2) {
            const faceGeometry = new THREE.BoxGeometry(
              smallCubeSize - 2 * frameThickness, 
              smallCubeSize - 2 * frameThickness, 
              0.05
            );
            const face = new THREE.Mesh(faceGeometry, faceMaterials.blue);
            face.position.z = smallCubeSize / 2 - 0.05;
            smallCubeGroup.add(face);
            
            // Add frame
            const frameGeometry = new THREE.BoxGeometry(
              smallCubeSize - 0.04,
              smallCubeSize - 0.04,
              0.05
            );
            const frame = new THREE.Mesh(frameGeometry, faceMaterials.frame);
            frame.position.z = smallCubeSize / 2 - 0.04;
            smallCubeGroup.add(frame);
          }
          
          // Back face (Z-)
          if (z === 0) {
            const faceGeometry = new THREE.BoxGeometry(
              smallCubeSize - 2 * frameThickness, 
              smallCubeSize - 2 * frameThickness, 
              0.05
            );
            const face = new THREE.Mesh(faceGeometry, faceMaterials.white);
            face.position.z = -smallCubeSize / 2 + 0.05;
            smallCubeGroup.add(face);
            
            // Add frame
            const frameGeometry = new THREE.BoxGeometry(
              smallCubeSize - 0.04,
              smallCubeSize - 0.04,
              0.05
            );
            const frame = new THREE.Mesh(frameGeometry, faceMaterials.frame);
            frame.position.z = -smallCubeSize / 2 + 0.04;
            smallCubeGroup.add(frame);
          }
          
          // Right face (X+)
          if (x === 2) {
            const faceGeometry = new THREE.BoxGeometry(
              0.05,
              smallCubeSize - 2 * frameThickness, 
              smallCubeSize - 2 * frameThickness
            );
            const face = new THREE.Mesh(faceGeometry, faceMaterials.orange);
            face.position.x = smallCubeSize / 2 - 0.05;
            smallCubeGroup.add(face);
            
            // Add frame
            const frameGeometry = new THREE.BoxGeometry(
              0.05,
              smallCubeSize - 0.04,
              smallCubeSize - 0.04
            );
            const frame = new THREE.Mesh(frameGeometry, faceMaterials.frame);
            frame.position.x = smallCubeSize / 2 - 0.04;
            smallCubeGroup.add(frame);
          }
          
          // Left face (X-)
          if (x === 0) {
            const faceGeometry = new THREE.BoxGeometry(
              0.05,
              smallCubeSize - 2 * frameThickness, 
              smallCubeSize - 2 * frameThickness
            );
            const face = new THREE.Mesh(faceGeometry, faceMaterials.blue);
            face.position.x = -smallCubeSize / 2 + 0.05;
            smallCubeGroup.add(face);
            
            // Add frame
            const frameGeometry = new THREE.BoxGeometry(
              0.05,
              smallCubeSize - 0.04,
              smallCubeSize - 0.04
            );
            const frame = new THREE.Mesh(frameGeometry, faceMaterials.frame);
            frame.position.x = -smallCubeSize / 2 + 0.04;
            smallCubeGroup.add(frame);
          }
          
          // Top face (Y+)
          if (y === 2) {
            const faceGeometry = new THREE.BoxGeometry(
              smallCubeSize - 2 * frameThickness,
              0.05,
              smallCubeSize - 2 * frameThickness
            );
            const face = new THREE.Mesh(faceGeometry, faceMaterials.white);
            face.position.y = smallCubeSize / 2 - 0.05;
            smallCubeGroup.add(face);
            
            // Add frame
            const frameGeometry = new THREE.BoxGeometry(
              smallCubeSize - 0.04,
              0.05,
              smallCubeSize - 0.04
            );
            const frame = new THREE.Mesh(frameGeometry, faceMaterials.frame);
            frame.position.y = smallCubeSize / 2 - 0.04;
            smallCubeGroup.add(frame);
          }
          
          // Bottom face (Y-)
          if (y === 0) {
            const faceGeometry = new THREE.BoxGeometry(
              smallCubeSize - 2 * frameThickness,
              0.05,
              smallCubeSize - 2 * frameThickness
            );
            const face = new THREE.Mesh(faceGeometry, faceMaterials.white);
            face.position.y = -smallCubeSize / 2 + 0.05;
            smallCubeGroup.add(face);
            
            // Add frame
            const frameGeometry = new THREE.BoxGeometry(
              smallCubeSize - 0.04,
              0.05,
              smallCubeSize - 0.04
            );
            const frame = new THREE.Mesh(frameGeometry, faceMaterials.frame);
            frame.position.y = -smallCubeSize / 2 + 0.04;
            smallCubeGroup.add(frame);
          }
          
          // Add robotic details to specific corners and edges
          if ((x === 0 || x === 2) && (y === 0 || y === 2) && (z === 0 || z === 2)) {
            // Corner pieces - add robotic details
            addRoboticDetail(smallCubeGroup, x, y, z);
          }
          
          cubeGroup.add(smallCubeGroup);
        }
      }
    }
    
    // Function to add robotic details to corners of the cube
    function addRoboticDetail(cubeGroup, x, y, z) {
      // Position the detail on the correct corner
      const detailSize = 0.3;
      
      // Create a cylindrical detail
      const cylinderGeometry = new THREE.CylinderGeometry(detailSize * 0.5, detailSize * 0.5, detailSize * 0.3, 16);
      const cylinderMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x222222, 
        roughness: 0.2, 
        metalness: 0.8 
      });
      const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
      
      // Determine position based on corner
      let posX = x === 0 ? -0.4 : 0.4;
      let posY = y === 0 ? -0.4 : 0.4;
      let posZ = z === 0 ? -0.4 : 0.4;
      
      // Position and rotate cylinder based on which face it should attach to
      // Fixed the ESLint error by using a random number to determine orientation (0-2)
      const faceOrientation = Math.floor(Math.random() * 3); // Generate 0, 1, or 2
      
      if (faceOrientation === 0) {
        // X face
        cylinder.rotation.z = Math.PI / 2;
        cylinder.position.set(posX * 1.1, posY * 0.7, posZ * 0.7);
      } else if (faceOrientation === 1) {
        // Y face
        cylinder.rotation.x = Math.PI / 2;
        cylinder.position.set(posX * 0.7, posY * 1.1, posZ * 0.7);
      } else {
        // Z face (faceOrientation === 2)
        cylinder.position.set(posX * 0.7, posY * 0.7, posZ * 1.1);
      }
      
      cubeGroup.add(cylinder);
      
      // Add a glowing blue light in some corners
      if (Math.random() > 0.6) {
        const glowGeometry = new THREE.CircleGeometry(detailSize * 0.2, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x00BFFF, 
          side: THREE.DoubleSide 
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(cylinder.position);
        
        // Rotate to face outward
        if (cylinder.rotation.z !== 0) {
          glow.rotation.z = cylinder.rotation.z;
          glow.position.x += x === 0 ? -0.16 : 0.16;
        } else if (cylinder.rotation.x !== 0) {
          glow.rotation.x = cylinder.rotation.x;
          glow.position.y += y === 0 ? -0.16 : 0.16;
        } else {
          glow.position.z += z === 0 ? -0.16 : 0.16;
        }
        
        cubeGroup.add(glow);
        
        // Add point light for the glow effect
        const pointLight = new THREE.PointLight(0x00BFFF, 0.5, 1);
        pointLight.position.copy(glow.position);
        cubeGroup.add(pointLight);
      }
    }
    
    // Slightly rotate the cube group for a better initial view
    cubeGroup.rotation.y = Math.PI / 6;
    cubeGroup.rotation.x = Math.PI / 12;
    
    // Brighter lighting
    // Ambient light - increased intensity
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Increased from 0.4
    scene.add(ambientLight);

    // Key light - increased intensity
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2); // Increased from 1.0
    keyLight.position.set(5, 5, 5);
    keyLight.castShadow = true;
    keyLight.shadow.bias = -0.0001;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);
    
    // Fill light - increased intensity and made slightly warmer
    const fillLight = new THREE.DirectionalLight(0xFFF8E1, 0.9); // Increased from 0.7 and warmer color
    fillLight.position.set(-5, 2, 2);
    scene.add(fillLight);
    
    // Back light - increased intensity
    const backLight = new THREE.DirectionalLight(0xffffff, 0.6); // Increased from 0.4
    backLight.position.set(0, -5, -5);
    scene.add(backLight);

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Update camera and renderer on window resize
    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener('mousedown', () => {});
      container.removeEventListener('mouseup', () => {});
      container.removeEventListener('mouseleave', () => {});
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <>
      
      <div 
        ref={mountRef} 
        className={`${styles.container} ${isGrabbing ? styles.grabbing : styles.grab}`}
      />
    
    </>
 
  );
}
