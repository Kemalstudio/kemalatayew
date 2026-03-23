import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring as useFramerSpring } from 'framer-motion';
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
// ========================================
const translations = {
  en: {
    navWork: "Work", navExpertise: "Expertise", navAbout: "About", navContact: "Contact", navBtn: "Let's Talk",
    heroBadge: "AVAILABLE FOR HIRE", heroTitle1: "Creative", heroTitle2: "Full Stack", heroTitle3: "Developer",
    heroDesc: "Kemal Atayev — Creative Developer bridging the gap between exceptional design and flawless engineering.",
    bentoSub: "01 // ARSENAL", bentoTitle: "Technologies & Tools",
    expTitle: "EXPERTISE",
    skills: [
      { title: "Frontend Engineering", desc: "Pixel-perfect, performant UIs with React ecosystem." },
      { title: "Backend Architecture", desc: "Scalable APIs and robust database management." },
      { title: "Creative Development", desc: "Award-winning WebGL & GSAP animations." },
      { title: "UI/UX Design", desc: "Figma prototyping and user-centric design flows." }
    ],
    physicsTitle: "Play with my skills", physicsSub: "DRAG, THROW & CLICK",
    footerTitle1: "Let's build the", footerTitle2: "impossible.", footerBtn: "Start a Project", rights: "All rights reserved.",
    a11yTooltip: "Accessibility Mode",
    // ДАННЫЕ ПРОЕКТОВ
    projects: {
      aura: {
        title: "Aura Computers",
        role: "Full Stack Development",
        desc: "Aura-Computers is a modern, responsive website featuring a full administration panel for effortless content, product, and service management. It delivers a clean user experience with secure authentication, fast performance, and a structure built with SEO best practices in mind to support future growth.",
        tech: ["PHP", "Laravel", "Javascript", "MySql/SQL", "AJAX", "JQuery", "Blade", "Bootstrap/Icons", "Chart.js", "Postman", "Brevo"]
      },
      atam: {
        title: "Atam Store",
        role: "Frontend & UI/UX",
        desc: "Modern digital storefront focusing on exceptional user experience and blazing fast page transitions.",
        tech: ["Next.js", "GSAP", "Zustand", "Figma", "Vercel"]
      },
      sonus: {
        title: "Sonus Music",
        role: "Creative Web App",
        desc: "An immersive music discovery platform with visualizers and real-time audio processing.",
        tech: ["Vue.js", "Three.js", "Web Audio API", "Firebase"]
      },
      turkmen: {
        title: "Turkmen Store",
        role: "Full Stack Architecture",
        desc: "A localized marketplace application tailored for regional commerce and payment gateways.",
        tech: ["React Native", "Express", "MongoDB", "Redux Toolkit"]
      }
    }
  },
  ru: {
    navWork: "Работы", navExpertise: "Навыки", navAbout: "Обо мне", navContact: "Контакты", navBtn: "Обсудить",
    heroBadge: "ОТКРЫТ ДЛЯ ПРЕДЛОЖЕНИЙ", heroTitle1: "Креативный", heroTitle2: "Full Stack", heroTitle3: "Разработчик",
    heroDesc: "Кемаль Атаев — Креативный разработчик, объединяющий исключительный дизайн и безупречный код.",
    bentoSub: "01 // АРСЕНАЛ", bentoTitle: "Технологии и Инструменты",
    expTitle: "ЭКСПЕРТИЗА",
    skills: [
      { title: "Frontend Разработка", desc: "Идеальные и быстрые интерфейсы на React." },
      { title: "Backend Архитектура", desc: "Масштабируемые API и надежные базы данных." },
      { title: "Креативная Разработка", desc: "Премиальные WebGL и GSAP анимации." },
      { title: "UI/UX Дизайн", desc: "Прототипирование в Figma и удобный дизайн." }
    ],
    physicsTitle: "Поиграйте с моими навыками", physicsSub: "ТЯНИ, БРОСАЙ И КЛИКАЙ",
    footerTitle1: "Давайте создадим", footerTitle2: "невозможное.", footerBtn: "Начать проект", rights: "Все права защищены.",
    a11yTooltip: "Версия для слабовидящих",
    projects: {
      aura: {
        title: "Aura Computers",
        role: "Full Stack Разработка",
        desc: "Aura Computers — это современный адаптивный веб-сайт с полной административной панелью для удобного управления контентом, товарами и услугами. Он обеспечивает чистый и удобный интерфейс, безопасную аутентификацию, высокую скорость работы и структуру, созданную с учётом лучших практик SEO для будущего развития.",
        tech: ["PHP", "Laravel", "Javascript", "MySql/SQL", "AJAX", "JQuery", "Blade", "Bootstrap/Icons", "Chart.js", "Postman", "Brevo"]
      },
      atam: {
        title: "Atam Store",
        role: "Frontend & UI/UX",
        desc: "Современная цифровая витрина с акцентом на UX и быстрые переходы.",
        tech: ["Next.js", "GSAP", "Zustand", "Figma", "Vercel"]
      },
      sonus: {
        title: "Sonus Music",
        role: "Креативное приложение",
        desc: "Иммерсивная платформа для поиска музыки с визуализаторами.",
        tech: ["Vue.js", "Three.js", "Web Audio API", "Firebase"]
      },
      turkmen: {
        title: "Turkmen Store",
        role: "Full Stack Архитектура",
        desc: "Локальный маркетплейс с интеграцией региональных платежных систем.",
        tech: ["React Native", "Express", "MongoDB", "Redux Toolkit"]
      }
    }
  },
  tk: {
    navWork: "Işler", navExpertise: "Başarnyklar", navAbout: "Barada", navContact: "Habarlaşmak", navBtn: "Gürleşeliň",
    heroBadge: "IŞLEMÄGE TAÝÝAR", heroTitle1: "Kreatiw", heroTitle2: "Full Stack", heroTitle3: "Programmist",
    heroDesc: "Kemal Ataýew — Ajaýyp dizaýny we kämil inženerçiligi birleşdirýän kreatiw programmist.",
    bentoSub: "01 // GURALLAR", bentoTitle: "Tehnologiýalar we Gurallar",
    expTitle: "HÜNÄR",
    skills: [
      { title: "Frontend Ösüşi", desc: "React ekosistemasy bilen kämil we çalt interfeýsler." },
      { title: "Backend Arhitekturasy", desc: "Giňeldip bolýan API-ler calculations maglumatlar bazasy." },
      { title: "Kreatiw Ösüş", desc: "Ýokary hilli WebGL we GSAP animasiýalary." },
      { title: "UI/UX Dizaýn", desc: "Figma we ulanyjy touchin amatly dizaýnlar." }
    ],
    physicsTitle: "Başarnyklarym bilen oýnaň", physicsSub: "ÇEK, ZYŇ WE BAS",
    footerTitle1: "Mümkin däl zady", footerTitle2: "döredeliň.", footerBtn: "Taslama Başla", rights: "Ähli hukuklar goralan.",
    a11yTooltip: "Gözüň görşüni ýeňilleşdiriş",
    projects: {
      aura: {
        title: "Aura Computers",
        role: "Full Stack Ösüşi",
        desc: "Aura Computers — häzirki zaman, ähli enjamlar üçin amatly görünýän web-saýt bolup, mazmuny, harytlary we hyzmatlary dolandyrmak üçin doly administratiw panel bilen üpjün edilendir. Ol arassa we peýdalanyjy üçin amatly interfeýs, ygtybarly awtentifikasiýa, ýokary tizlikde işlemek mümkinçiliklerini berýär we geljekki ösüşi üpjün etmek üçin SEO-nyň iň gowy tejribeleri esasynda gurlan gurluşa eýedir.",
        tech: ["PHP", "Laravel", "Javascript", "MySql/SQL", "AJAX", "JQuery", "Blade", "Bootstrap/Icons", "Chart.js", "Postman", "Brevo"]
      },
      atam: {
        title: "Atam Store",
        role: "Frontend & UI/UX",
        desc: "Tizlik we amatlylyk üçin niýetlenen häzirki zaman dükany.",
        tech: ["Next.js", "GSAP", "Zustand", "Figma", "Vercel"]
      },
      sonus: {
        title: "Sonus Music",
        role: "Kreatiw Web Programmasy",
        desc: "Saz diňlemek we wizualizasiýa üçin niýetlenen platforma.",
        tech: ["Vue.js", "Three.js", "Web Audio API", "Firebase"]
      },
      turkmen: {
        title: "Turkmen Store",
        role: "Full Stack Arhitekturasy",
        desc: "Sebitleýin söwda üçin ýöriteleşdirilen ýerli bazar programmasy.",
        tech: ["React Native", "Express", "MongoDB", "Redux Toolkit"]
      }
    }
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
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return <>{children}</>;
};

// =========================================
// SMART CUSTOM CURSOR С ТЕКСТОМ
// =========================================
const CustomCursor = () => {
  const cursorDotRef = useRef(null);
  const cursorFollowerRef = useRef(null);
  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);

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

      const target = e.target.closest('[data-cursor]');
      if (target) {
        setIsHovered(true);
        setCursorText(target.getAttribute('data-cursor'));
      } else {
        setIsHovered(false);
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <>
      <div ref={cursorDotRef} className={`custom-cursor-dot ${isHovered ? 'hidden' : ''}`}></div>
      <div ref={cursorFollowerRef} className={`custom-cursor-follower ${isHovered ? 'expanded' : ''}`}>
        <span className="cursor-text">{cursorText}</span>
      </div>
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

// =========================================
// ПАРЯЩИЕ ЧАСТИЦЫ ДЛЯ ГЛАВНОГО ЭКРАНА
// =========================================
const FloatingParticles = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const particles = gsap.utils.toArray('.floating-particle');
    particles.forEach(p => {
      gsap.to(p, {
        y: "random(-20, 20)",
        x: "random(-20, 20)",
        rotation: "random(-15, 15)",
        duration: "random(2, 4)",
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
    });
  }, []);

  return (
    <div ref={containerRef} className="particles-container">
      <span className="floating-particle p-1">{"{ }"}</span>
      <span className="floating-particle p-2">{"</>"}</span>
      <span className="floating-particle p-3">✦</span>
      <span className="floating-particle p-4">{"#"}</span>
    </div>
  );
};

// =========================================
// PRELOADER
// =========================================
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
// GIGABYTE TEXT MORPH SCROLL EFFECT
// ==========================================
const GigabyteScrollEffect = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=400%",
          scrub: 1,      
          pin: true,     
        }
      });

      tl.to(".g-text-reveal", { backgroundPositionX: "0%", duration: 2.5, ease: "none" }, 0);
      tl.to(".giga-front-text", { opacity: 0, scale: 0.9, y: -50, duration: 1.5 }, 2.8);
      tl.fromTo(".giga-bg-huge-text", 
        { scale: 4, opacity: 0.15, filter: "blur(20px)" },
        { scale: 1, opacity: 1, filter: "blur(0px)", duration: 2, ease: "power2.inOut" },
        2.8 
      );
      tl.fromTo(".giga-word-1", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 4.5);
      tl.fromTo(".giga-word-2", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 5.0);
      tl.fromTo(".giga-word-3", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 5.5);

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="gigabyte-section">
      <div className="giga-background"></div>
      <div className="giga-content-wrapper">
        <div className="giga-front-text">
          <h1 className="giga-main-title">
            <span className="g-text-white">I </span>
            <span className="g-text-empower">Develop </span>
            <span className="g-text-white">Applications</span>
          </h1>
          <p className="giga-subtext-old">
            <span className="g-text-white">Code that's </span>
            <span className="g-text-reveal">Clean, Responsive, Dynamic, Reliable, User-centric</span>
          </p>
        </div>
        <div className="giga-bg-huge-text">
          <h1 className="giga-final-title">
            <span className="g-text-white giga-bold">FULL STACK </span>
            <span className="g-text-blue">is My </span>
            <span className="g-text-cyan">Playground</span>
          </h1>
          <div className="giga-subtext-new">
            <span className="giga-word giga-word-1">to Learn, </span>
            <span className="giga-word giga-word-2">Build, </span>
            <span className="giga-word giga-word-3">Deploy.</span>
          </div>
        </div>
        <div className="giga-buttons">
          <Magnetic><SpringButton className="cta-huge giga-cta" onClick={() => window.open('https://github.com', '_blank')}>My GitHub</SpringButton></Magnetic>
          <Magnetic><SpringButton className="cta-huge giga-cta" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>Hire Me</SpringButton></Magnetic>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// MATTER.JS - НАДЕЖНЫЕ СТЕНЫ И СПАВН
// ==========================================
const PhysicsPlayground = ({ dict }) => {
  const sceneRef = useRef(null);
  const elementsRef = useRef([]);
  const engineRef = useRef(null);
  const bodiesRef = useRef([]);

  const skills = [
    "HTML", "CSS", "SASS", "Bootstrap", "TailwindCSS", "JavaScript", 
    "jQuery", "AJAX", "ReactJS", "Python", "Django", "PHP", 
    "Laravel", "MySQL", "API", "Postman", "PostgreSQL", "GitHub", 
    "Git", "GSAP", "Three.js", "Figma"
  ];

  useEffect(() => {
    const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint, Events, Composite } = Matter;
    const engine = Engine.create();
    engineRef.current = engine;
    engine.world.gravity.y = 0.8; 

    const container = sceneRef.current;
    const width = container.clientWidth;
    const height = 500;

    const wallOptions = { isStatic: true, render: { visible: false } };
    const wallThickness = 1000;
    
    const ground = Bodies.rectangle(width / 2, height + wallThickness / 2, width * 3, wallThickness, wallOptions);
    const leftWall = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 3, wallOptions);
    const rightWall = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 3, wallOptions);
    const ceiling = Bodies.rectangle(width / 2, -wallThickness / 2 - 500, width * 3, wallThickness, wallOptions); 
    
    World.add(engine.world, [ground, leftWall, rightWall, ceiling]);

    const newBodies = skills.map((skill) => {
      const w = skill.length * 10 + 50; 
      const h = 50; 
      return Bodies.rectangle(
        Math.random() * (width - 150) + 75, 
        Math.random() * -400 - 50,          
        w, h, 
        { chamfer: { radius: 25 }, restitution: 0.6, friction: 0.1, frictionAir: 0.02 }
      );
    });
    
    bodiesRef.current = newBodies;
    World.add(engine.world, newBodies);

    const mouse = Mouse.create(container);
    const mouseConstraint = MouseConstraint.create(engine, { mouse: mouse, constraint: { stiffness: 0.2, render: { visible: false } } });
    World.add(engine.world, mouseConstraint);

    Events.on(engine, "beforeUpdate", () => {
      if (mouse.position.x !== 0 && mouse.position.y !== 0) {
        newBodies.forEach(body => {
          const dx = body.position.x - mouse.position.x;
          const dy = body.position.y - mouse.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = 0.00015 * (120 - dist) / 120;
            Matter.Body.applyForce(body, body.position, { x: dx * force, y: dy * force });
          }
        });
      }
    });

    const runner = Runner.create();
    Runner.run(runner, engine);

    Events.on(engine, 'afterUpdate', () => {
      newBodies.forEach((body, index) => {
        const el = elementsRef.current[index];
        if (el) el.style.transform = `translate(calc(-50% + ${body.position.x}px), calc(-50% + ${body.position.y}px)) rotate(${body.angle}rad)`;
      });
    });

    const handleResize = () => {
      const newWidth = container.clientWidth;
      Matter.Body.setPosition(ground, { x: newWidth / 2, y: height + wallThickness / 2 });
      Matter.Body.setPosition(rightWall, { x: newWidth + wallThickness / 2, y: height / 2 });
      Matter.Body.setPosition(ceiling, { x: newWidth / 2, y: -wallThickness / 2 - 500 });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      Runner.stop(runner);
      Engine.clear(engine);
      Composite.clear(engine.world);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleExplodeClick = () => {
    if (!bodiesRef.current.length) return;
    bodiesRef.current.forEach(body => {
      Matter.Body.applyForce(body, body.position, {
        x: (Math.random() - 0.5) * 0.15,
        y: -Math.random() * 0.3 - 0.1
      });
    });
  };

  return (
    <section className="physics-section">
      <div className="container">
        <h2 className="physics-title">{dict.physicsTitle}</h2>
        <p className="physics-sub">{dict.physicsSub}</p>
      </div>
      <div ref={sceneRef} className="physics-dom-container" onClick={handleExplodeClick} data-cursor="DRAG / CLICK">
        <div className="physics-hint">Click anywhere to explode! 💥</div>
        {skills.map((skill, i) => (
          <div key={skill} ref={(el) => (elementsRef.current[i] = el)} className="physics-skill-pill">{skill}</div>
        ))}
      </div>
    </section>
  );
};

// ======================================
// ПОЛНОЭКРАННАЯ СЕКЦИЯ GSAP С ВИДЕО 
// =======================================
const GsapPanelsShowcase = ({ onOpenProject }) => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {}); 
    const timer = setTimeout(() => {
      ctx.add(() => {
        let panels = gsap.utils.toArray(".gsap-panel");
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 1,
            end: () => "+=" + window.innerHeight * 4, 
            invalidateOnRefresh: true, 
          }
        });
        tl.fromTo(panels[1], { xPercent: 100, rotation: 5 }, { xPercent: 0, rotation: 0, ease: "power2.inOut" })
          .fromTo(panels[2], { yPercent: -100, scale: 0.8 }, { yPercent: 0, scale: 1, ease: "power2.inOut" })
          .fromTo(panels[3], { xPercent: -100, rotation: -5 }, { xPercent: 0, rotation: 0, ease: "power2.inOut" });
      });
      ScrollTrigger.refresh();
    }, 100); 

    return () => { clearTimeout(timer); ctx.revert(); };
  }, []);

  return (
    <section ref={containerRef} className="gsap-panels-container">
      <div className="gsap-panel panel-one" data-cursor="VIEW">
        <div className="bg-circle" />
        <div className="project-video-wrapper">
          <video src="/video/aura.mp4" autoPlay loop muted playsInline className="project-video"></video>
          <div className="video-gradient-overlay"></div>
          <h2 className="project-video-title">Aura Computers</h2>
          <button className="project-info-btn" onClick={() => onOpenProject('aura')} data-cursor="CLICK">
            <span>Project Details</span>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>

      <div className="gsap-panel panel-two" data-cursor="VIEW">
        <div className="bg-circle" />
        <div className="project-video-wrapper">
          <video src="/video/atam.mp4" autoPlay loop muted playsInline className="project-video"></video>
          <div className="video-gradient-overlay"></div>
          <h2 className="project-video-title">Atam Store</h2>
          <button className="project-info-btn" onClick={() => onOpenProject('atam')} data-cursor="CLICK">
            <span>Project Details</span>
          </button>
        </div>
      </div>

      <div className="gsap-panel panel-three" data-cursor="VIEW">
        <div className="bg-circle" />
        <div className="project-video-wrapper">
          <video src="/video/sonus.mp4" autoPlay loop muted playsInline className="project-video"></video>
          <div className="video-gradient-overlay"></div>
          <h2 className="project-video-title">Sonus Music</h2>
          <button className="project-info-btn" onClick={() => onOpenProject('sonus')} data-cursor="CLICK">
            <span>Project Details</span>
          </button>
        </div>
      </div>

      <div className="gsap-panel panel-four" data-cursor="VIEW">
        <div className="bg-circle" />
        <div className="project-video-wrapper">
          <video src="/video/turkmen.mp4" autoPlay loop muted playsInline className="project-video"></video>
          <div className="video-gradient-overlay"></div>
          <h2 className="project-video-title">Turkmen Store</h2>
          <button className="project-info-btn" onClick={() => onOpenProject('turkmen')} data-cursor="CLICK">
            <span>Project Details</span>
          </button>
        </div>
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
          scrollTrigger: { trigger: containerRef.current, pin: true, scrub: 1, end: `+=${scrollWidth}`, invalidateOnRefresh: true }
        });
        gsap.utils.toArray('.panel-num').forEach(num => {
          gsap.to(num, { x: 100, ease: "none", scrollTrigger: { trigger: containerRef.current, scrub: 1 } });
        });
      });
      ScrollTrigger.refresh();
    }, 100);

    return () => { clearTimeout(timer); ctx.revert(); };
  }, [lang]);

  return (
    <section ref={containerRef} className="horizontal-section" id="expertise">
      <div className="horizontal-sticky">
        <h2 className="horizontal-bg-text">{dict.expTitle}</h2>
      </div>
      <div ref={scrollRef} className="horizontal-scroll-container">
        {dict.skills.map((skill, i) => (
          <div key={i} className="horizontal-panel" data-cursor="SCROLL">
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
    <div ref={cardRef} className="tech-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={handleClick} data-cursor="EXPLORE">
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

  const handleGridMouseMove = (e) => {
    if (!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll('.tech-card');
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }
  };

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(titleRef.current, { scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }, y: 100, opacity: 0, duration: 1.2, ease: "power4.out" });
      const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: "top 65%", toggleActions: "play none none reverse" } });
      tl.from(".tech-card", { y: 100, opacity: 0, scale: 0.8, rotationX: 45, stagger: 0.1, duration: 0.8, ease: "back.out(1.5)" });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="tech-bento-section" id="work" onMouseMove={handleGridMouseMove}>
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
// INFINITE VELOCITY MARQUEE (Бегущая строка)
// ==========================================
const VelocityMarquee = () => {
  const textRef = useRef(null);
  
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      let proxy = { skew: 0 },
          skewSetter = gsap.quickSetter(".marquee-inner", "skewX", "deg"),
          clamp = gsap.utils.clamp(-20, 20);

      ScrollTrigger.create({
        onUpdate: (self) => {
          let skew = clamp(self.getVelocity() / -100);
          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew;
            gsap.to(proxy, {skew: 0, duration: 0.8, ease: "power3", overwrite: true, onUpdate: () => skewSetter(proxy.skew)});
          }
        }
      });
    }, textRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="velocity-marquee-container" ref={textRef}>
      <div className="marquee-inner">
        <div className="marquee-part">
          PREMIUM DEVELOPMENT • WEBGL ANIMATIONS • CREATIVE ENGINEERING • REACT ECOSYSTEM • 
        </div>
        <div className="marquee-part">
          PREMIUM DEVELOPMENT • WEBGL ANIMATIONS • CREATIVE ENGINEERING • REACT ECOSYSTEM • 
        </div>
      </div>
    </div>
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
  const [activeProjectId, setActiveProjectId] = useState(null); 
  
  const heroTextRef = useRef(null);
  const heroTextBlockRef = useRef(null); 

  const dict = translations[lang];
  const activeProject = activeProjectId ? dict.projects[activeProjectId] : null;

  const { scrollYProgress } = useScroll();
  const scaleX = useFramerSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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
      gsap.fromTo(".split-char", 
        { y: 100, opacity: 0, rotateX: -90, filter: "blur(10px)" },
        { 
          y: 0, opacity: 1, rotateX: 0, filter: "blur(0px)", 
          stagger: 0.02, duration: 1.2, ease: "power4.out", delay: 0.2,
          clearProps: "filter"
        }
      );
    }, heroTextRef);
    return () => ctx.revert();
  }, [loadingEnded, lang]);

  const handleHeroMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;
    gsap.to(".parallax-orb", { x: x, y: y, duration: 1, ease: "power2.out", stagger: 0.1 });

    if (heroTextBlockRef.current) {
      const rect = heroTextBlockRef.current.getBoundingClientRect();
      const moveX = e.clientX - rect.left - rect.width / 2;
      const moveY = e.clientY - rect.top - rect.height / 2;
      gsap.to(heroTextBlockRef.current, {
        rotateX: -(moveY / 40), 
        rotateY: (moveX / 40),
        transformPerspective: 1000,
        duration: 1,
        ease: "power2.out"
      });
    }
  };

  const handleHeroMouseLeave = () => {
    if (heroTextBlockRef.current) {
      gsap.to(heroTextBlockRef.current, {
        rotateX: 0, rotateY: 0, duration: 1.5, ease: "elastic.out(1, 0.3)"
      });
    }
  };

  return (
    <SmoothScroll>
      <motion.div className="scroll-progress-bar" style={{ scaleX }} />

      <div className={`app-wrapper ${a11yMode ? 'a11y-active' : ''}`}>
        <CustomCursor />

        <AnimatePresence>
          {activeProjectId && (
            <motion.div 
              className="project-modal-overlay"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="project-modal-backdrop" onClick={() => setActiveProjectId(null)}></div>
              <motion.div 
                className="project-modal-box"
                initial={{ y: 50, scale: 0.95, opacity: 0 }} 
                animate={{ y: 0, scale: 1, opacity: 1 }} 
                exit={{ y: 20, scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <button className="project-modal-close" onClick={() => setActiveProjectId(null)} data-cursor="CLOSE">✕</button>
                
                <div className="project-modal-content">
                  <span className="project-modal-role">{activeProject.role}</span>
                  <h3 className="project-modal-title">{activeProject.title}</h3>
                  <p className="project-modal-desc">{activeProject.desc}</p>
                  
                  <h4 className="project-modal-tech-title">Technologies Used</h4>
                  <div className="project-modal-tech-list">
                    {activeProject.tech.map((t, i) => (
                      <span key={i} className="project-modal-tech-tag">{t}</span>
                    ))}
                  </div>

                  {/* Дополнительный красивый функционал */}
                  <div className="project-modal-footer">
                    <SpringButton className="modal-btn-live" onClick={() => window.open('#', '_blank')} data-cursor="OPEN SITE">Live Preview</SpringButton>
                    <SpringButton className="modal-btn-github" onClick={() => window.open('#', '_blank')} data-cursor="SOURCE">Source Code</SpringButton>
                  </div>
                </div>
                <div className="modal-decorative-glow" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {!loadingEnded && <LoadingScreen onComplete={() => setLoadingEnded(true)} />}
        </AnimatePresence>
        
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
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
            </Magnetic>
            <SpringButton className="nav-cta">{dict.navBtn}</SpringButton>
          </div>
        </motion.nav>

        <AnimatePresence mode="wait">
          <motion.div key={lang} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} onAnimationComplete={() => { setTimeout(() => ScrollTrigger.refresh(), 100); }}>
            <main>
              <section className="hero-premium" onMouseMove={handleHeroMouseMove} onMouseLeave={handleHeroMouseLeave}>
                <div className="noise-overlay" />
                <div className="parallax-orb orb-1"></div>
                <div className="parallax-orb orb-2"></div>
                <FloatingParticles />

                <div className="container hero-container" ref={heroTextRef}>
                  <div className="hero-text-block" ref={heroTextBlockRef}>
                    <motion.span className="hero-badge" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1, type: "spring" }}>
                      {dict.heroBadge}
                    </motion.span>
                    <h1 className="hero-h1">
                      <div className="line-wrap"><SplitText>{dict.heroTitle1}</SplitText></div>
                      <div className="line-wrap"><span className="text-gradient"><SplitText>{dict.heroTitle2}</SplitText></span></div>
                      <div className="line-wrap"><SplitText>{dict.heroTitle3}</SplitText><span className="split-char">.</span></div>
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

              <GigabyteScrollEffect />
              <TechBentoGrid dict={dict} techStack={techStack} />
              <VelocityMarquee />
              <GsapPanelsShowcase onOpenProject={setActiveProjectId} />
              <SkillsHorizontal lang={lang} dict={dict} />
              <PhysicsPlayground dict={dict} />

              <footer className="footer-premium" id="contact" data-cursor="CONTACT">
                <div className="container">
                  <motion.h2 initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
                    {dict.footerTitle1} <br/>
                    <span className="text-gradient">{dict.footerTitle2}</span>
                  </motion.h2>
                  <Magnetic>
                    <SpringButton className="cta-huge">{dict.footerBtn}</SpringButton>
                  </Magnetic>
                  <div className="footer-bottom">
                    <p>© 2024 Kemal Atayev. {dict.rights}</p>
                    <div className="socials">
                      <a href="#">Twitter</a><a href="#">LinkedIn</a><a href="#">GitHub</a>
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