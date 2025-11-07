import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import { processImagePath, createPlaceholderSVG } from './image'
// import type Token from 'markdown-it/lib/token'

// 创建markdown-it实例
const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${
          hljs.highlight(str, { language: lang }).value
        }</code></pre>`
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

// 自定义规则：处理标题添加锚点
md.renderer.rules.heading_open = (tokens: any[], idx: number) => {
  const token = tokens[idx]
  const nextToken = tokens[idx + 1]
  const text = nextToken ? nextToken.content : ''
  const id = text.toLowerCase().replace(/[^\w]+/g, '-')

  return `<${token.tag} id="${id}">`
}

// 自定义规则：处理链接在新标签页打开
md.renderer.rules.link_open = (tokens: any[], idx: number) => {
  const token = tokens[idx]
  const hrefIndex = token.attrIndex('href')

  if (hrefIndex >= 0) {
    const href = token.attrs![hrefIndex][1]

    // 检查是否为外部链接（不以 # 开头的锚点链接）
    if (href && !href.startsWith('#')) {
      // 添加 target="_blank" 和 rel="noopener noreferrer"
      token.attrPush(['target', '_blank'])
      token.attrPush(['rel', 'noopener noreferrer'])
    }
  }

  return token.attrGet('class')
    ? `<a${token.attrs!.map(([name, value]: [string, string]) => ` ${name}="${value}"`).join('')}>`
    : `<a${token.attrs!.map(([name, value]: [string, string]) => ` ${name}="${value}"`).join('')}>`
}

// 自定义规则：处理图片路径和显示
md.renderer.rules.image = (
  tokens: any[],
  idx: number,
  _options: any,
  _env: any,
  _renderer: any
) => {
  const token = tokens[idx]
  const srcIndex = token.attrIndex('src')
  // const altIndex = token.attrIndex('alt')
  // const titleIndex = token.attrIndex('title')

  if (srcIndex >= 0) {
    const originalSrc = token.attrs![srcIndex][1]
    const processedSrc = processImagePath(originalSrc)
    // 保留 alt 和 title 信息用于无障碍访问
    // const alt = altIndex >= 0 ? token.attrs![altIndex][1] : ''
    // const title = titleIndex >= 0 ? token.attrs![titleIndex][1] : ''

    // 更新 src 属性
    token.attrs![srcIndex][1] = processedSrc

    // 添加加载错误处理
    token.attrPush([
      'onerror',
      `this.onerror=null; this.src='${createPlaceholderSVG(400, 300, '图片加载失败')}';`
    ])
    token.attrPush(['loading', 'lazy']) // 添加懒加载
    token.attrPush([
      'style',
      'max-width: 100%; height: auto; border-radius: 4px; box-shadow: var(--shadow-light, 0 2px 8px rgba(0,0,0,0.1));'
    ])
  }

  // 渲染图片标签
  let attrs = ''
  if (token.attrs) {
    attrs = token.attrs.map(([name, value]: [string, string]) => ` ${name}="${value}"`).join('')
  }

  return `<img${attrs}>`
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
      // 简单的YAML解析（这里只处理基本的key: value和数组）
      const frontmatterText = match[1]
      const meta: Record<string, any> = {}

      frontmatterText?.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':')
        if (key && valueParts.length) {
          const value = valueParts.join(':').trim()
          const trimmedKey = key.trim()

          // 处理数组格式的标签（如：tags: ["CSS", "前端", "Web开发"]）
          if (trimmedKey === 'tags' && value.startsWith('[') && value.endsWith(']')) {
            try {
              // 解析JSON数组格式的标签
              const tagsContent = value.slice(1, -1) // 移除 [ 和 ]
              const tags = tagsContent
                .split(',')
                .map(tag => tag.trim().replace(/^["']|["']$/g, '')) // 移除每个标签的引号
                .filter(tag => tag.length > 0) // 过滤空标签
              meta[trimmedKey] = tags
            } catch (e) {
              console.warn('解析标签数组失败:', e)
              meta[trimmedKey] = []
            }
          } else {
            // 处理普通字符串值，移除外层引号
            meta[trimmedKey] = value.replace(/^["']|["']$/g, '')
          }
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
