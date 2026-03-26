import Database from 'better-sqlite3'
import { join } from 'path'

let db: Database.Database | null = null

/**
 * 获取数据库实例（单例模式）
 */
export function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = join(process.cwd(), 'server', 'database', 'stats.db')
    db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
    initTables(db)
  }
  return db
}

/**
 * 初始化数据库表
 */
function initTables(db: Database.Database) {
  // 访客统计表
  db.exec(`
    CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_path TEXT NOT NULL,
      ip_hash TEXT,
      user_agent TEXT,
      referer TEXT,
      country TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 页面浏览量汇总表
  db.exec(`
    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_path TEXT NOT NULL UNIQUE,
      view_count INTEGER DEFAULT 0,
      unique_visitors INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 创建索引
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_visits_page_path ON visits(page_path)
  `)
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits(created_at)
  `)
}

/**
 * 记录页面访问
 */
export function recordVisit(data: {
  pagePath: string
  ipHash?: string
  userAgent?: string
  referer?: string
  country?: string
}) {
  const db = getDatabase()

  // 插入访问记录
  const insertVisit = db.prepare(`
    INSERT INTO visits (page_path, ip_hash, user_agent, referer, country)
    VALUES (?, ?, ?, ?, ?)
  `)
  insertVisit.run(
    data.pagePath,
    data.ipHash || null,
    data.userAgent || null,
    data.referer || null,
    data.country || null
  )

  // 更新页面浏览量汇总
  const updatePageViews = db.prepare(`
    INSERT INTO page_views (page_path, view_count, unique_visitors, updated_at)
    VALUES (?, 1, 1, CURRENT_TIMESTAMP)
    ON CONFLICT(page_path) DO UPDATE SET
      view_count = view_count + 1,
      updated_at = CURRENT_TIMESTAMP
  `)
  updatePageViews.run(data.pagePath)

  // 如果有唯一访客标识，检查并更新 UV
  if (data.ipHash) {
    const checkUnique = db.prepare(`
      SELECT COUNT(*) as count FROM visits
      WHERE page_path = ? AND ip_hash = ?
    `)
    const result = checkUnique.get(data.pagePath, data.ipHash) as { count: number }

    if (result.count === 1) {
      const updateUV = db.prepare(`
        UPDATE page_views SET unique_visitors = unique_visitors + 1
        WHERE page_path = ?
      `)
      updateUV.run(data.pagePath)
    }
  }
}

/**
 * 获取页面统计
 */
export function getPageStats(pagePath: string) {
  const db = getDatabase()
  const stmt = db.prepare(`
    SELECT page_path, view_count, unique_visitors, updated_at
    FROM page_views
    WHERE page_path = ?
  `)
  return stmt.get(pagePath) as {
    page_path: string
    view_count: number
    unique_visitors: number
    updated_at: string
  } | undefined
}

/**
 * 获取全站统计概览
 */
export function getOverviewStats() {
  const db = getDatabase()

  const totalViews = db
    .prepare(`SELECT COALESCE(SUM(view_count), 0) as total FROM page_views`)
    .get() as { total: number }

  const totalUV = db
    .prepare(`SELECT COALESCE(SUM(unique_visitors), 0) as total FROM page_views`)
    .get() as { total: number }

  const totalPages = db
    .prepare(`SELECT COUNT(*) as total FROM page_views`)
    .get() as { total: number }

  const topPages = db
    .prepare(`
      SELECT page_path, view_count, unique_visitors
      FROM page_views
      ORDER BY view_count DESC
      LIMIT 10
    `)
    .all() as Array<{
    page_path: string
    view_count: number
    unique_visitors: number
  }>

  return {
    totalViews: totalViews.total,
    totalUniqueVisitors: totalUV.total,
    totalPages: totalPages.total,
    topPages,
  }
}

/**
 * 关闭数据库连接
 */
export function closeDatabase() {
  if (db) {
    db.close()
    db = null
  }
}
