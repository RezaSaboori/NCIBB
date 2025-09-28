import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"

interface ThemeContextType {
  theme: "light" | "dark"
  toggleTheme: () => void
  setTheme: (theme: "light" | "dark") => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeContextProviderProps {
  children: ReactNode
}

export const ThemeContextProvider = ({
  children,
}: ThemeContextProviderProps) => {
  const [theme, setThemeState] = useState<"light" | "dark">(() => {
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem("theme") as "light" | "dark"
    return savedTheme || "light"
  })

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute("data-theme", theme)

    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeContextProvider")
  }
  return context
}
