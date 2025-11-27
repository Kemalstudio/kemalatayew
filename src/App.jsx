import React, { useRef, useEffect, useState, useMemo, useLayoutEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionValueEvent
} from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import './App.css';

// ==================================================================
// КОМПОНЕНТЫ (БЕЗ ИЗМЕНЕНИЙ)
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

const VerticalTicker = React.memo(({ items, speed = 50 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, speed * 100);
    return () => clearInterval(interval);
  }, [items.length, speed]);

  const extendedItems = useMemo(() => [...items, items[0]], [items]);

  return (
    <div className="ticker-container">
      <motion.div
        className="ticker-track"
        animate={{ y: `-${(currentIndex * 100) / extendedItems.length}%` }}
        transition={{ type: "spring", stiffness: 100, damping: 20, mass: 0.5 }}
      >
        {extendedItems.map((item, index) => (
          <motion.div
            key={index}
            className="ticker-item"
            whileHover={{ scale: 1.05, color: "#ff6c00" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {item}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
});

const SmoothParallaxStars = () => {
    const { scrollYProgress } = useScroll();
    const smoothY1 = useSpring(useTransform(scrollYProgress, [0, 1], [0, 200]), { stiffness: 100, damping: 30, restDelta: 0.001 });
    const smoothY2 = useSpring(useTransform(scrollYProgress, [0, 1], [0, 400]), { stiffness: 100, damping: 30, restDelta: 0.001 });
    const smoothY3 = useSpring(useTransform(scrollYProgress, [0, 1], [0, 600]), { stiffness: 100, damping: 30, restDelta: 0.001 });

    const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);
    const opacity2 = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.2, 0.6, 0.6, 0.2]);
    const opacity3 = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.1, 0.3, 0.3, 0.1]);

    return (
        <div className="stars-container">
            <motion.div className="stars-layer stars-1" style={{ y: smoothY1, opacity: opacity1 }} />
            <motion.div className="stars-layer stars-2" style={{ y: smoothY2, opacity: opacity2 }} />
            <motion.div className="stars-layer stars-3" style={{ y: smoothY3, opacity: opacity3 }} />
        </div>
    );
};

const Crazy3DImageSlider = () => {
  const images = useMemo(() => [
    { src: "/images/atam.jpg" }, { src: "/images/atam.jpg" },
    { src: "/images/atam.jpg" }, { src: "/images/atam.jpg" },
    { src: "/images/atam.jpg" }, { src: "/images/atam.jpg" },
    { src: "/images/atam.jpg" }, { src: "/images/atam.jpg" },
  ], []);

  const sceneRef = useRef(null);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const timeline = gsap.timeline({ repeat: -1 });
      timeline.to(sceneRef.current, {
        rotationY: 360,
        duration: 30,
        ease: "none"
      });
      sceneRef.current.timeline = timeline;
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = () => {
    if (sceneRef.current?.timeline) {
      gsap.to(sceneRef.current.timeline, { timeScale: 0.1, duration: 0.5 });
    }
  };

  const handleMouseLeave = () => {
    if (sceneRef.current?.timeline) {
      gsap.to(sceneRef.current.timeline, { timeScale: 1, duration: 0.5 });
    }
    if (sceneRef.current) {
      gsap.to(sceneRef.current, {
        rotationX: 0,
        rotationY: gsap.getProperty(sceneRef.current, "rotationY"),
        rotationZ: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)"
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!sceneRef.current) return;
    
    const { currentTarget, clientX, clientY } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;

    gsap.to(sceneRef.current, {
      rotationX: -y * 20,
      rotationY: gsap.getProperty(sceneRef.current, "rotationY") - (x * 20),
      rotationZ: -x * y * 10,
      duration: 0.5,
      ease: "power1.out"
    });
  };

  return (
    <section className="crazy-3d-slider-section" ref={containerRef}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2>CRAZY 3D ГАЛЕРЕЯ</h2>
          <p>Интерактивная 3D галерея с эффектом вращения на 360°</p>
        </motion.div>

        <div
          className="slider-3d-viewport-gsap"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <div className="slider-3d-scene-gsap" ref={sceneRef}>
            {images.map((image, index) => (
              <div
                key={index}
                className="slider-3d-item-gsap"
                style={{
                  '--i': index,
                  '--total': images.length,
                }}
              >
                <img src={image.src} alt={`slide ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="slider-background-elements">
          <motion.div className="bg-orb orb-1" animate={{ y: [0, -40, 0], x: [0, 20, 0], rotate: [0, 180, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="bg-orb orb-2" animate={{ y: [0, 30, 0], x: [0, -25, 0], rotate: [0, -180, -360] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
          <motion.div className="bg-orb orb-3" animate={{ y: [0, -25, 0], x: [0, 15, 0], scale: [1, 1.2, 1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }} />
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
    cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      key={index}
      className="horizontal-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }} 
    >
      <motion.div
        className="card-inner"
        style={{ '--glow-color': project.color, rotateX, rotateY, transformStyle: "preserve-3d" }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div style={{ transform: "translateZ(50px)" }}>
          <div className="card-glare"></div>
          <motion.div className="project-index">
            {String(index + 1).padStart(2, '0')}
          </motion.div>
          <motion.div className="card-image-container">
            <motion.img src={project.image} alt={project.title} className="project-image"/>
            <motion.div className="image-glow" />
          </motion.div>
          <div className="card-text-content">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <motion.ul className="tech-list">
              {project.tech.map((tech, techIndex) => (
                <motion.li key={techIndex}>{tech}</motion.li>
              ))}
            </motion.ul>
            <motion.button className="project-button" style={{ borderColor: project.color }}>
              <span>Посмотреть проект ›</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const HorizontalScrollSection = () => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsVisible(latest > 0.1 && latest < 0.9);
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-85%']);
  const smoothX = useSpring(x, { stiffness: 60, damping: 20, mass: 0.8 });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  const portfolioProjects = useMemo(() => [
    { title: "E-Commerce Platform", description: "Полнофункциональная платформа электронной коммерции с React и Node.js", color: "#ff6c00", image: "/images/atam.jpg", tech: ["React", "Node.js", "MongoDB", "Stripe API"] },
    { title: "Task Management App", description: "Приложение для управления задачами с реальным временем обновления", color: "#00c6ff", image: "/images/atam.jpg", tech: ["React Native", "Firebase", "Redux", "Push Notifications"] },
    { title: "Social Media Dashboard", description: "Панель управления социальными сетями с аналитикой в реальном времени", color: "#e91e63", image: "/images/atam.jpg", tech: ["Vue.js", "Express", "PostgreSQL", "Chart.js"] },
    { title: "Weather Forecast App", description: "Приложение прогноза погоды с красивым UI и офлайн-режимом", color: "#a855f7", image: "/images/atam.jpg", tech: ["React", "Weather API", "PWA", "Local Storage"] },
    { title: "Fitness Tracker", description: "Трекер фитнеса с мониторингом активности и целей", color: "#10b981", image: "/images/atam.jpg", tech: ["React Native", "Health APIs", "GraphQL", "Apple HealthKit"] },
    { title: "Portfolio Website", description: "Анимированное портфолио с современным дизайном и интерактивностью", color: "#f59e0b", image: "/images/atam.jpg", tech: ["React", "Framer Motion", "Three.js", "GSAP"] },
    { title: "Chat Application", description: "Приложение реального времени чата с комнатами и файловым обменом", color: "#6366f1", image: "/images/atam.jpg", tech: ["Socket.io", "React", "Node.js", "File Upload"] },
    { title: "Learning Platform", description: "Образовательная платформа с курсами и системой прогресса", color: "#06b6d4", image: "/images/atam.jpg", tech: ["Next.js", "Prisma", "MySQL", "Video Streaming"] }
  ], []);

  return (
    <section ref={containerRef} className="horizontal-scroll-wrapper">
      <SmoothParallaxStars />
      <div className="horizontal-scroll-sticky-view">
        <div className="scroll-section-header">
          <motion.h2 initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: "easeOut" }}>
            МОИ ПРОЕКТЫ
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}>
            Исследуйте мои работы через интерактивную прокрутку
          </motion.p>
        </div>

        <div className="horizontal-scroll-container">
          <motion.div className="horizontal-scroll-content" style={{ x: smoothX }}>
            {portfolioProjects.map((project, index) => (
              <ProjectCard project={project} index={index} key={index} />
            ))}
          </motion.div>
        </div>

        <motion.div className="scroll-progress-container" style={{ opacity }}>
          <div className="scroll-progress-bar">
            <motion.div className="scroll-progress-fill" style={{ scaleX: scrollYProgress, background: "linear-gradient(90deg, #ff6c00, #00c6ff, #a855f7)" }} />
          </div>
          <motion.div className="scroll-hint" animate={{ y: [-2, 2, -2], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            {isVisible ? "🌀 ПРОЕКТЫ ЗАГРУЖЕНЫ" : "⌛ SCROLL DOWN"}
          </motion.div>
        </motion.div>

        <div className="background-elements">
          <motion.div className="bg-grid" style={{ y: backgroundY }} />
          <motion.div className="floating-shapes shape-1" animate={{ y: [0, -40, 0], rotate: [0, 10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="floating-shapes shape-2" animate={{ y: [0, 30, 0], rotate: [0, -15, 0], scale: [1, 1.05, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
        </div>
      </div>
    </section>
  );
};

// ==================================================================
// ОБНОВЛЕННАЯ СЕКЦИЯ НАВЫКОВ (АНИМАЦИЯ ПРИ КАЖДОМ СКРОЛЛЕ)
// ==================================================================
const SkillsSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const skills = useMemo(() => [
    { icon: "⚛️", title: "Frontend Development", description: "React, Vue.js, TypeScript, Modern CSS, Responsive Design" },
    { icon: "🔧", title: "Backend Development", description: "Node.js, Express, Python, REST APIs, Database Design" },
    { icon: "📱", title: "Mobile Development", description: "React Native, iOS & Android, Cross-platform Solutions" },
    { icon: "🛠️", title: "Tools & Technologies", description: "Git, Docker, AWS, CI/CD, Testing, Agile Methodology" }
  ], []);

  // Анимационные варианты для карточек
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 100, 
      scale: 0.8, 
      rotateX: 45,
    },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 12,
        mass: 1,
        delay: index * 0.15, // Задержка для каскадного эффекта
        duration: 0.8
      }
    })
  };

  return (
    <section ref={containerRef} className="skills-section">
      <motion.div className="skills-background" style={{ scale, y }} />
      <div className="container">
        {/* Заголовок теперь анимируется каждый раз при прокрутке (once: fal */}
        <motion.div 
          className="section-header" 
          initial={{ opacity: 0, y: 50, rotateX: -20 }} 
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }} 
          transition={{ duration: 1, ease: "easeOut" }} 
          viewport={{ once: false, margin: "-50px" }} // <-- Ключевое изменение: once: false
        >
          <motion.h2 
            animate={{ backgroundPosition: ['0%', '100%', '0%'] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }} 
            style={{ background: "linear-gradient(90deg, #ff6c00, #00c6ff, #a855f7, #ff6c00)", backgroundSize: "300% auto", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}
          >
            МОИ НАВЫКИ
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }} 
            viewport={{ once: false }}
          >
            Технологии и инструменты, которые я использую для создания цифровых решений
          </motion.p>
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
              whileHover={{ 
                scale: 1.05, 
                y: -15, 
                rotateX: 5,
                boxShadow: "0 20px 40px rgba(255,108,0,0.2)",
                transition: { duration: 0.3, ease: "easeOut" } 
              }}
            >
              <motion.div 
                className="skill-icon" 
                animate={{ rotate: [0, 10, -5, 0], scale: [1, 1.1, 1.05, 1] }} 
                transition={{ duration: 4, repeat: Infinity, delay: index * 0.5, ease: "easeInOut" }}
              >
                {skill.icon}
              </motion.div>
              <h3>{skill.title}</h3>
              <p>{skill.description}</p>
              <motion.div 
                className="skill-glow" 
                animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.3, 1], rotate: [0, 180, 360] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: index * 0.3 }} 
              />
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
    { number: "25", label: "Завершенных проектов", suffix: "+" },
    { number: "3", label: "Года опыта", suffix: "+" },
    { number: "15", label: "Довольных клиентов", suffix: "+" },
    { number: "99", label: "Успешных решений", suffix: "%" }
  ], []);

  return (
    <section ref={containerRef} className="stats-section">
      <motion.div className="stats-background" style={{ scale, y }} />
      <div className="container">
        <motion.div className="stats-grid" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1.2 }} viewport={{ once: true, margin: "-100px" }}>
          {stats.map((stat, index) => (
            <motion.div key={index} className="stat-item" initial={{ opacity: 0, y: 30, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }} viewport={{ once: true }}>
              <motion.div className="stat-number" animate={{ scale: [1, 1.1, 1], textShadow: ["0 0 0px rgba(255,108,0,0)", "0 0 20px rgba(255,108,0,0.5)", "0 0 0px rgba(255,108,0,0)"] }} transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}>
                {stat.number}
                <span className="stat-suffix">{stat.suffix}</span>
              </motion.div>
              <motion.div className="stat-label" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: index * 0.15 + 0.3 }}>
                {stat.label}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

function App() {
  const features = useMemo(() => [
    { title: "React Development", description: "Современные React приложения с hooks и контекстом", icon: "⚛️" },
    { title: "Responsive Design", description: "Адаптивный дизайн для всех устройств и экранов", icon: "📱" },
    { title: "API Integration", description: "Интеграция с REST API и сторонними сервисами", icon: "🔌" },
    { title: "Database Design", description: "Проектирование и оптимизация баз данных", icon: "🗃️" },
    { title: "Mobile Apps", description: "Кроссплатформенные мобильные приложения", icon: "📲" },
    { title: "UI/UX Design", description: "Создание интуитивных пользовательских интерфейсов", icon: "🎨" },
  ], []);

  const tickerItems = useMemo(() => features.map(feature => feature.title), [features]);

  return (
    <SmoothScroll>
      <div className="app">
        <section className="hero">
          <SmoothParallaxStars />
          <div className="hero-content">
            <motion.h1 initial={{ opacity: 0, y: 80, skewX: -10 }} animate={{ opacity: 1, y: 0, skewX: 0 }} transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}>
              JUNIOR <span className="highlight">FULL STACK</span> DEVELOPER
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
              Создаю современные веб и мобильные приложения с фокусом на пользовательский опыт и производительность
            </motion.p>
            <motion.div className="hero-buttons" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}>
              <Magnetic>
                <motion.button className="btn-primary" whileTap={{ scale: 0.95 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                  Связаться со мной
                </motion.button>
              </Magnetic>
              <Magnetic>
                <motion.button className="btn-secondary" whileTap={{ scale: 0.95 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                  Скачать резюме
                </motion.button>
              </Magnetic>
            </motion.div>
          </div>
          <div className="ticker-section">
            <div className="ticker-label">
              <motion.span animate={{ color: ["#ff6c00", "#00c6ff", "#a855f7", "#ff6c00"] }} transition={{ duration: 3, repeat: Infinity }}>
                ТЕХНОЛОГИИ
              </motion.span>
            </div>
            <VerticalTicker items={tickerItems} speed={50} />
          </div>
          <motion.div className="hero-floating-elements" animate={{ y: [0, -30, 0], rotate: [0, 8, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
          <div className="hero-vignette"></div>
        </section>
        
        <HorizontalScrollSection />
        <SkillsSection />
        <StatsSection />
        <Crazy3DImageSlider />
        
        <section className="services-grid">
          <div className="container">
            <motion.div className="section-header" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: "easeOut" }} viewport={{ once: true, margin: "-100px" }}>
              <h2>Мои Услуги</h2>
              <p>Полный цикл разработки от идеи до запуска</p>
            </motion.div>
            <div className="services-grid-content">
              {features.map((service, index) => (
                <motion.div key={index} className="service-card" initial={{ opacity: 0, y: 60, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }} viewport={{ once: true, amount: 0.3, margin: "-50px" }} whileHover={{ scale: 1.03, y: -8, transition: { duration: 0.4, ease: "easeOut" } }}>
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
              <motion.div key={index} className="ticker-word" whileHover={{ scale: 1.15, color: "#ff6c00", y: -8 }} transition={{ duration: 0.4, ease: "easeOut" }}>
                {item}
                <motion.span className="dot" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1, repeat: Infinity, delay: index * 0.1 }}>
                  •
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
        </section>
        <motion.footer className="footer" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1.2, ease: "easeOut" }} viewport={{ once: true, margin: "-100px" }}>
          <div className="container">
            <motion.div className="footer-content" initial={{ y: 40 }} whileInView={{ y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <h3>ГОТОВЫ К СОТРУДНИЧЕСТВУ?</h3>
              <p>Давайте создадим что-то удивительное вместе</p>
              <Magnetic>
                <motion.button className="btn-primary" whileTap={{ scale: 0.95 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                  Начать проект
                </motion.button>
              </Magnetic>
            </motion.div>
          </div>
        </motion.footer>
      </div>
    </SmoothScroll>
  );
}

export default App;