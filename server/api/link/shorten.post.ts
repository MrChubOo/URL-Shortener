import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { db } from '~~/server/db'
import type { Link } from '~~/server/db/schema'
import { link } from '~~/server/db/schema'
import type { ApiResponse } from '~~/types'

const shortenSchema = z.object({
  longUrl: z.string({ required_error: 'URL is required' }).url({ message: 'Invalid URL' })
})

async function generateCode() {
  let code: string = ''
  let exists = true
  while (exists) {
    code = nanoid(6)
    const existingCode = await db.select().from(link).where(eq(link.code, code))
    if (!existingCode.length) {
      exists = false
    }
  }
  return code
}

export default defineEventHandler(async (event): Promise<ApiResponse<Link>> => {
  const result = await readValidatedBody(event, body => shortenSchema.safeParse(body))
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0].message
    }
  }

  const { longUrl } = result.data
  const code = await generateCode()

  const linkResult = await db.insert(link).values({
    code,
    longUrl
  }).returning()

  return {
    success: true,
    data: linkResult[0]
  }
})
