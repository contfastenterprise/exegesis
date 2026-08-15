import { useMemo } from 'react';
import { motionConfig } from '../transitionConfig';

export function usePageTransition() {
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  const staggerContainer = useMemo(() => ({
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : motionConfig.staggerDelay,
      }
    }
  }), [prefersReducedMotion]);

  const fadeInUp = useMemo(() => ({
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: motionConfig.easing
      }
    }
  }), [prefersReducedMotion]);
  
  const cinematicImage = useMemo(() => ({
    hidden: { opacity: 0, scale: prefersReducedMotion ? 1 : 1.04 },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.7,
        ease: motionConfig.easing
      }
    }
  }), [prefersReducedMotion]);

  return { staggerContainer, fadeInUp, cinematicImage, prefersReducedMotion };
}
