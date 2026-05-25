import type { GitHubProfile, GitHubRepo, Locale, RepoDetails } from "./types";

export const USERNAME = "lyl224459" as const;
export const DEFAULT_LOCALE: Locale = "zh";
export const FALLBACK_SNAPSHOT_DATE = "2026-05-16" as const;

export const fallbackProfile: GitHubProfile = {
  login: "lyl224459",
  name: "lyl224459",
  html_url: "https://github.com/lyl224459",
  avatar_url: "https://avatars.githubusercontent.com/u/60121811?v=4",
  location: "Bekasi, Indonesia",
  bio: null,
  public_repos: 10,
  followers: 2,
  following: 1,
  updated_at: "2026-05-03T08:43:25Z"
};

export const fallbackProjectPreview =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 640">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#07111f"/>
          <stop offset="55%" stop-color="#101b2e"/>
          <stop offset="100%" stop-color="#28194c"/>
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#2dd4bf"/>
          <stop offset="50%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#a78bfa"/>
        </linearGradient>
      </defs>
      <rect width="960" height="640" rx="56" fill="url(#bg)"/>
      <circle cx="768" cy="118" r="168" fill="#38bdf8" opacity="0.15"/>
      <circle cx="168" cy="522" r="184" fill="#a78bfa" opacity="0.14"/>
      <rect x="84" y="86" width="792" height="18" rx="9" fill="rgba(255,255,255,0.12)"/>
      <rect x="84" y="150" width="328" height="220" rx="34" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)"/>
      <rect x="464" y="154" width="336" height="26" rx="13" fill="url(#accent)"/>
      <rect x="464" y="222" width="292" height="20" rx="10" fill="rgba(255,255,255,0.20)"/>
      <rect x="464" y="266" width="248" height="20" rx="10" fill="rgba(255,255,255,0.14)"/>
      <rect x="464" y="310" width="188" height="20" rx="10" fill="rgba(255,255,255,0.10)"/>
      <rect x="84" y="440" width="220" height="58" rx="29" fill="rgba(45,212,191,0.22)" stroke="rgba(45,212,191,0.55)"/>
      <rect x="334" y="440" width="196" height="58" rx="29" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.16)"/>
    </svg>
  `);

export const fallbackRepos: GitHubRepo[] = [
  {
    name: "NeonSight-YOLODemoApp",
    html_url: "https://github.com/lyl224459/NeonSight-YOLODemoApp",
    description: "NeonSight 是一个基于 Qt Quick、OpenCV 和 ONNX Runtime 的 Windows 桌面端 YOLO 目标检测应用。",
    language: "C++",
    stargazers_count: 0,
    forks_count: 0,
    updated_at: "2026-05-16T13:24:13Z",
    homepage: null
  },
  {
    name: "onnxruntime-yolo",
    html_url: "https://github.com/lyl224459/onnxruntime-yolo",
    description: "ONNX Runtime cross-platform inferencing accelerator, packaged for YOLO usage.",
    language: "C++",
    stargazers_count: 0,
    forks_count: 0,
    updated_at: "2026-05-15T14:37:01Z",
    homepage: "https://onnxruntime.ai"
  },
  {
    name: "lyl224459.github.io",
    html_url: "https://github.com/lyl224459/lyl224459.github.io",
    description: "home page",
    language: "HTML",
    stargazers_count: 0,
    forks_count: 0,
    updated_at: "2026-05-02T13:58:49Z",
    homepage: null
  },
  {
    name: "obsidian-git-zh",
    html_url: "https://github.com/lyl224459/obsidian-git-zh",
    description: "一个强大的 Obsidian.md 社区插件，将 Git 版本控制集成到您的笔记库中。",
    language: "TypeScript",
    stargazers_count: 2,
    forks_count: 0,
    updated_at: "2026-04-10T17:21:30Z",
    homepage: ""
  },
  {
    name: "CloudSim-Benchmark",
    html_url: "https://github.com/lyl224459/CloudSim-Benchmark",
    description: "一个基于 CloudSim Plus 和 Kotlin 开发的云任务调度算法对比实验平台。",
    language: "Kotlin",
    stargazers_count: 1,
    forks_count: 0,
    updated_at: "2026-03-09T13:35:21Z",
    homepage: null
  },
  {
    name: "Cloudlet-Schedule",
    html_url: "https://github.com/lyl224459/Cloudlet-Schedule",
    description: "基于 CloudSim 5.0 框架的云计算任务调度仿真平台。",
    language: "Java",
    stargazers_count: 0,
    forks_count: 0,
    updated_at: "2026-03-08T01:35:46Z",
    homepage: ""
  },
  {
    name: "obsidian-releases",
    html_url: "https://github.com/lyl224459/obsidian-releases",
    description: "Community plugins list, theme list, and releases of Obsidian.",
    language: null,
    stargazers_count: 0,
    forks_count: 0,
    updated_at: "2026-01-22T14:40:26Z",
    homepage: "https://obsidian.md/"
  },
  {
    name: "BilibiliTask",
    html_url: "https://github.com/lyl224459/BilibiliTask",
    description: "哔哩哔哩(B站)自动完成每日任务、投币、点赞与签到。",
    language: "Java",
    stargazers_count: 0,
    forks_count: 0,
    updated_at: "2021-05-18T14:07:25Z",
    homepage: "https://srcrs.top/posts/202010191.html"
  },
  {
    name: "cloud189-action",
    html_url: "https://github.com/lyl224459/cloud189-action",
    description: "天翼云盘自动签到 + 抽奖",
    language: null,
    stargazers_count: 1,
    forks_count: 0,
    updated_at: "2021-05-18T13:50:13Z",
    homepage: null
  },
  {
    name: "wyy-action",
    html_url: "https://github.com/lyl224459/wyy-action",
    description: "网易云音乐自动签到 + 刷歌",
    language: null,
    stargazers_count: 1,
    forks_count: 0,
    updated_at: "2021-05-18T13:49:25Z",
    homepage: null
  }
];

export const featuredRepoOrder = [
  "NeonSight-YOLODemoApp",
  "CloudSim-Benchmark",
  "Cloudlet-Schedule",
  "obsidian-git-zh"
] as const;

export const repoDetails: Record<string, RepoDetails> = {
  "NeonSight-YOLODemoApp": {
    summary: {
      zh: "Windows 桌面端 YOLO 目标检测应用，已经打通图片检测、参数调节、结果导出和 CUDA 发布流程。",
      en: "A Windows desktop YOLO detection app with image inference, parameter controls, export flows, and CUDA release packaging already connected."
    },
    tags: ["C++", "Qt Quick", "OpenCV", "ONNX Runtime"]
  },
  "CloudSim-Benchmark": {
    summary: {
      zh: "基于 CloudSim Plus 与 Kotlin 的云任务调度实验平台，适合做批处理与实时调度算法对比。",
      en: "A cloud task scheduling benchmark platform built with CloudSim Plus and Kotlin for batch and real-time algorithm comparison."
    },
    tags: ["Kotlin", "CloudSim Plus", "Task Scheduling", "Benchmark"]
  },
  "Cloudlet-Schedule": {
    summary: {
      zh: "基于 CloudSim 5.0 的任务调度仿真平台，聚焦元启发式算法和传统调度策略对比。",
      en: "A CloudSim 5.0 scheduling simulation platform focused on comparing metaheuristics with traditional scheduling strategies."
    },
    tags: ["Java", "CloudSim 5.0", "Metaheuristics", "Simulation"]
  },
  "obsidian-git-zh": {
    summary: {
      zh: "Obsidian Git 插件的完整简体中文版本，覆盖核心界面、文档与中文用户使用体验。",
      en: "A full Simplified Chinese localization of the Obsidian Git plugin, covering the main UI, docs, and overall user experience."
    },
    tags: ["TypeScript", "Obsidian", "Plugin", "Localization"]
  },
  "lyl224459.github.io": {
    summary: {
      zh: "个人 GitHub Pages 主页源码仓库，用来维护对外展示页面。",
      en: "The source repository for this GitHub Pages homepage."
    },
    tags: ["TypeScript", "Bootstrap", "GitHub Pages"]
  }
};

export const languageColors: Record<string, string> = {
  "C++": "linear-gradient(90deg, #38bdf8, #0ea5e9)",
  Java: "linear-gradient(90deg, #f59e0b, #f97316)",
  Kotlin: "linear-gradient(90deg, #8b5cf6, #7c3aed)",
  TypeScript: "linear-gradient(90deg, #60a5fa, #2563eb)",
  HTML: "linear-gradient(90deg, #fb7185, #ef4444)"
};
