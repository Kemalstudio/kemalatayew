import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import './App.css';

// --- СЦЕНА 1: ГЕРОЙ С МНОГОСЛОЙНЫМ ПАРАЛЛАКСОМ ---
const HeroSection = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end start'],
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  // Многослойный параллакс для глубины
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const middlegroundY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const foregroundY = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);
  
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '200%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 1.5]);
  
  const backgroundYSpring = useSpring(backgroundY, springConfig);
  const middlegroundYSpring = useSpring(middlegroundY, springConfig);
  const foregroundYSpring = useSpring(foregroundY, springConfig);
  const textYSpring = useSpring(textY, springConfig);
  const textOpacitySpring = useSpring(textOpacity, springConfig);
  const scaleSpring = useSpring(scale, springConfig);

  return (
    <section ref={targetRef} className="hero-section">
      <div className="hero-sticky">
        {/* Фоновые слои для параллакса */}
        <motion.div 
          className="hero-layer background-layer"
          style={{ y: backgroundYSpring, scale: scaleSpring }}
        />
        <motion.div 
          className="hero-layer middleground-layer"
          style={{ y: middlegroundYSpring }}
        />
        <motion.div 
          className="hero-layer foreground-layer"
          style={{ y: foregroundYSpring }}
        />
        
        {/* Основной текст */}
        <motion.div 
          className="hero-content"
          style={{ 
            y: textYSpring,
            opacity: textOpacitySpring
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 2,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="hero-title"
          >
            ВЕЛИЧИЕ
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 0.8,
              duration: 1.5,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="hero-subtitle"
          >
            Исключительное качество в каждой детали
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

// --- СЦЕНА 2: ТЕКСТ С ПОЯВЛЕНИЕМ ПРИ СКРОЛЛЕ ---
const TextRevealSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 1.5
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      filter: "blur(10px)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <section ref={sectionRef} className="text-reveal-section">
      <motion.div
        className="text-reveal-container"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.h2 variants={itemVariants} className="section-title">
          НОВАЯ ЭРА ДИЗАЙНА
        </motion.h2>
        
        <motion.p variants={itemVariants} className="section-text">
          Мы переосмыслили каждый аспект, чтобы создать нечто по-настоящему особенное. 
          От первых эскизов до финальной полировки — все продумано до мельчайших деталей.
        </motion.p>
        
        <motion.p variants={itemVariants} className="section-text">
          Использование передовых материалов и инновационных технологий позволяет нам 
          достигать невозможного и устанавливать новые стандарты в индустрии.
        </motion.p>
      </motion.div>
    </section>
  );
};

// --- СЦЕНА 3: ГАЛЕРЕЯ С ПЛАВНЫМ ПОЯВЛЕНИЕМ ---
const GallerySection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 1.5
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 80,
      scale: 0.9,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 1.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const features = [
    {
      title: "ЭЛЕГАНТНОСТЬ",
      description: "Чистые линии и сбалансированные пропорции создают непревзойденную эстетику",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600"
    },
    {
      title: "ИННОВАЦИИ",
      description: "Передовые технологии, которые опережают время и устанавливают новые стандарты",
      image: "https://images.unsplash.com/photo-1558618666-fcd25856cd63?w=600"
    },
    {
      title: "КАЧЕСТВО",
      description: "Бескомпромиссное внимание к деталям и использование лучших материалов",
      image: "https://images.unsplash.com/photo-1531299204818-ea1d78ad7b28?w=600"
    }
  ];

  return (
    <section ref={sectionRef} className="gallery-section">
      <motion.div
        className="gallery-container"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.h2 
          variants={cardVariants}
          className="section-title"
        >
          НЕВЕРОЯТНЫЕ ВОЗМОЖНОСТИ
        </motion.h2>
        
        <div className="gallery-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="gallery-card"
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.4 }
              }}
            >
              <div className="card-image-container">
                <motion.img 
                  src={feature.image} 
                  alt={feature.title}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="card-overlay" />
              </div>
              
              <div className="card-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

// --- СЦЕНА 4: СТАТИСТИКА С АНИМАЦИЕЙ ЦИФР ---
const StatsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 1.5
      }
    }
  };

  const statVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.5,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const stats = [
    { number: "99.9%", label: "НАДЕЖНОСТЬ" },
    { number: "24/7", label: "ПОДДЕРЖКА" },
    { number: "5.0", label: "РЕЙТИНГ" },
    { number: "10K+", label: "КЛИЕНТОВ" }
  ];

  return (
    <section ref={sectionRef} className="stats-section">
      <motion.div
        className="stats-container"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.h2 variants={statVariants} className="section-title">
          МЫ В ЦИФРАХ
        </motion.h2>
        
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-item"
              variants={statVariants}
            >
              <motion.div 
                className="stat-number"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ 
                  delay: 0.5 + index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
              >
                {stat.number}
              </motion.div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

// --- СЦЕНА 5: ФИНАЛЬНЫЙ ПРИЗЫВ С АНИМАЦИЕЙ ---
const FinalCTASection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.5 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      filter: "blur(15px)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const buttonVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        delay: 1,
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 20px 40px rgba(0, 242, 234, 0.3)",
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <section ref={sectionRef} className="final-cta-section">
      <motion.div
        className="final-cta-container"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.h2 variants={itemVariants} className="final-title">
          ГОТОВЫ К ПЕРЕМЕНАМ?
        </motion.h2>
        
        <motion.p variants={itemVariants} className="final-subtitle">
          Присоединяйтесь к тысячам довольных клиентов, которые уже открыли для себя 
          новый стандарт качества и совершенства.
        </motion.p>
        
        <motion.div variants={itemVariants}>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            className="cta-button"
          >
            НАЧАТЬ ПУТЕШЕСТВИЕ
          </motion.button>
        </motion.div>
        
        <motion.div
          className="floating-orb"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </section>
  );
};

// --- ГЛАВНЫЙ КОМПОНЕНТ ---
function App() {
  return (
    <div className="app">
      <HeroSection />
      <TextRevealSection />
      <GallerySection />
      <StatsSection />
      <FinalCTASection />
    </div>
  );
}

export default App;