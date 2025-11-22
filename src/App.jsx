import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import './App.css';

// Компонент вертикального тикера (бегущей строки)
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
          <div key={index} className="ticker-item">
            {item}
          </div>
        ))}
        <div className="ticker-item">
          {items[0]}
        </div>
      </motion.div>
    </div>
  );
};

// Компонент горизонтальной прокрутки с продуктами
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
  
  // --- ДАННЫЕ ВАШИХ ПРОДУКТОВ ---
  // ВАЖНО: Замените эти данные на свои продукты.
  // Поместите изображения в папку `public/images/` вашего прое
  const scrollItems = [
    {
      title: "Процессор 'Квант'",
      description: "Непревзойденная мощность для самых требовательных задач.",
      color: "#ff6c00",
      image: "/images/processor.png"  
    },
    {
      title: "Видеокарта 'Фотон'",
      description: "Фотореалистичная графика нового поколения.",
      color: "#00c6ff",
      image: "/images/videocard.png" 
    },
    {
      title: "Материнская плата 'Генезис'",
      description: "Надежная основа для вашей идеальной сборки.",
      color: "#e91e63",
      image: "/images/motherboard.png" // Пример пути
    },
    {
      title: "SSD 'Импульс'",
      description: "Молниеносная скорость загрузки игр и приложений.",
      color: "#a855f7",
      image: "/images/ssd.png" // Пример пути
    },
    {
      title: "ОЗУ 'Вектор'",
      description: "Высокочастотная память для максимальной производительности.",
      color: "#10b981",
      image: "/images/ram.png" // Пример п
    },
    {
      title: "Корпус 'Цитадель'",
      description: "Футуристичный дизайн и продуманное охлаждение.",
      color: "#f59e0b",
      image: "/images/case.png" 
    },
  ];

  return (
    <section ref={containerRef} className="horizontal-scroll-wrapper">
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
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
              viewport={{ once: true, margin: "-150px" }}
              whileHover={{ y: -15, transition: { duration: 0.3 } }}
            >
              <div className="card-inner" style={{ '--glow-color': item.color }}>
                <div className="card-glare"></div>
                
                {/* Контейнер для изображения продукта */}
                <motion.div 
                  className="card-image-container"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                >
                  <img src={item.image} alt={item.title} className="product-image" />
                </motion.div>

                {/* Контейнер для текста */}
                <div className="card-text-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
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
      >
        <div className="scroll-progress-bar">
          <motion.div className="scroll-progress-fill" style={{ scaleX: scrollYProgress }}/>
        </div>
        <motion.div className="scroll-hint" animate={{ y: [-3, 3, -3] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
          {isVisible ? "СИСТЕМА АКТИВИРОВАНА" : "НАЧНИТЕ ПРОКРУТКУ"}
        </motion.div>
      </motion.div>

      <div className="background-elements">
        <motion.div className="bg-grid" />
      </div>
    </section>
  );
};

function App() {
  const features = [
    { title: "Простой API", description: "Интуитивный API, который легко освоить." },
    { title: "Трансформации", description: "Независимая анимация x, y, вращения и других свойств." },
    { title: "Анимация прокрутки", description: "Плавная, аппаратно-ускоренная анимация при скролле." },
    { title: "Анимация выхода", description: "Легкая анимация элементов при их исчезновении со страницы." },
    { title: "Жесты", description: "Нативная поддержка жестов наведения, нажатия и перетаскивания." },
    { title: "Анимация макета", description: "Анимация переходов между различными состояниями макета." },
  ];

  const tickerItems = features.map(feature => feature.title);

  return (
    <div className="app">
      <section className="hero">
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 50, skewX: -10 }}
            animate={{ opacity: 1, y: 0, skewX: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            
             <span className="highlight">БРЕНД</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            Представляем новое поколение высокопроизводительных решений.
          </motion.p>
        </div>

        <div className="ticker-section">
          <div className="ticker-label"><span>КЛЮЧЕВЫЕ ОСОБЕННОСТИ</span></div>
          <VerticalTicker items={tickerItems} speed={40} />
        </div>
        <div className="hero-vignette"></div>
      </section>

      <HorizontalScrollSection />

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
            <p>Полный обзор всех возможностей наших технологий.</p>
          </motion.div>

          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.5 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="feature-card-glow"></div>
              <div className="feature-card-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      <section className="continuous-ticker-section">
        <motion.div
          className="continuous-ticker"
          animate={{ x: ['0%', '-100%'] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <motion.div key={index} className="ticker-word" whileHover={{ scale: 1.1, color: "#ff6c00" }} transition={{ duration: 0.3 }}>
              {item}
              <span className="dot">•</span>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}

export default App;