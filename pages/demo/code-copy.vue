<template>
  <div class="demo-container">
    <div class="demo-content">
      <h1>代码复制按钮演示</h1>

      <section class="demo-section">
        <h2>基础用法</h2>
        <p>使用 CodeBlock 组件包裹代码，自动显示复制按钮:</p>

        <CodeBlock
          code="const hello = 'Hello, World!'"
          language="javascript"
        />
      </section>

      <section class="demo-section">
        <h2>显示文字标签</h2>
        <p>通过 showLabel 属性显示复制状态的文字提示:</p>

        <CodeBlock
          code="function greet(name: string) {
  return `Hello, ${name}!`
}"
          language="typescript"
          :show-label="true"
        />
      </section>

      <section class="demo-section">
        <h2>多种语言支持</h2>

        <h3>Python</h3>
        <CodeBlock
          :code="pythonCode"
          language="python"
        />

        <h3>CSS</h3>
        <CodeBlock
          :code="cssCode"
          language="css"
        />

        <h3>HTML</h3>
        <CodeBlock
          :code="htmlCode"
          language="html"
        />
      </section>

      <section class="demo-section">
        <h2>无高亮模式</h2>
        <p>设置 highlight 为 false 禁用语法高亮:</p>

        <CodeBlock
          code="PLAIN TEXT CODE WITHOUT SYNTAX HIGHLIGHTING"
          :highlight="false"
        />
      </section>

      <section class="demo-section">
        <h2>大段代码</h2>
        <CodeBlock
          :code="largeCodeSnippet"
          language="typescript"
          :show-label="true"
        />
      </section>

      <section class="demo-section">
        <h2>在 Markdown 中的使用</h2>
        <p>通过插件自动为 @nuxt/content 渲染的代码块添加复制按钮:</p>

        <div class="markdown-content prose">
          <ContentDoc path="/demo/code-copy" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const pythonCode = `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)`

const cssCode = `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}`

const htmlCode = `<div class="container">
  <h1>Hello World</h1>
  <p>This is a paragraph</p>
</div>`

const largeCodeSnippet = `interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  createdAt: Date
  updatedAt?: Date
}

class UserService {
  private users: Map<number, User> = new Map()

  async findById(id: number): Promise<User | null> {
    return this.users.get(id) || null
  }

  async create(data: Omit<User, 'id'>): Promise<User> {
    const id = this.generateId()
    const user: User = {
      id,
      ...data,
      createdAt: new Date()
    }
    this.users.set(id, user)
    return user
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    const user = this.users.get(id)
    if (!user) return null

    const updatedUser = {
      ...user,
      ...data,
      updatedAt: new Date()
    }
    this.users.set(id, updatedUser)
    return updatedUser
  }

  async delete(id: number): Promise<boolean> {
    return this.users.delete(id)
  }

  private generateId(): number {
    return Date.now() + Math.random()
  }
}`

useHead({
  title: '代码复制按钮演示'
})
</script>

<style scoped lang="scss">
.demo-container {
  min-height: 100vh;
  padding: 2rem;
  background-color: var(--bg-primary);
}

.demo-content {
  max-width: 900px;
  margin: 0 auto;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    color: var(--text-primary);
    text-align: center;
  }

  h2 {
    font-size: 1.75rem;
    margin: 2rem 0 1rem;
    color: var(--text-primary);
    border-bottom: 2px solid var(--border-primary);
    padding-bottom: 0.5rem;
  }

  h3 {
    font-size: 1.25rem;
    margin: 1.5rem 0 0.75rem;
    color: var(--text-primary);
  }

  p {
    color: var(--text-secondary);
    margin-bottom: 1rem;
    line-height: 1.6;
  }
}

.demo-section {
  margin-bottom: 3rem;

  &:last-child {
    margin-bottom: 0;
  }
}

/* Markdown 内容样式 */
.markdown-content {
  background-color: var(--bg-secondary);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid var(--border-primary);
}

@media (max-width: 768px) {
  .demo-container {
    padding: 1rem;
  }

  .demo-content {
    h1 {
      font-size: 2rem;
    }

    h2 {
      font-size: 1.5rem;
    }
  }
}
</style>
