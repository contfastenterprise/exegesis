import React, { useRef, ReactNode } from 'react';
import { motion, useInView } from 'motion/react';
import { usePageTransition } from './hooks/usePageTransition';
import { motionConfig } from './transitionConfig';

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function RevealOnScroll({ children, className = "", delay = 0 }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { prefersReducedMotion } = usePageTransition();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ 
        duration: 0.6, 
        delay, 
        ease: motionConfig.easing 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
