import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

// Регистрируем плагин ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// --- VERTICAL SCROLLING TICKER COMPONENT ---
const VerticalTicker = ({ items, speed = 50 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, speed * 100);

    return () => clearInterval(interval);
  }, [items.length, speed]);

  return (
    <div className="ticker-container" ref={containerRef}>
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

// --- HORIZONTAL SCROLL SECTION ---
const HorizontalScrollSection = () => {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);
  const horizontalRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const trigger = triggerRef.current;
    const horizontal = horizontalRef.current;

    const scrollWidth = horizontal.scrollWidth - window.innerWidth;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: "top top",
        end: `+=${scrollWidth}`,
        pin: section,
        scrub: 1,
        anticipatePin: 1,
        markers: false, // Set to true for debugging
      }
    });

    tl.to(horizontal, {
      x: -scrollWidth,
      duration: 1,
      ease: "power2.inOut"
    });

    // Анимация для отдельных элементов
    gsap.utils.toArray('.scroll-item').forEach((item, index) => {
      gsap.fromTo(item, 
        {
          opacity: 0,
          y: 100,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: item,
            containerAnimation: tl,
            start: "left 80%",
            end: "left 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const scrollItems = [
    {
      title: "Smooth Experience",
      description: "Butter-smooth animations powered by GSAP",
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
    <section className="horizontal-scroll-section" ref={sectionRef}>
      <div className="scroll-trigger" ref={triggerRef}></div>
      <div className="horizontal-container" ref={horizontalRef}>
        <div className="horizontal-content">
          {scrollItems.map((item, index) => (
            <div key={index} className="scroll-item">
              <div 
                className="scroll-card"
                style={{ 
                  borderColor: item.color,
                  background: `linear-gradient(145deg, ${item.color}15, ${item.color}05)`
                }}
              >
                <h3 style={{ color: item.color }}>{item.title}</h3>
                <p>{item.description}</p>
                <div 
                  className="scroll-indicator"
                  style={{ backgroundColor: item.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- MAIN APP COMPONENT ---
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
      {/* Hero Section with Ticker */}
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
                y: -5,
                transition: { duration: 0.3 }
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

      {/* Continuous Vertical Ticker */}
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