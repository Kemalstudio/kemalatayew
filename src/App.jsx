import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './App.css';

const FadeInWhenVisible = ({ children }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8 }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 20 },
      }}
    >
      {children}
    </motion.div>
  );
};

const ParallaxSection = ({ children, backgroundImage }) => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div
      ref={ref}
      className="parallax-section"
      style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}
    >
      <motion.div
        className="parallax-background"
        style={{
          y: backgroundY,
          backgroundImage: `url(${backgroundImage})`,
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="parallax-content">{children}</div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <ParallaxSection backgroundImage="https://images.unsplash.com/photo-1605283134105-4c673b3810a5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
        <FadeInWhenVisible>
          <h1 className="title">Погрузитесь в Будущее</h1>
        </FadeInWhenVisible>
      </ParallaxSection>

      <section className="content-section">
        <FadeInWhenVisible>
          <h2>Инновационный Дизайн</h2>
          <p>
            Мы создаем продукты, которые не только мощные, но и выглядят
            потрясающе. Каждая деталь продумана до мелочей.
          </p>
        </FadeInWhenVisible>
      </section>

      <ParallaxSection backgroundImage="https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
        <FadeInWhenVisible>
          <h1 className="title">Непревзойденная Мощность</h1>
        </FadeInWhenVisible>
      </ParallaxSection>

      <section className="content-section">
        <FadeInWhenVisible>
          <h2>Технологии Завтрашнего Дня</h2>
          <p>
            Используйте передовые технологии, чтобы оставаться на шаг впереди.
            Наша продукция создана для тех, кто не боится будущего.
          </p>
        </FadeInWhenVisible>
      </section>
    </div>
  );
}

export default App;