export const LOCALES = ["zh", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const THEME_MODES = ["auto", "dark", "light"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];
export type ResolvedTheme = Exclude<ThemeMode, "auto">;

export interface GitHubProfile {
  login: string;
  name: string | null;
  html_url: string;
  avatar_url: string;
  location: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  updated_at: string;
}

export interface GitHubRepo {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  homepage: string | null;
}

export interface RepoDetails {
  summary: Record<Locale, string>;
  tags: readonly string[];
  preview?: string;
}

export type DataSourceState =
  | { kind: "snapshot"; stamp: string }
  | { kind: "live"; stamp: string };

export interface GitHubPayload {
  profile: GitHubProfile;
  repos: GitHubRepo[];
  source: DataSourceState;
}

export interface LanguageStat {
  language: string;
  count: number;
  percent: number;
}
