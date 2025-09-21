import axios from "axios"

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
})

export const getPageData = (pageName: string) => {
  return apiClient.get(`/pages/${pageName}/`)
}
