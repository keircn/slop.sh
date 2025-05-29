'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade' | 'blur';
  duration?: number;
  once?: boolean;
  stagger?: boolean;
  intensity?: 'subtle' | 'normal' | 'strong';
}

export function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.6,
  once = true,
  stagger = false,
  intensity = 'normal',
}: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once,
    margin: '-5% 0px -5% 0px', // Trigger animation when 5% of element is visible
    amount: 0.1, // Trigger when 10% of element is visible
  });

  // Intensity multipliers
  const intensityMap = {
    subtle: 0.5,
    normal: 1,
    strong: 1.5,
  };

  const multiplier = intensityMap[intensity];

  const getVariants = () => {
    const baseVariants = {
      hidden: {
        opacity: 0,
        y:
          direction === 'up'
            ? 30 * multiplier
            : direction === 'down'
              ? -30 * multiplier
              : 0,
        x:
          direction === 'left'
            ? 30 * multiplier
            : direction === 'right'
              ? -30 * multiplier
              : 0,
        scale: direction === 'scale' ? 0.9 + 0.1 * (1 - multiplier) : 1,
        filter: direction === 'blur' ? 'blur(4px)' : 'blur(0px)',
      },
      visible: {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
          duration,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
          ...(stagger && {
            staggerChildren: 0.1,
            delayChildren: delay + 0.1,
          }),
        },
      },
    };

    return baseVariants;
  };

  const containerVariants = stagger
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay,
          },
        },
      }
    : getVariants();

  return (
    <motion.div
      ref={ref}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={className}
      style={{ willChange: 'transform, opacity' }} // Optimize for animations
    >
      {children}
    </motion.div>
  );
}
