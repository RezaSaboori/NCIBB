import { useState, useEffect } from "react"
import { getPageData } from "@/services/api"

interface PageProps {
  pageName: string
}

export const Page = ({ pageName }: PageProps) => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await getPageData(pageName)
        setTitle(response.data.title)
        setContent(response.data.content)
      } catch (error) {
        console.error(`Error fetching ${pageName} page data:`, error)
        // Set default error content
        setTitle("Error")
        setContent("Could not load page content.")
      }
    }

    fetchPageData()
  }, [pageName])

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  )
}
