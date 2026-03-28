import Database from 'better-sqlite3'
import { join } from 'path'
import type { StatsStorage, TopPage, TrendItem } from './storage'

let db: Database.Database | null = null

function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = join(process.cwd(), 'server', 'database', 'stats.db')
    db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
    initTables(db)
  }
  return db
}

function initTables(db: Database.Database) {
  // 访客明细表
  db.exec(`
    CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_path TEXT NOT NULL,
      ip_hash TEXT,
      user_agent TEXT,
      referer TEXT,
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

  // 每日汇总表
  db.exec(`
    CREATE TABLE IF NOT EXISTS visits_daily (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_path TEXT NOT NULL,
      date TEXT NOT NULL,
      pv INTEGER DEFAULT 0,
      uv INTEGER DEFAULT 0,
      UNIQUE(page_path, date)
    )
  `)

  // 索引
  db.exec(`CREATE INDEX IF NOT EXISTS idx_visits_page_path ON visits(page_path)`)
  db.exec(`CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits(created_at)`)
  db.exec(`CREATE INDEX IF NOT EXISTS idx_visits_daily_date ON visits_daily(date)`)
}

export class SQLiteStorage implements StatsStorage {
  async recordVisit(data: {
    pagePath: string
    ipHash: string
    userAgent?: string
    referer?: string
  }): Promise<void> {
    const db = getDatabase()
    const today = new Date().toISOString().slice(0, 10)

    const insertVisit = db.prepare(`
      INSERT INTO visits (page_path, ip_hash, user_agent, referer)
      VALUES (?, ?, ?, ?)
    `)
    insertVisit.run(data.pagePath, data.ipHash, data.userAgent || null, data.referer || null)

    // 更新页面浏览量汇总
    const updatePageViews = db.prepare(`
      INSERT INTO page_views (page_path, view_count, unique_visitors, updated_at)
      VALUES (?, 1, 0, CURRENT_TIMESTAMP)
      ON CONFLICT(page_path) DO UPDATE SET
        view_count = view_count + 1,
        updated_at = CURRENT_TIMESTAMP
    `)
    updatePageViews.run(data.pagePath)

    // 检查是否为新访客（UV）
    if (data.ipHash) {
      const checkUnique = db.prepare(`
        SELECT COUNT(*) as count FROM visits
        WHERE page_path = ? AND ip_hash = ?
      `)
      const result = checkUnique.get(data.pagePath, data.ipHash) as { count: number }

      if (result.count === 1) {
        db.prepare(`UPDATE page_views SET unique_visitors = unique_visitors + 1 WHERE page_path = ?`)
          .run(data.pagePath)
      }
    }

    // 更新每日汇总 PV
    db.prepare(`
      INSERT INTO visits_daily (page_path, date, pv, uv)
      VALUES (?, ?, 1, 0)
      ON CONFLICT(page_path, date) DO UPDATE SET pv = pv + 1
    `).run(data.pagePath, today)

    // 更新每日汇总 UV
    if (data.ipHash) {
      const todayVisitCount = db.prepare(`
        SELECT COUNT(*) as count FROM visits
        WHERE page_path = ? AND ip_hash = ? AND date(created_at) = ?
      `).get(data.pagePath, data.ipHash, today) as { count: number }

      if (todayVisitCount.count === 1) {
        db.prepare(`
          UPDATE visits_daily SET uv = uv + 1
          WHERE page_path = ? AND date = ?
        `).run(data.pagePath, today)
      }
    }
  }

  async getOverview(): Promise<{
    totalViews: number
    totalUV: number
    totalPages: number
    topPages: TopPage[]
    todayViews: number
    todayUV: number
  }> {
    const db = getDatabase()
    const today = new Date().toISOString().slice(0, 10)

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
        SELECT page_path as pagePath, view_count as viewCount, unique_visitors as uniqueVisitors
        FROM page_views
        ORDER BY view_count DESC
        LIMIT 10
      `)
      .all() as TopPage[]

    const todayStats = db.prepare(`
      SELECT COALESCE(SUM(pv), 0) as pv, COALESCE(SUM(uv), 0) as uv
      FROM visits_daily
      WHERE date = ?
    `).get(today) as { pv: number; uv: number }

    return {
      totalViews: totalViews.total,
      totalUV: totalUV.total,
      totalPages: totalPages.total,
      topPages,
      todayViews: todayStats.pv,
      todayUV: todayStats.uv,
    }
  }

  async getPageStats(pagePath: string): Promise<{
    pagePath: string
    viewCount: number
    uniqueVisitors: number
  }> {
    const db = getDatabase()
    const row = db.prepare(`
      SELECT page_path, view_count, unique_visitors
      FROM page_views
      WHERE page_path = ?
    `).get(pagePath) as { page_path: string; view_count: number; unique_visitors: number } | undefined

    if (!row) {
      return { pagePath, viewCount: 0, uniqueVisitors: 0 }
    }
    return {
      pagePath: row.page_path,
      viewCount: row.view_count,
      uniqueVisitors: row.unique_visitors,
    }
  }

  async getTrend(period: 'day' | 'week' | 'month', days: number): Promise<TrendItem[]> {
    const db = getDatabase()

    if (period === 'day') {
      // 按天聚合
      const rows = db.prepare(`
        SELECT date, COALESCE(SUM(pv), 0) as pv, COALESCE(SUM(uv), 0) as uv
        FROM visits_daily
        WHERE date >= date('now', '-' || ? || ' days')
        GROUP BY date
        ORDER BY date ASC
      `).all(days) as Array<{ date: string; pv: number; uv: number }>

      // 补全缺失的日期
      return this.fillMissingDates(rows, days)
    }

    if (period === 'week') {
      // 按周聚合
      const rows = db.prepare(`
        SELECT
          strftime('%Y-%W', date) as week,
          MIN(date) as date,
          COALESCE(SUM(pv), 0) as pv,
          COALESCE(SUM(uv), 0) as uv
        FROM visits_daily
        WHERE date >= date('now', '-' || ? || ' days')
        GROUP BY strftime('%Y-%W', date)
        ORDER BY date ASC
      `).all(days * 7) as Array<{ date: string; pv: number; uv: number }>

      return rows.map((r) => ({ date: r.date, pv: r.pv, uv: r.uv }))
    }

    // 按月聚合
    const rows = db.prepare(`
      SELECT
        strftime('%Y-%m', date) as month,
        MIN(date) as date,
        COALESCE(SUM(pv), 0) as pv,
        COALESCE(SUM(uv), 0) as uv
      FROM visits_daily
        WHERE date >= date('now', '-' || ? || ' days')
      GROUP BY strftime('%Y-%m', date)
      ORDER BY date ASC
    `).all(days * 30) as Array<{ date: string; pv: number; uv: number }>

    return rows.map((r) => ({ date: r.date, pv: r.pv, uv: r.uv }))
  }

  private fillMissingDates(rows: Array<{ date: string; pv: number; uv: number }>, days: number): TrendItem[] {
    const result: TrendItem[] = []
    const dataMap = new Map(rows.map((r) => [r.date, r]))

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().slice(0, 10)
      const existing = dataMap.get(dateStr)
      result.push({
        date: dateStr,
        pv: existing?.pv || 0,
        uv: existing?.uv || 0,
      })
    }

    return result
  }
}
