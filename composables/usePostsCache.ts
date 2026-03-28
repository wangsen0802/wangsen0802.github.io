/**
 * 文章数据缓存 Composable
 * 封装 @nuxt/content 查询逻辑，提供统一的文章状态管理
 */
import type { Post, Category } from '~/types'

export const usePostsCache = () => {
  // 获取所有文章（useAsyncData 内置缓存）
  const { data: posts, refresh } = useAsyncData('all-posts', () =>
    queryCollection('content').order('date', 'DESC').all()
  )

  // 提取分类列表
  const categories = computed<Category[]>(() => {
    if (!posts.value) return []
    const categoryMap = new Map<string, number>()
    posts.value.forEach((post) => {
      const category = (post as Post).category || 'other'
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
    })
    return Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      slug: name,
      count,
    }))
  })

  // 按分类过滤文章
  const getPostsByCategory = (category: string | null) => {
    return computed(() => {
      if (!posts.value) return []
      if (!category) return posts.value
      return posts.value.filter((post) => (post as Post).category === category)
    })
  }

  // 按路径获取单篇文章
  const getPostByPath = (path: string) => {
    return useAsyncData(`post-${path}`, () =>
      queryCollection('content')
        .where('path', '=', path)
        .first()
    )
  }

  // 刷新文章缓存
  const refreshPosts = () => refresh()

  return {
    posts,
    categories,
    getPostsByCategory,
    getPostByPath,
    refreshPosts,
  }
}
