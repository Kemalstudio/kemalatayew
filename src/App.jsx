import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, useMotionValue, useVelocity, useAnimationFrame } from 'framer-motion';
import './App.css';

// Компонент вертикального тикера с улучшенной анимацией
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
          stiffness: 200,
          damping: 25
        }}
      >
        {items.map((item, index) => (
          <motion.div 
            key={index} 
            className="ticker-item"
            whileHover={{ scale: 1.05, color: "#ff6c00" }}
            transition={{ duration: 0.3 }}
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

// Параллакс секция с звездным фоном
const ParallaxStars = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, 400]);
  const y3 = useTransform(scrollY, [0, 1000], [0, 600]);

  return (
    <div className="stars-container">
      <motion.div className="stars-layer stars-1" style={{ y: y1 }} />
      <motion.div className="stars-layer stars-2" style={{ y: y2 }} />
      <motion.div className="stars-layer stars-3" style={{ y: y3 }} />
    </div>
  );
};

// Анимированный фон с частицами
const ParticleBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Настройка размера canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Создание частиц
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: `rgba(255, 108, 0, ${Math.random() * 0.3 + 0.1})`
      });
    }
    
    // Анимация частиц
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Возврат частиц на экран при выходе за границы
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        
        // Рисование частицы
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="particle-background" />;
};

// Компонент с параллакс эффектом
const ParallaxElement = ({ children, speed = 0.5, ...props }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 1000 * speed]);
  
  return (
    <motion.div style={{ y }} {...props}>
      {children}
    </motion.div>
  );
};

// Компонент горизонтальной прокрутки с улучшенными эффектами
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

  const xTransform = useTransform(scrollYProgress, [0, 1], ['5%', '-125%']);
  const smoothX = useSpring(xTransform, { stiffness: 150, damping: 40, mass: 0.5 });
  
  // Параллакс эффекты для фона
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  
  // Данные продуктов
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
      <ParallaxStars />
      
      <div className="scroll-section-header">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          ИЗУЧИТЕ НАШ АРСЕНАЛ
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Погрузитесь в мир наших технологий с помощью интерактивной прокрутки.
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
                duration: 0.7, 
                delay: index * 0.1, 
                ease: "easeOut",
                rotateY: { duration: 0.8 }
              }}
              viewport={{ once: true, margin: "-150px" }}
              whileHover={{ 
                y: -15, 
                scale: 1.02,
                transition: { duration: 0.3 } 
              }}
            >
              <div className="card-inner" style={{ '--glow-color': item.color }}>
                <div className="card-glare"></div>
                
                {/* Индикатор номера продукта */}
                <motion.div 
                  className="product-index"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {String(index + 1).padStart(2, '0')}
                </motion.div>

                {/* Контейнер для изображения продукта */}
                <motion.div 
                  className="card-image-container"
                  whileHover={{ scale: 1.05, rotateZ: 2 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.img 
                    src={item.image} 
                    alt={item.title} 
                    className="product-image" 
                    whileHover={{ rotateY: 10 }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.div 
                    className="image-glow"
                    animate={{ 
                      opacity: [0.3, 0.7, 0.3],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>

                {/* Контейнер для текста */}
                <div className="card-text-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  
                  {/* Спецификации */}
                  <motion.ul className="specs-list">
                    {item.specs.map((spec, specIndex) => (
                      <motion.li 
                        key={specIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 + specIndex * 0.1 }}
                      >
                        {spec}
                      </motion.li>
                    ))}
                  </motion.ul>
                  
                  {/* Кнопка действия */}
                  <motion.button 
                    className="product-button"
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: item.color 
                    }}
                    whileTap={{ scale: 0.95 }}
                    style={{ borderColor: item.color }}
                  >
                    Узнать больше
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="scroll-progress-container"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        style={{ opacity }}
      >
        <div className="scroll-progress-bar">
          <motion.div 
            className="scroll-progress-fill" 
            style={{ 
              scaleX: scrollYProgress,
              background: "linear-gradient(90deg, #ff6c00, #00c6ff)"
            }}
          />
        </div>
        <motion.div 
          className="scroll-hint" 
          animate={{ y: [-3, 3, -3] }} 
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {isVisible ? "СИСТЕМА АКТИВИРОВАНА" : "НАЧНИТЕ ПРОКРУТКУ"}
        </motion.div>
      </motion.div>

      <div className="background-elements">
        <motion.div 
          className="bg-grid"
          style={{ y: backgroundY }}
        />
        <motion.div 
          className="floating-shapes"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </section>
  );
};

// Новая секция с интерактивными карточками
const InteractiveFeaturesSection = () => {
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
    <section className="interactive-features">
      <ParticleBackground />
      
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            animate={{ 
              backgroundPosition: ['0%', '100%', '0%'],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              background: "linear-gradient(90deg, #ff6c00, #00c6ff, #ff6c00)",
              backgroundSize: "200% auto",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent"
            }}
          >
            ИННОВАЦИОННЫЕ ВОЗМОЖНОСТИ
          </motion.h2>
          <p>Откройте для себя технологии будущего уже сегодня</p>
        </motion.div>

        <div className="features-grid-interactive">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="interactive-card"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true, amount: 0.5 }}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              <motion.div 
                className="card-icon"
                animate={{ 
                  rotate: [0, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: index * 0.5
                }}
              >
                {feature.icon}
              </motion.div>
              
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              
              <motion.div 
                className="card-glow"
                animate={{ 
                  opacity: [0.3, 0.7, 0.3],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Секция с параллакс статистикой
const StatsSection = () => {
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  const stats = [
    { number: "99.9%", label: "Надежность системы", suffix: "" },
    { number: "2.5x", label: "Выше производительность", suffix: "" },
    { number: "45", label: "Дней бесперебойной работы", suffix: "" },
    { number: "10", label: "Лет гарантии", suffix: "+" }
  ];

  return (
    <section className="stats-section">
      <motion.div 
        className="stats-background"
        style={{ scale, opacity }}
      />
      
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="stat-number"
                animate={{ 
                  scale: [1, 1.1, 1],
                  color: ["#ffffff", "#ff6c00", "#ffffff"]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: index * 0.5
                }}
              >
                {stat.number}
                <span className="stat-suffix">{stat.suffix}</span>
              </motion.div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
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
        <ParallaxStars />
        
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 50, skewX: -10 }}
            animate={{ opacity: 1, y: 0, skewX: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            ТЕХНОЛОГИИ <span className="highlight">БУДУЩЕГО</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            Представляем новое поколение высокопроизводительных решений для геймеров и профессионалов
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.button 
              className="btn-primary"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Начать сборку
            </motion.button>
            <motion.button 
              className="btn-secondary"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Смотреть обзор
            </motion.button>
          </motion.div>
        </div>

        <div className="ticker-section">
          <div className="ticker-label">
            <motion.span
              animate={{ 
                color: ["#ff6c00", "#00c6ff", "#ff6c00"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              КЛЮЧЕВЫЕ ОСОБЕННОСТИ
            </motion.span>
          </div>
          <VerticalTicker items={tickerItems} speed={40} />
        </div>

        {/* Анимированные элементы в hero секции */}
        <motion.div 
          className="hero-floating-elements"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="hero-vignette"></div>
      </section>

      {/* Основная горизонтальная секция */}
      <HorizontalScrollSection />

      {/* Секция с интерактивными  */}
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
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>Технические характеристики</h2>
            <p>Полный обзор всех возможностей наших технологий</p>
          </motion.div>

          <div className="features-grid-content">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1, 
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true, amount: 0.5 }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -5,
                  transition: { duration: 0.3 }
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
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <motion.div 
              key={index} 
              className="ticker-word" 
              whileHover={{ 
                scale: 1.1, 
                color: "#ff6c00",
                y: -5
              }} 
              transition={{ duration: 0.3 }}
            >
              {item}
              <span className="dot">•</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Футер */}
      <motion.footer 
        className="footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <motion.div
            className="footer-content"
            initial={{ y: 30 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3>ГОТОВЫ К ИННОВАЦИЯМ?</h3>
            <p>Присоединяйтесь к будущему технологий сегодня</p>
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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