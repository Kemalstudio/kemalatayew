import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import './App.css';

// Vertical Ticker Component
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
        {/* Loop back to the first item for a seamless transition */}
        <div className="ticker-item">
          {items[0]}
        </div>
      </motion.div>
    </div>
  );
};

// Horizontal Scroll Section
const HorizontalScrollSection = () => {
  const containerRef = useRef(null);
  const horizontalRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsVisible(latest > 0.1 && latest < 0.9);
  });

  const xTransform = useTransform(scrollYProgress, [0, 1], ['5%', '-125%']);
  const smoothX = useSpring(xTransform, {
    stiffness: 150,
    damping: 40,
    mass: 0.5
  });

  const scaleTransform = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.7, 1, 1, 0.7]);
  const smoothScale = useSpring(scaleTransform, { stiffness: 150, damping: 40 });

  const opacityTransform = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const smoothOpacity = useSpring(opacityTransform, { stiffness: 150, damping: 40 });

  const rotateTransform = useTransform(scrollYProgress, [0, 1], [-10, 10]);
  const smoothRotate = useSpring(rotateTransform, { stiffness: 100, damping: 30 });

  const scrollItems = [
    {
      title: "Dominant Performance",
      description: "Engineered for peak performance with next-gen hardware.",
      color: "#ff6c00",
      icon: "🚀",
      gradient: "linear-gradient(145deg, #ff6c00, #ff8c00)"
    },
    {
      title: "Futuristic Design",
      description: "Aggressive aesthetics with customizable RGB lighting.",
      color: "#00c6ff",
      icon: "⚡",
      gradient: "linear-gradient(145deg, #00c6ff, #0072ff)"
    },
    {
      title: "Immersive Experience",
      description: "Dive into new worlds with cutting-edge visual technology.",
      color: "#e91e63",
      icon: "🎨",
      gradient: "linear-gradient(145deg, #e91e63, #c2185b)"
    },
    {
      title: "Built to Last",
      description: "Premium materials and robust construction for longevity.",
      color: "#a855f7",
      icon: "💎",
      gradient: "linear-gradient(145deg, #a855f7, #9333ea)"
    },
    {
      title: "Cross-Platform Synergy",
      description: "Seamless integration across all your devices.",
      color: "#10b981",
      icon: "📱",
      gradient: "linear-gradient(145deg, #10b981, #059669)"
    },
    {
      title: "Simple & Powerful",
      description: "Intuitive software for easy customization and control.",
      color: "#f59e0b",
      icon: "🔧",
      gradient: "linear-gradient(145deg, #f59e0b, #d97706)"
    },
    {
      title: "Advanced Features",
      description: "Unlock the full potential of your hardware with our tools.",
      color: "#ef4444",
      icon: "🌟",
      gradient: "linear-gradient(145deg, #ef4444, #dc2626)"
    },
    {
      title: "Elite Community",
      description: "Join a passionate community of builders and gamers.",
      color: "#8b5cf6",
      icon: "👥",
      gradient: "linear-gradient(145deg, #8b5cf6, #7c3aed)"
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
          Explore The Arsenal
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Engage with our core technologies through interactive scroll.
        </motion.p>
      </div>

      <div className="horizontal-scroll-container">
        <motion.div
          ref={horizontalRef}
          className="horizontal-scroll-content"
          style={{
            x: smoothX,
            scale: smoothScale,
            opacity: smoothOpacity,
            rotateY: smoothRotate
          }}
        >
          {scrollItems.map((item, index) => (
            <motion.div
              key={index}
              className="horizontal-card"
              initial={{ opacity: 0, y: 100, scale: 0.8, rotateX: -20 }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0
              }}
              transition={{
                duration: 0.8,
                delay: index * 0.08,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true, margin: "-150px" }}
              whileHover={{
                scale: 1.05,
                y: -15,
                transition: { duration: 0.3 }
              }}
            >
              <div
                className="card-inner"
                style={{
                  '--glow-color': item.color,
                }}
              >
                <div className="card-glare"></div>
                <motion.div
                  className="card-icon"
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  transition={{ duration: 0.5 }}
                >
                  {item.icon}
                </motion.div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <motion.div
                  className="progress-indicator"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                  whileHover={{ scaleX: 1.5 }}
                  transition={{ duration: 0.3 }}
                />
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
          <motion.div
            className="scroll-progress-fill"
            style={{ scaleX: scrollYProgress }}
          />
        </div>
        <motion.div
          className="scroll-hint"
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {isVisible ? "SYSTEM ENGAGED" : "INITIATE SCROLL"}
        </motion.div>
      </motion.div>

      <div className="background-elements">
        <motion.div className="bg-grid" />
        <motion.div className="bg-line-1" animate={{ y: [0, -100, 0] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}/>
        <motion.div className="bg-line-2" animate={{ y: [0, 120, 0] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}/>
      </div>
    </section>
  );
};

// Main App Component
function App() {
  const features = [
    {
      title: "Simple API",
      description: "Motion's pick-up-and-play API is easy to start and fun to master.",
      links: ["Get started with Motion for React", "Get started with Motion", "Get started with Motion for Vue"]
    },
    {
      title: "Independent transforms",
      description: "Animate x, y, rotateZ etc independently, without wrapper elements.",
      links: ["Learn how to animate with Motion for React", "Learn how to animate with Motion", "Learn how to animate with Motion for Vue"]
    },
    {
      title: "Scroll animation",
      description: "Smooth, hardware-accelerated scroll animations.",
      links: ["Create scroll animations with Motion for React", "Create scroll animations with Motion's scroll function", "Create scroll animations with Motion for Vue"]
    },
    {
      title: "Exit animation",
      description: "Motion's AnimatePresence makes it easy to animate elements as they exit.",
      links: ["Create exit animations with Motion for React's AnimatePresence component", "Create exit animations with Motion for Vue's AnimatePresence component"]
    },
    {
      title: "Gestures",
      description: "Hover, press and drag gestures that feel native, not 'webby'.",
      links: ["Learn more about gesture animations with React", "Learn more about Motion's hover function", "Learn more about Motion for Vue gesture animations"]
    },
    {
      title: "Layout animation",
      description: "Animate between different layouts with Motion's industry-leading layout animation engine.",
      links: ["Get started with layout animation in React", "Start with the View Transitions API in JS", "Get started with layout animations in Vue"]
    },
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
            FUTURE <span className="highlight">MOTION</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            Unleashing the next generation of web animation.
          </motion.p>
        </div>

        <div className="ticker-section">
          <div className="ticker-label">
             <span>CORE FEATURES</span>
          </div>
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
            <h2>Technical Specifications</h2>
            <p>A deep dive into the powerful Framer Motion capabilities.</p>
          </motion.div>

          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.5 }}
              whileHover={{
                scale: 1.02,
                y: -5
              }}
            >
              <div className="feature-card-glow"></div>
              <div className="feature-card-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="links">
                  {feature.links.map((link, linkIndex) => (
                    <motion.a
                      key={linkIndex}
                      href="#"
                      className="link"
                      whileHover={{ x: 8, color: '#ff6c00' }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {link} <span>&gt;</span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="continuous-ticker-section">
        <motion.div
          className="continuous-ticker"
          animate={{ x: ['0%', '-100%'] }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <motion.div
              key={index}
              className="ticker-word"
              whileHover={{ scale: 1.1, color: "#ff6c00" }}
              transition={{ duration: 0.3 }}
            >
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