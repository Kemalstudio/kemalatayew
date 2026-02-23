import React, { useRef, useEffect, useState, Suspense, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import Spline from '@splinetool/react-spline'; // Добавлен Spline для робота
import './App.css';

// Регистрация бесплатного плагина ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// ========================================
// МУЛЬТИЯЗЫЧНЫЙ СЛОВАРЬ (i18n)
// ==========================================
const translations = {
  en: {
    navWork: "Work", navExpertise: "Expertise", navAbout: "About", navContact: "Contact", navBtn: "Let's Talk",
    heroBadge: "AVAILABLE FOR HIRE", heroTitle1: "Full Stack", heroTitle2: "Stack", heroTitle3: "Developer",
    heroDesc: "Kemal Atayev — Creative Developer bridging the gap between exceptional design and flawless engineering.",
    bentoSub: "01 // ARSENAL", bentoTitle: "Technologies & Tools",
    expTitle: "EXPERTISE",
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
    skills: [
      { title: "Frontend Ösüşi", desc: "React ekosistemasy bilen kämil we çalt interfeýsler." },
      { title: "Backend Arhitekturasy", desc: "Giňeldip bolýan API-ler we maglumatlar bazasy." },
      { title: "Kreatiw Ösüş", desc: "Ýokary hilli WebGL и GSAP animasiýalary." },
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
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return <>{children}</>;
};

// ==========================================
// UTILS & WRAPPERS
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
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    // Симуляция загрузки для плавного прелоадера
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 3;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => setFinished(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (finished) return null;

  return (
    <motion.div className="loading-screen" exit={{ opacity: 0, filter: "blur(10px)" }} transition={{ duration: 0.8 }}>
      <div className="loader-content">
        <div className="loader-text">{progress.toFixed(0)}<span className="accent">%</span></div>
        <div className="loader-bar-container">
          <motion.div className="loader-bar-fill" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
        </div>
        <p className="loader-subtext">Loading Premium Experience...</p>
      </div>
    </motion.div>
  );
};

// ==========================================
// ПОЛНОЭКРАННАЯ СЕКЦИЯ GSAP (ONE, TWO, THREE, FOUR)
// ==========================================
const GsapPanelsShowcase = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      let panels = gsap.utils.toArray(".gsap-panel");
      
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          end: () => "+=" + window.innerHeight * 4, 
        }
      });

      tl.fromTo(panels[1], { xPercent: 100 }, { xPercent: 0, ease: "none" })
        .fromTo(panels[2], { yPercent: 100 }, { yPercent: 0, ease: "none" })
        .fromTo(panels[3], { xPercent: -100 }, { xPercent: 0, ease: "none" });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="gsap-panels-container">
      <div className="gsap-panel panel-one">
        <div className="bg-circle" />
        <h2 className="panel-text">ONE</h2>
      </div>
      <div className="gsap-panel panel-two">
        <div className="bg-circle" />
        <h2 className="panel-text">TWO</h2>
      </div>
      <div className="gsap-panel panel-three">
        <div className="bg-circle" />
        <h2 className="panel-text">THREE</h2>
      </div>
      <div className="gsap-panel panel-four">
        <div className="bg-circle" />
        <h2 className="panel-text">FOUR</h2>
      </div>
    </section>
  );
};

// ==========================================
// ГОРИЗОНТАЛЬНЫЙ СКРОЛЛ НАВЫКОВ (GSAP)
// ==========================================
const SkillsHorizontal = ({ lang, dict }) => {
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
          invalidateOnRefresh: true
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, [lang]);

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

// ==========================================
// TECH BENTO GRID С ИСПОЛЬЗОВАНИЕМ GSAP TIMELINE
// ==========================================
const TechBentoGrid = ({ dict, techStack }) => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse"
        }
      });

      tl.from(".tech-card", {
        y: 100,
        opacity: 0,
        scale: 0.8,
        rotationX: 45,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(1.5)" 
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="tech-bento-section">
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">{dict.bentoSub}</span>
          <h2 className="section-title">{dict.bentoTitle}</h2>
        </div>
        <div className="tech-grid">
          {techStack.map((tech, i) => (
            <div key={i} className="tech-card">
              <div className="tech-card-glow" />
              <div className="tech-icon">{tech.icon}</div>
              <div className="tech-info">
                <h4>{tech.name}</h4>
                <span className="tech-level">{tech.level}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// MAIN APP КОМПОНЕНТ
// ==========================================
export default function App() {
  const [lang, setLang] = useState('en');
  const [a11yMode, setA11yMode] = useState(false); // Состояние Режима Доступно
  const dict = translations[lang];

  const techStack = [
    { name: "React", icon: "⚛️", level: "Expert" },
    { name: "Next.js", icon: "▲", level: "Advanced" },
    { name: "Three.js", icon: "🧊", level: "Advanced" },
    { name: "Node.js", icon: "🟢", level: "Pro" },
    { name: "Tailwind", icon: "💨", level: "Expert" },
    { name: "GSAP", icon: "✨", level: "Pro" },
    { name: "TypeScript", icon: "📘", level: "Advanced" },
    { name: "PostgreSQL", icon: "🐘", level: "Pro" },
  ];

  return (
    <SmoothScroll>
      <div className={`app-wrapper ${a11yMode ? 'a11y-active' : ''}`}>
        <LoadingScreen />
        
        {/* NAVBAR */}
        <motion.nav className="navbar" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.5 }}>
          <div className="nav-logo">
            <div className="logo-dot" />
            <span style={{ fontSize: "30px" }} className="name custom-font">Atayev Kemal</span>
          </div>
          
          <ul className="nav-links">
            <li>
              <a href="#work">{dict.navWork}</a>
              </li>
            <li>
              <a href="#expertise">{dict.navExpertise}</a>
              </li>
            <li>
              <a href="#about">{dict.navAbout}</a>
              </li>
          </ul>

          <div className="nav-right">
            <div className="lang-switcher">
              <span className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</span>
              <span className={lang === 'ru' ? 'active' : ''} onClick={() => setLang('ru')}>RU</span>
              <span className={lang === 'tk' ? 'active' : ''} onClick={() => setLang('tk')}>TK</span>
            </div>
            
            {/* КНОПКА ДЛЯ СЛАБОВИДЯЩИХ (ИКОНКА ГЛАЗА) */}
            <button 
              className={`a11y-toggle-btn ${a11yMode ? 'active' : ''}`} 
              onClick={() => setA11yMode(!a11yMode)}
              title={dict.a11yTooltip}
              aria-label={dict.a11yTooltip}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>

            <Magnetic><button className="nav-cta">{dict.navBtn}</button></Magnetic>
          </div>
        </motion.nav>

        <main>
          {/* HERO SECTION */}
          <section className="hero-premium">
            <div className="noise-overlay" />
            <div className="container hero-container">
              <div className="hero-text-block">
                <motion.span className="hero-badge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                  {dict.heroBadge}
                </motion.span>
                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 1 }}>
                  {dict.heroTitle1} <br/>
                  <span className="text-gradient">{dict.heroTitle2}</span> <br/>
                  {dict.heroTitle3}.
                </motion.h1>
                <motion.p className="hero-desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                  {dict.heroDesc}
                </motion.p>
              </div>
              
              {/* СЮДА ДОБАВЛЕН РОБОТ ИЗ ВАШЕГО HTML КОДА */}
              <div className="model-viewer-canvas">
                <Spline scene="https://prod.spline.design/Qr2knMM4aKElH8x7/scene.splinecode" />
              </div>

            </div>
          </section>

          {/* TECH BENTO GRID */}
          <TechBentoGrid dict={dict} techStack={techStack} />

          {/* АНИМАЦИЯ ПАНЕЛЕЙ (ONE, TWO, THREE, FOUR) */}
          <GsapPanelsShowcase />

          {/* HORIZONTAL SKILLS */}
          <SkillsHorizontal lang={lang} dict={dict} />

          {/* FOOTER */}
          <footer className="footer-premium" id="contact">
            <div className="container">
              <h2>{dict.footerTitle1} <br/><span className="text-gradient">{dict.footerTitle2}</span></h2>
              <Magnetic>
                <button className="cta-huge">{dict.footerBtn}</button>
              </Magnetic>
              <div className="footer-bottom">
                <p>© 2024 Kemal Atayev. {dict.rights}</p>
                <div className="socials">
                  <a href="#">Twitter</a>
                  <a href="#">LinkedIn</a>
                  <a href="#">GitHub</a>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </SmoothScroll>
  );
}