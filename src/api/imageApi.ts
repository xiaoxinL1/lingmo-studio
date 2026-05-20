import { puter } from '@heyputer/puter.js'
import type { GenerateParams } from '@/types'

export interface ImageGenerationOptions {
  model?: string
  quality?: 'low' | 'medium' | 'high'
}

const DEFAULT_MODEL = 'ByteDance-Seed/Seedream-4.0'
const DEFAULT_QUALITY = 'medium' as const

export async function generateImage(
  params: GenerateParams,
  options: ImageGenerationOptions = {}
): Promise<string[]> {
  let {
    model = DEFAULT_MODEL,
    quality = DEFAULT_QUALITY,
  } = options

  const finalPrompt = buildPrompt(params)
  const images: string[] = []

  try {
    for (let i = 0; i < params.num_images; i++) {
      const imageElement = await puter.ai.txt2img(finalPrompt, {
        model,
        quality,
      })

      if (!imageElement) {
        throw new Error(`第 ${i + 1} 张图像生成失败`)
      }

      const imageUrl = await extractImageUrl(imageElement)
      images.push(imageUrl)
    }

    return images
  } catch (error: any) {
    throw new Error(`图像生成失败: ${error.message || '未知错误'}`)
  }
}

function containsChinese(text: string): boolean {
  return /[\u4e00-\u9fa5]/.test(text)
}

function buildPrompt(params: GenerateParams): string {
  let prompt = params.prompt.trim()

  if (params.negative_prompt && params.negative_prompt.trim()) {
    prompt += `, avoid: ${params.negative_prompt}`
  }

  if (params.size) {
    const sizeMap: Record<string, string> = {
      '1024x1024': 'square format, high resolution',
      '2048x2048': 'ultra high resolution 4K',
      '768x1024': 'portrait orientation',
      '1024x576': 'landscape widescreen',
      '2048x1152': 'landscape ultra wide',
      '576x1024': 'tall portrait',
    }
    prompt += `, ${sizeMap[params.size] || params.size}`
  }

  if (params.enhance) {
    prompt += ', masterpiece, best quality, highly detailed, 8K'
  }

  return prompt
}

async function extractImageUrl(imageElement: HTMLImageElement): Promise<string> {
  return new Promise((resolve, reject) => {
    if (imageElement.complete && imageElement.naturalWidth !== 0) {
      convertToDataURL(imageElement, resolve, reject)
    } else {
      imageElement.onload = () => convertToDataURL(imageElement, resolve, reject)
      imageElement.onerror = () => reject(new Error('图像加载失败'))
    }
  })
}

function convertToDataURL(
  img: HTMLImageElement,
  resolve: (value: string) => void,
  reject: (reason?: any) => void
) {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth || img.width
    canvas.height = img.naturalHeight || img.height

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      reject(new Error('无法创建 Canvas 上下文'))
      return
    }

    ctx.drawImage(img, 0, 0)
    const dataURL = canvas.toDataURL('image/png')
    resolve(dataURL)
  } catch (error) {
    if (img.src && img.src.startsWith('data:')) {
      resolve(img.src)
    } else if (img.src) {
      resolve(img.src)
    } else {
      reject(error)
    }
  }
}

export function getRecommendedModel(prompt: string): string {
  if (containsChinese(prompt)) {
    return 'ByteDance-Seed/Seedream-4.0'
  }
  return 'black-forest-labs/flux-1.1-pro'
}

export const AVAILABLE_MODELS = [
  { value: 'ByteDance-Seed/Seedream-4.0', label: 'Seedream 4.0 🇨🇳⭐', description: '字节跳动，中文优化（默认推荐）', chineseSupport: true },
  { value: 'Qwen/Qwen-Image', label: 'Qwen Image 🇨🇳', description: '通义千问，中文理解优秀', chineseSupport: true },
  { value: 'gpt-image-2', label: 'GPT Image 2', description: 'OpenAI 最新，英文优化', chineseSupport: false },
  { value: 'gpt-image-1.5', label: 'GPT Image 1.5', description: 'OpenAI 高质量版本', chineseSupport: false },
  { value: 'dall-e-3', label: 'DALL-E 3', description: 'OpenAI 经典高质量', chineseSupport: false },
  { value: 'dall-e-2', label: 'DALL-E 2', description: '快速生成，适合批量', chineseSupport: false },
  { value: 'black-forest-labs/flux-1.1-pro', label: 'Flux 1.1 Pro', description: '高质量写实风格（英文）', chineseSupport: false },
  { value: 'black-forest-labs/flux-schnell', label: 'Flux Schnell', description: '极速生成模式（英文）', chineseSupport: false },
  { value: 'gemini-3.1-flash-image-preview', label: 'Gemini 3.1 Flash', description: 'Google 最新极速', chineseSupport: true },
  { value: 'gemini-3-pro-image-preview', label: 'Gemini 3 Pro', description: 'Google 专业级', chineseSupport: true },
  { value: 'ideogram/ideogram-3.0', label: 'Ideogram 3.0', description: '文字渲染专家', chineseSupport: false },
  { value: 'stabilityai/stable-diffusion-3-medium', label: 'Stable Diffusion 3', description: '开源经典模型', chineseSupport: false },
] as const

export type ModelType = typeof AVAILABLE_MODELS[number]['value']
