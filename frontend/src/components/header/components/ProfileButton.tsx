import { Icon } from "@iconify/react"
import { useDisclosure } from "@heroui/react"
import { IconButtonProps } from "../types"
import { AuthModal } from "../../auth/modal/AuthModal"

export const ProfileButton = ({
  className,
  ariaLabel,
  title,
}: Omit<IconButtonProps, "onClick">) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <>
      <fieldset className="header-nav header-nav--icon">
        <legend className="header-nav__legend">User Profile</legend>
        <button
          className={`header-nav__control ${className || ""}`}
          aria-label={ariaLabel}
          title={title}
          onClick={onOpen}
        >
          <Icon
            icon="typcn:user"
            className="header-nav__icon"
            width="100%"
            height="100%"
          />
        </button>
      </fieldset>
      <AuthModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  )
}
