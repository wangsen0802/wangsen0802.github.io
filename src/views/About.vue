<template>

  <div class="about">
     <a-layout class="layout"
      > <a-layout-content class="content"
        >
        <div class="content-wrapper">
           <a-row :gutter="[32, 32]"
            > <a-col
              :xs="24"
              :lg="16"
              > <a-card class="about-card"
                > <template #title> <UserOutlined /> 关于我 </template>
                <div class="profile-section">

                  <div class="avatar-section">
                     <a-avatar
                      :size="120"
                      class="avatar"
                      > 👨‍💻 </a-avatar
                    >
                    <h1 class="name">王森</h1>

                    <p class="title">前端开发工程师 / GIS开发者</p>

                  </div>

                  <div class="bio-section">

                    <h3>个人简介</h3>

                    <p>
                       专注于前端开发和GIS技术的开发者，热爱开源技术，喜欢分享技术知识和开发经验。
                      主要从事Vue.js生态开发、地理信息系统相关开发工作。
                    </p>

                  </div>

                  <div class="skills-section">

                    <h3>技术栈</h3>

                    <div class="skills-grid">
                       <a-tag
                        color="blue"
                        class="skill-tag"
                        >Vue.js</a-tag
                      > <a-tag
                        color="green"
                        class="skill-tag"
                        >TypeScript</a-tag
                      > <a-tag
                        color="orange"
                        class="skill-tag"
                        >JavaScript</a-tag
                      > <a-tag
                        color="red"
                        class="skill-tag"
                        >OpenLayers</a-tag
                      > <a-tag
                        color="purple"
                        class="skill-tag"
                        >Mapbox</a-tag
                      > <a-tag
                        color="cyan"
                        class="skill-tag"
                        >SCSS</a-tag
                      > <a-tag
                        color="gold"
                        class="skill-tag"
                        >Vite</a-tag
                      > <a-tag
                        color="magenta"
                        class="skill-tag"
                        >Node.js</a-tag
                      >
                    </div>

                  </div>

                </div>
                 </a-card
              > </a-col
            > <a-col
              :xs="24"
              :lg="8"
              > <a-card class="contact-card"
                > <template #title> <ContactsOutlined /> 联系方式 </template>
                <div class="contact-info">

                  <div class="contact-item">
                     <GithubOutlined /> <a
                      href="https://github.com/wangsen0802"
                      target="_blank"
                      rel="noopener"
                      > GitHub: wangsen0802 </a
                    >
                  </div>

                  <div class="contact-item"> <MailOutlined /> <span>邮箱: wangsen@example.com</span> </div>

                  <div class="contact-item"> <GlobalOutlined /> <span>位置: 中国</span> </div>

                </div>
                 </a-card
              > <a-card class="stats-card"
                > <template #title> <BarChartOutlined /> 项目统计 </template>
                <div class="stats-info">

                  <div class="stat-item">
                     <span class="stat-number">3</span> <span class="stat-label">文章分类</span>
                  </div>

                  <div class="stat-item">
                     <span class="stat-number">10+</span> <span class="stat-label">技术文章</span>
                  </div>

                  <div class="stat-item">
                     <span class="stat-number">5+</span> <span class="stat-label">开源项目</span>
                  </div>

                </div>
                 </a-card
              > </a-col
            > </a-row
          > <a-row style="margin-top: 32px"
            > <a-col :span="24"
              > <a-card class="timeline-card"
                > <template #title> <ClockCircleOutlined /> 开发历程 </template> <a-timeline
                  > <a-timeline-item
                    > <template #dot> <a-avatar style="background-color: #1890ff">V3</a-avatar> </template>
                    <div class="timeline-content">

                      <h4>Vue 3 深度实践</h4>

                      <p>深入学习和应用Vue 3 Composition API，参与多个Vue 3项目开发</p>

                    </div>
                     </a-timeline-item
                  > <a-timeline-item
                    > <template #dot> <a-avatar style="background-color: #52c41a">GIS</a-avatar> </template>
                    <div class="timeline-content">

                      <h4>GIS项目开发</h4>

                      <p>使用OpenLayers、Mapbox等技术开发地理信息系统应用</p>

                    </div>
                     </a-timeline-item
                  > <a-timeline-item
                    > <template #dot> <a-avatar style="background-color: #fa8c16">TS</a-avatar> </template>
                    <div class="timeline-content">

                      <h4>TypeScript全面应用</h4>

                      <p>在前端项目中全面应用TypeScript，提升代码质量和开发效率</p>

                    </div>
                     </a-timeline-item
                  > </a-timeline
                > </a-card
              > </a-col
            > </a-row
          >
        </div>
         </a-layout-content
      > </a-layout
    >
  </div>

</template>

<script setup lang="ts">
import {
  UserOutlined,
  ContactsOutlined,
  MailOutlined,
  GlobalOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  GithubOutlined
} from '@ant-design/icons-vue'
</script>

<style scoped lang="scss">
.about {
  min-height: 100vh;
  background-color: var(--bg-primary);
}

.layout {
  min-height: 100vh;
}

.content {
  padding: 24px;
  background-color: var(--bg-primary);
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.about-card,
.contact-card,
.stats-card,
.timeline-card {
  border-radius: 12px;
  box-shadow: var(--shadow-light);

  :deep(.ant-card-head) {
    border-bottom-color: var(--border-primary);
    background-color: var(--bg-secondary);
    border-radius: 12px 12px 0 0;
  }

  :deep(.ant-card-head-title) {
    color: var(--text-primary);

    .anticon {
      margin-right: 8px;
      color: var(--accent-primary);
    }
  }
}

.profile-section {
  .avatar-section {
    text-align: center;
    margin-bottom: 32px;

    .avatar {
      margin-bottom: 16px;
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      border: 4px solid var(--bg-secondary);
      box-shadow: var(--shadow-medium);
    }

    .name {
      margin: 0 0 8px 0;
      font-size: 32px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .title {
      margin: 0;
      color: var(--text-secondary);
      font-size: 16px;
    }
  }

  .bio-section,
  .skills-section {
    margin-bottom: 32px;

    h3 {
      margin-bottom: 16px;
      color: var(--text-primary);
      font-size: 20px;
      font-weight: 600;
    }

    p {
      color: var(--text-secondary);
      line-height: 1.8;
      margin: 0;
    }
  }

  .skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    .skill-tag {
      border-radius: 16px;
      font-size: 14px;
      padding: 4px 12px;
    }
  }
}

.contact-info {
  .contact-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    color: var(--text-secondary);

    .anticon {
      color: var(--accent-primary);
      font-size: 18px;
    }

    a {
      color: var(--accent-primary);
      text-decoration: none;

      &:hover {
        color: var(--accent-secondary);
      }
    }
  }
}

.stats-info {
  .stat-item {
    text-align: center;
    margin-bottom: 24px;

    .stat-number {
      display: block;
      font-size: 36px;
      font-weight: 700;
      color: var(--accent-primary);
      margin-bottom: 8px;
    }

    .stat-label {
      color: var(--text-secondary);
      font-size: 14px;
    }
  }
}

.timeline-content {
  h4 {
    margin: 0 0 8px 0;
    color: var(--text-primary);
    font-size: 18px;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  :deep(.ant-timeline-item-content) {
    margin-left: 8px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .content {
    padding: 16px;
  }

  .avatar-section {
    .name {
      font-size: 28px;
    }

    .title {
      font-size: 14px;
    }
  }

  .skills-grid {
    .skill-tag {
      font-size: 12px;
      padding: 3px 8px;
    }
  }

  .stats-info {
    .stat-item {
      .stat-number {
        font-size: 28px;
      }
    }
  }
}
</style>

