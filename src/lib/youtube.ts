/**
 * Utilities for parsing YouTube Shorts (and regular) URLs on the client.
 * No network calls here — just string parsing.
 */

const ID_PATTERN = /^[a-zA-Z0-9_-]{6,15}$/;

export function extractYoutubeId(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  // Allow a bare video id to be pasted directly.
  if (ID_PATTERN.test(trimmed) && !trimmed.includes(".")) {
    return trimmed;
  }

  let url: URL;
  try {
    url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id && ID_PATTERN.test(id) ? id : null;
  }

  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const segments = url.pathname.split("/").filter(Boolean);

    // /shorts/<id>
    const shortsIndex = segments.indexOf("shorts");
    if (shortsIndex !== -1 && segments[shortsIndex + 1]) {
      const id = segments[shortsIndex + 1];
      return ID_PATTERN.test(id) ? id : null;
    }

    // /embed/<id>
    const embedIndex = segments.indexOf("embed");
    if (embedIndex !== -1 && segments[embedIndex + 1]) {
      const id = segments[embedIndex + 1];
      return ID_PATTERN.test(id) ? id : null;
    }

    // /watch?v=<id>
    const v = url.searchParams.get("v");
    if (v && ID_PATTERN.test(v)) return v;
  }

  return null;
}

export function isLikelyShortsUrl(rawUrl: string): boolean {
  return /\/shorts\//i.test(rawUrl.trim());
}

export function thumbnailFor(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function embedUrlFor(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}
