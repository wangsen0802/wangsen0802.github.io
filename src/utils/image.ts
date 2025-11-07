/**
 * 图片处理工具函数
 */

// 处理图片路径，支持多种图片源
export function processImagePath(src: string): string {
  if (!src) return src

  // 处理 VSCode 内部 attachment 格式
  if (src.startsWith('attachment:')) {
    console.warn('检测到 VSCode 内部图片引用格式，请手动替换为标准图片路径')
    return '/src/assets/images/common/placeholder.png' // 返回占位符
  }

  // 处理相对路径 - 转换为从 @/assets/images 开始的路径
  if (src.startsWith('./') || src.startsWith('../')) {
    return src // 保持相对路径，让 Vite 处理
  }

  // 处理绝对路径 - 如果以 /src/assets/images 开头
  if (src.startsWith('/src/assets/images/')) {
    return src // 保持原样，Vite 会处理
  }

  // 处理外部 URL
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src // 保持外部链接不变
  }

  // 处理其他相对路径，假设是相对于当前文章的图片
  if (!src.startsWith('/')) {
    return `/src/assets/images/posts/${src}`
  }

  return src
}

// 安全的 base64 编码，支持中文字符
function safeBase64Encode(str: string): string {
  try {
    // 先转换为 UTF-8 字节数组，再进行 base64 编码
    const utf8Bytes = new TextEncoder().encode(str)
    let binary = ''
    utf8Bytes.forEach(byte => (binary += String.fromCharCode(byte)))
    return btoa(binary)
  } catch (error) {
    console.warn('Base64 编码失败，使用备用方案:', error)
    // 降级方案：移除非 ASCII 字符
    return btoa(unescape(encodeURIComponent(str)))
  }
}

// 创建占位符图片 SVG
export function createPlaceholderSVG(
  width: number = 400,
  height: number = 300,
  text: string = '图片加载中'
): string {
  const svgTemplate = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .placeholder-text {
            font-family: Arial, sans-serif;
            font-size: 16px;
            fill: #999;
            text-anchor: middle;
            dominant-baseline: middle;
          }
        </style>
      </defs>
      <rect width="100%" height="100%" fill="#f5f5f5" stroke="#ddd" stroke-width="1"/>
      <text x="50%" y="50%" class="placeholder-text">
        ${text}
      </text>
    </svg>
  `.trim()

  return `data:image/svg+xml;base64,${safeBase64Encode(svgTemplate)}`
}

// 检查图片是否存在（仅用于本地图片）
export async function checkImageExists(src: string): Promise<boolean> {
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return true // 外部图片假设存在
  }

  if (src.startsWith('data:')) {
    return true // base64 图片认为存在
  }

  try {
    const img = new Image()
    return new Promise(resolve => {
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = src
      // 设置超时，避免长时间等待
      setTimeout(() => resolve(false), 3000)
    })
  } catch {
    return false
  }
}

// 优化图片尺寸建议
export function getOptimalImageSrc(
  src: string,
  _containerWidth: number,
  _containerHeight: number
): string {
  // 对于外部图片，返回原链接
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }

  // 对于本地图片，可以在这里添加不同尺寸的逻辑
  // 例如：@2x, @3x 后缀等
  return src
}

// 支持的图片格式
export const SUPPORTED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'avif']

// 检查文件扩展名是否为支持的图片格式
export function isSupportedImageFormat(filename: string): boolean {
  const extension = filename.split('.').pop()?.toLowerCase()
  return extension ? SUPPORTED_IMAGE_FORMATS.includes(extension) : false
}
