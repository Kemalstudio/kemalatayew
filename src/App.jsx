import React, { useRef, useEffect, useState, useMemo, Suspense } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  AnimatePresence
} from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Float, 
  Environment, 
  ContactShadows, 
  useProgress
} from '@react-three/drei';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// UTILS & WRAPPERS
// ==========================================
const SmoothScroll = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);
  return <>{children}</>;
};

const Magnetic = ({ children }) => {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const xTo = gsap.quickTo(element, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(element, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const mouseMove = (e) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = element.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      xTo(x * 0.35);
      yTo(y * 0.35);
    };

    const mouseLeave = () => { xTo(0); yTo(0); };

    element.addEventListener("mousemove", mouseMove);
    element.addEventListener("mouseleave", mouseLeave);
    return () => {
      element.removeEventListener("mousemove", mouseMove);
      element.removeEventListener("mouseleave", mouseLeave);
    };
  }, []);
  return React.cloneElement(children, { ref });
};

// ==========================================
// PRELOADER
// ==========================================
const LoadingScreen = () => {
  const { progress } = useProgress();
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => setFinished(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (finished) return null;

  return (
    <motion.div 
      className="loading-screen"
      exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="loader-content">
        <div className="loader-text">{progress.toFixed(0)}<span className="accent">%</span></div>
        <div className="loader-bar-container">
          <motion.div 
            className="loader-bar-fill" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "circOut" }}
          />
        </div>
        <p className="loader-subtext">Initializing WebGL Experience</p>
      </div>
    </motion.div>
  );
};

// ==========================================
// NAVBAR
// ==========================================
const Navbar = () => (
  <motion.nav 
    className="navbar"
    initial={{ y: -100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
  >
    <div className="nav-logo">
      <div className="logo-dot" />
      <span className="name">Kemal Atayev</span>
      <span className="portfolio">Digital Studio</span>
    </div>
    <ul className="nav-links">
      {['Work', 'Expertise', 'About', 'Contact'].map((item) => (
        <li key={item}><a href={`#${item.toLowerCase()}`}>{item}</a></li>
      ))}
    </ul>
    <Magnetic>
      <button className="nav-cta">Let's Talk</button>
    </Magnetic>
  </motion.nav>
);

// ==========================================
// HERO 3D MODEL
// ==========================================
useGLTF.preload('/images/gaming_desktop_pc.glb');

const HeroModel = () => {
  const { scene } = useGLTF('/images/gaming_desktop_pc.glb');
  return <primitive object={scene} scale={0.8} position={[0, -2.5, 0]} rotation={[0, -0.4, 0]} />;
};

const HeroCanvas = () => (
  <div className="model-viewer-canvas">
    <Canvas camera={{ position: [0, 1, 12], fov: 40 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
      <Suspense fallback={null}>
        <Environment preset="studio" />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={2} color="#8a2be2" />
        <pointLight position={[-10, -5, -10]} intensity={3} color="#00ffff" />
        
        <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <HeroModel />
        </Float>
        <ContactShadows position={[0, -3, 0]} opacity={0.6} scale={15} blur={2} color="#000" />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} minPolarAngle={Math.PI/3} maxPolarAngle={Math.PI/2} />
      </Suspense>
    </Canvas>
  </div>
);

// ==========================================
// PREMIUM TECH GRID (Replaces 16 Canvases)
// ==========================================
const PremiumTechGrid = () => {
  const techStack = [
    { name: "React", icon: "⚛️", level: "Expert" },
    { name: "Next.js", icon: "▲", level: "Advanced" },
    { name: "Three.js", icon: "🧊", level: "Advanced" },
    { name: "Node.js", icon: "🟢", level: "Pro" },
    { name: "Tailwind", icon: "💨", level: "Expert" },
    { name: "Framer", icon: "✨", level: "Pro" },
    { name: "TypeScript", icon: "📘", level: "Advanced" },
    { name: "PostgreSQL", icon: "🐘", level: "Pro" },
  ];

  return (
    <section className="tech-bento-section">
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">01 // ARSENAL</span>
          <h2 className="section-title">Technologies & Tools</h2>
        </div>
        <div className="tech-grid">
          {techStack.map((tech, i) => (
            <motion.div 
              key={i} 
              className="tech-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="tech-card-glow" />
              <div className="tech-icon">{tech.icon}</div>
              <div className="tech-info">
                <h4>{tech.name}</h4>
                <span className="tech-level">{tech.level}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// DYNAMIC HORIZONTAL SCROLL
// ==========================================
const SkillsHorizontal = () => {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  const skills = [
    { title: "Frontend Engineering", desc: "Pixel-perfect, performant UIs with React ecosystem.", num: "01" },
    { title: "Backend Architecture", desc: "Scalable APIs and robust database management.", num: "02" },
    { title: "Creative Development", desc: "Award-winning WebGL & GSAP animations.", num: "03" },
    { title: "UI/UX Design", desc: "Figma prototyping and user-centric design flows.", num: "04" },
    { title: "Mobile Apps", desc: "Cross-platform solutions with React Native.", num: "05" }
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      const scrollWidth = scrollRef.current.scrollWidth - window.innerWidth;
      
      gsap.to(scrollRef.current, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          end: `+=${scrollWidth}`,
          invalidateOnRefresh: true
        }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="horizontal-section" id="expertise">
      <div className="horizontal-sticky">
        <h2 className="horizontal-bg-text">EXPERTISE</h2>
      </div>
      <div ref={scrollRef} className="horizontal-scroll-container">
        {skills.map((skill, i) => (
          <div key={i} className="horizontal-panel">
            <div className="panel-content">
              <span className="panel-num">{skill.num}</span>
              <h3>{skill.title}</h3>
              <p>{skill.desc}</p>
              <div className="panel-glass-effect" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ==========================================
// CRAZY 3D SLIDER (Refined & Performant)
// ==========================================
const ShowcaseSlider = () => {
  const slides = useMemo(() => [
    { src: "/images/aura-computer.png", title: "ATAM Alpha", color: "#8a2be2" },
    { src: "/images/aura-computer.png", title: "Neon Nexus", color: "#00ffff" },
    { src: "/images/aura-computer.png", title: "Quantum Web", color: "#ff007f" },
    { src: "/images/aura-computer.png", title: "Cyber Shield", color: "#ffd700" },
    { src: "/images/aura-computer.png", title: "AI Core", color: "#00ff7f" },
  ], []);

  const ref = useRef(null);
  const [active, setActive] = useState(0);
  
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const rotation = useSpring(useTransform(scrollYProgress, [0, 1], [0, -360 * 2]), { stiffness: 60, damping: 20 });

  useMotionValueEvent(rotation, "change", (val) => {
    const deg = Math.abs(val) % 360;
    const step = 360 / slides.length;
    const idx = Math.round(deg / step) % slides.length;
    if (idx !== active) setActive(idx);
  });

  return (
    <section ref={ref} className="showcase-section" id="work">
      <div className="showcase-sticky">
        <div className="showcase-bg-glow" style={{ background: `radial-gradient(circle at 50% 50%, ${slides[active].color}20 0%, transparent 60%)` }} />
        
        <div className="scene-perspective">
          <motion.div className="scene-rotator" style={{ rotateY: rotation }}>
            {slides.map((slide, i) => {
              const angle = (360 / slides.length) * i;
              return (
                <div key={i} className={`scene-item ${i === active ? 'active' : ''}`} style={{ '--angle': `${angle}deg` }}>
                  <div className="scene-item-inner">
                    <img src={slide.src} alt={slide.title} />
                    <div className="item-border" style={{ borderColor: slide.color }} />
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        <div className="showcase-info">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="info-box"
            >
              <h3 style={{ color: slides[active].color }}>{slides[active].title}</h3>
              <p>Premium WebGL Experience</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// MAIN APP
// ==========================================
export default function App() {
  return (
    <SmoothScroll>
      <div className="app-wrapper">
        <LoadingScreen />
        <Navbar />

        {/* HERO SECTION */}
        <section className="hero-premium">
          <div className="noise-overlay" />
          <div className="hero-container">
            <div className="hero-text-block">
              <motion.span 
                className="hero-badge"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                AVAILABLE FOR HIRE
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 1 }}
              >
                Crafting <br/>
                <span className="text-gradient">Digital</span> Experiences.
              </motion.h1>
              <motion.p 
                className="hero-desc"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                Kemal Atayev — Creative Developer & Technical Director bridging the gap between exceptional design and flawless engineering.
              </motion.p>
            </div>
            <HeroCanvas />
          </div>
        </section>

        <PremiumTechGrid />
        <SkillsHorizontal />
        <ShowcaseSlider />

        {/* FOOTER */}
        <footer className="footer-premium" id="contact">
          <div className="container">
            <h2>Let's build the <br/><span className="text-gradient">impossible.</span></h2>
            <Magnetic>
              <button className="cta-huge">Start a Project</button>
            </Magnetic>
            <div className="footer-bottom">
              <p>© 2024 Kemal Atayev. All rights reserved.</p>
              <div className="socials">
                <a href="#">Twitter</a>
                <a href="#">LinkedIn</a>
                <a href="#">GitHub</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  );
}