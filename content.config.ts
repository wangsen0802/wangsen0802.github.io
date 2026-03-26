import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        category: z.string(),
        date: z.string(),
        author: z.string().optional(),
        tags: z.array(z.string()).optional(),
        cover: z.string().optional(),
        updated: z.string().optional(),
      }),
    }),
  },
})
