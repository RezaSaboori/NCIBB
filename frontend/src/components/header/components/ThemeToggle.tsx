import { Around } from "@theme-toggles/react"
import { ThemeToggleProps } from "../types"

export const ThemeToggle = ({
  isToggled,
  onToggle,
  className,
}: ThemeToggleProps) => {
  return (
    <fieldset className="header-nav header-nav--icon">
      <legend className="header-nav__legend">Toggle Dark Mode</legend>
      <Around
        duration={750}
        toggled={isToggled}
        toggle={onToggle}
        className={`header-nav__control ${className || ""}`}
        id="dark-mode-toggle"
        aria-label="Toggle Dark Mode"
        title="Toggle Dark Mode"
      />
    </fieldset>
  )
}
