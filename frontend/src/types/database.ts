export type DataType =
  | "image"
  | "text"
  | "sequence"
  | "omics"
  | "table"
  | "signal"

export interface DatabaseInfo {
  name: string
  shortDescription: string
  year: number
  reference: string
  fileSize: string
  fileSizeKB: number
  datasetVariables: string[]
  dataTypes: DataType[]
  topics: string[]
  description: string
  rating: number
}
