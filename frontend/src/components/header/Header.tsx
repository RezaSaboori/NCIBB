import { Around } from "@theme-toggles/react"
import "@theme-toggles/react/css/Around.css"

import { HeaderProps, NavigationItem } from "./types"
import { useActiveIndicator } from "./hooks/useActiveIndicator"
import { useTheme } from "../theme"
import { HomeButton } from "./components/HomeButton"
import { ProfileButton } from "./components/ProfileButton"
import { ThemeToggle } from "./components/ThemeToggle"
import { Navigation } from "./components/Navigation"
import { LoginModal } from "./components/LoginModal"
import { useState } from "react"
import "./styles/header.css"

const navigationItems: NavigationItem[] = [
  { value: "home", label: "خانه", checked: true },
  { value: "services", label: "خدمات" },
  { value: "resources", label: "منابع" },
  { value: "about", label: "درباره ما" },
  { value: "contact", label: "تماس با ما" },
]

export const Header = ({ className }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useActiveIndicator()

  const handleProfileClick = () => {
    setIsModalOpen(true)
  }

  return (
    <div className={`header-container ${className || ""}`}>
      <HomeButton ariaLabel="Home" title="Home" />

      <Navigation items={navigationItems} />

      <ProfileButton
        ariaLabel="Profile"
        title="User Profile"
        onClick={handleProfileClick}
      />

      <ThemeToggle
        isToggled={theme === "dark"}
        onToggle={() => toggleTheme()}
      />

      <LoginModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  )
}
