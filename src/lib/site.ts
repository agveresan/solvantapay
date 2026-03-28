export function getSiteUrl(): string {
  if (import.meta.env.PUBLIC_SITE_URL) {
    return import.meta.env.PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (import.meta.env.SITE) {
    return String(import.meta.env.SITE).replace(/\/$/, "");
  }
  return "https://www.solvantapay.com";
}
