import { ReactNode } from "react"
import { HeroUIProvider } from "@heroui/react"
import { ThemeContextProvider, useTheme } from "./ThemeContext"

interface ThemeProviderProps {
  children: ReactNode
}

const ThemedHeroUIProvider = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme()
  return (
    <HeroUIProvider key={theme} theme={theme}>
      {children}
    </HeroUIProvider>
  )
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <ThemeContextProvider>
      <ThemedHeroUIProvider>{children}</ThemedHeroUIProvider>
    </ThemeContextProvider>
  )
}
