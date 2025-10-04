// @ts-nocheck
import { useState } from "react"
import Spline from "@splinetool/react-spline"
import { useTheme } from "@/components/theme/ThemeContext"
import { ChatInput } from "@/components/ChatInput"
import "./styles.css"

export const ServicesPage = () => {
  const { theme } = useTheme()
  const [isTextVisible, setIsTextVisible] = useState(false)

  const handleSplineLoad = () => {
    setTimeout(() => {
      setIsTextVisible(true)
    }, 2000)
  }

  return (
    <div className="robot-container">
      <div
        className={`text-overlay frosted-container ${
          isTextVisible ? "fade-in-up" : ""
        }`}
      >
        درخواستتون رو این پایین بنویسین
      </div>

      <ChatInput
        className={`${isTextVisible ? "fade-in-up" : ""}`}
        buttonText="داده‌ای که می‌خواهید جستجو کنید رو توصیف کنید"
        placeholderText="سعی کنید درخواستتون رو دقیق و کامل توصیف کنید"
      />

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
  )
}
