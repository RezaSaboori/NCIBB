import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export const useActiveIndicator = () => {
  const location = useLocation()

  useEffect(() => {
    const navMenu = document.querySelector(".header-nav__menu")

    const updateActiveIndicator = () => {
      if (!navMenu) return
      const activeItem = navMenu.querySelector(
        ".header-nav__item input:checked"
      )?.parentElement

      if (!activeItem) {
        // Hide indicator with smooth fade-out animation
        ;(navMenu as HTMLElement).style.setProperty(
          "--active-indicator-opacity",
          "0"
        )
        // Delay width/position reset to allow fade-out to complete
        setTimeout(() => {
          ;(navMenu as HTMLElement).style.setProperty(
            "--active-indicator-width",
            "0px"
          )
          ;(navMenu as HTMLElement).style.setProperty(
            "--active-indicator-left",
            "0px"
          )
        }, 200) // Match the transition duration
        return
      }

      const indicatorWidth = activeItem.offsetWidth
      const indicatorLeft = activeItem.offsetLeft

      // Show indicator with smooth fade-in animation
      ;(navMenu as HTMLElement).style.setProperty(
        "--active-indicator-opacity",
        "1"
      )
      ;(navMenu as HTMLElement).style.setProperty(
        "--active-indicator-width",
        `${indicatorWidth}px`
      )
      ;(navMenu as HTMLElement).style.setProperty(
        "--active-indicator-left",
        `${indicatorLeft}px`
      )
    }

    // Update on route change and resize
    updateActiveIndicator()
    window.addEventListener("resize", updateActiveIndicator)

    return () => {
      window.removeEventListener("resize", updateActiveIndicator)
    }
  }, [location])
}
