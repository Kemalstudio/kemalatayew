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

  const scrollItems = [
    {
      title: "Процессор 'Квант'",
      description: "Непревзойденная мощность для самых требовательных задач.",
      color: "#ff6c00",
      image: "/images/processor.png",
      specs: ["8 ядер", "5.2 ГГц", "128 МБ кэш"]
    },
    {
      title: "Видеокарта 'Фотон'",
      description: "Фотореалистичная графика нового поколения.",
      color: "#00c6ff",
      image: "/images/videocard.png",
      specs: ["24 ГБ GDDR6X", "RTX ускорение", "4K 240FPS"]
    },
    {
      title: "Материнская плата 'Генезис'",
      description: "Надежная основа для вашей идеальной сборки.",
      color: "#e91e63",
      image: "/images/motherboard.png",
      specs: ["PCIe 5.0", "4 слота M.2", "Wi-Fi 6E"]
    },
    {
      title: "SSD 'Импульс'",
      description: "Молниеносная скорость загрузки игр и приложений.",
      color: "#a855f7",
      image: "/images/ssd.png",
      specs: ["7 ГБ/с чтение", "6.5 ГБ/с запись", "2 ТБ память"]
    },
    {
      title: "ОЗУ 'Вектор'",
      description: "Высокочастотная память для максимальной производительности.",
      color: "#10b981",
      image: "/images/ram.png",
      specs: ["DDR5 6400 МГц", "CL32 тайминги", "RGB подсветка"]
    },
    {
      title: "Корпус 'Цитадель'",
      description: "Футуристичный дизайн и продуманное охлаждение.",
      color: "#f59e0b",
      image: "/images/case.png",
      specs: ["Температурное стекло", "4 вентилятора", "USB-C фронтальный"]
    },
    {
      title: "Блок питания 'Титан'",
      description: "Стабильное питание для вашей системы.",
      color: "#6366f1",
      image: "/images/psu.png",
      specs: ["1200W 80+ Platinum", "Полная модульность", "12-летняя гарантия"]
    },
    {
      title: "Охлаждение 'Арктика'",
      description: "Эффективное охлаждение для разгона.",
      color: "#06b6d4",
      image: "/images/cooler.png",
      specs: ["360mm радиатор", "6 тепловых трубок", "ARGB синхронизация"]
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
          ИЗУЧИТЕ НАШ АРСЕНАЛ
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Погрузитесь в мир наших технологий с помощью интерактивной прокрутки
        </motion.p>
      </div>

      <div className="horizontal-scroll-container">
        <motion.div
          className="horizontal-scroll-content"
          style={{ x: smoothX }}
        >
          {scrollItems.map((item, index) => (
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
              <div className="card-inner" style={{ '--glow-color': item.color }}>
                <div className="card-glare"></div>
                
                <motion.div 
                  className="product-index"
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
                    src={item.image} 
                    alt={item.title} 
                    className="product-image" 
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
                    {item.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 + 0.4 }}
                  >
                    {item.description}
                  </motion.p>
                  
                  <motion.ul className="specs-list">
                    {item.specs.map((spec, specIndex) => (
                      <motion.li 
                        key={specIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: index * 0.15 + 0.5 + specIndex * 0.1,
                          duration: 0.6 
                        }}
                      >
                        {spec}
                      </motion.li>
                    ))}
                  </motion.ul>
                  
                  <motion.button 
                    className="product-button"
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: item.color,
                      y: -2
                    }}
                    whileTap={{ scale: 0.95 }}
                    style={{ borderColor: item.color }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 + 0.8 }}
                  >
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Узнать больше ›
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
          {isVisible ? "🌀 СИСТЕМА АКТИВИРОВАНА" : "⌛ НАЧНИТЕ ПРОКРУТКУ"}
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

// Секция с интерактивными возможностями
const InteractiveFeaturesSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const features = [
    {
      icon: "🚀",
      title: "Максимальная производительность",
      description: "Оптимизированная архитектура для игр и профессиональных приложений",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: "❄️",
      title: "Эффективное охлаждение",
      description: "Инновационная система охлаждения с минимальным уровнем шума",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: "⚡",
      title: "Энергоэффективность",
      description: "Передовые технологии энергосбережения без компромиссов в мощности",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: "🔧",
      title: "Простота установки",
      description: "Интуитивно понятный монтаж и настройка для любого пользователя",
      gradient: "from-orange-500 to-red-500"
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
            ИННОВАЦИОННЫЕ ВОЗМОЖНОСТИ
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Откройте для себя технологии будущего уже сегодня
          </motion.p>
        </motion.div>

        <div className="features-grid-interactive">
          {features.map((feature, index) => (
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
                {feature.icon}
              </motion.div>
              
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              
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

// 
const StatsSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const stats = [
    { number: "99.9%", label: "Надежность системы", suffix: "" },
    { number: "2.5x", label: "Выше производительность", suffix: "" },
    { number: "45", label: "Дней бесперебойной работы", suffix: "" },
    { number: "10", label: "Лет гарантии", suffix: "+" }
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
      title: "Простой API", 
      description: "Интуитивный API, который легко освоить.",
      icon: "⚡"
    },
    { 
      title: "Трансформации", 
      description: "Независимая анимация x, y, вращения и других свойств.",
      icon: "🔄"
    },
    { 
      title: "Анимация прокрутки", 
      description: "Плавная, аппаратно-ускоренная анимация при скролле.",
      icon: "📜"
    },
    { 
      title: "Анимация выхода", 
      description: "Легкая анимация элементов при их исчезновении со страницы.",
      icon: "👋"
    },
    { 
      title: "Жесты", 
      description: "Нативная поддержка жестов наведения, нажатия и перетаскивания.",
      icon: "👆"
    },
    { 
      title: "Анимация макета", 
      description: "Анимация переходов между различными состояниями макета.",
      icon: "🎭"
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
            ТЕХНОЛОГИИ <span className="highlight">БУДУЩЕГО</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Представляем новое поколение высокопроизводительных решений для геймеров и профессионалов
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
              Начать сборку
            </motion.button>
            <motion.button 
              className="btn-secondary"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              Смотреть обзор
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
              КЛЮЧЕВЫЕ ОСОБЕННОСТИ
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

      {/* Основная горизонтальная секция */}
      <HorizontalScrollSection />

      {/* Секция с интерактивными возможностями */}
      <InteractiveFeaturesSection />

      {/* Секция со статистикой */}
      <StatsSection />

      {/* Сетка характеристик */}
      <section className="features-grid">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2>Технические характеристики</h2>
            <p>Полный обзор всех возможностей наших технологий</p>
          </motion.div>

          <div className="features-grid-content">
            {features.map((feature, index) => (
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
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-card-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
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
            <h3>ГОТОВЫ К ИННОВАЦИЯМ?</h3>
            <p>Присоединяйтесь к будущему технологий сегодня</p>
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              Связаться с нами
            </motion.button>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;