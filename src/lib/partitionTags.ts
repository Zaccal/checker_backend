import type { TagInputSchema } from '@/schemas/todos.schemas.js'

export function partitionTags(tags?: TagInputSchema[]) {
  const tagConnections = []
  const newTags = []

  if (tags) {
    for (const tag of tags) {
      if (typeof tag === 'string') {
        tagConnections.push({ id: tag })
      } else {
        newTags.push(tag)
      }
    }
  }

  return {
    tagConnections,
    newTags,
  }
}
