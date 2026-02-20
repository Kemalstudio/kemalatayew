import React, { useRef, useEffect, useState, useMemo, Suspense, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap-trial';
import { ScrollTrigger } from 'gsap-trial/ScrollTrigger';
import { ScrollSmoother } from 'gsap-trial/ScrollSmoother';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Float, Environment, ContactShadows, useProgress } from '@react-three/drei';
import './App.css';

// Регистрация премиум плагинов GSAP
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// ==========================================
// МУЛЬТИЯЗЫЧНЫЙ СЛОВАРЬ (i18n)
// ==========================================
const translations = {
  en: {
    navWork: "Work", navExpertise: "Expertise", navAbout: "About", navContact: "Contact", navBtn: "Let's Talk",
    heroBadge: "AVAILABLE FOR HIRE", heroTitle1: "Crafting", heroTitle2: "Digital", heroTitle3: "Experiences",
    heroDesc: "Kemal Atayev — Creative Developer bridging the gap between exceptional design and flawless engineering.",
    bentoSub: "01 // ARSENAL", bentoTitle: "Technologies & Tools",
    expTitle: "EXPERTISE",
    skills: [
      { title: "Frontend Engineering", desc: "Pixel-perfect, performant UIs with React ecosystem." },
      { title: "Backend Architecture", desc: "Scalable APIs and robust database management." },
      { title: "Creative Development", desc: "Award-winning WebGL & GSAP animations." },
      { title: "UI/UX Design", desc: "Figma prototyping and user-centric design flows." }
    ],
    footerTitle1: "Let's build the", footerTitle2: "impossible.", footerBtn: "Start a Project", rights: "All rights reserved."
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
    footerTitle1: "Давайте создадим", footerTitle2: "невозможное.", footerBtn: "Начать проект", rights: "Все права защищены."
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
      { title: "Kreatiw Ösüş", desc: "Ýokary hilli WebGL we GSAP animasiýalary." },
      { title: "UI/UX Dizaýn", desc: "Figma we ulanyjy üçin amatly dizaýnlar." }
    ],
    footerTitle1: "Mümkin däl zady", footerTitle2: "döredeliň.", footerBtn: "Taslama Başla", rights: "Ähli hukuklar goralan."
  }
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
// HERO 3D MODEL
// ==========================================
useGLTF.preload('/images/gaming_desktop_pc.glb');

const HeroModel = () => {
  const { scene } = useGLTF('/images/gaming_desktop_pc.glb');
  return <primitive object={scene} scale={0.8} position={[0, -2.5, 0]} rotation={[0, -0.4, 0]} />;
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
          end: () => "+=" + window.innerHeight * 4, // 4 экрана скролла
        }
      });

      // Panel 1 (Красный) уже на экране.
      // Panel 2 (Оранжевый) выезжает справа
      tl.fromTo(panels[1], { xPercent: 100 }, { xPercent: 0, ease: "none" })
      // Panel 3 (Фиолетовый) выезжает снизу
        .fromTo(panels[2], { yPercent: 100 }, { yPercent: 0, ease: "none" })
      // Panel 4 (Зеленый) выезжает слева
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
// MAIN APP КОМПОНЕНТ
// ==========================================
export default function App() {
  const [lang, setLang] = useState('en');
  const dict = translations[lang];

  // Инициализация ScrollSmoother
  useLayoutEffect(() => {
    let smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.5,
      effects: true,
      smoothTouch: 0.1,
    });
    return () => smoother.kill();
  }, []);

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
    <>
      <LoadingScreen />
      
      {/* NAVBAR */}
      <motion.nav className="navbar" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.5 }}>
        <div className="nav-logo">
          <div className="logo-dot" />
          {/* ЗДЕСЬ ОСТАВЛЕН КАСТОМНЫЙ ШРИФТ ДЛЯ ВАШЕГО ИМЕНИ */}
          <span className="name custom-font">Atayev Kemal</span>
        </div>
        
        <ul className="nav-links">
          <li><a href="#work">{dict.navWork}</a></li>
          <li><a href="#expertise">{dict.navExpertise}</a></li>
          <li><a href="#about">{dict.navAbout}</a></li>
        </ul>

        <div className="nav-right">
          <div className="lang-switcher">
            <span className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</span>
            <span className={lang === 'ru' ? 'active' : ''} onClick={() => setLang('ru')}>RU</span>
            <span className={lang === 'tk' ? 'active' : ''} onClick={() => setLang('tk')}>TK</span>
          </div>
          <Magnetic><button className="nav-cta">{dict.navBtn}</button></Magnetic>
        </div>
      </motion.nav>

      {/* Обертки для GSAP ScrollSmoother */}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          
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
              
              <div className="model-viewer-canvas">
                <Canvas camera={{ position: [0, 1, 12], fov: 40 }} dpr={[1, 2]} gl={{ alpha: true }}>
                  <Suspense fallback={null}>
                    <Environment preset="studio" />
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} intensity={2} color="#8a2be2" />
                    <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.5}><HeroModel /></Float>
                    <ContactShadows position={[0, -3, 0]} opacity={0.6} scale={15} blur={2} />
                    <OrbitControls enableZoom={false} enablePan={false} autoRotate />
                  </Suspense>
                </Canvas>
              </div>
            </div>
          </section>

          {/* TECH BENTO GRID */}
          <section className="tech-bento-section">
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

        </div>
      </div>
    </>
  );
}