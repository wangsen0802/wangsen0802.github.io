# 访客统计功能完善 - 设计文档

> 创建日期：2026-03-29
> 状态：已批准

## 1. 概述

在现有访客统计基础功能上，完善为完整的统计系统，包括：
- 存储层抽象（SQLite 开发 / Vercel KV 生产）
- 独立统计页面（/stats）含趋势图表
- 文章详情页浏览量展示
- 页脚统计小组件

### 技术选型

| 技术 | 用途 |
|------|------|
| 存储抽象层 | SQLite（开发）/ Vercel KV（生产） |
| Chart.js | 趋势折线图 |
| lucide-vue-next | 图标 |

### 设计决策

- **方案 A：抽象存储层** — 开发阶段用 SQLite，部署时通过环境变量自动切换到 Vercel KV
- **公开访问** — /stats 页面所有人可见
- **Chart.js** — 轻量趋势图表（~40KB）

## 2. 架构设计

```
┌─────────────────────────────────────────────────────┐
│                    前端展示层                         │
│                                                     │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────┐ │
│  │ 文章浏览量   │ │ /stats 统计页 │ │ 页脚统计卡片  │ │
│  │ (文章详情页) │ │ (独立页面)    │ │ (默认布局)    │ │
│  └─────────────┘ └──────────────┘ └──────────────┘ │
│                         │                           │
│              composables/useStats.ts                │
│                         │                           │
│              useFetch / $fetch                      │
│                         ▼                           │
├─────────────────────────────────────────────────────┤
│                   服务端 API 层                      │
│                                                     │
│  POST /api/stats/visit    — 记录访问（改造）         │
│  GET  /api/stats/overview — 全站概览（改造）         │
│  GET  /api/stats/trending — 趋势数据（新增）         │
│  GET  /api/stats/page     — 单页统计（新增）         │
│                         │                           │
│  server/utils/storage.ts (存储适配层)                │
│     ┌────────────┐  ┌────────────────┐             │
│     │ SQLite     │  │ Vercel KV      │             │
│     │ (开发环境)  │  │ (生产环境)      │             │
│     └────────────┘  └────────────────┘             │
└─────────────────────────────────────────────────────┘
```

## 3. 存储适配层

### 3.1 统一接口

```typescript
// server/utils/storage.ts

interface StatsStorage {
  // 记录访问（PV + UV 判断）
  recordVisit(data: {
    pagePath: string
    ipHash: string
    userAgent?: string
    referer?: string
  }): Promise<void>

  // 获取全站统计概览
  getOverview(): Promise<{
    totalViews: number
    totalUV: number
    totalPages: number
    topPages: TopPage[]
    todayViews: number
    todayUV: number
  }>

  // 获取单页统计
  getPageStats(pagePath: string): Promise<{
    pagePath: string
    viewCount: number
    uniqueVisitors: number
  }>

  // 获取趋势数据
  getTrend(period: 'day' | 'week' | 'month', days: number): Promise<TrendItem[]>
}
```

### 3.2 数据模型

```typescript
interface TrendItem {
  date: string        // "2026-03-29"
  pv: number          // 当日浏览量
  uv: number          // 当日独立访客
}

interface TopPage {
  pagePath: string
  viewCount: number
  uniqueVisitors: number
}
```

### 3.3 SQLite 实现

在现有 `server/utils/db.ts` 基础上扩展：

- 新增 `visits_daily` 汇总表，按日期 + 路径聚合 PV/UV
- 新增索引 `idx_visits_date_path` 优化趋势查询
- 保留 visits 明细表用于去重判断

```sql
CREATE TABLE IF NOT EXISTS visits_daily (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_path TEXT NOT NULL,
  date TEXT NOT NULL,
  pv INTEGER DEFAULT 0,
  uv INTEGER DEFAULT 0,
  UNIQUE(page_path, date)
);

CREATE INDEX IF NOT EXISTS idx_visits_daily_date ON visits_daily(date);
```

### 3.4 Vercel KV 实现（生产环境）

使用 Redis 数据结构：

| Key | 类型 | 用途 |
|-----|------|------|
| `pv:{path}` | String (int) | 页面总浏览量 |
| `uv:{path}` | String (int) | 页面独立访客数 |
| `unique:{date}:{path}` | Set | 当日当日唯一访客 ipHash 集合 |
| `daily:pv:{date}` | String (int) | 当日全站 PV |
| `daily:uv:{date}` | Set | 当日全站唯一访客 ipHash 集合 |
| `pages` | Sorted Set | 所有页面 PV 排行 |

### 3.5 工厂函数

```typescript
// server/utils/storage.ts
export function createStorage(): StatsStorage {
  if (process.env.VERCEL) {
    return new VercelKVStorage()
  }
  return new SQLiteStorage()
}
```

## 4. API 设计

### 4.1 POST /api/stats/visit（改造）

请求体不变，内部改为调用存储适配层。

限流：同一 ipHash + pagePath 在 10 秒内去重。

```typescript
// 请求
{ pagePath: '/posts/vue/pinia' }

// 响应
{ success: true, message: 'Visit recorded' }
```

### 4.2 GET /api/stats/overview（改造）

新增 todayViews 和 todayUV 字段。

```typescript
// 响应
{
  totalViews: 1234,
  totalUV: 567,
  totalPages: 15,
  todayViews: 42,
  todayUV: 18,
  topPages: [
    { pagePath: '/', viewCount: 500, uniqueVisitors: 200 },
    ...
  ],
  timestamp: '2026-03-29T10:00:00Z'
}
```

### 4.3 GET /api/stats/trending（新增）

```typescript
// 请求参数
?period=day&days=30   // 按天，最近30天
?period=week&days=12  // 按周，最近12周
?period=month&days=6  // 按月，最近6个月

// 响应
{
  period: 'day',
  data: [
    { date: '2026-03-29', pv: 42, uv: 18 },
    { date: '2026-03-28', pv: 35, uv: 15 },
    ...
  ]
}
```

### 4.4 GET /api/stats/page（新增）

```typescript
// 请求参数
?path=/posts/vue/pinia

// 响应
{
  pagePath: '/posts/vue/pinia',
  viewCount: 128,
  uniqueVisitors: 67
}
```

### 4.5 缓存策略

- visit API：不缓存
- overview API：内存缓存 5 分钟
- trending API：内存缓存 10 分钟
- page API：内存缓存 5 分钟

## 5. 前端展示

### 5.1 文章详情页浏览量

在文章详情页标题下方添加浏览量标签：

```
Vue 3 组合式 API 完全指南
🏷 Vue · TypeScript   👁 128 次浏览   📅 2026-03-25
```

- 使用 `Eye` 图标（lucide-vue-next）
- 客户端 `useFetch('/api/stats/page')` 获取
- 数字递增动画（GSAP 或 CSS）

### 5.2 /stats 独立统计页面

布局结构：

```
┌──────────────────────────────────────────────────────┐
│  网站统计                                             │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │ 总浏览量  │  │ 独立访客  │  │ 页面数    │           │
│  │  1,234   │  │   567    │  │    15    │           │
│  │ ↑42 今日 │  │ ↑18 今日 │  │          │           │
│  └──────────┘  └──────────┘  └──────────┘           │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ 访问趋势                          [日|周|月]   │   │
│  │     📈 Chart.js 折线图 (PV + UV 双线)          │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ 热门页面排行榜                                  │   │
│  │  1. 首页              500 次                   │   │
│  │  2. 文章: Vue 组合式    128 次                  │   │
│  │  ...                                           │   │
│  └──────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

特性：
- 三个统计卡片（总浏览量 / 独立访客 / 页面数）+ 今日增量
- 趋势折线图支持日 / 周 / 月切换
- 热门页面排行 TOP 10
- 暗色模式适配
- Chart.js 按需加载

### 5.3 页脚统计小组件

在默认布局的页脚添加：

```
© 2026 wanGISen  ·  👁 1,234 次浏览  ·  👥 567 位访客
```

- 轻量级，只显示总 PV 和 UV
- 缓存 5 分钟

### 5.4 导航更新

在导航菜单添加"统计"入口，链接到 `/stats`。

## 6. 新增文件清单

| 文件 | 说明 | 类型 |
|------|------|------|
| `server/utils/storage.ts` | 存储适配层接口 + 工厂函数 | 新增 |
| `server/utils/sqlite-storage.ts` | SQLite 存储实现 | 新增 |
| `server/utils/kv-storage.ts` | Vercel KV 存储实现（预留骨架） | 新增 |
| `server/api/stats/trending.get.ts` | 趋势数据 API | 新增 |
| `server/api/stats/page.get.ts` | 单页统计 API | 新增 |
| `pages/stats.vue` | 独立统计页面 | 新增 |
| `composables/useStats.ts` | 统一统计数据获取逻辑 | 新增 |
| `components/stats/StatCard.vue` | 统计数字卡片组件 | 新增 |
| `components/stats/TrendChart.vue` | Chart.js 趋势图组件 | 新增 |
| `components/stats/TopPagesList.vue` | 热门页面列表组件 | 新增 |
| `components/stats/SiteFooterStats.vue` | 页脚统计小组件 | 新增 |

需改造的文件：

| 文件 | 改造内容 |
|------|---------|
| `server/utils/db.ts` | 重构为 sqlite-storage.ts 的基础 |
| `server/api/stats/visit.post.ts` | 改用存储适配层 |
| `server/api/stats/overview.get.ts` | 改用存储适配层，新增今日数据 |
| `composables/usePageStats.ts` | 增加去重逻辑 |
| `layouts/default.vue` | 页脚添加统计组件 |
| 文章详情页 | 添加浏览量展示 |

## 7. 依赖变更

```bash
pnpm add chart.js
```

Vercel KV 依赖在部署时安装：
```bash
pnpm add @vercel/kv
```
