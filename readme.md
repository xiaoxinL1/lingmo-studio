# 靈墨工坊 · Lingmo Studio

基于 Puter.js 的 AI 图像生成工具，免费、中文友好、开箱即用。

## 核心特性

- **零成本使用** — 通过 Puter 平台调用 12 个主流 AI 生图模型，无需自备 API Key
- **中文优化** — 自动检测中文提示词并推荐最佳模型（Seedream 4.0 / Qwen Image）
- **当代水墨设计** — 朱砂红 + 宣纸白配色，马山正书法字体，暗色/亮色双主题
- **本地持久化** — IndexedDB 存储历史记录，localStorage 存储额度与设置
- **响应式布局** — 桌面端与移动端适配

## 技术栈

| 类别     | 方案                                                            |
| ------ | ------------------------------------------------------------- |
| 框架     | Vue 3 (Composition API + `<script setup>`)                    |
| 语言     | TypeScript (strict)                                           |
| 构建     | Vite 6                                                        |
| UI 库   | Naive UI                                                      |
| 状态管理   | Pinia                                                         |
| 路由     | Vue Router (Hash 模式)                                          |
| 图标     | @vicons/ionicons5                                             |
| 字体     | Ma Shan Zheng / Noto Serif SC / Noto Sans SC / JetBrains Mono |
| AI SDK | @heyputer/puter.js                                            |
| 本地存储   | idb-keyval (IndexedDB)                                        |

## 可用模型

| 模型                 | 中文支持 | 特点          |
| ------------------ | ---- | ----------- |
| Seedream 4.0       | ✅ 推荐 | 字节跳动，中文优化   |
| Qwen Image         | ✅    | 通义千问，中文理解优秀 |
| Gemini 3 Pro       | ✅    | Google 专业级  |
| Gemini 3.1 Flash   | ✅    | Google 极速   |
| GPT Image 2        | —    | OpenAI 最新   |
| DALL-E 3           | —    | OpenAI 经典   |
| DALL-E 2           | —    | 快速批量        |
| Flux 1.1 Pro       | —    | 写实风格        |
| Flux Schnell       | —    | 极速生成        |
| Ideogram 3.0       | —    | 文字渲染专家      |
| Stable Diffusion 3 | —    | 开源经典        |
| GPT Image 1.5      | —    | OpenAI 高质量  |

## 快速开始

```bash
npm install
npm run dev       # 开发模式 http://localhost:3000
npm run build     # 生产构建
npm run preview   # 预览构建产物
```

## 项目结构

```
src/
├── main.ts                      # 应用入口
├── App.vue                      # 根组件 · 主题配置 · CSS 变量
├── api/
│   └── imageApi.ts              # Puter.js 生图封装 · 模型列表
├── components/
│   ├── ImageGenerator.vue       # 提示词输入 · 参数控制 · 生成按钮
│   ├── ImageResult.vue          # 结果网格展示
│   ├── GeneratingOverlay.vue    # 生成中全屏动画
│   ├── HistoryPanel.vue         # 历史记录抽屉
│   ├── SettingsDrawer.vue       # 设置抽屉
│   ├── ThemeToggle.vue          # 暗色/亮色切换
│   └── WelcomeGuide.vue         # 首次使用引导
├── router/
│   └── index.ts                 # Vue Router 配置
├── stores/
│   ├── settings.ts              # 主题 · 默认模型 · 画质
│   └── usage.ts                 # 每日额度管理
├── types/
│   └── index.ts                 # 全局类型定义
├── utils/
│   ├── db.ts                    # IndexedDB CRUD
│   └── uuid.ts                  # UUID 生成器
└── views/
    └── HomeView.vue             # 主页面
```

## 图像生成参数

- **提示词**：最多 500 字，支持中英文
- **排除元素**：可折叠区域，默认排除低质量词
- **尺寸**：1:1 / 1:1 HD / 3:4 / 16:9 / 16:9 HD / 9:16
- **数量**：1–4 张
- **画质**：快速 / 标准 / 精细
- **增强**：自动添加画质提升关键词

## 设计令牌

| 令牌          | 暗色模式      | 亮色模式      | 用途   |
| ----------- | --------- | --------- | ---- |
| `--bg`      | `#08080a` | `#f5f0e8` | 页面背景 |
| `--surface` | `#111014` | `#ede7dc` | 卡片背景 |
| `--accent`  | `#c13b33` | `#b8332b` | 强调色  |
| `--text`    | `#efe8dc` | `#1a1612` | 主文字  |

## 数据持久化

| 存储           | 键                                          | 内容             |
| ------------ | ------------------------------------------ | -------------- |
| IndexedDB    | `lingmo-history-{id}`                      | 历史记录 (最多 20 条) |
| localStorage | `lingmo-theme`                             | 主题模式           |
| localStorage | `lingmo-default-model`                     | 默认模型           |
| localStorage | `lingmo-daily-limit`                       | 每日额度           |
| localStorage | `lingmo-usage-date` / `lingmo-usage-count` | 当日用量           |

## 许可证

MIT
