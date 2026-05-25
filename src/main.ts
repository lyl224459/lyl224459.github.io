import Collapse from "bootstrap/js/dist/collapse";
import "./styles/main.scss";
import {
  DEFAULT_LOCALE,
  USERNAME,
  fallbackProjectPreview,
  featuredRepoOrder,
  languageColors,
  repoDetails
} from "./data";
import { queryElement, queryOptional, setHtml, setImageSource, setText } from "./dom";
import { getFallbackPayload, loadGitHubPayload } from "./github";
import { isTranslationKey, type TranslationKey, translate } from "./i18n";
import {
  LOCALES,
  THEME_MODES,
  type DataSourceState,
  type GitHubPayload,
  type GitHubProfile,
  type GitHubRepo,
  type LanguageStat,
  type Locale,
  type ResolvedTheme,
  type ThemeMode
} from "./types";

const LANGUAGE_STORAGE_KEY = "homepage-locale" as const;
const THEME_STORAGE_KEY = "homepage-theme" as const;
const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

let currentLocale: Locale = readStoredLocale() ?? detectLocale();
let currentThemeMode: ThemeMode = readStoredThemeMode();
let lastPayload: GitHubPayload = getFallbackPayload();

function t(key: TranslationKey): string {
  return translate(currentLocale, key);
}

function isLocale(value: string | null | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

function isThemeMode(value: string | null | undefined): value is ThemeMode {
  return THEME_MODES.includes(value as ThemeMode);
}

function readStoredLocale(): Locale | null {
  try {
    const storedLocale = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLocale(storedLocale) ? storedLocale : null;
  } catch {
    return null;
  }
}

function readStoredThemeMode(): ThemeMode {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeMode(storedTheme) ? storedTheme : "auto";
  } catch {
    return "auto";
  }
}

function persistLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
  } catch {
  }
}

function persistTheme(themeMode: ThemeMode): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  } catch {
  }
}

function normalizeLocale(locale: string | undefined): Locale | null {
  if (!locale) {
    return null;
  }

  const lowerLocale = locale.toLowerCase();
  return LOCALES.find((candidate) => lowerLocale === candidate || lowerLocale.startsWith(`${candidate}-`)) ?? null;
}

function detectLocale(): Locale {
  const browserLocales =
    Array.isArray(navigator.languages) && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];

  for (const locale of browserLocales) {
    const normalizedLocale = normalizeLocale(locale);

    if (normalizedLocale) {
      return normalizedLocale;
    }
  }

  return DEFAULT_LOCALE;
}

function resolveTheme(themeMode: ThemeMode): ResolvedTheme {
  if (themeMode === "auto") {
    return systemThemeQuery.matches ? "dark" : "light";
  }

  return themeMode;
}

function applyTheme(): void {
  const resolvedTheme = resolveTheme(currentThemeMode);
  document.documentElement.setAttribute("data-bs-theme", resolvedTheme);
  document.documentElement.setAttribute("data-theme-mode", currentThemeMode);

  const themeToggle = queryOptional<HTMLButtonElement>("#themeToggle");
  if (themeToggle) {
    themeToggle.setAttribute("aria-label", t("themeToggleLabel"));
    themeToggle.title = t("themeToggleLabel");
  }

  setText("#themeLabel", `${t("themeCurrentPrefix")}${themeLabel(currentThemeMode)}`);
}

function themeLabel(themeMode: ThemeMode): string {
  const labels: Record<ThemeMode, TranslationKey> = {
    auto: "themeAuto",
    dark: "themeDark",
    light: "themeLight"
  };

  return t(labels[themeMode]);
}

function cycleTheme(): void {
  const nextThemeByMode: Record<ThemeMode, ThemeMode> = {
    auto: "dark",
    dark: "light",
    light: "auto"
  };

  currentThemeMode = nextThemeByMode[currentThemeMode];
  persistTheme(currentThemeMode);
  applyTheme();
}

function escapeHtml(value: string | number | null | undefined): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(value: string | Date | null | undefined): string {
  if (!value) {
    return t("dateUnknown");
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return t("dateUnknown");
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function sortByUpdated(repos: readonly GitHubRepo[]): GitHubRepo[] {
  return [...repos].sort((firstRepo, secondRepo) => {
    const firstTime = new Date(firstRepo.updated_at).getTime();
    const secondTime = new Date(secondRepo.updated_at).getTime();

    return secondTime - firstTime;
  });
}

function totalStars(repos: readonly GitHubRepo[]): number {
  return repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
}

function totalForks(repos: readonly GitHubRepo[]): number {
  return repos.reduce((sum, repo) => sum + repo.forks_count, 0);
}

function summarizeProfile(profile: GitHubProfile): string {
  return profile.bio?.trim() || t("profileFallbackBio");
}

function repoSummary(repo: GitHubRepo): string {
  return repoDetails[repo.name]?.summary[currentLocale] ?? repo.description ?? t("projectSummaryEmpty");
}

function repoTags(repo: GitHubRepo): readonly string[] {
  const configuredTags = repoDetails[repo.name]?.tags;

  if (configuredTags) {
    return configuredTags.slice(0, 4);
  }

  return [repo.language, repo.homepage ? "Homepage" : null].filter((tag): tag is string => Boolean(tag)).slice(0, 4);
}

function repoImage(repo: GitHubRepo): string {
  return `https://opengraph.githubassets.com/1/${USERNAME}/${repo.name}`;
}

function repoImageFallback(repo: GitHubRepo): string {
  return repoDetails[repo.name]?.preview ?? fallbackProjectPreview;
}

function pickFeatured(repos: readonly GitHubRepo[]): GitHubRepo[] {
  const reposByName = new Map(repos.map((repo) => [repo.name, repo]));
  const featuredRepos = featuredRepoOrder
    .map((repoName) => reposByName.get(repoName))
    .filter((repo): repo is GitHubRepo => Boolean(repo));

  for (const repo of sortByUpdated(repos)) {
    const alreadyFeatured = featuredRepos.some((featuredRepo) => featuredRepo.name === repo.name);

    if (!alreadyFeatured && featuredRepos.length < 4) {
      featuredRepos.push(repo);
    }
  }

  return featuredRepos.slice(0, 4);
}

function languageStats(repos: readonly GitHubRepo[]): LanguageStat[] {
  const counts = new Map<string, number>();

  for (const repo of repos) {
    if (repo.language) {
      counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
    }
  }

  const entries = [...counts.entries()]
    .map(([language, count]) => ({ language, count }))
    .sort((first, second) => second.count - first.count || first.language.localeCompare(second.language));
  const total = entries.reduce((sum, entry) => sum + entry.count, 0);

  return entries.map((entry) => ({
    ...entry,
    percent: total > 0 ? Math.round((entry.count / total) * 100) : 0
  }));
}

function sourceLabel(source: DataSourceState): string {
  return t(source.kind === "live" ? "stateLive" : "stateSnapshot");
}

function translateStaticContent(): void {
  document.documentElement.lang = t("htmlLang");
  document.title = t("pageTitle");
  queryOptional<HTMLMetaElement>('meta[name="description"]')?.setAttribute("content", t("metaDescription"));
  queryOptional<HTMLElement>("#siteNav")?.setAttribute("aria-label", t("pageNavLabel"));
  queryOptional<HTMLElement>("#languageSwitcher")?.setAttribute("aria-label", t("languageSwitcherLabel"));
  queryOptional<HTMLElement>("#backToTop")?.setAttribute("aria-label", t("backToTop"));
  queryOptional<HTMLElement>("#backToTop")?.setAttribute("title", t("backToTop"));

  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (isTranslationKey(key)) {
      element.textContent = t(key);
    }
  });

  document.querySelectorAll<HTMLElement>("[data-i18n-html]").forEach((element) => {
    const key = element.dataset.i18nHtml;
    if (isTranslationKey(key)) {
      element.innerHTML = t(key);
    }
  });

  document.querySelectorAll<HTMLButtonElement>(".lang-button").forEach((button) => {
    const isActive = button.dataset.lang === currentLocale;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  applyTheme();
}

function renderProfile(profile: GitHubProfile, repos: readonly GitHubRepo[], source: DataSourceState): void {
  const latestRepo = sortByUpdated(repos)[0];
  const profileName = profile.name || profile.login || USERNAME;
  const avatarUrl = profile.avatar_url;

  setText("#heroLead", t("heroLead"));
  setText("#heroRepos", String(profile.public_repos || repos.length));
  setText("#heroFollowers", String(profile.followers));
  setText("#heroStars", String(totalStars(repos)));
  setText("#heroForks", String(totalForks(repos)));
  setText("#profileName", profileName);
  setText("#profileHandle", `@${profile.login || USERNAME}`);
  setText("#profileSummary", summarizeProfile(profile));
  setText("#profileLocation", profile.location || t("locationHidden"));
  setText("#profileUpdated", latestRepo ? formatDate(latestRepo.updated_at) : formatDate(profile.updated_at));
  setText("#profileDataState", sourceLabel(source));
  setText("#footerStamp", `${t("footerStampPrefix")}${source.stamp}`);
  setText("#dataNotice", source.kind === "live" ? t("apiLiveNotice") : t("apiErrorNotice"));

  setImageSource("#profilePhoto", avatarUrl);
  setImageSource("#brandAvatar", avatarUrl);
  queryOptional<HTMLLinkElement>("#siteFavicon")?.setAttribute(
    "href",
    `${avatarUrl}${avatarUrl.includes("?") ? "&" : "?"}s=64`
  );
}

function renderOverview(profile: GitHubProfile, repos: readonly GitHubRepo[]): void {
  const latestRepo = sortByUpdated(repos)[0];
  const languages = languageStats(repos);
  const leadingLanguage = languages[0]?.language ?? t("languageMixed");
  const stackSummary = languages
    .slice(0, 4)
    .map((language) => language.language)
    .join(" / ");

  setText("#statRepos", String(profile.public_repos || repos.length));
  setText("#statStars", String(totalStars(repos)));
  setText("#statStack", leadingLanguage);
  setText("#tileReposCopy", t("tileReposCopy"));
  setText("#tileStarsCopy", t("tileStarsCopy"));
  setText(
    "#statStackCopy",
    stackSummary ? `${t("tileStackCopyPrefix")}${stackSummary}${t("tileStackCopySuffix")}` : t("tileStackCopyEmpty")
  );
  setText("#statLatestRepo", latestRepo ? latestRepo.name.replace("-YOLODemoApp", "") : t("latestRepoEmpty"));
  setText(
    "#statLatestRepoCopy",
    latestRepo
      ? `${t("tileLatestRepoCopyPrefix")}${formatDate(latestRepo.updated_at)}${t("tileLatestRepoCopySuffix")}`
      : t("tileLatestRepoCopyEmpty")
  );
}

function renderProjects(profile: GitHubProfile, repos: readonly GitHubRepo[], source: DataSourceState): void {
  const projectGrid = queryElement<HTMLElement>("#projectGrid");
  const featuredRepos = pickFeatured(repos);

  projectGrid.innerHTML = featuredRepos
    .map((repo) => {
      const homepage = repo.homepage?.trim();
      const tags = repoTags(repo)
        .map((tag) => `<span class="badge rounded-pill text-bg-secondary-subtle">${escapeHtml(tag)}</span>`)
        .join("");

      return `
        <article class="col">
          <div class="project-card card h-100 border-0 shadow-lg overflow-hidden">
            <div class="project-preview">
              <img src="${escapeHtml(repoImage(repo))}" alt="${escapeHtml(repo.name + t("projectPreviewAltSuffix"))}" data-fallback="${escapeHtml(repoImageFallback(repo))}">
            </div>
            <div class="card-body d-flex flex-column gap-3">
              <div class="d-flex align-items-center justify-content-between gap-2 flex-wrap">
                <span class="badge rounded-pill text-bg-primary-subtle">${escapeHtml(repo.language || t("languageMixed"))}</span>
                <span class="small text-body-secondary">${escapeHtml(t("projectCardUpdated"))} ${escapeHtml(formatDate(repo.updated_at))}</span>
              </div>
              <div>
                <h3 class="h5 mb-2">${escapeHtml(repo.name)}</h3>
                <p class="project-summary mb-0">${escapeHtml(repoSummary(repo))}</p>
              </div>
              <div class="d-flex gap-2 flex-wrap">${tags}</div>
              <div class="d-flex align-items-center gap-3 small text-body-secondary">
                <span>${escapeHtml(t("projectCardStar"))} ${repo.stargazers_count}</span>
                <span>${escapeHtml(t("projectCardFork"))} ${repo.forks_count}</span>
              </div>
              <div class="d-flex gap-2 mt-auto">
                <a class="btn btn-primary btn-sm rounded-pill" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener">${escapeHtml(t("projectCardRepo"))}</a>
                ${
                  homepage
                    ? `<a class="btn btn-outline-secondary btn-sm rounded-pill" href="${escapeHtml(homepage)}" target="_blank" rel="noopener">${escapeHtml(t("projectCardHomepage"))}</a>`
                    : ""
                }
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  setText(
    "#projectsStatus",
    `${sourceLabel(source)}${t("projectStatusJoiner")}${source.stamp}${t("projectStatusJoiner")}${featuredRepos.length}${t("projectStatusRepoSuffix")}`
  );
  setText("#profileSourceHint", `${sourceLabel(source)} · ${profile.login}`);
  bindImageFallbacks();
}

function renderActivity(repos: readonly GitHubRepo[]): void {
  const activityList = queryElement<HTMLElement>("#activityList");
  const recentRepos = sortByUpdated(repos).slice(0, 5);

  activityList.innerHTML = recentRepos
    .map(
      (repo) => `
        <article class="activity-item">
          <div class="d-flex justify-content-between gap-3">
            <h3 class="h6 mb-1">${escapeHtml(repo.name)}</h3>
            <time class="small text-body-secondary" datetime="${escapeHtml(repo.updated_at)}">${escapeHtml(formatDate(repo.updated_at))}</time>
          </div>
          <p class="mb-0 text-body-secondary">${escapeHtml(repoSummary(repo))}</p>
        </article>
      `
    )
    .join("");
}

function renderLanguages(repos: readonly GitHubRepo[]): void {
  const languageList = queryElement<HTMLElement>("#languageList");
  const stats = languageStats(repos).slice(0, 5);

  languageList.innerHTML = stats
    .map((item) => {
      const color = languageColors[item.language] ?? "linear-gradient(90deg, #64748b, #94a3b8)";

      return `
        <div class="language-row">
          <div class="d-flex justify-content-between gap-3 mb-2 small">
            <span class="fw-semibold">${escapeHtml(item.language)}</span>
            <span class="text-body-secondary">${item.count}${escapeHtml(t("languageRepoSuffix"))} · ${item.percent}%</span>
          </div>
          <div class="progress language-progress" role="progressbar" aria-label="${escapeHtml(item.language)}" aria-valuenow="${item.percent}" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar" style="width:${item.percent}%;background:${escapeHtml(color)}"></div>
          </div>
        </div>
      `;
    })
    .join("");
}

function bindImageFallbacks(): void {
  document.querySelectorAll<HTMLImageElement>("img[data-fallback]").forEach((image) => {
    if (image.dataset.bound === "true") {
      return;
    }

    image.dataset.bound = "true";
    image.addEventListener("error", () => {
      if (image.dataset.failed === "true") {
        return;
      }

      image.dataset.failed = "true";
      image.src = image.dataset.fallback ?? fallbackProjectPreview;
    });
  });
}

function render(payload: GitHubPayload): void {
  lastPayload = payload;
  translateStaticContent();
  renderProfile(payload.profile, payload.repos, payload.source);
  renderOverview(payload.profile, payload.repos);
  renderProjects(payload.profile, payload.repos, payload.source);
  renderActivity(payload.repos);
  renderLanguages(payload.repos);
}

function setLocale(locale: Locale): void {
  currentLocale = locale;
  persistLocale(locale);
  render(lastPayload);
}

function setupLanguageSwitcher(): void {
  document.querySelectorAll<HTMLButtonElement>(".lang-button").forEach((button) => {
    button.addEventListener("click", () => {
      const locale = button.dataset.lang;

      if (isLocale(locale) && locale !== currentLocale) {
        setLocale(locale);
      }
    });
  });
}

function setupNavbarCollapse(): void {
  const nav = queryOptional<HTMLElement>("#siteNav");

  if (!nav) {
    return;
  }

  const collapse = Collapse.getOrCreateInstance(nav, { toggle: false });
  nav.querySelectorAll<HTMLAnchorElement>("a.nav-link").forEach((link) => {
    link.addEventListener("click", () => collapse.hide());
  });
}

function setupBackToTop(): void {
  const button = queryElement<HTMLButtonElement>("#backToTop");

  function toggleVisibility(): void {
    button.classList.toggle("is-visible", window.scrollY > 520);
  }

  window.addEventListener("scroll", toggleVisibility, { passive: true });
  button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  toggleVisibility();
}

function setupThemeControls(): void {
  queryOptional<HTMLButtonElement>("#themeToggle")?.addEventListener("click", cycleTheme);
  systemThemeQuery.addEventListener("change", () => {
    if (currentThemeMode === "auto") {
      applyTheme();
    }
  });
}

async function hydrateLiveData(): Promise<void> {
  try {
    const payload = await loadGitHubPayload(USERNAME);
    render(payload);
  } catch {
    render(getFallbackPayload());
  }
}

function bootstrapApp(): void {
  setHtml("#heroTitle", t("heroTitle"));
  setText("#projectsStatus", t("projectStatusPreparing"));
  setupLanguageSwitcher();
  setupThemeControls();
  setupNavbarCollapse();
  setupBackToTop();
  render(getFallbackPayload());
  void hydrateLiveData();
}

bootstrapApp();
