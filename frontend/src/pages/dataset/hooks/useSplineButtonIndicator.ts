import { useEffect } from "react"

export const useSplineButtonIndicator = (
  containerRef: React.RefObject<HTMLDivElement>,
  activeButtonId: string | null
) => {
  useEffect(() => {
    const updateActiveIndicator = () => {
      if (!containerRef.current) return
      const container = containerRef.current

      const activeItem = activeButtonId
        ? container.querySelector<HTMLElement>(`#${activeButtonId}`)
        : null

      if (!activeItem) {
        container.style.setProperty("--active-indicator-opacity", "0")
        setTimeout(() => {
          container.style.setProperty("--active-indicator-width", "0px")
          container.style.setProperty("--active-indicator-left", "0px")
        }, 200)
        return
      }

      const indicatorWidth = activeItem.offsetWidth
      const indicatorLeft = activeItem.offsetLeft

      container.style.setProperty("--active-indicator-opacity", "1")
      container.style.setProperty(
        "--active-indicator-width",
        `${indicatorWidth}px`
      )
      container.style.setProperty(
        "--active-indicator-left",
        `${indicatorLeft}px`
      )
    }

    updateActiveIndicator()
    window.addEventListener("resize", updateActiveIndicator)

    return () => {
      window.removeEventListener("resize", updateActiveIndicator)
    }
  }, [activeButtonId, containerRef])
}
