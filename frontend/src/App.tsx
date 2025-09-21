import { Route, Routes } from "react-router-dom"
import MainLayout from "@/layouts/default"
import {
  HomePage,
  AboutPage,
  ContactPage,
  ResourcesPage,
  ServicesPage,
} from "@/pages"

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/services" element={<ServicesPage />} />
      </Routes>
    </MainLayout>
  )
}

export default App
