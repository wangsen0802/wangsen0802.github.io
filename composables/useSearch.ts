import FlexSearch from 'flexsearch'

/**
 * 文章搜索接口
 */
export interface SearchDocument {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  date: string
}

/**
 * 搜索结果接口
 */
export interface SearchResult {
  doc: SearchDocument
  score: number
}

/**
 * 搜索索引管理
 */
let searchIndex: FlexSearch.Index | null = null
let documents: Map<string, SearchDocument> = new Map()

/**
 * 初始化搜索索引
 */
export const useSearch = () => {
  /**
   * 初始化 FlexSearch 索引
   * 配置支持中文分词和模糊搜索
   */
  const initSearchIndex = () => {
    if (searchIndex) return searchIndex

    // 创建 FlexSearch 索引实例
    searchIndex = new FlexSearch.Index({
      profile: 'memory', // 使用内存配置，更适合客户端
      charset: 'latin:simplified', // 支持简体中文
      tokenize: 'forward', // 前向分词，对中文更友好
      resolution: 9, // 分辨率（1-9），越高越精确但越慢
      optimize: true, // 启用优化
      threshold: 1, // 相关性阈值
      minlength: 1, // 最小匹配长度
    })

    return searchIndex
  }

  /**
   * 添加文档到索引
   */
  const addDocument = (doc: SearchDocument) => {
    const index = initSearchIndex()

    // 存储完整文档
    documents.set(doc.id, doc)

    // 创建可搜索的文本内容（标题 + 描述 + 标签）
    const searchableText = [
      doc.title,
      doc.description,
      doc.tags.join(' '),
      doc.category,
    ].join(' ')

    // 添加到索引
    index.add(doc.id, searchableText)
  }

  /**
   * 批量添加文档
   */
  const addDocuments = (docs: SearchDocument[]) => {
    docs.forEach(doc => addDocument(doc))
  }

  /**
   * 执行搜索
   * @param query 搜索关键词
   * @param limit 结果数量限制
   * @returns 搜索结果数组
   */
  const search = (query: string, limit: number = 10): SearchResult[] => {
    if (!searchIndex || !query.trim()) return []

    try {
      // 执行搜索
      const results = searchIndex.search(query, limit)

      // 将结果转换为包含文档信息的数组
      return results.map(id => ({
        doc: documents.get(id as string)!,
        score: 1, // FlexSearch 不直接提供分数，使用默认值
      }))
    } catch (error) {
      console.error('搜索出错:', error)
      return []
    }
  }

  /**
   * 清空索引
   */
  const clearIndex = () => {
    if (searchIndex) {
      searchIndex = null
    }
    documents.clear()
  }

  /**
   * 获取已索引的文档数量
   */
  const getDocumentCount = () => documents.size

  return {
    initSearchIndex,
    addDocument,
    addDocuments,
    search,
    clearIndex,
    getDocumentCount,
  }
}
