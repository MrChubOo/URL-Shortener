import { and, eq, sql } from 'drizzle-orm'
import { db } from '~~/server/db'
import { link, stats } from '~~/server/db/schema'
import type { ClickData } from '~~/types'

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const code = query.code as string
  const year = query.year as string

  // Step 1: Look up the link in the 'links' table by 'code'
  const linkRecord = await db.select()
    .from(link)
    .where(eq(link.code, code))
    .then(results => results[0])

  // If the link does not exist, return null
  if (!linkRecord) {
    return null
  }

  const linkId = linkRecord.id

  // Query for monthly clicks by year
  const result = await db.select({
    year: sql`EXTRACT(YEAR FROM ${stats.createdAt})`.as<number>(),
    month: sql`EXTRACT(MONTH FROM ${stats.createdAt})`.as<number>(),
    clicks: sql`COUNT(${stats.id})`.as<number>()
  })
    .from(stats)
    .where(
      and(
        code ? eq(stats.linkId, linkId) : undefined,
        year ? eq(sql`EXTRACT(YEAR FROM ${stats.createdAt})`, year) : undefined
      )
    )
    .groupBy(sql`EXTRACT(YEAR FROM ${stats.createdAt}), EXTRACT(MONTH FROM ${stats.createdAt})`)
    .execute()

  // Transform query result to match ClickData format
  const clickData: ClickData = {}

  result.forEach((row) => {
    const year = row.year
    const month = row.month
    const clicks = row.clicks

    if (!clickData[year]) {
      clickData[year] = {
        totalClicks: 0,
        monthlyClicks: Array.from({ length: 12 }, (_, i) => ({
          month: MONTH_NAMES[i],
          clicks: 0
        }))
      }
    }

    clickData[year].totalClicks += clicks
    clickData[year].monthlyClicks[month - 1].clicks = clicks
  })

  // get distinct years per link
  const yearResult = await db.select({
    year: sql`DISTINCT EXTRACT(YEAR FROM ${stats.createdAt})`.as<number>()
  })
    .from(stats).where(linkId ? eq(stats.linkId, linkId) : undefined)

  const years = yearResult.map(row => row.year.toString())

  return {
    clickData,
    years
  }
})
