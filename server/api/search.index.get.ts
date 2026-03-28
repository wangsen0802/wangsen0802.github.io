/**
 * 获取所有文章用于搜索索引
 * 这个 API 在服务端运行，返回所有文章的元数据
 */

/** Content 查询结果类型 */
interface ContentDoc {
  title?: string
  description?: string
  path?: string
  tags?: string[]
  date?: string
}

export default defineEventHandler(async (event) => {
  try {
    // 使用 queryCollection 查询所有文章
    const articles = await queryCollection(event, 'content').all()

    // 过滤出文章类型的文档
    const posts = articles.filter((doc: ContentDoc) => {
      // 只包含有标题的文档（排除目录等）
      return doc.title && doc.path && !doc.path.endsWith('/index')
    })

    // 转换为搜索文档格式
    const searchDocuments = posts.map((doc: ContentDoc) => {
      // 从路径中提取分类和 ID
      const pathSegments = doc.path.split('/').filter(Boolean)
      const category = pathSegments[0] || 'uncategorized'
      const id = pathSegments.slice(1).join('/') || doc.title.toLowerCase().replace(/\s+/g, '-')

      return {
        id,
        title: doc.title || '',
        description: doc.description || '',
        category,
        tags: doc.tags || [],
        date: doc.date || new Date().toISOString().split('T')[0],
      }
    })

    return {
      success: true,
      data: searchDocuments,
      total: searchDocuments.length,
    }
  } catch (error) {
    console.error('获取搜索索引失败:', error)
    return {
      success: false,
      error: '获取搜索索引失败',
      data: [],
      total: 0,
    }
  }
})
