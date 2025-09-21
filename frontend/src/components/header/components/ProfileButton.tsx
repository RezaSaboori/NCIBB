import { Icon } from "@iconify/react"
import { IconButtonProps } from "../types"

export const ProfileButton = ({
  className,
  ariaLabel,
  title,
  onClick,
}: IconButtonProps) => {
  return (
    <fieldset className="header-nav header-nav--icon">
      <legend className="header-nav__legend">User Profile</legend>
      <button
        className={`header-nav__control ${className || ""}`}
        aria-label={ariaLabel}
        title={title}
        onClick={onClick}
      >
        <Icon
          icon="typcn:user"
          className="header-nav__icon"
          width="100%"
          height="100%"
        />
      </button>
    </fieldset>
  )
}
