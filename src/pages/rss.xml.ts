import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { getSiteUrl } from "../lib/site";

export async function GET(context: APIContext) {
  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
  const site = context.site?.toString().replace(/\/$/, "") ?? getSiteUrl();
  return rss({
    title: "Solvanta Pay Insights",
    description: "Articles on high-risk processing, chargebacks, reserves, and underwriting.",
    site,
    items: posts.map((post) => ({
      link: `/blog/${post.id.replace(/\.md$/, "")}/`,
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
    })),
    stylesheet: false,
  });
}
