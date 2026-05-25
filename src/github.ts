import { FALLBACK_SNAPSHOT_DATE, fallbackProfile, fallbackRepos } from "./data";
import type { GitHubPayload, GitHubProfile, GitHubRepo } from "./types";

const GITHUB_HEADERS = {
  Accept: "application/vnd.github+json"
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNullableString(value: unknown): value is string | null {
  return typeof value === "string" || value === null;
}

function isGitHubProfile(value: unknown): value is GitHubProfile {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.login === "string" &&
    isNullableString(value.name) &&
    typeof value.html_url === "string" &&
    typeof value.avatar_url === "string" &&
    isNullableString(value.location) &&
    isNullableString(value.bio) &&
    typeof value.public_repos === "number" &&
    typeof value.followers === "number" &&
    typeof value.following === "number" &&
    typeof value.updated_at === "string"
  );
}

function isGitHubRepo(value: unknown): value is GitHubRepo {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.name === "string" &&
    typeof value.html_url === "string" &&
    isNullableString(value.description) &&
    isNullableString(value.language) &&
    typeof value.stargazers_count === "number" &&
    typeof value.forks_count === "number" &&
    typeof value.updated_at === "string" &&
    isNullableString(value.homepage)
  );
}

function isGitHubRepoArray(value: unknown): value is GitHubRepo[] {
  return Array.isArray(value) && value.every(isGitHubRepo);
}

function formatStamp(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getFallbackPayload(): GitHubPayload {
  return {
    profile: fallbackProfile,
    repos: fallbackRepos,
    source: { kind: "snapshot", stamp: FALLBACK_SNAPSHOT_DATE }
  };
}

export async function loadGitHubPayload(
  username: string,
  timeoutMs = 8000
): Promise<GitHubPayload> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const [profileResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: GITHUB_HEADERS,
        signal: controller.signal
      }),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
        headers: GITHUB_HEADERS,
        signal: controller.signal
      })
    ]);

    if (!profileResponse.ok || !reposResponse.ok) {
      throw new Error("GitHub API unavailable");
    }

    const [profileJson, reposJson] = await Promise.all([
      profileResponse.json() as Promise<unknown>,
      reposResponse.json() as Promise<unknown>
    ]);

    if (!isGitHubProfile(profileJson) || !isGitHubRepoArray(reposJson)) {
      throw new Error("GitHub API response shape mismatch");
    }

    return {
      profile: profileJson,
      repos: reposJson,
      source: { kind: "live", stamp: formatStamp(new Date()) }
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}
