import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  AnimatePresence
} from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import './App.css';

// ==================================================================
// ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ
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

// ==================================================================
// СЕКЦИЯ CRAZY 3D (ФИКСАЦИЯ И СКРОЛЛ)
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
  
  // Механика фиксации:
  // Мы отслеживаем прогресс скролла внутри этого длинного контейнера.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Вращаем карусель на 2.5 оборота (360 * 2.5) за время прохождения секции
  const rawRotation = useTransform(scrollYProgress, [0, 1], [0, -360 * 2.5]);
  
  // Добавляем физику: скролл управляет пружиной
  const smoothRotation = useSpring(rawRotation, {
    stiffness: 50,
    damping: 15,
    mass: 1,
    restDelta: 0.001
  });

  // Вычисляем активный слайд
  useMotionValueEvent(smoothRotation, "change", (latest) => {
    const degrees = Math.abs(latest) % 360;
    const step = 360 / slides.length;
    const index = Math.round(degrees / step) % slides.length;
    if (index !== activeIndex) setActiveIndex(index);
  });

  return (
    // Этот div будет ОЧЕНЬ высоким (500vh в CSS), чтобы создать паузу
    <section ref={containerRef} className="crazy-3d-wrapper">
      {/* Этот блок "прилипнет" к верху экрана */}
      <div className="crazy-sticky-view">
        <CrazyParticles />
        
        <motion.div 
          className="crazy-header"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* <h2>SCROLL TO EXPLORE</h2> */}
        </motion.div>

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
                  {/* data-lenis-prevent останавливает прокрутку всей страницы, когда мы скроллим ВНУТРИ карточки */}
                  <div className="slide-content-wrapper" data-lenis-prevent>
                    <div className="slide-glass-effect"></div>
                    <img src={slide.src} alt={slide.title} />
                    {/* Оверлей скрываем, если это активная карточка и мы хотим скроллить */}
                    <div className="slide-overlay" style={{ pointerEvents: isActive ? 'none' : 'auto' }} />
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
// ОСТАЛЬНЫЕ КОМПОНЕНТЫ
// ==================================================================

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
    { title: "E-Commerce Platform", description: "Полнофункциональная платформа электронной коммерции", color: "#ff6c00", image: "/images/atam.jpg", tech: ["React", "Node.js", "MongoDB"] },
    { title: "Task Management", description: "Приложение для управления задачами", color: "#00c6ff", image: "/images/atam.jpg", tech: ["React Native", "Firebase", "Redux"] },
    { title: "Social Dashboard", description: "Панель управления социальными сетями", color: "#e91e63", image: "/images/atam.jpg", tech: ["Vue.js", "Express", "PostgreSQL"] },
    { title: "Weather App", description: "Приложение прогноза погоды", color: "#a855f7", image: "/images/atam.jpg", tech: ["React", "Weather API", "PWA"] },
    { title: "Fitness Tracker", description: "Трекер фитнеса с мониторингом", color: "#10b981", image: "/images/atam.jpg", tech: ["React Native", "GraphQL"] },
    { title: "Portfolio Website", description: "Анимированное портфолио", color: "#f59e0b", image: "/images/atam.jpg", tech: ["React", "Framer Motion", "Three.js"] },
    { title: "Chat Application", description: "Приложение реального времени", color: "#6366f1", image: "/images/atam.jpg", tech: ["Socket.io", "React", "Node.js"] },
    { title: "Learning Platform", description: "Образовательная платформа", color: "#06b6d4", image: "/images/atam.jpg", tech: ["Next.js", "Prisma", "MySQL"] }
  ], []);

  return (
    <section ref={containerRef} className="horizontal-scroll-wrapper">
      <SmoothParallaxStars />
      <div className="horizontal-scroll-sticky-view">
        <div className="scroll-section-header">
          <motion.h2 initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
            МОИ ПРОЕКТЫ
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.3 }}>
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
          <motion.div className="scroll-hint" animate={{ y: [-2, 2, -2], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}>
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

  return (
    <SmoothScroll>
      <div className="app">
        <section className="hero">
          <SmoothParallaxStars />
          <div className="hero-content">
            <motion.h1 initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }}>
              JUNIOR <span className="highlight">FULL STACK</span> DEVELOPER
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1.2 }}>
              Создаю современные веб и мобильные приложения
            </motion.p>
            <motion.div className="hero-buttons" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }}>
              <Magnetic><button className="btn-primary">Связаться со мной</button></Magnetic>
              <Magnetic><button className="btn-secondary">Скачать резюме</button></Magnetic>
            </motion.div>
          </div>
          <div className="ticker-section">
            <div className="ticker-label">ТЕХНОЛОГИИ</div>
            <VerticalTicker items={tickerItems} speed={50} />
          </div>
          <motion.div className="hero-floating-elements" animate={{ y: [0, -30, 0], rotate: [0, 8, 0] }} transition={{ duration: 10, repeat: Infinity }} />
          <div className="hero-vignette"></div>
        </section>

        <HorizontalScrollSection />
        <SkillsSection />
        <StatsSection />
        
        {/* ВОТ ЗДЕСЬ СЕКЦИЯ КОТОРАЯ ФИКСИРУЕТСЯ */}
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