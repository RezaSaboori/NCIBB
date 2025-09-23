// frontend/src/components/profile/__tests__/ProfileForm.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { HeroUIProvider } from "@heroui/react"
import ProfileForm from "../ProfileForm"

const renderWithProvider = (component) => {
  return render(<HeroUIProvider>{component}</HeroUIProvider>)
}

describe("ProfileForm", () => {
  const mockProfileData = {
    profile: {
      first_name: "John",
      last_name: "Doe",
      bio: "Test bio",
    },
  }

  test("renders profile form", () => {
    renderWithProvider(
      <ProfileForm
        profileData={mockProfileData}
        onUpdate={() => {}}
        saving={false}
        onRefresh={() => {}}
      />
    )

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
  })
})
