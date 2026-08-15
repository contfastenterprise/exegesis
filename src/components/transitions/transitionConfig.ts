export type TransitionType = "fade" | "slide" | "scale" | "cinematic" | "none";

export const motionConfig = {
  pageDuration: 0.45,
  staggerDelay: 0.08,
  easing: [0.22, 1, 0.36, 1], // Cinematic cubic-bezier
};

export const pageTransitions: Record<string, TransitionType> = {
  home: "cinematic",
  sermons: "fade",
  activities: "slide",
  devotionals: "slide",
  leaders: "fade",
  location: "fade",
  "biblical-books": "slide",
  help: "fade",
  interactions: "cinematic",
  admin: "none"
};

export const getPageVariants = (type: TransitionType) => {
  switch (type) {
    case "cinematic":
      return {
        initial: { opacity: 0, scale: 0.985, y: 15 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.985, y: -10 }
      };
    case "slide":
      return {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 }
      };
    case "fade":
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      };
    case "scale":
      return {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.05 }
      };
    case "none":
    default:
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 }
      };
  }
};
