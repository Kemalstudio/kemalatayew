import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import Spline from '@splinetool/react-spline';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

// ========================================
// МУЛЬТИЯЗЫЧНЫЙ СЛОВАРЬ (i18n)
// ==========================================
const translations = {
  en: {
    navWork: "Work", navExpertise: "Expertise", navAbout: "About", navContact: "Contact", navBtn: "Let's Talk",
    heroBadge: "AVAILABLE FOR HIRE", heroTitle1: "Creative", heroTitle2: "Digital", heroTitle3: "Experience",
    heroDesc: "Kemal Atayev — Creative Developer bridging the gap between exceptional design and flawless engineering.",
    bentoSub: "01 // ARSENAL", bentoTitle: "Technologies & Tools",
    expTitle: "EXPERTISE",
    marquee: "CREATIVE DEVELOPER - FRONTEND - BACKEND - WEBGL - 3D ANIMATION - ",
    skills: [
      { title: "Frontend Engineering", desc: "Pixel-perfect, performant UIs with React ecosystem." },
      { title: "Backend Architecture", desc: "Scalable APIs and robust database management." },
      { title: "Creative Development", desc: "Award-winning WebGL & GSAP animations." },
      { title: "UI/UX Design", desc: "Figma prototyping and user-centric design flows." }
    ],
    footerTitle1: "Let's build the", footerTitle2: "impossible.", footerBtn: "Start a Project", rights: "All rights reserved.",
    a11yTooltip: "Accessibility Mode"
  },
  ru: {
    navWork: "Работы", navExpertise: "Навыки", navAbout: "Обо мне", navContact: "Контакты", navBtn: "Обсудить проект",
    heroBadge: "ОТКРЫТ ДЛЯ ПРЕДЛОЖЕНИЙ", heroTitle1: "Создаю", heroTitle2: "Цифровые", heroTitle3: "Шедевры",
    heroDesc: "Кемаль Атаев — Креативный разработчик, объединяющий исключительный дизайн и безупречный код.",
    bentoSub: "01 // АРСЕНАЛ", bentoTitle: "Технологии и Инструменты",
    expTitle: "ЭКСПЕРТИЗА",
    marquee: "КРЕАТИВНЫЙ РАЗРАБОТЧИК - ФРОНТЕНД - БЭКЕНД - WEBGL - 3D АНИМАЦИЯ - ",
    skills: [
      { title: "Frontend Разработка", desc: "Идеальные и быстрые интерфейсы на React." },
      { title: "Backend Архитектура", desc: "Масштабируемые API и надежные базы данных." },
      { title: "Креативная Разработка", desc: "Премиальные WebGL и GSAP анимации." },
      { title: "UI/UX Дизайн", desc: "Прототипирование в Figma и удобный дизайн." }
    ],
    footerTitle1: "Давайте создадим", footerTitle2: "невозможное.", footerBtn: "Начать проект", rights: "Все права защищены.",
    a11yTooltip: "Версия для слабовидящих"
  },
  tk: {
    navWork: "Işler", navExpertise: "Başarnyklar", navAbout: "Barada", navContact: "Habarlaşmak", navBtn: "Gürleşeliň",
    heroBadge: "IŞLEMÄGE TAÝÝAR", heroTitle1: "Sanly", heroTitle2: "Taslamalary", heroTitle3: "Döredýärin",
    heroDesc: "Kemal Ataýew — Ajaýyp dizaýny we kämil inženerçiligi birleşdirýän kreatiw programmist.",
    bentoSub: "01 // GURALLAR", bentoTitle: "Tehnologiýalar we Gurallar",
    expTitle: "HÜNÄR",
    marquee: "KREATIW PROGRAMMIST - FRONTEND - BACKEND - WEBGL - 3D ANIMASIÝA - ",
    skills: [
      { title: "Frontend Ösüşi", desc: "React ekosistemasy bilen kämil we çalt interfeýsler." },
      { title: "Backend Arhitekturasy", desc: "Giňeldip bolýan API-ler we maglumatlar bazasy." },
      { title: "Kreatiw Ösüş", desc: "Ýokary hilli WebGL we GSAP animasiýalary." },
      { title: "UI/UX Dizaýn", desc: "Figma we ulanyjy üçin amatly dizaýnlar." }
    ],
    footerTitle1: "Mümkin däl zady", footerTitle2: "döredeliň.", footerBtn: "Taslama Başla", rights: "Ähli hukuklar goralan.",
    a11yTooltip: "Gözüň görşüni ýeňilleşdiriş"
  }
};

// ==========================================
// ПРЕМИАЛЬНЫЙ ПЛАВНЫЙ СКРОЛЛ (LENIS)
// ==========================================
const SmoothScroll = ({ children }) => {
  useLayoutEffect(() => {
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

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return <>{children}</>;
};

// ==========================================
// КАСТОМНЫЙ КУРСОР С BLEND-MODE (GSAP)
// ==========================================
const CustomCursor = () => {
  const cursorDotRef = useRef(null);
  const cursorFollowerRef = useRef(null);

  useEffect(() => {
    const dot = cursorDotRef.current;
    const follower = cursorFollowerRef.current;

    const xToDot = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" });
    const yToDot = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" });
    const xToFollower = gsap.quickTo(follower, "x", { duration: 0.5, ease: "back.out(1.7)" });
    const yToFollower = gsap.quickTo(follower, "y", { duration: 0.5, ease: "back.out(1.7)" });

    const onMouseMove = (e) => {
      xToDot(e.clientX); yToDot(e.clientY);
      xToFollower(e.clientX); yToFollower(e.clientY);
    };

    const addHoverEvents = () => {
      const interactives = document.querySelectorAll('a, button, .tech-card, .project-item');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
          gsap.to(follower, { scale: 3, backgroundColor: "#fff", mixBlendMode: "difference", border: "none", duration: 0.3 });
          gsap.to(dot, { opacity: 0, duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(follower, { scale: 1, backgroundColor: "transparent", mixBlendMode: "normal", border: "1px solid rgba(255,255,255,0.5)", duration: 0.3 });
          gsap.to(dot, { opacity: 1, duration: 0.3 });
        });
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    setTimeout(addHoverEvents, 2000);

    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <>
      <div ref={cursorDotRef} className="custom-cursor-dot"></div>
      <div ref={cursorFollowerRef} className="custom-cursor-follower"></div>
    </>
  );
};

// ==========================================
// MAGNETIC BUTTON EFFECT
// ==========================================
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
      xTo((clientX - (left + width / 2)) * 0.4);
      yTo((clientY - (top + height / 2)) * 0.4);
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
// АНИМАЦИЯ ПОСИМВОЛЬНОГО ПОЯВЛЕНИЯ ТЕКСТА
// ==========================================
const AnimatedText = ({ text, className }) => {
  const words = text.split(" ");
  return (
    <h1 className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block overflow-hidden mr-4">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", rotateZ: 5 }}
            animate={{ y: 0, rotateZ: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 1.2 + wordIndex * 0.1 }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h1>
  );
};

// ==========================================
// ИНФИНИТНЫЙ MARQUEE (БЕГУЩАЯ СТРОКА)
// ==========================================
const InfiniteMarquee = ({ text }) => {
  return (
    <div className="marquee-container">
      <div className="marquee-track">
        <h2>{text.repeat(10)}</h2>
      </div>
    </div>
  );
};

// ==========================================
// PREMIUM PROJECT SHOWCASE (HOVER IMAGE REVEAL)
// ==========================================
const PremiumProjectShowcase = () => {
  const projects = [
    { name: "Aura Computers", img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=2068&auto=format&fit=crop" },
    { name: "Atam Store", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop" },
    { name: "Sonus Music", img: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=1974&auto=format&fit=crop" },
    { name: "Turkmen Store", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" }
  ];

  const cursorImgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorImgRef.current;
    const xTo = gsap.quickTo(cursor, "left", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "top", { duration: 0.4, ease: "power3.out" });

    const handleMouseMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      xTo(e.clientX - rect.left);
      yTo(e.clientY - rect.top);
    };

    containerRef.current.addEventListener("mousemove", handleMouseMove);
    return () => containerRef.current?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleMouseEnter = (img) => {
    const cursor = cursorImgRef.current;
    cursor.style.backgroundImage = `url(${img})`;
    gsap.to(cursor, { scale: 1, opacity: 1, rotation: Math.random() * 10 - 5, duration: 0.5, ease: "back.out(1.5)" });
  };

  const handleMouseLeave = () => {
    gsap.to(cursorImgRef.current, { scale: 0, opacity: 0, rotation: 0, duration: 0.4, ease: "power3.in" });
  };

  return (
    <section className="premium-projects" ref={containerRef} id="work">
      <div className="project-cursor-img" ref={cursorImgRef}></div>
      <div className="container">
        {projects.map((proj, i) => (
          <div 
            key={i} 
            className="project-item"
            onMouseEnter={() => handleMouseEnter(proj.img)}
            onMouseLeave={handleMouseLeave}
          >
            <h2 className="project-name" data-text={proj.name}>{proj.name}</h2>
            <span className="project-category">Design & Development</span>
          </div>
        ))}
      </div>
    </section>
  );
};

// ==========================================
// ГОРИЗОНТАЛЬНЫЙ СКРОЛЛ НАВЫКОВ (GSAP)
// ==========================================
const SkillsHorizontal = ({ dict }) => {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  useLayoutEffect(() => {
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
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="horizontal-section" id="expertise">
      <div className="horizontal-sticky">
        <h2 className="horizontal-bg-text">{dict.expTitle}</h2>
      </div>
      <div ref={scrollRef} className="horizontal-scroll-container">
        {dict.skills.map((skill, i) => (
          <div key={i} className="horizontal-panel">
            <div className="panel-content">
              <span className="panel-num">0{i + 1}</span>
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

// ==============================================
// TECH BENTO GRID (3D ТИЛТ + GSAP)
// ==============================================
const TechBentoGrid = ({ dict, techStack }) => {
  return (
    <section className="tech-bento-section">
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">{dict.bentoSub}</span>
          <h2 className="section-title">{dict.bentoTitle}</h2>
        </div>
        <div className="tech-grid">
          {techStack.map((tech, i) => (
            <div key={i} className="tech-card group">
              <div className="tech-icon">{tech.icon}</div>
              <div className="tech-info">
                <h4>{tech.name}</h4>
                <span className="tech-level">{tech.level}</span>
              </div>
              <div className="card-hover-bg"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// PRELOADER
// ==========================================
const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => p >= 100 ? 100 : p + 2);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) setTimeout(() => setFinished(true), 800);
  }, [progress]);

  if (finished) return null;

  return (
    <AnimatePresence>
      <motion.div className="loading-screen" exit={{ opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }} transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}>
        <div className="loader-content">
          <h1 className="loader-text">{progress}<span className="accent">%</span></h1>
          <p className="loader-subtext">Awaking the digital space...</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ==========================================
// MAIN APP 
// ==========================================
export default function App() {
  const [lang, setLang] = useState('en');
  const dict = translations[lang];

  const techStack = [
    { name: "React", icon: "⚛️", level: "Expert" },
    { name: "Three.js", icon: "🧊", level: "Advanced" },
    { name: "GSAP", icon: "✨", level: "Pro" },
    { name: "Next.js", icon: "▲", level: "Advanced" },
    { name: "Node.js", icon: "🟢", level: "Pro" },
    { name: "PostgreSQL", icon: "🐘", level: "Pro" },
  ];

  return (
    <SmoothScroll>
      <div className="app-wrapper">
        <CustomCursor />
        <LoadingScreen />
        
        {/* NAVBAR */}
        <motion.nav className="navbar" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 1, delay: 1, ease: "easeOut" }}>
          <div className="nav-logo">
            <span className="logo-text">Atayev.</span>
          </div>
          <ul className="nav-links">
            <li><Magnetic><a href="#work">{dict.navWork}</a></Magnetic></li>
            <li><Magnetic><a href="#expertise">{dict.navExpertise}</a></Magnetic></li>
            <li><Magnetic><a href="#contact">{dict.navContact}</a></Magnetic></li>
          </ul>
          <div className="nav-right">
            <div className="lang-switcher">
              {['en', 'ru', 'tk'].map(l => (
                <span key={l} className={lang === l ? 'active' : ''} onClick={() => setLang(l)}>{l.toUpperCase()}</span>
              ))}
            </div>
            <Magnetic><button className="nav-cta">{dict.navBtn}</button></Magnetic>
          </div>
        </motion.nav>

        <main>
          {/* HERO SECTION */}
          <section className="hero-premium">
            <div className="noise-overlay" />
            <div className="ambient-glow"></div>

            <div className="container hero-container relative z-10">
              <div className="hero-text-block">
                <motion.span className="hero-badge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                  <div className="pulse-dot"></div> {dict.heroBadge}
                </motion.span>
                
                <div className="hero-title-wrapper">
                  <AnimatedText text={dict.heroTitle1} className="hero-h1" />
                  <AnimatedText text={dict.heroTitle2} className="hero-h1 text-gradient" />
                  <AnimatedText text={dict.heroTitle3} className="hero-h1" />
                </div>

                <motion.p className="hero-desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
                  {dict.heroDesc}
                </motion.p>
              </div>
              
              <div className="model-viewer-canvas pointer-events-none">
                <Spline scene="https://prod.spline.design/Qr2knMM4aKElH8x7/scene.splinecode" />
              </div>
            </div>
          </section>

          {/* INFINITE MARQUEE */}
          <InfiniteMarquee text={dict.marquee} />

          {/* PROJECT SHOWCASE (КРУТАЯ ЗАМЕНА GSAP PANELS) */}
          <PremiumProjectShowcase />

          {/* TECH BENTO GRID */}
          <TechBentoGrid dict={dict} techStack={techStack} />

          {/* HORIZONTAL SKILLS */}
          <SkillsHorizontal dict={dict} />

          {/* REVEAL FOOTER (PARALLAX EFFECT В CSS) */}
          <div className="footer-wrapper">
            <footer className="footer-premium" id="contact">
              <div className="container footer-content">
                <h2>{dict.footerTitle1} <br/><span className="text-gradient">{dict.footerTitle2}</span></h2>
                <Magnetic>
                  <button className="cta-huge">{dict.footerBtn}</button>
                </Magnetic>
                <div className="footer-bottom">
                  <p>© 2024 Kemal Atayev. {dict.rights}</p>
                  <div className="socials">
                    <Magnetic><a href="#">Twitter</a></Magnetic>
                    <Magnetic><a href="#">LinkedIn</a></Magnetic>
                    <Magnetic><a href="#">GitHub</a></Magnetic>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </SmoothScroll>
  );
}