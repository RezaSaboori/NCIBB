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
      if (!activeItem) return

      const indicatorWidth = activeItem.offsetWidth
      const indicatorLeft = activeItem.offsetLeft

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
