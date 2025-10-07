import React from "react"
import { motion } from "framer-motion"

interface Props {
  isUnsupported?: boolean
}

export const refreshIconVariants = {
  hidden: {
    opacity: 0,
    scale: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17,
      delay: 0.1, // delay after the button appears
    },
  },
}

export const RefreshIcon: React.FC<Props> = () => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      variants={refreshIconVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <path
        fill="currentColor"
        d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
      />
    </motion.svg>
  )
}
