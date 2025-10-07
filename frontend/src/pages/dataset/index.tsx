// @ts-nocheck
import { useState, useRef, useEffect, useMemo } from "react"
import Spline from "@splinetool/react-spline"
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react"
import { AnimatePresence, motion } from "framer-motion"
import { useTheme } from "@/components/theme/ThemeContext"
import { ChatInput } from "@/components/ChatInput"
import { DataCard } from "@/components/DataCard"
import { useDataFinderModeIndicator } from "./hooks/useDataFinderModeIndicator"
import { getDatabases } from "./utils/csv"
import { DatabaseInfo } from "@/types/database"
import { searchInCsv } from "@/components/Search"
import { refreshButtonVariants } from "@/components/ChatInput/animations"
import { RefreshIcon } from "@/components/ChatInput/icons/RefreshIcon"

import "./styles.css"
import generatedImage from "../../../data/Gemini_Generated_Image_sc72gssc72gssc72.png"

const TARGET_ID = "b647ec01-9216-4d75-8e14-935351259d8f" // from Copy Development Object ID in Spline

const chatInputConfig = {
  datasaz: {
    buttonText: "داده‌ای که می‌خواهید جستجو کنید رو توصیف کنید.",
    placeholderText: "سعی کنید درخواستتون رو دقیق و کامل توصیف کنید.",
  },
  datayab: {
    buttonText: "ویژگی‌های داده مورد نظر خود را برای ساخت وارد کنید.",
    placeholderText: "مثال: داده‌ای با ۱۰۰۰ سطر و ستون‌های سن، جنسیت و تحصیلات",
  },
  manual: {
    buttonText: "پرسش خود را در مورد داده‌ها اینجا وارد کنید.",
    placeholderText: "مثال: میانگین سنی افراد در داده «سلامت» چقدر است؟",
  },
}

export const DatasetPage = () => {
  const { theme } = useTheme()
  const [isTextVisible, setIsTextVisible] = useState(false)
  const [isDataVisible, setIsDataVisible] = useState(false)
  const [activeMode, setActiveMode] = useState("datasaz")
  const [chatInputStep, setChatInputStep] = useState(1)
  const [databases, setDatabases] = useState<DatabaseInfo[]>([])
  const [chatInputAnimationClass, setChatInputAnimationClass] = useState("")
  const [dataContainerAnimationClass, setDataContainerAnimationClass] =
    useState("")
  const [searchResults, setSearchResults] = useState<DatabaseInfo[]>([])
  const [searchAttempted, setSearchAttempted] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<"all" | Set<string>>(
    new Set()
  )
  const [selectedSort, setSelectedSort] = useState<"all" | Set<string>>(
    new Set(["سال"])
  )
  const [manualSort, setManualSort] = useState<"all" | Set<string>>(
    new Set(["امتیاز"])
  )
  const appRef = useRef(null)
  const objRef = useRef(null)
  const modesContainerRef = useRef(null)

  const selectedFilterValue = useMemo(
    () => Array.from(selectedFilters).join(", ").replace(/_/g, " "),
    [selectedFilters]
  )

  useDataFinderModeIndicator(modesContainerRef, activeMode)

  useEffect(() => {
    const loadDatabases = async () => {
      const data = await getDatabases()
      setDatabases(data)
    }
    loadDatabases()
  }, [])

  const handleSplineLoad = (app) => {
    appRef.current = app
    objRef.current = app.findObjectById(TARGET_ID)
    setTimeout(() => {
      setIsTextVisible(true)
      setIsDataVisible(true)
      setChatInputAnimationClass("fade-in-up")
    }, 2000)
  }

  const toState = () => {
    if (!objRef.current) return
    objRef.current.transition({ to: "State", duration: 800 })
  }

  const toBase = () => {
    if (!objRef.current) return
    objRef.current.transition({ to: null, duration: 800 }) // null = Base State
  }

  const toState2 = () => {
    if (!objRef.current) return
    objRef.current.transition({ to: "State 2", duration: 800 })
  }

  const handleModeChange = (mode: string) => {
    if (mode === activeMode) return

    setChatInputAnimationClass("fade-out")
    setDataContainerAnimationClass("fade-out")
    setTimeout(() => {
      switch (mode) {
        case "manual":
          toState2()
          break
        case "datasaz":
          toBase()
          break
        case "datayab":
          toState()
          break
        default:
          toBase()
      }
      setActiveMode(mode)
      if (mode === "datasaz" || mode === "datayab") {
        setSelectedSort(new Set(["سال"]))
      } else if (mode === "manual") {
        setSelectedSort(manualSort)
      }
      if (mode !== "manual") {
        setSearchAttempted(false)
        setSearchResults([])
      }
      setTimeout(() => {
        setChatInputAnimationClass("fade-in")
      }, 400)
      setDataContainerAnimationClass("fade-in")
    }, 300) // This duration should match the CSS animation duration
  }

  const handleSearch = async (query: string) => {
    setSearchAttempted(true)
    const searchStartTime = Date.now()
    const minAnimationTime = 2000 // Corresponds to ChatInput's animation
    const fadeAnimationTime = 300

    // Fade out current results and wait for the animation to finish.
    setDataContainerAnimationClass("fade-out")
    await new Promise((resolve) => setTimeout(resolve, fadeAnimationTime))

    const results = await searchInCsv(query)
    const searchDuration = Date.now() - searchStartTime

    // Ensure the loading animation is visible for a minimum duration.
    if (searchDuration < minAnimationTime) {
      await new Promise((resolve) =>
        setTimeout(resolve, minAnimationTime - searchDuration)
      )
    }

    setSearchResults(results)

    // Fade in new results.
    setDataContainerAnimationClass("fade-in")
  }

  const handleClearSearch = async () => {
    console.log("Refresh button clicked")
    const fadeAnimationTime = 300
    setDataContainerAnimationClass("fade-out")
    await new Promise((resolve) => setTimeout(resolve, fadeAnimationTime))
    setSearchAttempted(false)
    setSearchResults([])
    setDataContainerAnimationClass("fade-in")
  }

  const filterTags = useMemo(() => {
    const allTags = new Set<string>()
    databases.forEach((db) => {
      db.datasetVariables.forEach((tag) => {
        allTags.add(tag)
      })
    })
    return Array.from(allTags)
  }, [databases])

  const displayedDatabases =
    activeMode === "manual" && searchAttempted ? searchResults : databases

  const processedDatabases = useMemo(() => {
    let filtered = displayedDatabases

    // Filtering logic
    if (selectedFilters instanceof Set && selectedFilters.size > 0) {
      filtered = displayedDatabases.filter((db) =>
        db.datasetVariables.some((tag) => selectedFilters.has(tag))
      )
    }

    // Sorting logic
    const sortKey =
      selectedSort instanceof Set
        ? selectedSort.values().next().value
        : selectedSort

    if (sortKey) {
      return [...filtered].sort((a, b) => {
        switch (sortKey) {
          case "امتیاز":
            return b.rating - a.rating
          case "الفبا":
            return a.name.localeCompare(b.name)
          case "سال":
            return b.year - a.year
          case "حجم":
            return b.fileSizeKB - a.fileSizeKB
          default:
            return 0
        }
      })
    }

    return filtered
  }, [displayedDatabases, selectedFilters, selectedSort])

  return (
    <div className="holistic-page-wrapper">
      <div className="spline-container">
        <Spline
          className="spline-canvas"
          onLoad={handleSplineLoad}
          scene={
            theme === "dark"
              ? "/robot_dark.splinecode"
              : "/robot_light.splinecode"
          }
        />
      </div>

      <div className="robot-container">
        <div
          className={`holistic-input-container ${
            isTextVisible ? "fade-in-up" : ""
          }`}
        >
          <div ref={modesContainerRef} className="data-finder-modes-container">
            <button
              id="manual"
              onClick={() => handleModeChange("manual")}
              className={`data-finder-mode ${
                activeMode === "manual" ? "active" : ""
              }`}
            >
              دستی
            </button>
            <button
              id="datasaz"
              onClick={() => handleModeChange("datasaz")}
              className={`data-finder-mode ${
                activeMode === "datasaz" ? "active" : ""
              }`}
            >
              داده‌یاب
            </button>

            <button
              id="datayab"
              onClick={() => handleModeChange("datayab")}
              className={`data-finder-mode ${
                activeMode === "datayab" ? "active" : ""
              }`}
            >
              داده‌ساز
            </button>
          </div>
          <div className={`search-controls ${chatInputAnimationClass}`}>
            {activeMode === "manual" && (
              <div className="controls-container">
                <Dropdown
                  showArrow={true}
                  classNames={{
                    content: "rounded-3xl bg-gray1",
                  }}
                >
                  <DropdownTrigger>
                    <Button
                      variant="solid"
                      className="filter-dropdown-trigger rounded-full"
                      style={{
                        backgroundColor: "var(--color-gray1)",
                        color: "var(--color-gray11)",
                        fontFamily: "var(--font-family-persian)",
                        fontWeight: "var(--font-weight-medium)",
                        fontSize: "var(--font-size-sm)",
                        cursor: "pointer",
                      }}
                    >
                      {selectedFilterValue || "فیلتر"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Multiple selection for filtering"
                    variant="flat"
                    closeOnSelect={false}
                    selectionMode="multiple"
                    selectedKeys={selectedFilters}
                    onSelectionChange={(keys) =>
                      setSelectedFilters(keys as "all" | Set<string>)
                    }
                    className="max-h-60 overflow-y-auto scrollbar-thin custom-scrollbar"
                    itemClasses={{
                      base: [
                        "text-[var(--color-gray11)]",
                        "data-[hover=true]:bg-[var(--color-gray3)]",
                        "rounded-full",
                        "px-3",
                      ],
                    }}
                  >
                    {filterTags.map((tag) => (
                      <DropdownItem key={tag}>{tag}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>

                <Dropdown
                  showArrow={true}
                  classNames={{
                    content: "rounded-3xl",
                  }}
                >
                  <DropdownTrigger>
                    <Button
                      variant="solid"
                      className="sort-dropdown-trigger rounded-full"
                      style={{
                        backgroundColor: "var(--color-gray1)",
                        fontFamily: "var(--font-family-persian)",
                        fontWeight: "var(--font-weight-medium)",
                        fontSize: "var(--font-size-sm)",
                        cursor: "pointer",
                      }}
                    >
                      مرتب‌سازی بر اساس:{" "}
                      {typeof selectedSort === "string"
                        ? selectedSort
                        : selectedSort.values().next().value}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Single selection for sorting"
                    variant="flat"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={selectedSort}
                    onSelectionChange={(keys) =>
                      setSelectedSort(keys as "all" | Set<string>)
                    }
                    itemClasses={{
                      base: [
                        "text-[var(--color-gray11)]",
                        "data-[hover=true]:bg-default-100",
                        "rounded-full",
                        "px-3",
                        "font-family: var(--font-family-persian);",
                        "font-weight: var(--font-weight-medium);",
                        "font-size: var(--font-size-sm);",
                      ],
                    }}
                  >
                    <DropdownItem key="امتیاز">امتیاز</DropdownItem>
                    <DropdownItem key="الفبا">الفبا</DropdownItem>
                    <DropdownItem key="سال">سال</DropdownItem>
                    <DropdownItem key="حجم">حجم</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            )}
            <div className={`input-refresh-container step-${chatInputStep}`}>
              {activeMode === "manual" && (
                <AnimatePresence>
                  {searchAttempted && (
                    <motion.div
                      key="refresh-fab"
                      className="refresh-fab"
                      variants={refreshButtonVariants(false)}
                      initial="hidden"
                      animate={"visibleStep1"}
                      exit="hidden"
                      onClick={handleClearSearch}
                      onMouseDown={(e) => e.preventDefault()}
                      role="button"
                      aria-label="Refresh results"
                    >
                      <RefreshIcon />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
              <ChatInput
                className="chat-input-override"
                buttonText={chatInputConfig[activeMode].buttonText}
                placeholderText={chatInputConfig[activeMode].placeholderText}
                onSubmit={activeMode === "manual" ? handleSearch : undefined}
                onStepChange={setChatInputStep}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`data-container ${dataContainerAnimationClass} ${
          activeMode === "manual" ? "manual-mode" : ""
        }`}
      >
        {activeMode === "datayab" ? (
          <div className="generated-image-container">
            <img
              src={generatedImage}
              alt="Generated Data Visualization"
              className="generated-image"
            />
          </div>
        ) : (
          <>
            {processedDatabases.length === 0 &&
            (searchAttempted ||
              (selectedFilters instanceof Set && selectedFilters.size > 0)) ? (
              <div className="no-results-message">
                <p>متاسفانه داده‌ای مطابق با جستجوی شما یافت نشد.</p>
                <p>لطفاً کلیدواژه‌های دیگری را امتحان کنید.</p>
              </div>
            ) : (
              <>
                <div className="data-column">
                  {processedDatabases
                    .filter((_, index) => index % 2 === 0)
                    .map((db, index) => (
                      <DataCard
                        key={db.name}
                        size={db.fileSizeKB}
                        year={db.year}
                        rating={db.rating}
                        title={db.name}
                        description={db.shortDescription}
                        tags={db.datasetVariables}
                        dataTypes={db.dataTypes}
                        reference={db.reference}
                        isVisible={isDataVisible}
                        animationDelay={index * 300} // Adjusted delay for column-based animation
                      />
                    ))}
                </div>
                <div className="data-column">
                  {processedDatabases
                    .filter((_, index) => index % 2 !== 0)
                    .map((db, index) => (
                      <DataCard
                        key={db.name}
                        size={db.fileSizeKB}
                        year={db.year}
                        rating={db.rating}
                        title={db.name}
                        description={db.shortDescription}
                        tags={db.datasetVariables}
                        dataTypes={db.dataTypes}
                        reference={db.reference}
                        isVisible={isDataVisible}
                        animationDelay={150 + index * 300} // Adjusted delay for column-based animation
                      />
                    ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
