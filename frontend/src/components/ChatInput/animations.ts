export const buttonVariants = {
  initial: { x: 0, width: "clamp(100px, 30vw, 1500px)" },
  step1: { x: 0, width: "clamp(100px, 30vw, 1500px)" },
  step2: { x: -30, width: "clamp(180px, 35vw, 1500px)" },
}

export const iconVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 24, opacity: 1 },
}

export const refreshButtonVariants = (isUnsupported: boolean) => ({
  hidden: {
    opacity: 0,
    scale: 0,
    filter: isUnsupported ? "none" : "blur(10px)",
    x: 0,
    transition: {
      scale: { duration: 0.25, ease: "easeIn", delay: 0.1 },
      filter: { duration: 0.2, ease: "easeOut" },
      opacity: { duration: 0.25, ease: "easeIn", delay: 0.1 },
    },
  },
  visibleStep1: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    x: 0,
    transition: {
      scale: { type: "spring", stiffness: 400, damping: 17 },
      filter: { duration: 0.4, ease: "easeOut", delay: 0.1 },
      opacity: { duration: 0.2, ease: "easeOut" },
    },
  },
  visibleStep2: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    x: -30,
    transition: {
      x: { duration: 0.75, type: "spring", bounce: 0.15 },
    },
  },
})

export const getResultItemVariants = (
  index: number,
  isUnsupported: boolean
) => ({
  initial: {
    y: 0,
    scale: 0.3,
    filter: isUnsupported ? "none" : "blur(10px)",
  },
  animate: {
    y: (index + 1) * 60,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: {
    y: isUnsupported ? 0 : -4,
    scale: 0.8,
    color: "#000000",
  },
})

export const getResultItemTransition = (index: number) => ({
  duration: 0.75,
  delay: index * 0.12,
  type: "spring",
  bounce: 0.35,
  exit: { duration: index * 0.1 },
  filter: { ease: "easeInOut" },
})
