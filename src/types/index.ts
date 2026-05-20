export interface ImageSize {
  label: string
  width: number
  height: number
  value: string
}

export interface GenerateParams {
  prompt: string
  negative_prompt: string
  size: string
  num_images: number
  enhance: boolean
}

export interface HistoryRecord {
  id: string
  prompt: string
  negative_prompt: string
  size: string
  model?: string
  images: string[]
  favorited: boolean
  createdAt: number
}

export interface SettingsState {
  dailyLimit: number
  defaultModel: string
  defaultQuality: 'low' | 'medium' | 'high'
}

export type ThemeMode = 'dark' | 'light'

export type QualityLevel = 'low' | 'medium' | 'high'
