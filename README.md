# wangsen0802.github.io

使用 Vue 3 + TypeScript + Vite 构建的个人网站。

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 部署到 GitHub Pages

这个项目配置了 GitHub Actions 自动构建和部署：

1. **启用 GitHub Pages**：
   - 进入仓库的 Settings → Pages
   - Source 选择 "GitHub Actions"

2. **推送代码**：
   ```bash
   git add .
   git commit -m "feat: 配置 TypeScript + Vue 项目自动部署"
   git push origin main
   ```

3. **查看部署状态**：
   - 在 Actions 标签页查看构建进度
   - 部署成功后可在 `https://wangsen0802.github.io` 访问

## 技术栈

- Vue 3
- TypeScript
- Vite 5.x (Node.js 18 兼容)
- GitHub Actions 自动部署

## 项目结构

```
src/
├── App.vue          # 根组件
├── main.ts          # 应用入口
├── style.css        # 全局样式
└── components/      # 组件目录
    └── HelloWorld.vue
```

TypeScript 代码会自动编译为 JavaScript 并部署到 GitHub Pages。