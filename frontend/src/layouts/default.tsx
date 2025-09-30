import { Header } from "@/components/header"
import { useState } from "react"
import { Outlet } from "react-router-dom"

export default function DefaultLayout() {
  const [sidebar, setSidebar] = useState<React.ReactNode | null>(null)

  return (
    <div className="relative flex flex-col h-screen">
      <Header />
      {sidebar ? (
        <div className="flex flex-1">
          {sidebar}
          <main className="flex-grow pt-16 pr-[calc(260px+2rem)] pl-6 w-full max-w-none">
            <Outlet context={{ setSidebar }} />
          </main>
        </div>
      ) : (
        <main className="flex-grow pt-16 px-6 w-full max-w-none">
          <Outlet context={{ setSidebar }} />
        </main>
      )}
      <footer className="w-full flex items-center justify-center py-3">
        <span className="text-default-600">طراحی شده توسط NCIBB</span>
      </footer>
    </div>
  )
}
