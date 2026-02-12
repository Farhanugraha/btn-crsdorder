import { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

export const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut' as const
  }
};

export const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut' as const
  }
};

export const floatAnimationDelayed = {
  y: [0, 10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut' as const,
    delay: 0.5
  }
};

export const fixedPositions = [
  { left: '10%', top: '20%' },
  { left: '30%', top: '40%' },
  { left: '50%', top: '10%' },
  { left: '70%', top: '60%' },
  { left: '90%', top: '30%' },
  { left: '15%', top: '70%' },
  { left: '40%', top: '80%' },
  { left: '60%', top: '90%' },
  { left: '85%', top: '75%' },
  { left: '25%', top: '15%' },
  { left: '45%', top: '50%' },
  { left: '65%', top: '25%' },
  { left: '5%', top: '45%' },
  { left: '35%', top: '65%' },
  { left: '75%', top: '85%' },
  { left: '95%', top: '55%' },
  { left: '20%', top: '95%' },
  { left: '55%', top: '35%' },
  { left: '80%', top: '5%' },
  { left: '100%', top: '100%' }
];