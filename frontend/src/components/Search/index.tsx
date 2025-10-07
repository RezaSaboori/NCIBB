import { getDatabases } from "@/pages/dataset/utils/csv"
import { DatabaseInfo } from "@/types/database"

export const searchInCsv = async (query: string): Promise<DatabaseInfo[]> => {
  const data = await getDatabases()
  const searchTerms = query.toLowerCase().split(" ")

  return data.filter((row) => {
    const searchableString = Object.values(row).join(" ").toLowerCase()
    return searchTerms.every((term) => searchableString.includes(term))
  })
}
