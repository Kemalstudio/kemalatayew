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
import { Canvas, useFrame } from '@react-three/fiber'; // Добавлен useFrame
import { 
  OrbitControls, 
  useGLTF, 
  Float, 
  Environment, 
  ContactShadows, 
  useProgress,
  Decal,     
  Preload,   
  useTexture 
} from '@react-three/drei';
import './App.css';

// ==================================================================
// LOADING SCREEN
// ==================================================================
const LoadingScreen = () => {
  const { progress } = useProgress();
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        setFinished(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (finished) return null;

  return (
    <div className={`loading-screen ${progress === 100 ? 'loaded' : ''}`}>
      <div className="loader-content">
        <div className="loader-text">
          {progress.toFixed(0)}%
        </div>
        <div className="loader-bar-container">
          <div 
            className="loader-bar-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="loader-subtext">Loading 3D Experience...</p>
      </div>
    </div>
  );
};

// ==================================================================
// NAVBAR
// ==================================================================
const Navbar = () => {
  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className="nav-logo">
        <div className="logo-container">
          <img 
            src="/images/kemalstudio.jpg" 
            alt="Kemal Studio Logo" 
            className="logo-image"
          />
        </div>
        
        <div className="logo-text">
          <span className="name">Atayev Kemal</span>
          <span className="portfolio">| Portfolio</span>
        </div>
      </div>
      <ul className="nav-links">
        <li>
          <a href="#about">About</a>
        </li>
        <li>
          <a href="#overview">Overview</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
      </ul>
    </motion.nav>
  );
};

// ==================================================================
// TYPEWRITER
// ==================================================================
const Typewriter = ({ words, wait = 3000 }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  useEffect(() => {
    if (index === words.length) return;

    if (subIndex === words[index].length + 1 && !reverse) {
      setReverse(true);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, Math.max(reverse ? 75 : subIndex === words[index].length ? wait : 150, parseInt(Math.random() * 350)));

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words, wait]);

  return (
    <span className="typewriter-text">
      {words[index].substring(0, subIndex)}
      <span className={`cursor ${blink ? 'blink' : ''}`}>|</span>
    </span>
  );
};

// ==================================================================
// HERO BACKGROUND
// ==================================================================
const HeroBackground = () => {
  return (
    <div className="hero-background-wrapper">
      <div className="wave-pattern"></div>
      <div className="gradient-overlay"></div>
      <div className="noise-overlay"></div>
    </div>
  );
};

// ==================================================================
// SMOOTH SCROLL & UTILS
// ==================================================================
const SmoothScroll = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothTouch: true,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
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
      xTo(x * 0.4);
      yTo(y * 0.4);
    };

    const mouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener("mousemove", mouseMove);
    element.addEventListener("mouseleave", mouseLeave);

    return () => {
      element.removeEventListener("mousemove", mouseMove);
      element.removeEventListener("mouseleave", mouseLeave);
    };
  }, []);

  return React.cloneElement(children, { ref });
};

const VerticalTicker = ({ items }) => {
  const duplicatedItems = useMemo(() => [...items, ...items], [items]);

  return (
    <div className="ticker-wrapper-styled">
      <div className="ticker-label">ТЕХНОЛОГИИ</div>
      <div className="ticker-container">
        <div className="ticker-fade-top"></div>
        <div className="ticker-fade-bottom"></div>
        
        <motion.div
          className="ticker-track"
          animate={{ y: ["-50%", "0%"] }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {duplicatedItems.map((item, index) => (
            <div key={index} className="ticker-item-wrapper">
              <motion.div
                className="ticker-item"
                whileHover={{ scale: 1.1, color: "#c176fa", x: -5 }}
                transition={{ duration: 0.2 }}
              >
                {item}
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const SmoothParallaxStars = () => {
  const { scrollYProgress } = useScroll();
  const smoothY1 = useSpring(useTransform(scrollYProgress, [0, 1], [0, 200]), { stiffness: 100, damping: 30, restDelta: 0.001 });
  const smoothY2 = useSpring(useTransform(scrollYProgress, [0, 1], [0, 400]), { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  return (
    <div className="stars-container">
      <motion.div className="stars-layer stars-1" style={{ y: smoothY1 }} />
      <motion.div className="stars-layer stars-2" style={{ y: smoothY2 }} />
    </div>
  );
};

// ==================================================================
// HERO 3D MODEL
// ==================================================================
const Model = ({ path }) => {
  const { scene } = useGLTF(path);
  const sceneClone = useMemo(() => scene.clone(), [scene]);

  return (
    <primitive 
      object={sceneClone} 
      scale={0.75} 
      position={[0, -2.5, 0]} 
      rotation={[0, -0.2, 0]} 
    />
  );
};

const ModelViewer = ({ modelPath }) => {
  return (
    <div className="model-viewer-canvas-container">
      <Canvas 
        camera={{ position: [0, 1, 11], fov: 40 }} 
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={800} color="#ffffff" />
          <pointLight position={[-10, -5, -10]} intensity={1500} color="#9d4edd" />
          <pointLight position={[10, 5, 10]} intensity={1500} color="#00c6ff" />

          <Environment preset="city" />

          <Float 
            speed={2} 
            rotationIntensity={0.1} 
            floatIntensity={0.2} 
            floatingRange={[-0.05, 0.05]}
          >
            <Model path={modelPath} />
          </Float>

          <ContactShadows position={[0, -2.6, 0]} opacity={0.5} scale={20} blur={2.5} far={4} color="#000000" />

          <OrbitControls 
            enableZoom={false} 
            enablePan={false}  
            autoRotate={false} 
            minPolarAngle={Math.PI / 3} 
            maxPolarAngle={Math.PI / 1.9} 
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

useGLTF.preload('/images/gaming-desktop.glb');

// ==================================================================
// NEW: 3D BALL COMPONENTS (Tech Spheres)
// ==================================================================

// Компонент одного шара
const Ball = (props) => {
  const [decal] = useTexture([props.imgUrl]);
  const meshRef = useRef();

  // Анимация вращения самого шарика вокруг своей оси Y
  useFrame((state, delta) => {
    // Вращаем шар по оси Y (вокруг себя)
    if(meshRef.current) {
      meshRef.current.rotation.y += delta * 2.5; // Скорость вращения
    }
  });

  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
      <mesh ref={meshRef} castShadow receiveShadow scale={2.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color='#fff8eb'
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />
        <Decal
          position={[0, 0, 1]}
          rotation={[2 * Math.PI, 0, 6.25]}
          scale={1}
          map={decal}
          flatShading
        />
      </mesh>
    </Float>
  );
};

// Канвас для шара
const BallCanvas = ({ icon }) => {
  return (
    <Canvas
      frameloop='always' 
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={null}>
        {/* Убрали autoRotate, чтобы вращался только шар, а не камера */}
        <OrbitControls enableZoom={false} />
        <Ball imgUrl={icon} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

// Секция с шарами
const TechBallSection = () => {
  const technologies = [
    { name: "HTML 5", icon: "/images/tech/html.png" },
    { name: "CSS 3", icon: "/images/tech/css.png" },
    { name: "JavaScript", icon: "/images/tech/javascript.png" },
    { name: "TypeScript", icon: "/images/tech/typescript.png" },
    { name: "React JS", icon: "/images/tech/reactjs.png" },
    { name: "Redux", icon: "/images/tech/redux.png" },
    { name: "Tailwind", icon: "/images/tech/tailwind.png" },
    { name: "Node JS", icon: "/images/tech/nodejs.png" },
    { name: "MongoDB", icon: "/images/tech/mongodb.png" },
    { name: "Three JS", icon: "/images/tech/threejs.svg" }, 
    { name: "Git", icon: "/images/tech/git.png" },
    { name: "Figma", icon: "/images/tech/figma.png" },
    { name: "Docker", icon: "/images/tech/docker.png" },
  ];

  return (
    <section className="tech-balls-section">
      <div className="container">
        <motion.div 
          className="section-header" 
          initial={{ opacity: 0, y: 50 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1 }}
        >
           <p style={{textAlign: 'center', marginBottom: '10px', color: '#aaa'}}>WHAT I KNOW</p>
           <h2 style={{textAlign: 'center', fontSize: '3rem', fontWeight: '900', color: 'white'}}>Technologies</h2>
        </motion.div>
        
        <div className='tech-balls-container'>
          {technologies.map((technology) => (
            <div className='tech-ball-wrapper' key={technology.name}>
              <BallCanvas icon={technology.icon} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================================================================
// CRAZY 3D SECTION
// ==================================================================

const CrazyParticles = () => {
  const particles = Array.from({ length: 25 });
  return (
    <div className="crazy-particles-container">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="crazy-particle"
          initial={{
            x: Math.random() * 100 - 50 + "%",
            y: Math.random() * 100 - 50 + "%",
            scale: Math.random() * 0.5 + 0.2,
            opacity: Math.random() * 0.5 + 0.1
          }}
          animate={{
            y: [null, Math.random() * -100 + "%"],
            opacity: [null, 0]
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

const Crazy3DImageSlider = () => {
  const slides = useMemo(() => [
    { src: "/images/aura-computer.png", title: "ATAM Alpha", desc: "Флагманский WebGL проект", color: "#ff6c00" },
    { src: "/images/aura-computer.png", title: "Neon City", desc: "Управление умным городом", color: "#00c6ff" },
    { src: "/images/aura-computer.png", title: "Quantum Core", desc: "Аналитика вычислений", color: "#a855f7" },
    { src: "/images/aura-computer.png", title: "Cyber Shield", desc: "Система защиты данных", color: "#e91e63" },
    { src: "/images/aura-computer.png", title: "AI Nexus", desc: "Голосовой ассистент", color: "#10b981" },
    { src: "/images/aura-computer.png", title: "Mars Colony", desc: "Интерактивная карта", color: "#f59e0b" },
    { src: "/images/aura-computer.png", title: "Eco Pulse", desc: "Мониторинг экологии", color: "#6366f1" },
    { src: "/images/aura-computer.png", title: "Vault X", desc: "Крипто-хранилище", color: "#06b6d4" },
  ], []);

  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const rawRotation = useTransform(scrollYProgress, [0, 1], [0, -360 * 2.5]);
  
  const smoothRotation = useSpring(rawRotation, {
    stiffness: 100,
    damping: 30,
    mass: 1,
    restDelta: 0.001
  });

  useMotionValueEvent(smoothRotation, "change", (latest) => {
    const degrees = Math.abs(latest) % 360;
    const step = 360 / slides.length;
    const index = Math.round(degrees / step) % slides.length;
    if (index !== activeIndex) setActiveIndex(index);
  });

  return (
    <section ref={containerRef} className="crazy-3d-wrapper">
      <div className="crazy-sticky-view">
        <CrazyParticles />
        <div className="scene-container">
          <motion.div 
            className="scene-3d"
            style={{ rotateY: smoothRotation }}
          >
            {slides.map((slide, index) => {
              const angle = (360 / slides.length) * index;
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className={`slide-3d-item ${isActive ? 'active' : ''}`}
                  style={{ '--rotate-angle': `${angle}deg` }}
                >
                  <div className="slide-content-wrapper" data-lenis-prevent>
                    <img src={slide.src} alt={slide.title} />
                    <div className="slide-border-glow" style={{ borderColor: slide.color }}></div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        <div className="active-slide-info">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="info-content"
            >
              <div className="info-number">
                {String(activeIndex + 1).padStart(2, '0')}
              </div>
              <motion.h3 style={{ color: slides[activeIndex].color }}>
                {slides[activeIndex].title}
              </motion.h3>
              <p>{slides[activeIndex].desc}</p>
              <motion.div 
                className="info-progress"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "circOut" }}
                style={{ background: slides[activeIndex].color }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="crazy-vignette"></div>
        <motion.div 
          className="crazy-bg-blur" 
          animate={{ background: `radial-gradient(circle at 50% 50%, ${slides[activeIndex].color}15 0%, transparent 60%)` }}
          transition={{ duration: 1 }}
        />
      </div>
    </section>
  );
};

// ==================================================================
// OVERVIEW SECTION
// ==================================================================
const OverviewSection = () => {
  const cards = [
    { title: "Frontend Developer", icon: "images/icon-frontend.png" },
    { title: "Backend Developer", icon: "images/icon-backend.png" },
    { title: "Mobile Apps Developer", icon: "images/icon-ui.png" },
    { title: "UI-UX Designer", icon: "images/icon-ui.png" }
  ];

  return (
    <section className="overview-section" id="overview">
      <SmoothParallaxStars />
      <div className="container">
        <div className="overview-header">
          <motion.div 
            className="intro-label"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            INTRODUCTION
          </motion.div>
          <motion.h2 
            className="overview-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Overview
          </motion.h2>
          
          <motion.p 
            className="overview-desc"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            I'm a highly motivated Software Developer skilled in the MERN stack (MongoDB, 
            Express.js, React.js, Node.js) with a strong focus on Frontend Development. Proficient 
            in modern web technologies including HTML, CSS, JavaScript, and React, and 
            animation tools like GSAP, ScrollTrigger, and Locomotive Scroll. Transitioned from non-tech 
            role to IT, now eager to deliver responsive, user-focused web applications to 
            leverage skills and grow in a dynamic web development role.
          </motion.p>

          <motion.div 
            className="overview-buttons"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button className="btn-hire">Hire Me</button>
            <button className="btn-resume">Resume</button>
          </motion.div>
        </div>

        <div className="overview-cards-container">
          {cards.map((card, index) => (
            <motion.div 
              key={index} 
              className={`role-card card-${index}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="card-content">
                <div className="card-icon-wrapper">
                  <div className="geometric-icon">
                    <div className="inner-shape"></div>
                  </div>
                </div>
                <h3>{card.title.split(' ').slice(0, -1).join(' ')} <br/> {card.title.split(' ').slice(-1)}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


// ==================================================================
// SKILLS SECTION (OLD)
// ==================================================================
const SkillsSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const skills = useMemo(() => [
    { icon: "⚛️", title: "Frontend", description: "React, Vue.js, TypeScript" },
    { icon: "🔧", title: "Backend", description: "Node.js, Express, Python" },
    { icon: "📱", title: "Mobile", description: "React Native, iOS & Android" },
    { icon: "🛠️", title: "Tools", description: "Git, Docker, AWS, CI/CD" }
  ], []);

  const cardVariants = {
    hidden: { opacity: 0, y: 100, scale: 0.8, rotateX: 45 },
    visible: (index) => ({
      opacity: 1, y: 0, scale: 1, rotateX: 0,
      transition: { type: "spring", stiffness: 70, damping: 12, delay: index * 0.15 }
    })
  };

  return (
    <section ref={containerRef} className="skills-section">
      <motion.div className="skills-background" style={{ scale, y }} />
      <div className="container">
        <motion.div className="section-header" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <motion.h2
            animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ background: "linear-gradient(90deg, #ff6c00, #00c6ff, #a855f7, #ff6c00)", backgroundSize: "300% auto", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}
          >
            МОИ НАВЫКИ
          </motion.h2>
          <p>Инструменты для создания цифровых решений</p>
        </motion.div>

        <div className="skills-grid">
          {skills.map((skill, index) => (
            <motion.div 
              key={index} 
              className="skill-card"
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }} 
              variants={cardVariants}
              whileHover={{ scale: 1.05, y: -15, rotateX: 5, transition: { duration: 0.3 } }}
            >
              <motion.div className="skill-icon" animate={{ rotate: [0, 10, -5, 0], scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}>{skill.icon}</motion.div>
              <h3>{skill.title}</h3>
              <p>{skill.description}</p>
              <motion.div className="skill-glow" animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.3, 1], rotate: [0, 180, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: index * 0.3 }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatsSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const stats = useMemo(() => [
    { number: "25", label: "Проектов", suffix: "+" },
    { number: "3", label: "Года опыта", suffix: "+" },
    { number: "15", label: "Клиентов", suffix: "+" },
    { number: "99", label: "Успех", suffix: "%" }
  ], []);

  return (
    <section ref={containerRef} className="stats-section">
      <motion.div className="stats-background" style={{ scale, y }} />
      <div className="container">
        <motion.div className="stats-grid" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1.2 }}>
          {stats.map((stat, index) => (
            <motion.div key={index} className="stat-item" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: index * 0.15 }}>
              <motion.div className="stat-number" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }}>
                {stat.number}<span className="stat-suffix">{stat.suffix}</span>
              </motion.div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ==================================================================
// MAIN APP COMPONENT
// ==================================================================
function App() {
  const features = useMemo(() => [
    { title: "React Dev", description: "Современные приложения", icon: "⚛️" },
    { title: "Responsive", description: "Адаптивный дизайн", icon: "📱" },
    { title: "API Integration", description: "REST API сервисы", icon: "🔌" },
    { title: "Database", description: "Оптимизация баз данных", icon: "🗃️" },
    { title: "Mobile Apps", description: "Кроссплатформа", icon: "📲" },
    { title: "UI/UX Design", description: "Интуитивные интерфейсы", icon: "🎨" },
  ], []);

  const tickerItems = useMemo(() => features.map(feature => feature.title), [features]);

  const typingRoles = useMemo(() => [
    "Frontend Developer",
    "Backend Developer",
    "Mobile Apps Developer",
    "Full Stack Web & App Developer"
  ], []);

  return (
    <SmoothScroll>
      <div className="app">
        <LoadingScreen />
        <Navbar />

        <section className="hero">
          <HeroBackground />
          <SmoothParallaxStars />
          
          <div className="hero-content">
            <div className="hero-text-overlay">
              <div className="hero-left-decoration"></div> 
              <motion.div 
                initial={{ opacity: 0, x: -50 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 1, delay: 0.5 }}
                className="greeting-container"
              >
                <h1>Hi !, I'm <span className="highlight-text">Atayev Kemal</span></h1>
                <p className="subtitle">I Develop Full Stack Web & Mobile Apps</p>
                <div className="role-ticker">
                  <Typewriter words={typingRoles} wait={2000} />
                </div>
              </motion.div>
            </div>

            <ModelViewer modelPath="/images/gaming_desktop_pc.glb" />
          </div>

          <div className="ticker-section">
            <VerticalTicker items={tickerItems} speed={50} />
          </div>
        </section>

        {/* Секция с карточк
        <OverviewSection />
        
        <TechBallSection />
        
        <SkillsSection />
        <StatsSection />

        <Crazy3DImageSlider />
        
        <section className="services-grid">
          <div className="container">
            <motion.div className="section-header" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
              <h2>Мои Услуги</h2>
              <p>Полный цикл разработки от идеи до запуска</p>
            </motion.div>
            <div className="services-grid-content">
              {features.map((service, index) => (
                <motion.div key={index} className="service-card" initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: index * 0.1 }} whileHover={{ scale: 1.03, y: -8 }}>
                  <div className="service-card-glow"></div>
                  <div className="service-icon">{service.icon}</div>
                  <div className="service-card-content">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="continuous-ticker-section">
          <motion.div className="continuous-ticker" animate={{ x: ['0%', '-100%'] }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
            {[...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
              <motion.div key={index} className="ticker-word" whileHover={{ scale: 1.15, color: "#ff6c00" }}>
                {item} <span className="dot">•</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <motion.footer className="footer" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1.2 }}>
          <div className="container">
            <div className="footer-content">
              <h3>ГОТОВЫ К СОТРУДНИЧЕСТВУ?</h3>
              <p>Давайте создадим что-то удивительное вместе</p>
              <Magnetic><button className="btn-primary">Начать проект</button></Magnetic>
            </div>
          </div>
        </motion.footer>
      </div>
    </SmoothScroll>
  );
}

export default App;