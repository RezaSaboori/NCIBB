// @ts-nocheck
import { useState, useRef } from "react"
import Spline from "@splinetool/react-spline"
import { useTheme } from "@/components/theme/ThemeContext"
import { ChatInput } from "@/components/ChatInput"
import { DataCard } from "@/components/DataCard"
import { useSplineButtonIndicator } from "./hooks/useSplineButtonIndicator"
import "./styles.css"

const TARGET_ID = "b647ec01-9216-4d75-8e14-935351259d8f" // from Copy Development Object ID in Spline

export const DatasetPage = () => {
  const { theme } = useTheme()
  const [isTextVisible, setIsTextVisible] = useState(false)
  const [activeButton, setActiveButton] = useState("datasaz")
  const appRef = useRef(null)
  const objRef = useRef(null)
  const buttonsContainerRef = useRef(null)

  useSplineButtonIndicator(buttonsContainerRef, activeButton)

  const handleSplineLoad = (app) => {
    appRef.current = app
    objRef.current = app.findObjectById(TARGET_ID)
    setTimeout(() => {
      setIsTextVisible(true)
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

  return (
    <div>
      <div className="robot-container">
        <div
          className={`chat-input-container ${
            isTextVisible ? "fade-in-up" : ""
          }`}
        >
          <div ref={buttonsContainerRef} className="spline-buttons-container">
            <button
              id="manual"
              onClick={() => {
                toState2()
                setActiveButton("manual")
              }}
              className={`spline-button ${
                activeButton === "manual" ? "active" : ""
              }`}
            >
              دستی
            </button>
            <button
              id="datasaz"
              onClick={() => {
                toBase()
                setActiveButton("datasaz")
              }}
              className={`spline-button ${
                activeButton === "datasaz" ? "active" : ""
              }`}
            >
              داده‌یاب
            </button>

            <button
              id="datayab"
              onClick={() => {
                toState()
                setActiveButton("datayab")
              }}
              className={`spline-button ${
                activeButton === "datayab" ? "active" : ""
              }`}
            >
              داده‌ساز
            </button>
          </div>

          <div className="chat-input-wrapper">
            <ChatInput
              className="chat-input-override"
              buttonText="داده‌ای که می‌خواهید جستجو کنید رو توصیف کنید."
              placeholderText="سعی کنید درخواستتون رو دقیق و کامل توصیف کنید."
            />
          </div>
        </div>

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
      </div>
      <div className="data-container">
        <DataCard
          size="38.0 MB"
          year="2014"
          rating={2}
          title="CTU-CHB Intrapartum Cardiotocography Database"
          description="552 cardiotocography records collected between 2010 and 2012 at the Czech Technical University and University Hospital in Brno."
          tags={["fetal", "multiparameter", "heart rate"]}
        />
      </div>
    </div>
  )
}
