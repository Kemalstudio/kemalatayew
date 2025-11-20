import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useVelocity, useAnimationFrame } from 'framer-motion';
import './App.css';

// --- СЦЕНА 0: ИНИЦИАЛИЗАЦИЯ С ПАРТИКЛАМИ ---
const ParticleBackground = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10
  }));

  return (
    <div className="particle-background">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// --- СЦЕНА 1: КИНЕМАТОГРАФИЧЕСКИЙ ГЕРОЙ С МНОГОСЛОЙНЫМ ПАРАЛЛАКСОМ ---
const HeroSection = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  // Многослойный параллакс
  const backgroundScale = useTransform(scrollYProgress, [0, 0.8], [1, 4]);
  const backgroundScaleSpring = useSpring(backgroundScale, springConfig);

  const midgroundScale = useTransform(scrollYProgress, [0, 0.6], [1, 2.5]);
  const midgroundScaleSpring = useSpring(midgroundScale, springConfig);

  const foregroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const foregroundYSpring = useSpring(foregroundY, springConfig);

  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '300%']);
  const textYSpring = useSpring(textY, springConfig);

  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const textOpacitySpring = useSpring(textOpacity, springConfig);

  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const rotateXSpring = useSpring(rotateX, springConfig);

  return (
    <section ref={targetRef} className="hero-container">
      <ParticleBackground />
      <div className="hero-sticky-wrapper">
        {/* Фоновый слой */}
        <motion.div 
          className="hero-background" 
          style={{ 
            scale: backgroundScaleSpring,
            rotateX: rotateXSpring
          }} 
        />
        
        {/* Средний слой */}
        <motion.div 
          className="hero-midground"
          style={{ 
            scale: midgroundScaleSpring,
            y: foregroundYSpring 
          }} 
        />
        
        {/* Передний слой */}
        <motion.div 
          className="hero-foreground"
          style={{ 
            y: foregroundYSpring 
          }} 
        />
        
        {/* Текст с параллаксом */}
        <motion.div 
          className="hero-text-wrapper" 
          style={{ 
            y: textYSpring,
            opacity: textOpacitySpring
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
          >
            BEYOND
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          >
            The next dimension of digital experience
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

// --- СЦЕНА 2: ИНТЕРАКТИВНАЯ ГОРИЗОНТАЛЬНАЯ ГАЛЕРЕЯ ---
const HorizontalScrollSection = () => {
  const targetRef = useRef(null);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '-300%']);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [0.8, 1]);

  const cards = [
    { 
      id: 1, 
      title: 'Kemal Atayew', 
      subtitle: 'Best Proffesianal Design',
      img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      color: '#00f2ea'
    },
    { 
      id: 2, 
      title: 'Kemal Atayew', 
      subtitle: 'Best Proffesianal Design',
      img: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800',
      color: '#ff6b6b'
    },
    { 
      id: 3, 
      title: 'Kemal Atayew', 
      subtitle: 'Best Proffesianal Design',
      img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
      color: '#ffd93d'
    },
    { 
      id: 4, 
      title: 'Kemal Atayew', 
      subtitle: 'Best Proffesianal Design',
      img: 'https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=800',
      color: '#6bcf7f'
    },
  ];

  return (
    <section ref={targetRef} className="horizontal-scroll-container">
      <div className="horizontal-sticky-wrapper">
        <motion.div 
          className="horizontal-content"
          style={{ 
            opacity,
            scale 
          }}
        >
          <motion.h2
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            НОВАЯ РЕАЛЬНОСТЬ
          </motion.h2>
          <motion.div 
            ref={containerRef}
            style={{ x }} 
            className="horizontal-cards-wrapper"
          >
            {cards.map((card, index) => (
              <motion.div 
                className="card" 
                key={card.id}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="card-content">
                  <h3 style={{ color: card.color }}>{card.title}</h3>
                  <p>{card.subtitle}</p>
                  <motion.img 
                    src={card.img} 
                    alt={card.title}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// --- СЦЕНА 3: МОРФИНГ СЕТКА С ГЛУБИНОЙ ---
const StaggeredGridSection = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 100, 
      rotateX: -45,
      filter: 'blur(20px)'
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      filter: 'blur(0px)',
      transition: { 
        duration: 1.2, 
        ease: [0.23, 1, 0.32, 1] 
      } 
    },
  };

  const features = [
    { title: "СКОРОСТЬ", desc: "Мгновенный отклик" },
    { title: "ЭЛЕГАНТНОСТЬ", desc: "Безупречный дизайн" },
    { title: "МОЩНОСТЬ", desc: "Неограниченные возможности" },
    { title: "ИНТУИЦИЯ", desc: "Интеллектуальный интерфейс" },
    { title: "БУДУЩЕЕ", desc: "Инновационные технологии" },
    { title: "ПРЕВОСХОДСТВО", desc: "Премиум качество" },
  ];

  return (
    <section className="staggered-grid-container">
      <motion.h2 
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        СОВЕРШЕНСТВО В ДЕТАЛЯХ
      </motion.h2>
      <motion.div 
        className="grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {features.map((feature, i) => (
          <motion.div 
            className="grid-item" 
            key={i} 
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              y: -10,
              transition: { type: "spring", stiffness: 400 }
            }}
          >
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
            <div className="grid-item-glow" />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

// --- СЦЕНА 4: ИНТЕРАКТИВНЫЙ SVG МОРФИНГ ---
const MorphingSVGSection = () => {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 3, 
        ease: "easeInOut",
      }
    }
  };

  return (
    <section className="morphing-svg-container">
      <div className="svg-wrapper">
        <svg viewBox="0 0 500 200">
          <motion.path
            d="M 50 100 Q 150 50, 250 100 T 450 100"
            fill="transparent"
            stroke="url(#gradient1)"
            strokeWidth="3"
            variants={pathVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          />
          <motion.path
            d="M 50 120 Q 200 80, 350 120 T 450 120"
            fill="transparent"
            stroke="url(#gradient2)"
            strokeWidth="2"
            variants={pathVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f2ea" />
              <stop offset="100%" stopColor="#0072ff" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff6b6b" />
              <stop offset="100%" stopColor="#ffd93d" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

// --- СЦЕНА 5: ЭПИЧЕСКИЙ ФИНАЛ С ТРАНСФОРМАЦИЕЙ ---
const FinaleSection = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.5, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ['100vh', '-100vh']);

  return (
    <section ref={targetRef} className="finale-container">
      <motion.div 
        className="finale-content"
        style={{ 
          scale,
          opacity,
          y 
        }}
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, type: "spring" }}
          viewport={{ once: true }}
        >
          БУДУЩЕЕ
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          viewport={{ once: true }}
        >
          НАЧИНАЕТСЯ СЕЙЧАС
        </motion.h2>
        <motion.div 
          className="finale-orb"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>
    </section>
  );
};

// --- ГЛАВНЫЙ КОМПОНЕНТ ---
function App() {
  return (
    <div className="app-container">
      <HeroSection />
      <HorizontalScrollSection />
      <StaggeredGridSection />
      <MorphingSVGSection />
      <FinaleSection />
    </div>
  );
}

export default App;