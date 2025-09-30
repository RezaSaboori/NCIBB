import React from "react"

declare module "./ProfileForm" {
  const Component: React.ComponentType<any>
  export default Component
}

declare module "./ProfileForm.jsx" {
  const Component: React.ComponentType<any>
  export default Component
}

declare module "./SecuritySettings" {
  const Component: React.ComponentType<any>
  export default Component
}

declare module "./SecuritySettings.jsx" {
  const Component: React.ComponentType<any>
  export default Component
}

declare module "./PreferencesSettings" {
  const Component: React.ComponentType<any>
  export default Component
}

declare module "./PreferencesSettings.jsx" {
  const Component: React.ComponentType<any>
  export default Component
}

declare module "./ActivityLog" {
  const Component: React.ComponentType<any>
  export default Component
}

declare module "./ActivityLog.jsx" {
  const Component: React.ComponentType<any>
  export default Component
}

declare module "../../services/profileService" {
  export const profileService: any
}
