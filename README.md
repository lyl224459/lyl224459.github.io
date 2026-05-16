# lyl224459.github.io

个人 GitHub Pages 主页源码仓库。

- 在线地址: [https://lyl224459.github.io/](https://lyl224459.github.io/)
- 仓库地址: [https://github.com/lyl224459/lyl224459.github.io](https://github.com/lyl224459/lyl224459.github.io)

## 目录

- [这个仓库是什么](#这个仓库是什么)
- [快速开始](#快速开始)
- [当前主页展示内容](#当前主页展示内容)
- [主要特性](#主要特性)
- [技术栈](#技术栈)
- [文件结构](#文件结构)
- [页面数据策略](#页面数据策略)
- [多语言说明](#多语言说明)
- [头像与 favicon 说明](#头像与-favicon-说明)
- [本地预览](#本地预览)
- [部署方式](#部署方式)
- [自定义速查](#自定义速查)
- [常见修改入口](#常见修改入口)
- [推荐维护流程](#推荐维护流程)
- [发布前检查清单](#发布前检查清单)
- [已知限制](#已知限制)
- [建议的后续优化](#建议的后续优化)
- [English Summary](#english-summary)

## 这个仓库是什么

这个仓库用来维护 `lyl224459` 的个人技术主页。它不是博客系统，也不是通用作品集模板，而是一个轻量、直接、可快速维护的单页主页，用来承担下面几件事：

- 展示个人介绍、研究方向和代表仓库
- 汇总 GitHub 公开资料与最近更新
- 作为 GitHub Profile / GitHub Pages 的对外入口页
- 为后续维护保留足够简单的结构，不依赖构建工具

## 快速开始

如果只是想快速上手维护这个站点，按下面做就够了：

1. 修改 `index.html`
2. 本地启动静态服务器预览
3. 检查中英文切换、头像、精选仓库和移动端布局
4. 提交并推送到 `lyl224459.github.io`

最常用的本地预览命令：

```powershell
py -3 -m http.server 4173
```

然后访问：

```text
http://127.0.0.1:4173/
```

## 当前主页展示内容

主页目前包含以下板块：

- 个人介绍
- GitHub 公开资料概览
- 精选仓库
- 最近公开动态
- 语言与主题标签
- 联系入口

当前重点展示的仓库包括：

- [NeonSight-YOLODemoApp](https://github.com/lyl224459/NeonSight-YOLODemoApp)
- [CloudSim-Benchmark](https://github.com/lyl224459/CloudSim-Benchmark)
- [Cloudlet-Schedule](https://github.com/lyl224459/Cloudlet-Schedule)
- [obsidian-git-zh](https://github.com/lyl224459/obsidian-git-zh)

## 主要特性

- 纯静态页面，适合直接部署到 GitHub Pages
- 核心实现集中在单文件 `index.html`
- 响应式布局，兼顾桌面端与移动端
- 根据浏览器语言自动选择中文或英文
- 支持手动切换 `中 / EN`
- 优先读取 GitHub API 实时公开数据
- GitHub API 不可用时自动回退到本地快照
- 页头头像、资料卡头像、标签页 favicon 共用 GitHub 头像源
- 附带一个轻量 GitHub Action，用来检查关键文件和主页核心标记
- 无需构建、无需打包、无需前端框架

## 技术栈

页面目前使用：

- HTML
- CSS
- 原生 JavaScript
- GitHub REST API

整个站点不依赖 Node 构建链，也没有引入 React、Vue 或其他框架，目标就是直接、透明、易改。

## 文件结构

当前仓库结构很简单：

```text
.
├─ .github/
│  └─ workflows/
│     └─ check.yml # 轻量自动检查
├─ index.html   # 页面结构、样式、交互、数据逻辑
└─ README.md    # 仓库说明文档
```

## 页面数据策略

主页内容分成两类：

### 1. 静态配置

这部分直接写在 `index.html` 中，适合手工维护：

- 中英文文案: `i18n`
- 精选仓库顺序: `featuredRepoOrder`
- 项目补充说明: `repoDetails`
- GitHub 数据回退快照: `fallbackProfile`、`fallbackRepos`

### 2. GitHub 实时数据

页面会在加载后请求：

- `https://api.github.com/users/lyl224459`
- `https://api.github.com/users/lyl224459/repos?sort=updated&per_page=100`

成功时使用最新公开资料刷新页面，失败时则保留本地快照内容。

### 回退快照什么时候需要更新

虽然页面会优先请求 GitHub API，但下面这些信息如果长期变化，最好顺手同步更新本地快照：

- `fallbackProfile`
- `fallbackRepos`
- `featuredRepoOrder`
- `repoDetails`

这样即使 GitHub API 暂时不可用，页面展示也不会显得过时。

## 多语言说明

主页当前支持：

- 中文
- 英文

语言逻辑如下：

1. 页面初次加载时，读取浏览器语言
2. 如果匹配 `zh`，默认显示中文
3. 如果匹配 `en`，默认显示英文
4. 其他未支持语言回退到中文
5. 用户仍然可以通过页头的 `中 / EN` 手动切换当前页面语言

如果后续需要增加更多语言，最主要的入口是 `index.html` 中的 `i18n` 对象。

## 头像与 favicon 说明

当前页面的头像来源保持统一：

- 页头 logo 使用 GitHub 头像
- 资料卡头像使用 GitHub 头像
- 标签页 favicon 使用 GitHub 头像

这些头像在运行时会优先使用 GitHub API 返回的 `avatar_url`，因此如果 GitHub 头像变更，页面上的对应图标也会一起更新。

## 本地预览

因为页面里包含 GitHub API 请求，不建议直接双击 HTML 文件预览。更稳妥的方式是启动本地静态服务器。

### Python

```powershell
py -3 -m http.server 4173
```

然后访问：

```text
http://127.0.0.1:4173/
```

## 部署方式

这个仓库对应 GitHub Pages 仓库：

- 仓库地址: [https://github.com/lyl224459/lyl224459.github.io](https://github.com/lyl224459/lyl224459.github.io)
- 站点地址: [https://lyl224459.github.io/](https://lyl224459.github.io/)

通常只需要提交并推送 `index.html`、`README.md` 和 `.github/workflows/check.yml` 这类文件更新即可完成发布。

## 自动检查

仓库现在带了一个轻量级 GitHub Action：

- 文件位置：`.github/workflows/check.yml`
- 触发时机：`push` 和 `pull_request`
- 检查内容：
  - `index.html` 和 `README.md` 是否存在
  - 页面标题、favicon 绑定、浏览器语言识别逻辑是否仍在
  - README 的快速开始和发布前检查清单是否仍在

这套检查不会引入构建链，也不会自动部署。它的目标只是防止主页核心结构被误删，保持仓库继续“轻、直、好维护”。

## 自定义速查

下面这张表可以当成改站点时的第一入口：

| 想改什么 | 去哪里改 |
| --- | --- |
| 首页主标题 | `i18n.zh.heroTitle` / `i18n.en.heroTitle` |
| 首页介绍文案 | `i18n.zh.heroLead` / `i18n.en.heroLead` |
| 导航与按钮文字 | `i18n` 对象中的对应字段 |
| 精选仓库顺序 | `featuredRepoOrder` |
| 仓库摘要说明 | `repoDetails` |
| GitHub API 失败时的默认资料 | `fallbackProfile` |
| GitHub API 失败时的默认仓库列表 | `fallbackRepos` |
| 页头头像 / 资料卡头像 / favicon 同步 | `renderProfile()` |
| 浏览器语言识别逻辑 | `detectLocale()` |
| 中英切换按钮逻辑 | `setupLanguageSwitcher()` / `setLocale()` |
| 项目卡渲染方式 | `renderProjects()` |
| 最近动态渲染方式 | `renderActivity()` |
| 语言分布渲染方式 | `renderLanguages()` |

## 常见修改入口

如果你之后要继续维护主页，最常改的地方通常是下面这些：

### 改首页文案

- `i18n.zh`
- `i18n.en`

### 改精选仓库顺序

- `featuredRepoOrder`

### 改项目介绍

- `repoDetails`

### 改默认回退数据

- `fallbackProfile`
- `fallbackRepos`

### 改头像 / favicon 逻辑

- `renderProfile()` 中与 `brandAvatar`、`profilePhoto`、`siteFavicon` 相关的部分

### 改浏览器语言默认值

- `defaultLocale`
- `supportedLocales`
- `detectLocale()`

## 推荐维护流程

每次更新主页时，建议按这个顺序做：

1. 修改 `index.html`
2. 本地起一个静态服务器预览
3. 检查桌面端和移动端布局
4. 检查中文和英文切换
5. 检查 GitHub API 可用时的数据是否正常刷新
6. 确认 API 不可用时页面仍可用
7. 提交并推送

## 发布前检查清单

可以在发布前快速过一遍：

- 页面首屏文案是否仍然自然
- 精选仓库是否还是你想展示的那几个
- 头像和 favicon 是否正常显示
- 中英文是否都完整
- GitHub API 请求失败时页面是否还能正常展示
- README 是否与当前主页逻辑一致

## 已知限制

- 当前没有自动化测试
- 当前没有构建产物校验流程
- GitHub API 数据依赖公开接口可用性
- README 目前仍以中文为主，没有单独英文版

## 建议的后续优化

- 增加 README 英文版说明
- 把精选仓库进一步细分为研究项目 / 工具项目
- 增加仓库截图或社交预览图
- 为页面加入更明确的更新时间展示
- 把 README 与主页文案继续统一风格

## English Summary

This repository contains the source code for the `lyl224459` personal GitHub Pages homepage.

### What the page does

- Presents a short personal introduction
- Shows featured repositories and recent public activity
- Pulls public GitHub profile and repository data at runtime
- Falls back to local snapshot data when the GitHub API is unavailable
- Switches between Chinese and English based on browser language

### Main implementation notes

- Single-file page implementation in `index.html`
- No frontend framework
- No build step
- Deployed directly through GitHub Pages

### Main customization points

- `i18n` for copy
- `featuredRepoOrder` for featured repository order
- `repoDetails` for custom repository summaries
- `fallbackProfile` and `fallbackRepos` for offline fallback data
- `renderProfile()` for avatar and favicon sync

## 备注

截至 2026-05-16 校验时：

- 主页在线地址可访问
- GitHub 公开资料接口可返回数据
