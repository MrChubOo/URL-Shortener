import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~~/server/db'
import type { Link } from '~~/server/db/schema'
import { link, stats } from '~~/server/db/schema'
import type { ApiResponse } from '~~/types'

const validateSchema = z.object({
  code: z.string({ required_error: 'Code is required' })
})

export default defineEventHandler(async (event): Promise<ApiResponse<Link>> => {
  const result = await readValidatedBody(event, body => validateSchema.safeParse(body))
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0].message
    }
  }

  const { code } = result.data

  const codeExist = await db.select().from(link).where(eq(link.code, code))
  if (!codeExist) {
    return {
      success: false,
      error: 'URL not found'
    }
  }

  const linkId = codeExist[0].id
  const clickCount = codeExist[0].click + 1
  await db.update(link).set({ click: clickCount }).where(eq(link.id, linkId))

  await db.insert(stats).values({
    linkId
  })

  return {
    success: true,
    data: codeExist[0]
  }
})
