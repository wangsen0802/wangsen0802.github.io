<script setup lang="ts">
interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

const props = defineProps<{
  links: TocLink[]
}>()

const activeId = ref('')

// 滚动跟踪当前可见的标题
const updateActiveId = () => {
  const headings = document.querySelectorAll('.markdown-content h2, .markdown-content h3')
  const windowHeight = window.innerHeight

  let current = ''
  for (const heading of headings) {
    const el = heading as HTMLElement
    const rect = el.getBoundingClientRect()
    // 标题进入视口上方 1/3 区域时激活
    if (rect.top <= windowHeight * 0.33) {
      current = el.id
    }
  }
  activeId.value = current
}

// 点击目录项平滑滚动
const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateActiveId, { passive: true })
  updateActiveId()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveId)
})
</script>

<template>
  <nav class="toc" v-if="links.length">
    <div class="toc-header">
      <span class="toc-title">目录</span>
    </div>
    <ul class="toc-list">
      <template v-for="link in links" :key="link.id">
        <li
          class="toc-item"
          :class="[
            `toc-depth-${link.depth}`,
            { active: activeId === link.id }
          ]"
        >
          <a
            class="toc-link"
            @click.prevent="scrollTo(link.id)"
            :title="link.text"
          >
            {{ link.text }}
          </a>
        </li>
        <!-- 二级子标题 -->
        <li
          v-for="child in link.children"
          :key="child.id"
          class="toc-item"
          :class="[
            `toc-depth-${child.depth}`,
            { active: activeId === child.id }
          ]"
        >
          <a
            class="toc-link"
            @click.prevent="scrollTo(child.id)"
            :title="child.text"
          >
            {{ child.text }}
          </a>
        </li>
      </template>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.toc {
  padding-left: var(--space-lg);
  border-left: 1px solid var(--border-primary);
}

.toc-header {
  margin-bottom: var(--space-md);
}

.toc-title {
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.toc-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toc-item {
  position: relative;
}

.toc-link {
  display: block;
  padding: 4px 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: color var(--duration-fast) ease;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    color: var(--text-secondary);
  }

  .toc-item.active & {
    color: var(--accent-primary);
    font-weight: 500;
  }
}

// 缩进层级
.toc-depth-3 {
  padding-left: var(--space-md);
}

// 活动项指示条
.toc-item.active::before {
  content: '';
  position: absolute;
  left: calc(-1 * var(--space-lg) - 1px);
  top: 4px;
  bottom: 4px;
  width: 2px;
  background: var(--accent-primary);
  border-radius: var(--radius-full);
}

// 滚动条样式
.toc::-webkit-scrollbar {
  width: 3px;
}

.toc::-webkit-scrollbar-thumb {
  background: var(--border-accent);
  border-radius: var(--radius-full);
}
</style>
