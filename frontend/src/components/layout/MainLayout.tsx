import React from "react"
import { Header } from "../header/Header"

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="text-foreground bg-background">
      <Header />
      <main>{children}</main>
    </div>
  )
}

export default MainLayout
