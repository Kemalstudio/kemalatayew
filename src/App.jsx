import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
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
          stiffness: 300, 
          damping: 30 
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

// Horizontal Scroll Section
const HorizontalScrollSection = () => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const xTransform = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
  const smoothX = useSpring(xTransform, { 
    stiffness: 100, 
    damping: 30 
  });

  const scrollItems = [
    {
      title: "Smooth Experience",
      description: "Butter-smooth animations powered by Framer Motion",
      color: "#00f2ea"
    },
    {
      title: "Performance First", 
      description: "Optimized for 60fps animations",
      color: "#0072ff"
    },
    {
      title: "Creative Freedom",
      description: "Unlimited possibilities for your designs",
      color: "#ff6b6b"
    },
    {
      title: "Professional Results",
      description: "Studio-quality animations for your projects",
      color: "#a855f7"
    },
    {
      title: "Cross Platform",
      description: "Works perfectly on all devices",
      color: "#10b981"
    }
  ];

  return (
    <section ref={containerRef} className="horizontal-scroll-wrapper">
      <div className="horizontal-scroll-container">
        <motion.div 
          className="horizontal-scroll-content"
          style={{ x: smoothX }}
        >
          {scrollItems.map((item, index) => (
            <motion.div
              key={index}
              className="horizontal-card"
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              whileInView={{ 
                opacity: 1, 
                y: 0, 
                scale: 1
              }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ 
                scale: 1.05,
                y: -10
              }}
            >
              <div 
                className="card-inner"
                style={{ 
                  borderColor: item.color,
                  background: `linear-gradient(135deg, ${item.color}20, ${item.color}05)`
                }}
              >
                <h3 style={{ color: item.color }}>{item.title}</h3>
                <p>{item.description}</p>
                <div 
                  className="progress-indicator"
                  style={{ backgroundColor: item.color }}
                ></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
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
      links: [
        "Get started with Motion for React",
        "Get started with Motion", 
        "Get started with Motion for Vue"
      ]
    },
    {
      title: "Independent transforms", 
      description: "Animate x, y, rotateZ etc independently, without wrapper elements.",
      links: [
        "Learn how to animate with Motion for React",
        "Learn how to animate with Motion",
        "Learn how to animate with Motion for Vue"
      ]
    },
    {
      title: "Scroll animation",
      description: "Smooth, hardware-accelerated scroll animations.", 
      links: [
        "Create scroll animations with Motion for React",
        "Create scroll animations with Motion's scroll function",
        "Create scroll animations with Motion for Vue"
      ]
    },
    {
      title: "Exit animation",
      description: "Motion's AnimatePresence makes it easy to animate elements as they exit.",
      links: [
        "Create exit animations with Motion for React's AnimatePresence component",
        "Create exit animations with Motion for Vue's AnimatePresence component"
      ]
    },
    {
      title: "Gestures",
      description: "Hover, press and drag gestures that feel native, not 'webby'.",
      links: [
        "Learn more about gesture animations with React",
        "Learn more about Motion's hover function", 
        "Learn more about Motion for Vue gesture animations"
      ]
    },
    {
      title: "Layout animation",
      description: "Animate between different layouts with Motion's industry-leading layout animation engine.",
      links: [
        "Get started with layout animation in React",
        "Start with the View Transitions API in JS",
        "Get started with layout animations in Vue"
      ]
    },
    {
      title: "Timeline sequences",
      description: "Variants, stagger and timelines make it easy to precisely orchestrate animations.",
      links: [
        "Orchestrate React animations with variants",
        "Learn more about animation sequences with the animate function",
        "Get started with animation orchestration in Vue"
      ]
    },
    {
      title: "Spring physics", 
      description: "Real spring physics for great-feeling animations.",
      links: [
        "Learn more about staggering in Motion for React",
        "Learn more about Motion's stagger function"
      ]
    }
  ];

  const tickerItems = features.map(feature => feature.title);

  return (
    <div className="app">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Motion Features
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Discover the powerful features of Framer Motion
          </motion.p>
        </div>
        
        <div className="ticker-section">
          <div className="ticker-label">
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              FEATURES
            </motion.span>
          </div>
          <VerticalTicker items={tickerItems} speed={30} />
        </div>
      </section>

      {/* Horizontal Scroll Section */}
      <HorizontalScrollSection />

      {/* Features Grid */}
      <section className="features-grid">
        <div className="container">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.02,
                y: -5
              }}
            >
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <div className="links">
                {feature.links.map((link, linkIndex) => (
                  <motion.a
                    key={linkIndex}
                    href="#"
                    className="link"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {link} →
                  </motion.a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Continuous Ticker */}
      <section className="continuous-ticker-section">
        <motion.div
          className="continuous-ticker"
          animate={{ y: [-100, 0] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <div key={index} className="ticker-word">
              {item}
              <span className="dot">•</span>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}

export default App;