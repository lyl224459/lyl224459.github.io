# lyl224459.github.io

个人 GitHub Pages 主页源码仓库。当前版本已从单文件静态页迁移为 `Bun + Vite + TypeScript + Sass + Bootstrap 5.3.8` 的轻量前端工程。

- 在线地址: [https://lyl224459.github.io/](https://lyl224459.github.io/)
- 仓库地址: [https://github.com/lyl224459/lyl224459.github.io](https://github.com/lyl224459/lyl224459.github.io)

## 快速开始

需要先安装 Bun：

```powershell
scoop install bun
```

安装依赖并启动开发服务器：

```powershell
bun install
bun run dev
```

然后访问：

```text
http://127.0.0.1:5173/
```

常用命令：

```powershell
bun run typecheck
bun run build
bun run preview
```

## 当前主页展示内容

- 个人介绍、技术方向与 GitHub 资料卡
- GitHub 公开资料概览、累计 Star、语言栈和最近活跃仓库
- 精选仓库、最近公开动态、语言分布和主题标签
- 中英文切换、暗色/亮色/自动主题、移动端响应式导航

当前重点展示的仓库包括：

- [NeonSight-YOLODemoApp](https://github.com/lyl224459/NeonSight-YOLODemoApp)
- [CloudSim-Benchmark](https://github.com/lyl224459/CloudSim-Benchmark)
- [Cloudlet-Schedule](https://github.com/lyl224459/Cloudlet-Schedule)
- [obsidian-git-zh](https://github.com/lyl224459/obsidian-git-zh)

## 技术栈

- Bun：依赖安装与脚本运行
- Vite：开发服务器与生产构建
- TypeScript：严格模式下的数据契约、状态建模和 DOM 安全访问
- Sass：Bootstrap 变量定制与主页视觉层
- Bootstrap 5.3.8：Grid、Utilities、Navbar、Cards、Buttons、Badges、Progress 和 `data-bs-theme`
- GitHub REST API：加载公开资料和仓库数据

## 文件结构

```text
.
├─ .github/
│  └─ workflows/
│     └─ check.yml
├─ src/
│  ├─ styles/
│  │  └─ main.scss
│  ├─ data.ts
│  ├─ dom.ts
│  ├─ github.ts
│  ├─ i18n.ts
│  ├─ main.ts
│  └─ types.ts
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
└─ README.md
```

## 页面数据策略

主页启动时会先渲染本地快照，随后请求：

- `https://api.github.com/users/lyl224459`
- `https://api.github.com/users/lyl224459/repos?sort=updated&per_page=100`

如果 GitHub API 可用，页面切换到实时公开数据；如果请求失败或响应结构不符合 TypeScript 类型守卫，就保留本地快照。

主要维护入口：

- `src/data.ts`：GitHub 用户名、fallback 资料、精选仓库顺序、项目补充说明
- `src/i18n.ts`：中英文文案，使用 `Record<Locale, ...>` 保证 key 对齐
- `src/styles/main.scss`：Bootstrap Sass 定制和 Neo-GitHub 视觉样式
- `src/main.ts`：渲染、主题、语言切换、导航和回到顶部交互

## 本地预览

开发模式：

```powershell
bun run dev
```

生产构建后预览：

```powershell
bun run build
bun run preview
```

`dist/` 是 Vite 生成的静态产物；`bun run build` 会同时把 `dist/index.html` 与 `dist/assets/` 同步到仓库根目录，兼容 GitHub Pages 的分支根目录发布模式。

## 部署方式

当前仓库已配置双保险部署：

- GitHub Actions：推送到 `main` 后运行 `bun install`、`bun run typecheck`、`bun run build`，并把 `dist/` 作为 Pages artifact 发布。
- 分支根目录：`bun run build` 会把构建产物同步到根目录的 `index.html` 与 `assets/`，即使 GitHub Pages 仍配置为 `Deploy from a branch` 也能直接加载样式。

GitHub 仓库设置里需要确认：

1. `Settings` → `Pages`
2. `Build and deployment` → `Source`
3. 选择 `GitHub Actions`

推荐使用以上设置。若暂时保持 `Deploy from a branch`，请确保提交的是执行 `bun run build` 后生成的根目录 `index.html` 与 `assets/`。

## 自动检查

工作流位置：`.github/workflows/check.yml`

当前检查内容：

- 安装 Bun
- 使用 lockfile 安装依赖
- 执行 `bun run typecheck`
- 执行 `bun run build`
- 校验 `dist/index.html`、根目录 `index.html` 与 `assets/` 构建产物存在
- 推送到 `main` 时上传 `dist/` 到 GitHub Pages，并保留根目录静态快照兼容分支部署

## 发布前检查清单

- `bun run typecheck` 通过
- `bun run build` 通过
- 桌面端与移动端布局无横向滚动、遮挡或按钮溢出
- 中英文切换正常
- 暗色、亮色、自动主题切换正常
- GitHub API 失败时 fallback 快照仍可正常展示

## English Summary

This repository contains the source code for the `lyl224459` personal GitHub Pages homepage.

The current implementation uses Bun, Vite, TypeScript, Sass, and Bootstrap 5.3.8. It renders a responsive Neo-GitHub style profile page with typed fallback data, live GitHub API hydration, bilingual copy, and dark/light/auto color modes.
