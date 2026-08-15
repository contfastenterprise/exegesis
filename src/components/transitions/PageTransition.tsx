import React from 'react';
import { motion } from 'motion/react';
import { motionConfig, getPageVariants, TransitionType, pageTransitions } from './transitionConfig';

interface PageTransitionProps {
  children: React.ReactNode;
  pageKey: string;
}

export function PageTransition({ children, pageKey }: PageTransitionProps) {
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  const type: TransitionType = pageTransitions[pageKey] || "fade";
  const variants = getPageVariants(type);

  if (prefersReducedMotion || type === "none") {
    return (
      <motion.div
        key={pageKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      key={pageKey}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ 
        duration: motionConfig.pageDuration, 
        ease: motionConfig.easing 
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
