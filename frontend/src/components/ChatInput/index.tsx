import { useState, useRef, useEffect, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import clsx from "clsx"

// Utils
import { isUnsupportedBrowser } from "./utils/isUnsupportedBrowser"

// Components
import { GooeyFilter } from "./GooeyFilter"
import { SearchIcon } from "./icons/SearchIcon"
import { LoadingIcon } from "./icons/LoadingIcon"
import { InfoIcon } from "./icons/InfoIcon"

import "./styles.css"

const buttonVariants = {
  initial: { x: 0, width: "clamp(100px, 30vw, 1500px)" },
  step1: { x: 0, width: "clamp(100px, 30vw, 1500px)" },
  step2: { x: -30, width: "clamp(180px, 35vw, 1500px)" },
}

const iconVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 24, opacity: 1 },
}

const getResultItemVariants = (index: number, isUnsupported: boolean) => ({
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

const getResultItemTransition = (index: number) => ({
  duration: 0.75,
  delay: index * 0.12,
  type: "spring",
  bounce: 0.35,
  exit: { duration: index * 0.1 },
  filter: { ease: "easeInOut" },
})

interface ChatInputProps {
  className?: string
  buttonText?: string
  placeholderText?: string
}

export const ChatInput = ({
  className,
  buttonText = "درخواست خود را وارد کنید",
  placeholderText = "داده ای که میخواهید جستجو کنید را وارد کنید",
}: ChatInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [state, setState] = useState({
    step: 1, // 1: Initial, 2: Search
    searchText: "",
    isLoading: false,
  })

  const isUnsupported = useMemo(() => isUnsupportedBrowser(), [])

  const handleButtonClick = () => {
    setState((prevState) => ({ ...prevState, step: 2 }))
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({ ...prevState, searchText: e.target.value }))
  }

  const handleSearchSubmit = () => {
    if (state.searchText.trim() !== "" && !state.isLoading) {
      setState((prevState) => ({ ...prevState, isLoading: true }))

      setTimeout(() => {
        setState((prevState) => ({ ...prevState, step: 1 }))
      }, 2000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit()
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.relatedTarget as Node | null)
    ) {
      setState((prevState) => ({ ...prevState, step: 1 }))
    }
  }

  useEffect(() => {
    if (state.step === 2) {
      inputRef.current?.focus()
    } else {
      setState((prevState) => ({
        ...prevState,
        searchText: "",
        isLoading: false,
      }))
    }
  }, [state.step])

  return (
    <div className={clsx("wrapper", isUnsupported && "no-goo", className)}>
      <GooeyFilter />

      <div className="button-content">
        <motion.div
          ref={containerRef}
          onBlur={handleBlur}
          className="button-content-inner"
          initial="initial"
          animate={state.step === 1 ? "step1" : "step2"}
          transition={{ duration: 0.75, type: "spring", bounce: 0.15 }}
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key="search-text-wrapper"
              className="search-results"
              role="listbox"
              aria-label="Search results"
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                delay: isUnsupported ? 0.5 : 1.25,
                duration: 0.5,
              }}
            >
              <AnimatePresence mode="popLayout">
                {state.isLoading && (
                  <motion.div
                    key="loading-text"
                    variants={getResultItemVariants(0, isUnsupported)}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={getResultItemTransition(0)}
                    className="search-result"
                    role="status"
                  >
                    <div className="search-result-title">
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        در حال پردازش ...
                      </motion.span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>

          <motion.div
            variants={buttonVariants}
            onClick={state.step === 1 ? handleButtonClick : undefined}
            whileHover={{ scale: state.step === 2 ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="search-btn"
            role="button"
          >
            {state.step === 1 ? (
              <span className="search-text">{buttonText}</span>
            ) : (
              <input
                ref={inputRef}
                type="text"
                className="search-input"
                placeholder={placeholderText}
                aria-label="Search input"
                onChange={handleSearch}
                onKeyDown={handleKeyDown}
                value={state.searchText}
              />
            )}
          </motion.div>

          <AnimatePresence mode="wait">
            {state.step === 2 && (
              <motion.div
                key="icon"
                className="separate-element"
                tabIndex={-1}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={iconVariants}
                transition={{
                  delay: 0.1,
                  duration: 0.85,
                  type: "spring",
                  bounce: 0.15,
                }}
                onClick={handleSearchSubmit}
              >
                {!state.isLoading ? (
                  <SearchIcon isUnsupported={isUnsupported} />
                ) : (
                  <LoadingIcon />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
