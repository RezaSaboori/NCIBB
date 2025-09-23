import { Icon } from "@iconify/react"
import { IconButtonProps } from "../types"

export const HomeButton = ({
  className,
  ariaLabel,
  title,
}: IconButtonProps) => {
  return (
    <fieldset className="header-nav header-nav--icon">
      <legend className="header-nav__legend">Home</legend>
      <button
        className={`header-nav__control ${className || ""}`}
        aria-label={ariaLabel}
        title={title}
      >
        <div className="home-icon-wrapper">
          <Icon
            icon="material-symbols-light:home-rounded"
            className="header-nav__icon"
            width="100%"
            height="100%"
          />
        </div>
      </button>
    </fieldset>
  )
}
