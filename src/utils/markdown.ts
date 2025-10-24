import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

// 创建markdown-it实例
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${
          hljs.highlight(str, { language: lang }).value
        }</code></pre>`
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  },
})

// 自定义规则：处理标题添加锚点
md.renderer.rules.heading_open = (tokens, idx) => {
  const token = tokens[idx]
  const level = token.tag.slice(1)
  const nextToken = tokens[idx + 1]
  const text = nextToken ? nextToken.content : ''
  const id = text.toLowerCase().replace(/[^\w]+/g, '-')

  return `<${token.tag} id="${id}">`
}

// 导出markdown解析函数
export const parseMarkdown = (content: string): string => {
  return md.render(content)
}

// 导出提取文章信息的函数
export const extractMarkdownMeta = (content: string) => {
  // 简单的frontmatter解析
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)

  if (match) {
    try {
      // 简单的YAML解析（这里只处理基本的key: value）
      const frontmatterText = match[1]
      const meta: Record<string, any> = {}

      frontmatterText.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':')
        if (key && valueParts.length) {
          const value = valueParts.join(':').trim()
          meta[key.trim()] = value.replace(/^["']|["']$/g, '') // 移除引号
        }
      })

      const markdownContent = content.replace(frontmatterRegex, '').trim()
      return {
        meta,
        content: markdownContent
      }
    } catch (error) {
      console.error('解析frontmatter失败:', error)
    }
  }

  return {
    meta: {},
    content
  }
}

export default md