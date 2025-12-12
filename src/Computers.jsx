import {Suspense, useEffect, useState} from 'react';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload, useGLTF } from '@react-three/drei';

const Computers = () => {
    <section className="hero">
          <SmoothParallaxStars />
          <div className="hero-content">
            const computer = useGLTF('./images/gaming_desktop_pc.glb');
          </div>
          <div className="ticker-section">
            <div className="ticker-label">ТЕХНОЛОГИИ</div>
            <VerticalTicker items={tickerItems} speed={50} />
          </div>
          <motion.div className="hero-floating-elements" animate={{ y: [0, -30, 0], rotate: [0, 8, 0] }} transition={{ duration: 10, repeat: Infinity }} />
          <div className="hero-vignette"></div>
        </section>
}