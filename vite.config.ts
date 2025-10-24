/*
 * @Author: wangsen 2765500856@qq.com
 * @Date: 2025-10-24 10:04:49
 * @LastEditors: wangsen 2765500856@qq.com
 * @LastEditTime: 2025-10-24 10:37:57
 * @FilePath: /wangsen0802.github.io/vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
  optimizeDeps: {
    include: ['vue'],
  },
})
