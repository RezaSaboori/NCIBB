import React, { useState, useEffect } from "react"
import { getPageData } from "../services/api"
import { Hero } from "../components/marketing/Hero"
import { FeatureGrid } from "../components/marketing/FeatureGrid"
import { CallToAction } from "../components/marketing/CallToAction"

const componentMap = {
  Hero: Hero,
  FeatureGrid: FeatureGrid,
  CallToAction: CallToAction,
}

interface PageProps {
  pageName: string
}

const Page: React.FC<PageProps> = ({ pageName }) => {
  const [pageData, setPageData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true)
        const response = await getPageData(pageName)
        const page = response.data

        let contentData = page.content
        if (typeof contentData === "string") {
          try {
            contentData = JSON.parse(contentData)
          } catch (e) {
            console.error("Failed to parse page content:", e)
            setError(`Failed to parse content for ${pageName} page.`)
            return
          }
        }

        setPageData(contentData)
      } catch (err) {
        setError(`Failed to load ${pageName} page data.`)
        console.error(`Error fetching ${pageName} page data:`, err)
      } finally {
        setLoading(false)
      }
    }

    fetchPageData()
  }, [pageName])

  if (loading)
    return (
      <div className="container mx-auto px-6 py-20 text-center">Loading...</div>
    )
  if (error)
    return (
      <div className="container mx-auto px-6 py-20 text-center text-red-500">
        {error}
      </div>
    )
  if (!pageData || !pageData.sections)
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        Page content not found.
      </div>
    )

  return (
    <div>
      {pageData.sections.map((section: any, index: number) => {
        const Component = componentMap[section.component]
        return Component ? <Component key={index} {...section.props} /> : null
      })}
    </div>
  )
}

export default Page
