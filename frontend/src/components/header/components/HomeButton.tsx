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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          className="header-nav__icon"
        >
          <path
            fill="currentColor"
            d="m12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"
          />
        </svg>
      </button>
    </fieldset>
  )
}
