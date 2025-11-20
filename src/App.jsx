import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import './App.css';

// Компонент для отдельной анимированной строки текста
// Принимает прогресс скролла (scrollYProgress) и массив [x, y] для направления движения
function ParallaxText({ children, scrollYProgress, direction = [0, 0] }) {
  // Преобразуем прогресс скролла (от 0 до 1) в движение по осям X и Y
  const translateX = useTransform(scrollYProgress, [0, 1], [0, direction[0]]);
  const translateY = useTransform(scrollYProgress, [0, 1], [0, direction[1]]);

  // Создаем "пружину" для плавности. Это главный секрет!
  // stiffness - жесткость, damping - затухание.
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothTranslateX = useSpring(translateX, springConfig);
  const smoothTranslateY = useSpring(translateY, springConfig);

  return (
    <motion.div style={{ x: smoothTranslateX, y: smoothTranslateY }}>
      {children}
    </motion.div>
  );
}

function App() {
  const targetRef = useRef(null);
  // Отслеживаем скролл внутри элемента с ref={targetRef}
  const { scrollYProgress } = useScroll({
    target: targetRef,
    // Начинаем отслеживать, когда верх секции касается верха экрана,
    // и заканчиваем, когда низ секции касается низа экрана.
    offset: ['start start', 'end end'],
  });

  return (
    <>
      {/* Эта секция - наш холст для анимации */}
      <section ref={targetRef} className="parallax-container">
        <div className="text-wrapper">
          {/* Каждый ParallaxText получает разное направление и скорость движения */}
          <ParallaxText scrollYProgress={scrollYProgress} direction={[-200, -300]}>
            <h1 className="text-outline">GIGABYTE</h1>
          </ParallaxText>
          <ParallaxText scrollYProgress={scrollYProgress} direction={[100, -150]}>
            <h1 className="text-main">MOTION</h1>
          </ParallaxText>
          <ParallaxText scrollYProgress={scrollYProgress} direction={[-50, 250]}>
            <h2 className="text-secondary">EXPERIENCE</h2>
          </ParallaxText>
          <ParallaxText scrollYProgress={scrollYProgress} direction={[300, 200]}>
             <div className="decorative-line"></div>
          </ParallaxText>
        </div>
      </section>

      {/* Эта секция нужна просто для того, чтобы было куда скроллить */}
      <section className="content-container">
        <h2>Scroll Down to See The Magic</h2>
        <p>Чем дальше вы скроллите, тем сильнее расходятся текстовые слои, создавая эффект глубины. Благодаря `useSpring`, движение остается невероятно плавным и органичным, а не механическим.</p>
      </section>
    </>
  );
}

export default App;