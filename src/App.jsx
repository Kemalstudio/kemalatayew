import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import Spline from '@splinetool/react-spline';
import { useSpring, animated } from '@react-spring/web'; 
import Matter from 'matter-js'; 
import Lottie from 'lottie-react'; 
import './App.css';

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
    physicsTitle: "Play with my skills", physicsSub: "DRAG & THROW",
    footerTitle1: "Let's build the", footerTitle2: "impossible.", footerBtn: "Start a Project", rights: "All rights reserved.",
    a11yTooltip: "Accessibility Mode"
  },
  ru: {
    navWork: "Работы", navExpertise: "Навыки", navAbout: "Обо мне", navContact: "Контакты", navBtn: "Обсудить",
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
    physicsTitle: "Поиграйте с моими навыками", physicsSub: "ТЯНИ И БРОСАЙ",
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
      { title: "Backend Arhitekturasy", desc: "Giňeldip bolýan API-ler calculations maglumatlar bazasy." },
      { title: "Kreatiw Ösüş", desc: "Ýokary hilli WebGL we GSAP animasiýalary." },
      { title: "UI/UX Dizaýn", desc: "Figma we ulanyjy üçin amatly dizaýnlar." }
    ],
    physicsTitle: "Başarnyklarym bilen oýnaň", physicsSub: "ÇEK WE ZYŇ",
    footerTitle1: "Mümkin däl zady", footerTitle2: "döredeliň.", footerBtn: "Taslama Başla", rights: "Ähli hukuklar goralan.",
    a11yTooltip: "Gözüň görşüni ýeňilleşdiriş"
  }
};

const scrollLottieData = {
  "v": "5.5.2", "fr": 30, "ip": 0, "op": 60, "w": 100, "h": 100, "nm": "Scroll Arrow", "ddd": 0,
  "assets": [], "layers": [{"ddd":0,"ind":1,"ty":4,"nm":"Arrow","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[0]},{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":30,"s":[100]},{"t":60,"s":[0]}]},"r":{"a":0,"k":0},"p":{"a":1,"k":[{"i":{"x":0.2,"y":1},"o":{"x":0.8,"y":0},"t":0,"s":[50,20,0],"to":[0,10,0],"ti":[0,-10,0]},{"t":60,"s":[50,80,0]}]},"a":{"a":0,"k":[0,0,0]},"s":{"a":0,"k":[100,100,100]}},"ao":0,"shapes":[{"ty":"gr","it":[{"d":1,"ty":"el","s":{"a":0,"k":[20,20]},"p":{"a":0,"k":[0,0]},"nm":"Circle","hd":false},{"ty":"fl","c":{"a":0,"k":[0,1,1,1]},"o":{"a":0,"k":100},"nm":"Fill 1","hd":false},{"ty":"tr","p":{"a":0,"k":[0,0]},"a":{"a":0,"k":[0,0]},"s":{"a":0,"k":[100,100]},"r":{"a":0,"k":0},"o":{"a":0,"k":100},"sk":{"a":0,"k":0},"sa":{"a":0,"k":0},"nm":"Transform"}],"nm":"Group 1","hd":false}],"ip":0,"op":60,"st":0,"bm":0}]
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
// CUSTOM CURSOR
// ==========================================
const CustomCursor = () => {
  const cursorDotRef = useRef(null);
  const cursorFollowerRef = useRef(null);

  useEffect(() => {
    const dot = cursorDotRef.current;
    const follower = cursorFollowerRef.current;

    const xToDot = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" });
    const yToDot = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" });
    const xToFollower = gsap.quickTo(follower, "x", { duration: 0.6, ease: "power3.out" });
    const yToFollower = gsap.quickTo(follower, "y", { duration: 0.6, ease: "power3.out" });

    const onMouseMove = (e) => {
      xToDot(e.clientX);
      yToDot(e.clientY);
      xToFollower(e.clientX);
      yToFollower(e.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);
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

const SplitText = ({ children, className }) => {
  return (
    <span className={className} style={{ display: "inline-block" }}>
      {children.split("").map((char, index) => (
        <span key={index} className="split-char" style={{ display: "inline-block", whiteSpace: "pre" }}>
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
};

// ==========================================
// PRELOADER
// ==========================================
const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2; 
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(onComplete, 800);
    }
  }, [progress, onComplete]);

  return (
    <motion.div className="loading-screen" exit={{ opacity: 0, y: "-100%" }} transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}>
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
// MATTER.JS - 2D ФИЗИКА
// ==========================================
const PhysicsPlayground = ({ dict }) => {
  const sceneRef = useRef(null);
  
  useEffect(() => {
    const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint, Composite } = Matter;
    const engine = Engine.create();
    const width = window.innerWidth;
    const height = 500;

    const render = Render.create({
      element: sceneRef.current, engine: engine,
      options: { width, height, wireframes: false, background: 'transparent', pixelRatio: window.devicePixelRatio }
    });

    const ground = Bodies.rectangle(width / 2, height + 25, width, 50, { isStatic: true });
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height, { isStatic: true });
    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, { isStatic: true });

    const skills = ["HTML", "CSS", "SASS", "Bootstrap", "TailwindCSS", "Javascript", "JQuery", "AJAX", "ReactJS", "Python", "Django", "PHP", "Laravel", "MySQL", "API", "Postman", "PostqreSQL", "Github", "Git", "GSAP", "Three.js", "Figma"];
    const skillBodies = skills.map((skill) => {
      return Bodies.rectangle(Math.random() * width, Math.random() * -500, 140, 60, {
          chamfer: { radius: 30 }, restitution: 0.8, friction: 0.5,
          render: { fillStyle: '#251c2e', strokeStyle: '#00ffff', lineWidth: 2 },
          label: skill
      });
    });

    World.add(engine.world, [ground, leftWall, rightWall, ...skillBodies]);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse, constraint: { stiffness: 0.2, render: { visible: false } }
    });
    World.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    const canvas = render.canvas;
    const ctx = canvas.getContext('2d');
    
    Matter.Events.on(render, 'afterRender', () => {
      ctx.font = 'bold 18px Nunito'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#ffffff';
      skillBodies.forEach(body => {
        ctx.save(); ctx.translate(body.position.x, body.position.y); ctx.rotate(body.angle);
        ctx.fillText(body.label, 0, 0); ctx.restore();
      });
    });

    const handleResize = () => {
      render.canvas.width = window.innerWidth;
      Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: height + 25 });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      Render.stop(render); Runner.stop(runner);
      Composite.clear(engine.world); Engine.clear(engine);
      render.canvas.remove(); window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="physics-section">
      <div className="container">
        <h2 className="physics-title">{dict.physicsTitle}</h2>
        <p className="physics-sub">{dict.physicsSub}</p>
      </div>
      <div ref={sceneRef} className="physics-canvas-container" />
    </section>
  );
};

// ==========================================
// ПОЛНОЭКРАННАЯ СЕКЦИЯ GSAP 
// ==========================================
const GsapPanelsShowcase = () => {
  const containerRef = useRef(null);

  // ИСПОЛЬЗУЕМ setTimeout внутри useLayoutEffect для устранения бага с черным экраном
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {}); // Пустой контекст
    
    const timer = setTimeout(() => {
      ctx.add(() => {
        let panels = gsap.utils.toArray(".gsap-panel");
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 1,
            end: () => "+=" + window.innerHeight * 4, 
            invalidateOnRefresh: true, // ВАЖНО ДЛЯ РЕСАЙЗА И СМЕНЫ ЯЗЫКА
          }
        });

        tl.fromTo(panels[1], { xPercent: 100, rotation: 10 }, { xPercent: 0, rotation: 0, ease: "power2.inOut" })
          .fromTo(panels[2], { yPercent: -100, scale: 0.5 }, { yPercent: 0, scale: 1, ease: "power2.inOut" })
          .fromTo(panels[3], { xPercent: -100, rotation: -10 }, { xPercent: 0, rotation: 0, ease: "power2.inOut" });
      });
      ScrollTrigger.refresh();
    }, 100); // Миллисекунды задержки для расчетов DOM

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className="gsap-panels-container">
      <div className="gsap-panel panel-one">
        <div className="bg-circle" />
        <h2 className="panel-text">Aura Computers</h2>
      </div>
      <div className="gsap-panel panel-two">
        <div className="bg-circle" />
        <h2 className="panel-text">Atam Store</h2>
      </div>
      <div className="gsap-panel panel-three">
        <div className="bg-circle" />
        <h2 className="panel-text">Sonus Music</h2>
      </div>
      <div className="gsap-panel panel-four">
        <div className="bg-circle" />
        <h2 className="panel-text">Turkmen Store</h2>
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
    let ctx = gsap.context(() => {});
    
    const timer = setTimeout(() => {
      ctx.add(() => {
        const scrollWidth = scrollRef.current.scrollWidth - window.innerWidth;
        gsap.to(scrollRef.current, {
          x: -scrollWidth,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 1,
            end: `+=${scrollWidth}`,
            invalidateOnRefresh: true // ВАЖНО!
          }
        });
        
        gsap.utils.toArray('.panel-num').forEach(num => {
          gsap.to(num, {
            x: 100, ease: "none",
            scrollTrigger: { trigger: containerRef.current, scrub: 1 }
          });
        });
      });
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
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
// ИНТЕРАКТИВНАЯ КАРТОЧКА НАВЫКОВ 
// ==========================================
const TiltCard = ({ tech }) => {
  const cardRef = useRef(null);
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    const centerX = rect.width / 2; const centerY = rect.height / 2;
    gsap.to(card, {
      rotateX: ((y - centerY) / centerY) * -15, rotateY: ((x - centerX) / centerX) * 15,
      transformPerspective: 1000, ease: "power2.out", duration: 0.5
    });
  };
  const handleMouseLeave = () => gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, ease: "elastic.out(1, 0.3)", duration: 1.2 });
  const handleClick = () => gsap.timeline().to(cardRef.current, { scale: 0.9, duration: 0.1 }).to(cardRef.current, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.3)" });

  return (
    <div ref={cardRef} className="tech-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={handleClick}>
      <div className="tech-card-glow" />
      <div className="tech-icon">{tech.icon}</div>
      <div className="tech-info">
        <h4>{tech.name}</h4>
        <span className="tech-level">{tech.level}</span>
      </div>
    </div>
  );
};

// ==============================================
// TECH BENTO GRID
// ==============================================
const TechBentoGrid = ({ dict, techStack }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(titleRef.current, { scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }, y: 100, opacity: 0, duration: 1.2, ease: "power4.out" });
      const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: "top 65%", toggleActions: "play none none reverse" } });
      tl.from(".tech-card", { y: 100, opacity: 0, scale: 0.8, rotationX: 45, stagger: 0.1, duration: 0.8, ease: "back.out(1.5)" });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="tech-bento-section" id="work">
      <div className="container">
        <div className="section-title-wrapper" ref={titleRef}>
          <span className="section-subtitle">{dict.bentoSub}</span>
          <h2 className="section-title">{dict.bentoTitle}</h2>
        </div>
        <div className="tech-grid">
          {techStack.map((tech, i) => <TiltCard key={i} tech={tech} />)}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// REACT SPRING КНОПКА
// ==========================================
const SpringButton = ({ children, onClick, className }) => {
  const [props, set] = useSpring(() => ({ scale: 1, boxShadow: "0px 0px 0px rgba(0, 255, 255, 0)", config: { tension: 400, friction: 15 } }));
  return (
    <animated.button className={className} onClick={onClick}
      onMouseEnter={() => set({ scale: 1.05, boxShadow: "0px 10px 30px rgba(0, 255, 255, 0.4)" })}
      onMouseLeave={() => set({ scale: 1, boxShadow: "0px 0px 0px rgba(0, 255, 255, 0)" })}
      onMouseDown={() => set({ scale: 0.95 })}
      onMouseUp={() => set({ scale: 1.05 })} style={props}
    >
      {children}
    </animated.button>
  );
};

// ==========================================
// MAIN APP
// ==========================================
export default function App() {
  const [lang, setLang] = useState('en');
  const [a11yMode, setA11yMode] = useState(false);
  const [loadingEnded, setLoadingEnded] = useState(false);
  const heroTextRef = useRef(null);

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

  useLayoutEffect(() => {
    if (!loadingEnded) return;
    let ctx = gsap.context(() => {
      gsap.from(".split-char", { y: 100, opacity: 0, rotateX: -90, stagger: 0.03, duration: 1, ease: "back.out(1.7)", delay: 0.2 });
    }, heroTextRef);
    return () => ctx.revert();
  }, [loadingEnded, lang]);

  const handleHeroMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;
    gsap.to(".parallax-orb", { x: x, y: y, duration: 1, ease: "power2.out", stagger: 0.1 });
  };

  return (
    <SmoothScroll>
      <div className={`app-wrapper ${a11yMode ? 'a11y-active' : ''}`}>
        <CustomCursor />
        
        <AnimatePresence>
          {!loadingEnded && <LoadingScreen onComplete={() => setLoadingEnded(true)} />}
        </AnimatePresence>
        
        {/* NAVBAR */}
        <motion.nav className="navbar" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}>
          <div className="nav-logo">
            <div className="logo-dot" />
            <span style={{ fontSize: "30px" }} className="name custom-font">Atayev Kemal</span>
          </div>
          <ul className="nav-links">
            <li><Magnetic><a href="#work">{dict.navWork}</a></Magnetic></li>
            <li><Magnetic><a href="#expertise">{dict.navExpertise}</a></Magnetic></li>
            <li><Magnetic><a href="#contact">{dict.navContact}</a></Magnetic></li>
          </ul>
          <div className="nav-right">
            <div className="lang-switcher">
              <span className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</span>
              <span className={lang === 'ru' ? 'active' : ''} onClick={() => setLang('ru')}>RU</span>
              <span className={lang === 'tk' ? 'active' : ''} onClick={() => setLang('tk')}>TK</span>
            </div>
            <Magnetic>
              <button className={`a11y-toggle-btn ${a11yMode ? 'active' : ''}`} onClick={() => setA11yMode(!a11yMode)} title={dict.a11yTooltip}>
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </Magnetic>
            <SpringButton className="nav-cta">{dict.navBtn}</SpringButton>
          </div>
        </motion.nav>

        {/* 
          ФИКС ЧЕРНОГО ЭКРАНА: 
          Убрали transform (y: 50) и filter из анимации AnimatePresence.
          Оставили ТОЛЬКО opacity. 
          Добавили onAnimationComplete={() => ScrollTrigger.refresh()}
        */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={lang}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onAnimationComplete={() => {
              // Принудительно заставляем GSAP пересчитать высоты, 
              // чтобы черный экран исче
              setTimeout(() => ScrollTrigger.refresh(), 100); 
            }}
          >
            <main>
              {/* HERO SECTION */}
              <section className="hero-premium" onMouseMove={handleHeroMouseMove}>
                <div className="noise-overlay" />
                <div className="parallax-orb orb-1"></div>
                <div className="parallax-orb orb-2"></div>

                <div className="container hero-container" ref={heroTextRef}>
                  <div className="hero-text-block">
                    <motion.span className="hero-badge" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1, type: "spring" }}>
                      {dict.heroBadge}
                    </motion.span>
                    <h1 className="hero-h1">
                      <SplitText>{dict.heroTitle1}</SplitText> <br/>
                      <span className="text-gradient"><SplitText>{dict.heroTitle2}</SplitText></span> <br/>
                      <SplitText>{dict.heroTitle3}</SplitText><span className="split-char">.</span>
                    </h1>
                    <motion.p className="hero-desc" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 1 }}>
                      {dict.heroDesc}
                    </motion.p>
                    <div className="lottie-scroll-wrapper">
                      <Lottie animationData={scrollLottieData} loop={true} style={{ width: 80, height: 80 }} />
                    </div>
                  </div>
                  
                  <div className="model-viewer-canvas">
                    <Spline scene="https://prod.spline.design/Qr2knMM4aKElH8x7/scene.splinecode" />
                  </div>
                </div>
              </section>

              {/* TECH BENTO GRID */}
              <TechBentoGrid dict={dict} techStack={techStack} />

              {/* АНИМАЦИЯ ПАНЕЛЕЙ GSAP */}
              <GsapPanelsShowcase />

              {/* HORIZONTAL SKILLS */}
              <SkillsHorizontal lang={lang} dict={dict} />

              {/* РЕАЛЬНАЯ ФИЗИКА (MATTER.JS) */}
              <PhysicsPlayground dict={dict} />

              {/* FOOTER */}
              <footer className="footer-premium" id="contact">
                <div className="container">
                  <motion.h2 initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
                    {dict.footerTitle1} <br/><span className="text-gradient">{dict.footerTitle2}</span>
                  </motion.h2>
                  <Magnetic>
                    <SpringButton className="cta-huge">{dict.footerBtn}</SpringButton>
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
            </main>
          </motion.div>
        </AnimatePresence>
      </div>
    </SmoothScroll>
  );
}