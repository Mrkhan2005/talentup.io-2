import React from 'react';
import { motion } from 'motion/react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  scale?: number;
}

export default function ScrollReveal({
  children,
  delay = 0,
  duration = 0.8,
  direction = 'up',
  distance = 35,
  scale = 0.96
}: ScrollRevealProps) {
  const getInitial = () => {
    const initial: any = { opacity: 0, scale };
    if (direction === 'up') initial.y = distance;
    if (direction === 'down') initial.y = -distance;
    if (direction === 'left') initial.x = distance;
    if (direction === 'right') initial.x = -distance;
    return initial;
  };

  const getAnimate = () => {
    return {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0
    };
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={getAnimate()}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.21, 0.85, 0.35, 1] // Custom elite cubic transition for elegant scroll fluidity
      }}
    >
      {children}
    </motion.div>
  );
}
