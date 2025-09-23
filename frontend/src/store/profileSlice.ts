import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { profileService } from "../services/profileService"

export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await profileService.getCurrentProfile()
      return data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await profileService.updateProfile(profileData)
      return data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const initialState = {
  profile: null,
  loading: false,
  error: null,
}

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = { ...state.profile, ...action.payload }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearProfile } = profileSlice.actions

export default profileSlice.reducer
