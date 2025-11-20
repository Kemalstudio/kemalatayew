import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import './App.css';

// --- СЦЕНА 1: ГЕРОЙ - КИНЕМАТОГРАФИЧЕСКИЙ ПАРАЛЛАКС ТЕКСТА ---
// Используем пружинную физику для невероятной плавности
const HeroSection = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  });

  const springConfig = { stiffness: 150, damping: 30, restDelta: 0.001 };

  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 2.5]);
  const scaleSpring = useSpring(scale, springConfig);

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const ySpring = useSpring(y, springConfig);

  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '500%']);
  const textYSpring = useSpring(textY, springConfig);

  return (
    <section ref={targetRef} className="hero-container">
      <div className="hero-sticky-wrapper">
        <motion.div className="hero-background" style={{ scale: scaleSpring, y: ySpring }} />
        <motion.div className="hero-text-wrapper" style={{ y: textYSpring }}>
          <h1>REVOLUTION</h1>
        </motion.div>
      </div>
    </section>
  );
};

// --- СЦЕНА 2: ГОРИЗОНТАЛЬНЫЙ СКРОЛЛ - ГАЛЕРЕЯ БУДУЩЕГО ---
// Показываем контент в стиле Apple
const HorizontalScrollSection = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '-300%']);

  const cards = [
    { id: 1, title: 'ДИЗАЙН', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800' },
    { id: 2, title: 'МОЩНОСТЬ', img: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800' },
    { id: 3, title: 'ИННОВАЦИИ', img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800' },
    { id: 4, title: 'БУДУЩЕЕ', img: 'https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=800' },
  ];

  return (
    <section ref={targetRef} className="horizontal-scroll-container">
      <div className="horizontal-sticky-wrapper">
        <motion.div style={{ x }} className="horizontal-cards-wrapper">
          {cards.map(card => (
            <div className="card" key={card.id}>
              <h2>{card.title}</h2>
              <img src={card.img} alt={card.title} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};


// --- СЦЕНА 3: СЕТКА С ЗАДЕРЖКОЙ - ЭНЕРГИЯ В ДЕЙСТВИИ ---
// Элементы появляются один за другим с красивым эффектом
const StaggeredGridSection = () => {
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15, // Задержка между появлением дочерних элементов
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
        visible: { 
            opacity: 1, 
            y: 0, 
            filter: 'blur(0px)',
            transition: { duration: 0.8, ease: 'easeOut' } 
        },
    };

    return (
        <section className="staggered-grid-container">
            <motion.h2 variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>КЛЮЧЕВЫЕ ОСОБЕННОСТИ</motion.h2>
            <motion.div 
              className="grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
                {[...Array(6)].map((_, i) => (
                    <motion.div className="grid-item" key={i} variants={itemVariants} />
                ))}
            </motion.div>
        </section>
    );
};


// --- СЦЕНА 4: ФИНАЛ - АНИМАЦИЯ SVG И ТЕКСТА ---
// Эффектное завершение с отрисовкой линии и появлением текста
const SvgFinaleSection = () => {
    return (
        <section className="finale-container">
            <svg viewBox="0 0 500 100">
                <motion.path
                    d="M 20 50 Q 125 0, 250 50 T 480 50"
                    fill="transparent"
                    stroke="#00f2ea"
                    strokeWidth="4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    viewport={{ once: true, amount: 0.5 }}
                />
            </svg>
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1.5 }}
                viewport={{ once: true, amount: 0.5 }}
            >
                ВЫ НА ГРАНИ НОВОГО
            </motion.h1>
        </section>
    );
};


// --- ГЛАВНЫЙ КОМПОНЕНТ APP ---
function App() {
  return (
    <div className="app-container">
      <HeroSection />
      <HorizontalScrollSection />
      <StaggeredGridSection />
      <SvgFinaleSection />
    </div>
  );
}

export default App;