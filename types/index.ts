export type MonthlyClickData = {
  month: string
  clicks: number
}

export type YearlyClickData = {
  totalClicks: number
  monthlyClicks: MonthlyClickData[]
}

export type ClickData = {
  [year: string]: YearlyClickData
}

export type ApiResponse<T> = {
  success: true
  data: T
} | {
  success: false
  error: string
}
