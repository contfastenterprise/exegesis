/**
 * Helper utility to extract a YouTube Video ID from various URL formats or raw ID string.
 */
export function extractYouTubeVideoId(input?: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  
  // If it's already an 11-char ID without slashes or query params
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Common YouTube URL regex (watch?v=, embed/, live/, youtu.be/)
  const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|live\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);

  if (match && match[1] && match[1].length === 11) {
    return match[1];
  }

  return trimmed;
}

/**
 * Returns the maximum resolution thumbnail URL for a given YouTube video ID.
 */
export function getYouTubeThumbnailUrl(videoId: string): string {
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
