export default defineEventHandler(async (event) => {
  const posts = await queryCollection(event, 'content').all()

  return posts
    .filter((post) => post.path)
    .map((post) => ({
      loc: `/posts${post.path}`,
      lastmod: post.updated || post.date,
      priority: 0.8,
      changefreq: 'monthly',
    }))
})
