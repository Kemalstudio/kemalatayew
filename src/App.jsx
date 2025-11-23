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

// Компонент Crazy 3D Image Slider
const Crazy3DImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(0); // 0: next, 1: prev
  const [isPaused, setIsPaused] = useState(false); // Состояние для паузы при наведении

  const images = [
    {
      src: "/images/slider1.jpg",
      title: "React Applications",
      description: "Современные веб-приложения"
    },
    {
      src: "/images/slider2.jpg",
      title: "Mobile Development",
      description: "Кроссплатформенные мобильные приложения"
    },
    {
      src: "/images/slider3.jpg",
      title: "UI/UX Design",
      description: "Интуитивные пользовательские интерфейсы"
    },
    {
      src: "/images/slider4.jpg",
      title: "Backend Solutions",
      description: "Мощные серверные решения"
    },
    {
      src: "/images/slider5.jpg",
      title: "Database Architecture",
      description: "Оптимизированные базы данных"
    },
    {
      src: "/images/slider6.jpg",
      title: "Cloud Deployment",
      description: "Облачные решения и хостинг"
    }
  ];

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(0);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsAnimating(false), 1500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsAnimating(false), 1500);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setDirection(index > currentIndex ? 0 : 1);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 1500);
  };

  // useEffect для автоматического вращения
  useEffect(() => {
    if (isPaused || isAnimating) {
      return;
    }

    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // Интервал 4 секунды

    return () => clearInterval(interval);
  }, [isAnimating, isPaused, currentIndex]);


  // Вычисляем позиции для всех изображений в 3D пространстве
  const getImagePosition = (index) => {
    const total = images.length;
    const angle = (360 / total) * (index - currentIndex);
    const radius = 400; // Радиус круга

    // Для плавного вращения учитываем направление
    const offset = isAnimating ? (direction === 0 ? -360 : 360) : 0;
    const currentAngle = angle + offset;

    const x = Math.sin((currentAngle * Math.PI) / 180) * radius;
    const z = -Math.cos((currentAngle * Math.PI) / 180) * radius;
    const rotationY = -currentAngle;

    return {
      transform: `translate3d(${x}px, 0px, ${z}px) rotateY(${rotationY}deg)`,
      opacity: Math.abs(z) > 350 ? 0 : 1 - Math.abs(z) / 500,
      zIndex: Math.round(100 - Math.abs(z))
    };
  };

  return (
    <section className="crazy-3d-slider-section">
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
          className="slider-3d-container"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="slider-3d-viewport">
            <div className="slider-3d-scene">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  className={`slider-3d-item ${index === currentIndex ? 'active' : ''}`}
                  style={getImagePosition(index)}
                  initial={false}
                  animate={{
                    scale: index === currentIndex ? 1.1 : 0.8,
                    filter: index === currentIndex ? 'brightness(1)' : 'brightness(0.7)'
                  }}
                  transition={{
                    duration: 1.5,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{
                    scale: index === currentIndex ? 1.15 : 0.9,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="image-container">
                    <motion.img
                      src={image.src}
                      alt={image.title}
                      className="slider-image"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="image-glow-effect"></div>
                  </div>

                  <motion.div
                    className="image-info"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: index === currentIndex ? 1 : 0,
                      y: index === currentIndex ? 0 : 20
                    }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h3>{image.title}</h3>
                    <p>{image.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Элементы управления */}
          <div className="slider-controls">
            <motion.button
              className="slider-btn prev-btn"
              onClick={prevSlide}
              whileHover={{ scale: 1.1, backgroundColor: "#ff6c00" }}
              whileTap={{ scale: 0.9 }}
              disabled={isAnimating}
            >
              <motion.span
                animate={{ x: [-2, 2, -2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ‹
              </motion.span>
            </motion.button>

            <motion.button
              className="slider-btn next-btn"
              onClick={nextSlide}
              whileHover={{ scale: 1.1, backgroundColor: "#00c6ff" }}
              whileTap={{ scale: 0.9 }}
              disabled={isAnimating}
            >
              <motion.span
                animate={{ x: [2, -2, 2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ›
              </motion.span>
            </motion.button>
          </div>

          {/* Индикаторы */}
          <div className="slider-indicators">
            {images.map((_, index) => (
              <motion.button
                key={index}
                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.8 }}
                animate={{
                  backgroundColor: index === currentIndex ? "#ff6c00" : "rgba(255,255,255,0.2)",
                  scale: index === currentIndex ? 1.2 : 1
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>

          {/* Информация о текущем слайде */}
          <motion.div
            className="current-slide-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="slide-counter"
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </motion.div>
          </motion.div>
        </div>

        {/* Фоновые элементы */}
        <div className="slider-background-elements">
          <motion.div
            className="bg-orb orb-1"
            animate={{
              y: [0, -40, 0],
              x: [0, 20, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="bg-orb orb-2"
            animate={{
              y: [0, 30, 0],
              x: [0, -25, 0],
              rotate: [0, -180, -360]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div
            className="bg-orb orb-3"
            animate={{
              y: [0, -25, 0],
              x: [0, 15, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>
      </div>
    </section>
  );
};

// Компонент горизонтальной прокрутки
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

  const portfolioProjects = [
    {
      title: "E-Commerce Platform",
      description: "Полнофункциональная платформа электронной коммерции с React и Node.js",
      color: "#ff6c00",
      image: "/images/ecommerce.png",
      tech: ["React", "Node.js", "MongoDB", "Stripe API"]
    },
    {
      title: "Task Management App",
      description: "Приложение для управления задачами с реальным временем обновления",
      color: "#00c6ff",
      image: "/images/taskapp.png",
      tech: ["React Native", "Firebase", "Redux", "Push Notifications"]
    },
    {
      title: "Social Media Dashboard",
      description: "Панель управления социальными сетями с аналитикой в реальном времени",
      color: "#e91e63",
      image: "/images/dashboard.png",
      tech: ["Vue.js", "Express", "PostgreSQL", "Chart.js"]
    },
    {
      title: "Weather Forecast App",
      description: "Приложение прогноза погоды с красивым UI и офлайн-режимом",
      color: "#a855f7",
      image: "/images/weather.png",
      tech: ["React", "Weather API", "PWA", "Local Storage"]
    },
    {
      title: "Fitness Tracker",
      description: "Трекер фитнеса с мониторингом активности и целей",
      color: "#10b981",
      image: "/images/fitness.png",
      tech: ["React Native", "Health APIs", "GraphQL", "Apple HealthKit"]
    },
    {
      title: "Portfolio Website",
      description: "Анимированное портфолио с современным дизайном и интерактивностью",
      color: "#f59e0b",
      image: "/images/portfolio.png",
      tech: ["React", "Framer Motion", "Three.js", "GSAP"]
    },
    {
      title: "Chat Application",
      description: "Приложение реального времени чата с комнатами и файловым обменом",
      color: "#6366f1",
      image: "/images/chat.png",
      tech: ["Socket.io", "React", "Node.js", "File Upload"]
    },
    {
      title: "Learning Platform",
      description: "Образовательная платформа с курсами и системой прогресса",
      color: "#06b6d4",
      image: "/images/learning.png",
      tech: ["Next.js", "Prisma", "MySQL", "Video Streaming"]
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
          Исследуйте мои работы через интерактивную прокрутку
        </motion.p>
      </div>

      <div className="horizontal-scroll-container">
        <motion.div
          className="horizontal-scroll-content"
          style={{ x: smoothX }}
        >
          {portfolioProjects.map((project, index) => (
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
                    {project.tech.map((tech, techIndex) => (
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
                  >
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Посмотреть проект ›
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
          {isVisible ? "🌀 ПРОЕКТЫ ЗАГРУЖЕНЫ" : "⌛ НАЧНИТЕ ПРОКРУТКУ"}
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
      title: "Frontend Development",
      description: "React, Vue.js, TypeScript, Modern CSS, Responsive Design",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: "🔧",
      title: "Backend Development",
      description: "Node.js, Express, Python, REST APIs, Database Design",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: "📱",
      title: "Mobile Development",
      description: "React Native, iOS & Android, Cross-platform Solutions",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: "🛠️",
      title: "Tools & Technologies",
      description: "Git, Docker, AWS, CI/CD, Testing, Agile Methodology",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section ref={containerRef} className="skills-section">
      <motion.div
        className="skills-background"
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
            Технологии и инструменты, которые я использую для создания цифровых решений
          </motion.p>
        </motion.div>

        <div className="skills-grid">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              className="skill-card"
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
                className="skill-icon"
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

              <motion.div
                className="skill-glow"
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

// Секция статистики
const StatsSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const stats = [
    { number: "25", label: "Завершенных проектов", suffix: "+" },
    { number: "3", label: "Года опыта", suffix: "+" },
    { number: "15", label: "Довольных клиентов", suffix: "+" },
    { number: "99", label: "Успешных решений", suffix: "%" }
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
          {stats.map((stat, index) => (
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
                {stat.number}
                <span className="stat-suffix">{stat.suffix}</span>
              </motion.div>
              <motion.div
                className="stat-label"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.15 + 0.3 }}
              >
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
  const features = [
    {
      title: "React Development",
      description: "Современные React приложения с hooks и контекстом",
      icon: "⚛️"
    },
    {
      title: "Responsive Design",
      description: "Адаптивный дизайн для всех устройств и экранов",
      icon: "📱"
    },
    {
      title: "API Integration",
      description: "Интеграция с REST API и сторонними сервисами",
      icon: "🔌"
    },
    {
      title: "Database Design",
      description: "Проектирование и оптимизация баз данных",
      icon: "🗃️"
    },
    {
      title: "Mobile Apps",
      description: "Кроссплатформенные мобильные приложения",
      icon: "📲"
    },
    {
      title: "UI/UX Design",
      description: "Создание интуитивных пользовательских интерфейсов",
      icon: "🎨"
    },
  ];

  const tickerItems = features.map(feature => feature.title);

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
            JUNIOR <span className="highlight">FULL STACK</span> DEVELOPER
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Создаю современные веб и мобильные приложения с фокусом на пользовательский опыт и производительность
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
              ТЕХНОЛОГИИ
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

      {/* Основная горизонтальная секция с проекта */}
      <HorizontalScrollSection />

      {/* Секция с навыками */}
      <SkillsSection />

      {/* Секция со статистикой */}
      <StatsSection />

      {/* Crazy 3D Image Slider */}
      <Crazy3DImageSlider />

      {/* Сетка услуг */}
      <section className="services-grid">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2>Мои Услуги</h2>
            <p>Полный цикл разработки от идеи до запуска</p>
          </motion.div>

          <div className="services-grid-content">
            {features.map((service, index) => (
              <motion.div
                key={index}
                className="service-card"
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

      {/* Бегущая строка */}
      <section className="continuous-ticker-section">
        <motion.div
          className="continuous-ticker"
          animate={{ x: ['0%', '-100%'] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
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
              {item}
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
            <p>Давайте создадим что-то удивительное вместе</p>
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              Начать проект
            </motion.button>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;