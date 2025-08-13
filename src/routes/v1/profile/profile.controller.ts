import { getPrisma } from '@/config/prisma.js'
import { Prisma } from '@/generated/prisma/index.js'
import { PROFILE_SELECT } from '@/lib/constants.js'
import type { ContextAuth } from '@/lib/types.js'

export async function getProfile(c: ContextAuth) {
  const user = c.get('user')

  try {
    const profile = await getPrisma().user.findUnique({
      where: {
        id: user.id,
      },
      select: PROFILE_SELECT,
    })

    if (!profile) {
      return c.json({ message: 'User not found' }, 404)
    }

    return c.json(profile, 200)
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Error
    ) {
      return c.text(
        `An error occurred while getting the profile: ${error.message}`,
        500,
      )
    }

    return c.text('An error occurred while getting the profile', 500)
  }
}
