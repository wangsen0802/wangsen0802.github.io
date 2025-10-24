// 从posts目录读取所有文章的元数据
export interface PostMeta {
  id: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  category: string
  content?: string
}

export interface Category {
  name: string
  path: string
  description: string
  count: number
}

// 动态导入所有文章
const postModules = import.meta.glob('/src/posts/**/*.md', { as: 'raw' })

export async function getAllPosts(): Promise<PostMeta[]> {
  const posts: PostMeta[] = []

  for (const path in postModules) {
    try {
      const content = await postModules[path]()
      const { meta } = extractMarkdownMeta(content)

      // 从路径提取分类和文件名
      const pathParts = path.split('/')
      const category = pathParts[pathParts.length - 2]
      const fileName = pathParts[pathParts.length - 1].replace('.md', '')

      posts.push({
        id: fileName,
        title: meta.title || fileName,
        description: meta.description || '',
        date: meta.date || new Date().toISOString().split('T')[0],
        author: meta.author || '王森',
        tags: meta.tags ? (meta.tags as string).split(',').map((tag: string) => tag.trim()) : [],
        category,
        content
      })
    } catch (error) {
      console.error(`读取文章失败: ${path}`, error)
    }
  }

  // 按日期排序（最新的在前）
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostsByCategory(category: string): Promise<PostMeta[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter(post => post.category === category)
}

export async function getPost(category: string, id: string): Promise<PostMeta | null> {
  const allPosts = await getAllPosts()
  return allPosts.find(post => post.category === category && post.id === id) || null
}

export async function getCategories(): Promise<Category[]> {
  const allPosts = await getAllPosts()
  const categoryMap = new Map<string, number>()

  allPosts.forEach(post => {
    categoryMap.set(post.category, (categoryMap.get(post.category) || 0) + 1)
  })

  const categories: Category[] = []
  const categoryNames = {
    'vue': 'Vue.js',
    'gis': 'GIS',
    'frontend': '前端开发'
  }

  const categoryDescriptions = {
    'vue': 'Vue.js 相关技术和最佳实践',
    'gis': 'GIS 地理信息系统开发',
    'frontend': '前端开发技术和工具'
  }

  for (const [category, count] of categoryMap.entries()) {
    categories.push({
      name: categoryNames[category as keyof typeof categoryNames] || category,
      path: category,
      description: categoryDescriptions[category as keyof typeof categoryDescriptions] || '',
      count
    })
  }

  return categories.sort((a, b) => a.name.localeCompare(b.name))
}

// 简单的frontmatter解析函数
function extractMarkdownMeta(content: string) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)

  if (match) {
    try {
      const frontmatterText = match[1]
      const meta: Record<string, any> = {}

      frontmatterText.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':')
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim()
          const value = line.substring(colonIndex + 1).trim()
          meta[key] = value.replace(/^["']|["']$/g, '') // 移除引号
        }
      })

      return { meta, content: content.replace(frontmatterRegex, '').trim() }
    } catch (error) {
      console.error('解析frontmatter失败:', error)
    }
  }

  return { meta: {}, content }
}