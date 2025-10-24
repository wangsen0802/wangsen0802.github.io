<template>
  <div class="demo-detail" v-if="demo">
    <div class="demo-header">
      <div class="breadcrumb">
        <router-link to="/demos">🎮 在线示例</router-link>
        <span class="separator">/</span>
        <router-link :to="`/demos/${demo.category}`">
          {{ categoryName }}
        </router-link>
        <span class="separator">/</span>
        <span class="current">{{ demo.title }}</span>
      </div>

      <div class="demo-meta">
        <div class="category-badge" :style="{ backgroundColor: categoryColor }">
          {{ categoryIcon }} {{ categoryName }}
        </div>
        <div class="difficulty" :class="demo.difficulty">
          {{ difficultyText }}
        </div>
        <span class="code-files" v-if="demo.codeFiles">
          📁 {{ demo.codeFiles.length }} 个文件
        </span>
      </div>

      <h1 class="demo-title">{{ demo.title }}</h1>
      <p class="demo-description">{{ demo.description }}</p>

      <div class="demo-tags" v-if="demo.tags.length">
        <span v-for="tag in demo.tags" :key="tag" class="tag">
          #{{ tag }}
        </span>
      </div>
    </div>

    <div class="demo-content">
      <!-- 代码编辑器和预览区域 -->
      <div class="code-preview-container">
        <div class="code-editor">
          <div class="editor-header">
            <span class="editor-title">📝 代码编辑器</span>
            <div class="editor-actions">
              <button class="run-btn" @click="runDemo">
                ▶️ 运行代码
              </button>
              <button class="reset-btn" @click="resetDemo">
                🔄 重置
              </button>
            </div>
          </div>
          <div class="code-area">
            <pre><code>{{ sampleCode }}</code></pre>
          </div>
        </div>

        <div class="preview-area">
          <div class="preview-header">
            <span class="preview-title">👀 预览效果</span>
            <a
              v-if="demo.liveUrl"
              :href="demo.liveUrl"
              target="_blank"
              class="fullscreen-btn"
            >
              🔗 在线运行
            </a>
          </div>
          <div class="preview-frame">
            <div class="demo-placeholder">
              <div class="placeholder-icon">🗺️</div>
              <h3>GIS示例预览</h3>
              <p>点击"运行代码"按钮查看地图效果</p>
              <p v-if="demo.liveUrl" class="external-link">
                或访问 <a :href="demo.liveUrl" target="_blank">在线版本</a> 获得完整体验
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 详细说明区域 -->
      <div class="demo-details">
        <div class="details-section">
          <h2>📋 使用说明</h2>
          <div class="instructions">
            <h3>🚧 正在建设中</h3>
            <p>这个示例的详细使用说明正在编写中，敬请期待...</p>

            <h4>预期内容：</h4>
            <ul>
              <li>代码详细说明和注释</li>
              <li>参数配置和自定义选项</li>
              <li>常见问题和解决方案</li>
              <li>扩展和改进建议</li>
            </ul>
          </div>
        </div>

        <div class="details-section" v-if="demo.codeFiles && demo.codeFiles.length">
          <h2>📁 文件结构</h2>
          <div class="file-list">
            <div v-for="file in demo.codeFiles" :key="file" class="file-item">
              📄 {{ file }}
            </div>
          </div>
        </div>

        <div class="details-section">
          <h2>🔗 相关资源</h2>
          <div class="related-links">
            <a v-if="demo.liveUrl" :href="demo.liveUrl" target="_blank" class="link-item">
              🌐 在线示例
            </a>
            <router-link to="/demos" class="link-item">
              📚 更多示例
            </router-link>
            <router-link :to="`/notes/${demo.category}`" class="link-item">
              📝 相关笔记
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import demosData from '@/data/demos.json'

interface Category {
  id: string
  name: string
  icon: string
  color: string
  description: string
}

interface Demo {
  id: string
  title: string
  category: string
  description: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  featured: boolean
  previewImage?: string
  codeFiles?: string[]
  liveUrl?: string
}

const route = useRoute()
const categories = ref<Category[]>(demosData.categories)
const demos = ref<Demo[]>(demosData.demos.map(demo => ({
  ...demo,
  difficulty: demo.difficulty as 'beginner' | 'intermediate' | 'advanced'
})))

const demo = computed<Demo | undefined>(() => {
  return demos.value.find(d =>
    d.id === String(route.params.id) && d.category === String(route.params.category)
  )
})

const category = computed(() => {
  return categories.value.find(cat => cat.id === demo.value?.category)
})

const categoryName = computed(() => category.value?.name || demo.value?.category || '未知')
const categoryIcon = computed(() => category.value?.icon || '🎮')
const categoryColor = computed(() => category.value?.color || '#666')

const difficultyText = computed(() => {
  const difficultyMap = {
    beginner: '入门',
    intermediate: '进阶',
    advanced: '高级'
  }
  return difficultyMap[demo.value?.difficulty || 'beginner'] || '未知'
})

// 示例代码
const sampleCode = computed(() => {
  if (!demo.value) return ''

  const codeExamples: Record<string, string> = {
    'mapbox-interactive-map': `// Mapbox GL JS 基础地图
mapboxgl.accessToken = 'YOUR_ACCESS_TOKEN';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [116.3974, 39.9093],
  zoom: 10
});

// 添加导航控件
map.addControl(new mapboxgl.NavigationControl());`,

    'mapbox-custom-markers': `// 自定义地图标记
const geojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [116.3974, 39.9093] },
      properties: { title: '北京', description: '中国首都' }
    }
  ]
};

// 添加标记点
geojson.features.forEach(feature => {
  const el = document.createElement('div');
  el.className = 'marker';
  el.style.backgroundImage = 'url(marker.png)';

  new mapboxgl.Marker(el)
    .setLngLat(feature.geometry.coordinates)
    .addTo(map);
});`,

    'openlayers-wms': `// OpenLayers WMS 图层示例
// 这是一个使用 OpenLayers 的 WMS 图层示例代码
// 实际项目中需要安装 openlayers 依赖包

// 基础地图配置
const mapConfig = {
  target: 'map',
  layers: [
    // 基础瓦片图层
    {
      type: 'Tile',
      source: {
        type: 'OSM'
      }
    },
    // WMS 服务图层
    {
      type: 'Tile',
      source: {
        type: 'TileWMS',
        url: 'https://example.com/wms',
        params: {
          'LAYERS': 'layer_name',
          'TILED': true
        }
      }
    }
  ],
  view: {
    center: [0, 0],
    zoom: 2
  }
};`
  }

  return codeExamples[demo.value.id] || '// 示例代码正在建设中...'
})

const runDemo = () => {
  alert('示例运行功能正在开发中，敬请期待！')
}

const resetDemo = () => {
  alert('代码重置功能正在开发中')
}
</script>

<style scoped lang="scss">
.demo-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.demo-header {
  margin-bottom: 2rem;

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    color: #666;

    a {
      color: #4264FB;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    .separator {
      color: #999;
    }

    .current {
      color: #2c3e50;
      font-weight: 500;
    }
  }

  .demo-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;

    .category-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.75rem;
      border-radius: 16px;
      font-size: 0.875rem;
      font-weight: 500;
      color: white;
    }

    .difficulty {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;

      &.beginner {
        background: #d4edda;
        color: #155724;
      }

      &.intermediate {
        background: #fff3cd;
        color: #856404;
      }

      &.advanced {
        background: #f8d7da;
        color: #721c24;
      }
    }

    .code-files {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #666;
      font-size: 0.9rem;
    }
  }

  .demo-title {
    color: #2c3e50;
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    line-height: 1.2;
  }

  .demo-description {
    color: #666;
    font-size: 1.25rem;
    line-height: 1.6;
    margin: 0 0 1.5rem 0;
  }

  .demo-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;

    .tag {
      background: #f1f3f4;
      color: #5f6368;
      padding: 0.25rem 0.75rem;
      border-radius: 16px;
      font-size: 0.875rem;
      font-weight: 500;
    }
  }
}

.demo-content {
  .code-preview-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .code-editor,
  .preview-area {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    .editor-header,
    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      background: #f8f9fa;
      border-bottom: 1px solid #e1e5e9;

      .editor-title,
      .preview-title {
        font-weight: 600;
        color: #2c3e50;
      }

      .editor-actions {
        display: flex;
        gap: 0.75rem;
      }

      .run-btn {
        background: #4264FB;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;

        &:hover {
          background: #3366cc;
        }
      }

      .reset-btn {
        background: #6c757d;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;

        &:hover {
          background: #5a6268;
        }
      }

      .fullscreen-btn {
        color: #4264FB;
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .code-area {
      padding: 1.5rem;
      background: #f8f9fa;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.875rem;
      line-height: 1.6;
      max-height: 400px;
      overflow-y: auto;

      pre {
        margin: 0;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    }

    .preview-frame {
      height: 400px;
      background: #f8f9fa;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .demo-placeholder {
    text-align: center;
    padding: 2rem;

    .placeholder-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    h3 {
      color: #2c3e50;
      margin: 0 0 1rem 0;
      font-size: 1.25rem;
    }

    p {
      color: #666;
      margin: 0 0 0.5rem 0;
      line-height: 1.6;

      .external-link a {
        color: #4264FB;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .demo-details {
    display: grid;
    gap: 2rem;

    .details-section {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      h2 {
        color: #2c3e50;
        font-size: 1.5rem;
        margin: 0 0 1.5rem 0;
        padding-bottom: 0.75rem;
        border-bottom: 2px solid #f1f3f4;
      }

      h3 {
        color: #2c3e50;
        font-size: 1.25rem;
        margin: 1.5rem 0 1rem 0;
      }

      h4 {
        color: #2c3e50;
        font-size: 1.1rem;
        margin: 1rem 0 0.5rem 0;
      }

      p {
        color: #666;
        line-height: 1.6;
        margin-bottom: 1rem;
      }

      ul {
        margin-left: 1.5rem;
        margin-bottom: 1rem;

        li {
          color: #666;
          margin-bottom: 0.5rem;
        }
      }

      .file-list {
        display: grid;
        gap: 0.5rem;

        .file-item {
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 6px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
          color: #2c3e50;
        }
      }

      .related-links {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;

        .link-item {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #f8f9fa;
          color: #2c3e50;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;

          &:hover {
            background: #e9ecef;
            transform: translateY(-1px);
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .demo-content .code-preview-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .demo-detail {
    padding: 1rem;
  }

  .demo-header {
    .demo-title {
      font-size: 2rem;
    }

    .demo-description {
      font-size: 1.1rem;
    }

    .demo-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }
  }

  .demo-content {
    .demo-details .details-section {
      padding: 1.5rem;
    }
  }
}
</style>