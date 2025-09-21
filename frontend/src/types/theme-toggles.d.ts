declare module "@theme-toggles/react" {
  import { ComponentType, ButtonHTMLAttributes } from "react"

  export interface AroundProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    duration?: number
    toggled?: boolean
    toggle?: (toggled: boolean) => void
    onToggle?: (toggled: boolean) => void
    reversed?: boolean
    forceMotion?: boolean
    idPrefix?: string
  }

  export const Around: ComponentType<AroundProps>
}
