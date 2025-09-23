import { Route, Routes } from "react-router-dom"
import MainLayout from "@/layouts/default"
import Page from "./pages/Page"
import ProfileManager from "./components/profile/ProfileManager"

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Page pageName="home" />} />
        <Route path="/about" element={<Page pageName="about" />} />
        <Route path="/contact" element={<Page pageName="contact" />} />
        <Route path="/resources" element={<Page pageName="resources" />} />
        <Route path="/services" element={<Page pageName="services" />} />
        <Route path="/profile" element={<ProfileManager />} />
      </Routes>
    </MainLayout>
  )
}

export default App
