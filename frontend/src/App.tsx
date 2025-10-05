import { Route, Routes } from "react-router-dom"
import MainLayout from "@/layouts/default"
import Page from "./pages/Page"
import ProfileManager from "./components/profile/ProfileManager"
import { DatasetPage } from "./pages/dataset"

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Page pageName="home" />} />
        <Route path="/about" element={<Page pageName="about" />} />
        <Route path="/contact" element={<Page pageName="contact" />} />
        <Route path="/resources" element={<Page pageName="resources" />} />
        <Route path="/dataset" element={<DatasetPage />} />
        <Route path="/profile" element={<ProfileManager />} />
      </Route>
    </Routes>
  )
}

export default App
