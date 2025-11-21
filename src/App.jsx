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
  const horizontalRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Use motion value event to track scroll progress
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.1 && latest < 0.9) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  });

  // Horizontal scroll animation - more dramatic movement
  const xTransform = useTransform(scrollYProgress, [0, 1], ['0%', '-150%']);
  const smoothX = useSpring(xTransform, { 
    stiffness: 100, 
    damping: 30,
    mass: 0.5
  });

  // Scale animation for cards
  const scaleTransform = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);
  const smoothScale = useSpring(scaleTransform, { stiffness: 100, damping: 30 });

  // Opacity animation
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.3, 1, 1, 0.3]);
  const smoothOpacity = useSpring(opacityTransform, { stiffness: 100, damping: 30 });

  // Rotation animation for fun
  const rotateTransform = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const smoothRotate = useSpring(rotateTransform, { stiffness: 50, damping: 20 });

  const scrollItems = [
    {
      title: "Smooth Experience",
      description: "Butter-smooth animations powered by Framer Motion with advanced physics",
      color: "#00f2ea",
      icon: "🚀",
      gradient: "linear-gradient(135deg, #00f2ea, #0072ff)"
    },
    {
      title: "Performance First", 
      description: "Optimized for 60fps animations with hardware acceleration",
      color: "#0072ff",
      icon: "⚡",
      gradient: "linear-gradient(135deg, #0072ff, #00f2ea)"
    },
    {
      title: "Creative Freedom",
      description: "Unlimited possibilities for your designs with powerful APIs",
      color: "#ff6b6b",
      icon: "🎨",
      gradient: "linear-gradient(135deg, #ff6b6b, #ffa726)"
    },
    {
      title: "Professional Results",
      description: "Studio-quality animations that impress your clients",
      color: "#a855f7",
      icon: "💎",
      gradient: "linear-gradient(135deg, #a855f7, #ec4899)"
    },
    {
      title: "Cross Platform",
      description: "Works perfectly on all devices and screen sizes",
      color: "#10b981",
      icon: "📱",
      gradient: "linear-gradient(135deg, #10b981, #059669)"
    },
    {
      title: "Easy Integration",
      description: "Simple to implement in any React project with clean API",
      color: "#f59e0b",
      icon: "🔧",
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)"
    },
    {
      title: "Powerful Features",
      description: "Advanced animations made simple with intuitive controls",
      color: "#ef4444",
      icon: "🌟",
      gradient: "linear-gradient(135deg, #ef4444, #dc2626)"
    },
    {
      title: "Community Support",
      description: "Backed by a vibrant developer community and great docs",
      color: "#8b5cf6",
      icon: "👥",
      gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)"
    },
    {
      title: "Real-time Preview",
      description: "See your animations live as you build them",
      color: "#06b6d4",
      icon: "👁️",
      gradient: "linear-gradient(135deg, #06b6d4, #0891b2)"
    },
    {
      title: "Production Ready",
      description: "Battle-tested in thousands of production applications",
      color: "#84cc16",
      icon: "🏆",
      gradient: "linear-gradient(135deg, #84cc16, #65a30d)"
    },
    {
      title: "Flexible Config",
      description: "Customize every aspect of your animations",
      color: "#f97316",
      icon: "⚙️",
      gradient: "linear-gradient(135deg, #f97316, #ea580c)"
    },
    {
      title: "Great Documentation",
      description: "Comprehensive docs with examples and tutorials",
      color: "#8b5cf6",
      icon: "📚",
      gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)"
    }
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
          Scroll Horizontally
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Scroll down to see the horizontal animation effect
        </motion.p>
        
        <motion.div 
          className="scroll-hint-top"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span>↓ Scroll Down ↓</span>
        </motion.div>
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
              initial={{ opacity: 0, y: 100, scale: 0.8, rotateY: 180 }}
              whileInView={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                rotateY: 0
              }}
              transition={{
                duration: 0.8,
                delay: index * 0.05,
                type: "spring",
                stiffness: 100
              }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ 
                scale: 1.05,
                y: -15,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div 
                className="card-inner"
                style={{ 
                  borderColor: item.color,
                  background: item.gradient,
                }}
              >
                <motion.div 
                  className="card-icon"
                  style={{ color: '#ffffff' }}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {item.icon}
                </motion.div>
                <h3 style={{ color: '#ffffff' }}>{item.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.9)' }}>{item.description}</p>
                <motion.div 
                  className="progress-indicator"
                  style={{ backgroundColor: '#ffffff' }}
                  whileHover={{ scaleX: 1.5 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Progress Indicator */}
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
          animate={{ x: [-5, 5, -5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {isVisible ? "🠔 Scroll Horizontal 🠖" : "↓ Scroll Down ↓"}
        </motion.div>
      </motion.div>

      {/* Background Elements */}
      <div className="background-elements">
        <motion.div 
          className="bg-circle-1"
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="bg-circle-2"
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="bg-circle-3"
          animate={{ 
            x: [0, 120, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
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
          <VerticalTicker items={tickerItems} speed={50} />
        </div>
      </section>

      {/* Horizontal Scroll Section */}
      <HorizontalScrollSection />

      {/* Features Grid */}
      <section className="features-grid">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2>All Features</h2>
            <p>Explore the complete set of Framer Motion capabilities</p>
          </motion.div>
          
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
          animate={{ x: [0, -2000] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
            <motion.div 
              key={index} 
              className="ticker-word"
              whileHover={{ scale: 1.2, color: "#00f2ea" }}
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