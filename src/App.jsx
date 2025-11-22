import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import './App.css';

// Компонент вертикального тикера
const VerticalTicker = ({ items, speed = 50 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, speed * 100);

    return () => clearInterval(interval);
  }, [items.length, speed]);

  return (
    <div className="ticker-container">
      <motion.div
        className="ticker-track"
        animate={{ y: -currentIndex * 100 + '%' }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          mass: 0.5
        }}
      >
        {items.map((item, index) => (
          <motion.div 
            key={index} 
            className="ticker-item"
            whileHover={{ scale: 1.05, color: "#ff6c00" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {item}
          </motion.div>
        ))}
        <div className="ticker-item">
          {items[0]}
        </div>
      </motion.div>
    </div>
  );
};

// Параллакс звезды
const SmoothParallaxStars = () => {
  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 100], {
    clamp: false
  });
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200], {
    clamp: false
  });
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 300], {
    clamp: false
  });
  
  const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);
  const opacity2 = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.2, 0.6, 0.6, 0.2]);
  const opacity3 = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.1, 0.3, 0.3, 0.1]);

  return (
    <div className="stars-container">
      <motion.div 
        className="stars-layer stars-1" 
        style={{ y: y1, opacity: opacity1 }}
      />
      <motion.div 
        className="stars-layer stars-2" 
        style={{ y: y2, opacity: opacity2 }}
      />
      <motion.div 
        className="stars-layer stars-3" 
        style={{ y: y3, opacity: opacity3 }}
      />
    </div>
  );
};

// Компонент горизонтальной прокрутки для проектов
const ProjectsScrollSection = () => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsVisible(latest > 0.1 && latest < 0.9);
  });

  const xTransform = useTransform(scrollYProgress, [0, 1], ['0%', '-120%'], {
    clamp: false
  });
  
  const smoothX = useSpring(xTransform, { 
    stiffness: 60, 
    damping: 30, 
    mass: 0.8 
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '80%'], {
    clamp: false
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9], {
    clamp: false
  });

  // Данные проектов для портфолио
  const projects = [
    {
      title: "Веб-приложение E-commerce",
      description: "Полнофункциональный интернет-магазин с системой оплаты и админ-панелью",
      color: "#ff6c00",
      image: "/images/project1.jpg",
      technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
      link: "#"
    },
    {
      title: "Мобильное приложение",
      description: "Кроссплатформенное приложение для управления задачами с облачной синхронизацией",
      color: "#00c6ff",
      image: "/images/project2.jpg",
      technologies: ["React Native", "Firebase", "Redux", "TypeScript"],
      link: "#"
    },
    {
      title: "Дашборд аналитики",
      description: "Интерактивная панель управления с графиками и реальными метриками",
      color: "#e91e63",
      image: "/images/project3.jpg",
      technologies: ["Vue.js", "D3.js", "Express", "PostgreSQL"],
      link: "#"
    },
    {
      title: "Социальная платформа",
      description: "Социальная сеть с функциями обмена контентом и мессенджером",
      color: "#a855f7",
      image: "/images/project4.jpg",
      technologies: ["Next.js", "GraphQL", "WebSocket", "Redis"],
      link: "#"
    },
    {
      title: "Портал образования",
      description: "Онлайн-платформа для дистанционного обучения с видеолекциями",
      color: "#10b981",
      image: "/images/project5.jpg",
      technologies: ["Angular", "NestJS", "MySQL", "AWS S3"],
      link: "#"
    },
    {
      title: "Арт-портфолио",
      description: "Интерактивная галерея для художника с 3D просмотром работ",
      color: "#f59e0b",
      image: "/images/project6.jpg",
      technologies: ["Three.js", "React", "Framer Motion", "GSAP"],
      link: "#"
    }
  ];

  return (
    <section ref={containerRef} className="horizontal-scroll-wrapper">
      <SmoothParallaxStars />
      
      <div className="scroll-section-header">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          МОИ ПРОЕКТЫ
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Исследуйте мои работы - от веб-приложений до мобильных решений
        </motion.p>
      </div>

      <div className="horizontal-scroll-container">
        <motion.div
          className="horizontal-scroll-content"
          style={{ x: smoothX }}
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="horizontal-card"
              initial={{ opacity: 0, y: 100, scale: 0.9, rotateY: 45 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
              transition={{ 
                duration: 1.2, 
                delay: index * 0.15, 
                ease: [0.25, 0.46, 0.45, 0.94],
                rotateY: { duration: 1.5 }
              }}
              viewport={{ once: true, margin: "-150px" }}
              whileHover={{ 
                y: -20, 
                scale: 1.03,
                transition: { duration: 0.5, ease: "easeOut" } 
              }}
            >
              <div className="card-inner" style={{ '--glow-color': project.color }}>
                <div className="card-glare"></div>
                
                <motion.div 
                  className="project-index"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.15 + 0.5, duration: 0.8 }}
                >
                  {String(index + 1).padStart(2, '0')}
                </motion.div>

                <motion.div 
                  className="card-image-container"
                  whileHover={{ scale: 1.08, rotateZ: 3 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <motion.img 
                    src={project.image} 
                    alt={project.title} 
                    className="project-image" 
                    whileHover={{ rotateY: 15, scale: 1.1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                  <motion.div 
                    className="image-glow"
                    animate={{ 
                      opacity: [0.2, 0.6, 0.2],
                      scale: [1, 1.15, 1]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>

                <div className="card-text-content">
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 + 0.3 }}
                  >
                    {project.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 + 0.4 }}
                  >
                    {project.description}
                  </motion.p>
                  
                  <motion.ul className="tech-list">
                    {project.technologies.map((tech, techIndex) => (
                      <motion.li 
                        key={techIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: index * 0.15 + 0.5 + techIndex * 0.1,
                          duration: 0.6 
                        }}
                      >
                        {tech}
                      </motion.li>
                    ))}
                  </motion.ul>
                  
                  <motion.button 
                    className="project-button"
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: project.color,
                      y: -2
                    }}
                    whileTap={{ scale: 0.95 }}
                    style={{ borderColor: project.color }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 + 0.8 }}
                    onClick={() => window.open(project.link, '_blank')}
                  >
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Смотреть проект ›
                    </motion.span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="scroll-progress-container"
        style={{ opacity }}
      >
        <div className="scroll-progress-bar">
          <motion.div 
            className="scroll-progress-fill" 
            style={{ 
              scaleX: scrollYProgress,
              background: "linear-gradient(90deg, #ff6c00, #00c6ff, #a855f7)"
            }}
          />
        </div>
        <motion.div 
          className="scroll-hint" 
          animate={{ 
            y: [-2, 2, -2],
            opacity: [0.7, 1, 0.7]
          }} 
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          {isVisible ? "🌀 ПРОКРУЧИВАЙТЕ ДАЛЬШЕ" : "⌛ НАЧНИТЕ ПРОКРУТКУ"}
        </motion.div>
      </motion.div>

      <div className="background-elements">
        <motion.div 
          className="bg-grid"
          style={{ y: backgroundY, scale }}
        />
        <motion.div 
          className="floating-shapes shape-1"
          animate={{
            y: [0, -40, 0],
            rotate: [0, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="floating-shapes shape-2"
          animate={{
            y: [0, 30, 0],
            rotate: [0, -15, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>
    </section>
  );
};

// Секция с навыками
const SkillsSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const skills = [
    {
      icon: "⚛️",
      title: "Frontend Разработка",
      description: "Создание современных пользовательских интерфейсов с React, Vue и Angular",
      technologies: ["React", "Vue.js", "TypeScript", "Tailwind CSS"]
    },
    {
      icon: "🔧",
      title: "Backend Разработка",
      description: "Разработка серверной части приложений и REST API",
      technologies: ["Node.js", "Python", "PostgreSQL", "MongoDB"]
    },
    {
      icon: "📱",
      title: "Мобильная Разработка",
      description: "Создание кроссплатформенных мобильных приложений",
      technologies: ["React Native", "Flutter", "iOS", "Android"]
    },
    {
      icon: "🎨",
      title: "UI/UX Дизайн",
      description: "Проектирование пользовательских интерфейсов и пользовательского опыта",
      technologies: ["Figma", "Adobe XD", "Prototyping", "User Research"]
    }
  ];

  return (
    <section ref={containerRef} className="interactive-features">
      <motion.div 
        className="features-background"
        style={{ scale, y }}
      />
      
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2
            animate={{ 
              backgroundPosition: ['0%', '100%', '0%'],
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              background: "linear-gradient(90deg, #ff6c00, #00c6ff, #a855f7, #ff6c00)",
              backgroundSize: "300% auto",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent"
            }}
          >
            МОИ НАВЫКИ
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Полный спектр технологий и инструментов для создания цифровых продуктов
          </motion.p>
        </motion.div>

        <div className="features-grid-interactive">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              className="interactive-card"
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 1.2, 
                delay: index * 0.2,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              viewport={{ once: true, amount: 0.5, margin: "-100px" }}
              whileHover={{ 
                scale: 1.05, 
                y: -15,
                transition: { duration: 0.5, ease: "easeOut" }
              }}
            >
              <motion.div 
                className="card-icon"
                animate={{ 
                  rotate: [0, 10, -5, 0],
                  scale: [1, 1.1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  delay: index * 0.5,
                  ease: "easeInOut"
                }}
              >
                {skill.icon}
              </motion.div>
              
              <h3>{skill.title}</h3>
              <p>{skill.description}</p>
              
              <div className="tech-tags">
                {skill.technologies.map((tech, techIndex) => (
                  <motion.span 
                    key={techIndex}
                    className="tech-tag"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 + techIndex * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
              
              <motion.div 
                className="card-glow"
                animate={{ 
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "linear",
                  delay: index * 0.3
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Секция опыта работы
const ExperienceSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const experiences = [
    { number: "5+", label: "Лет опыта", suffix: "" },
    { number: "50+", label: "Завершенных проектов", suffix: "" },
    { number: "30+", label: "Довольных клиентов", suffix: "" },
    { number: "15", label: "Технологий освоено", suffix: "+" }
  ];

  return (
    <section ref={containerRef} className="stats-section">
      <motion.div 
        className="stats-background"
        style={{ scale, y }}
      />
      
      <div className="container">
        <motion.div 
          className="stats-grid"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              className="stat-item"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.15,
                ease: "easeOut" 
              }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="stat-number"
                animate={{ 
                  scale: [1, 1.1, 1],
                  textShadow: [
                    "0 0 0px rgba(255,108,0,0)",
                    "0 0 20px rgba(255,108,0,0.5)",
                    "0 0 0px rgba(255,108,0,0)"
                  ]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  delay: index * 0.5
                }}
              >
                {exp.number}
                <span className="stat-suffix">{exp.suffix}</span>
              </motion.div>
              <motion.div 
                className="stat-label"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.15 + 0.3 }}
              >
                {exp.label}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

function App() {
  const aboutMe = [
    { 
      title: "Веб-разработка", 
      description: "Создание современных адаптивных веб-приложений с использованием последних технологий",
      icon: "💻"
    },
    { 
      title: "UI/UX Дизайн", 
      description: "Проектирование интуитивных интерфейсов с фокусом на пользовательский опыт",
      icon: "🎨"
    },
    { 
      title: "Мобильная разработка", 
      description: "Разработка кроссплатформенных мобильных приложений для iOS и Android",
      icon: "📱"
    },
    { 
      title: "Оптимизация", 
      description: "Повышение производительности и скорости загрузки веб-приложений",
      icon: "⚡"
    },
    { 
      title: "Тестирование", 
      description: "Гарантия качества через автоматизированное и ручное тестирование",
      icon: "🔍"
    },
    { 
      title: "Консалтинг", 
      description: "Техническое консультирование и архитектурные решения для проектов",
      icon: "🚀"
    },
  ];

  const tickerItems = aboutMe.map(item => item.title);

  return (
    <div className="app">
      {/* Hero секция */}
      <section className="hero">
        <SmoothParallaxStars />
        
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 80, skewX: -10 }}
            animate={{ opacity: 1, y: 0, skewX: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          >
            ПРИВЕТ, Я <span className="highlight">ВЕБ-РАЗРАБОТЧИК</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Создаю современные цифровые продукты с фокусом на пользовательский опыт и производительность
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
          >
            <motion.button 
              className="btn-primary"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              Связаться со мной
            </motion.button>
            <motion.button 
              className="btn-secondary"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              Скачать резюме
            </motion.button>
          </motion.div>
        </div>

        <div className="ticker-section">
          <div className="ticker-label">
            <motion.span
              animate={{ 
                color: ["#ff6c00", "#00c6ff", "#a855f7", "#ff6c00"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ОСНОВНЫЕ НАПРАВЛЕНИЯ
            </motion.span>
          </div>
          <VerticalTicker items={tickerItems} speed={50} />
        </div>

        <motion.div 
          className="hero-floating-elements"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 8, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="hero-vignette"></div>
      </section>

      {/* Секция с проектами */}
      <ProjectsScrollSection />

      {/* Секция с навыками */}
      <SkillsSection />

      {/* Секция с опытом */}
      <ExperienceSection />

      {/* Секция "Обо мне" */}
      <section className="features-grid">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2>Чем я занимаюсь</h2>
            <p>Полный цикл разработки - от идеи до запуска продукта</p>
          </motion.div>

          <div className="features-grid-content">
            {aboutMe.map((item, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.1, 
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true, amount: 0.3, margin: "-50px" }}
                whileHover={{ 
                  scale: 1.03, 
                  y: -8,
                  transition: { duration: 0.4, ease: "easeOut" }
                }}
              >
                <div className="feature-card-glow"></div>
                <div className="feature-icon">{item.icon}</div>
                <div className="feature-card-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Бегущая строка с технологиями */}
      <section className="continuous-ticker-section">
        <motion.div
          className="continuous-ticker"
          animate={{ x: ['0%', '-100%'] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          {[
            "React", "Vue.js", "TypeScript", "Node.js", "Python", 
            "MongoDB", "PostgreSQL", "AWS", "Docker", "Figma",
            "React Native", "GraphQL", "Next.js", "Tailwind CSS", "Git"
          ].map((tech, index) => (
            <motion.div 
              key={index} 
              className="ticker-word" 
              whileHover={{ 
                scale: 1.15, 
                color: "#ff6c00",
                y: -8
              }} 
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {tech}
              <motion.span 
                className="dot"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: index * 0.1 }}
              >
                •
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Футер */}
      <motion.footer 
        className="footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="container">
          <motion.div
            className="footer-content"
            initial={{ y: 40 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h3>ГОТОВЫ К СОТРУДНИЧЕСТВУ?</h3>
            <p>Давайте создадим что-то удивительное вместе. Свяжитесь со мной для обсуждения вашего проекта</p>
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={() => window.location.href = 'mailto:your.email@example.com'}
            >
              Начать проект
            </motion.button>
          </motion.div>
          
          <motion.div 
            className="footer-info"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="contact-info">
              <p>📧 your.em</p>
              <p>📱 +993 (64) 00 - 53 - 74</p>
              <p>📍 Ашхабад, Туркменистан</p>
            </div>
            <div className="social-links">
              <motion.a whileHover={{ scale: 1.2 }}>GitHub</motion.a>
              <motion.a whileHover={{ scale: 1.2 }}>LinkedIn</motion.a>
              <motion.a whileHover={{ scale: 1.2 }}>Telegram</motion.a>
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;