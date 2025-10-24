<template>
  <a-layout class="app">
    <a-layout-header class="header">
      <div class="header-content">
        <Navigation />
      </div>
    </a-layout-header>

    <a-layout-content class="main">
      <router-view />
    </a-layout-content>

    <a-layout-footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 王森的个人网站. All rights reserved.</p>
        <div class="footer-links">
          <a href="https://github.com/wangsen0802" target="_blank" rel="noopener">
            <GithubOutlined />
          </a>
        </div>
      </div>
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import { GithubOutlined } from '@ant-design/icons-vue'
import Navigation from '@/components/Navigation.vue'
</script>

<style scoped lang="scss">
.app {
  min-height: 100vh;
  background-color: var(--bg-primary);
}

.header {
  background-color: var(--bg-secondary) !important;
  border-bottom: 1px solid var(--border-primary);
  padding: 0;
  box-shadow: var(--shadow-light);

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    height: 64px;
    display: flex;
    align-items: center;
  }
}

.main {
  flex: 1;
  background-color: var(--bg-primary);
}

.footer {
  background-color: var(--bg-secondary) !important;
  border-top: 1px solid var(--border-primary);

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 14px;
    }

    .footer-links {
      display: flex;
      gap: 16px;

      a {
        color: var(--text-secondary);
        font-size: 18px;
        transition: color 0.3s ease;

        &:hover {
          color: var(--accent-primary);
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .header .header-content {
    padding: 0 16px;
  }

  .footer .footer-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
    padding: 20px 16px;
  }
}
</style>

