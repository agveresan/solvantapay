import type { APIRoute } from "astro";

export const prerender = true;

function isNoIndex(): boolean {
  return import.meta.env.PUBLIC_NO_INDEX !== "false";
}

export const GET: APIRoute = ({ site }) => {
  if (isNoIndex()) {
    return new Response("User-agent: *\nDisallow: /\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const siteStr =
    site instanceof URL ? site.href : site ?? import.meta.env.SITE ?? "https://www.solvantapay.com";
  const base = String(siteStr).replace(/\/$/, "");
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap-index.xml\n`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
