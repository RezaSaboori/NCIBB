import { Header } from "@/components/header"
import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Footer } from "@/components/global/Footer"

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
      <div className="pb-4">
        <Footer />
      </div>
    </div>
  )
}
