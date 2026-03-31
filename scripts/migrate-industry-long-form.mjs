/**
 * One-off: copy *-payment-processing pages to long-form components with industry props.
 * Run: node scripts/migrate-industry-long-form.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const MAPPINGS = [
  ["ecommerce-payment-processing", "ecommerce"],
  ["accounting-cpa-firm-payment-processing", "accounting-cpa-firms"],
  ["adult-content-payment-processing", "adult-content"],
  ["ai-payment-processing", "ai"],
  ["bar-restaurant-payment-processing", "bar-restaurant"],
  ["cbd-payment-processing", "cbd"],
  ["content-creator-payment-processing", "creator-content"],
  ["credit-repair-payment-processing", "credit-repair"],
  ["fantasy-sports-payment-processing", "fantasy-sports"],
  ["firearms-payment-processing", "firearms"],
  ["healthcare-payment-processing", "healthcare"],
  ["home-services-payment-processing", "home-services"],
  ["law-firm-payment-processing", "law-firms"],
  ["med-spa-payment-processing", "medspa"],
  ["nutraceuticals-payment-processing", "nutraceuticals"],
  ["online-dating-payment-processing", "online-dating"],
  ["peptide-payment-processing", "peptide"],
  ["retail-payment-processing", "retail"],
  ["saas-payment-processing", "saas"],
  ["telemedicine-payment-processing", "telemedicine"],
  ["travel-payment-processing", "travel"],
  ["vape-payment-processing", "vape"],
];

const NEW_FRONT_TOP = `import { Picture } from "astro:assets";
import BaseLayout from "../../../layouts/BaseLayout.astro";
import heroVisual from "../../../assets/images/hero-placeholder.png";
import { getSiteUrl } from "../../../lib/site";
import { applyIndustryQueryValue } from "../../../lib/industries";
import type { Industry } from "../../../lib/industries";
import type { CollectionEntry } from "astro:content";

type Props = {
  industry: Industry;
  relatedPosts?: CollectionEntry<"blog">[];
};
const { industry, relatedPosts = [] } = Astro.props;

const site = getSiteUrl();
const salesTel = "+18556002419";
const canonical = new URL(\`/industries/\${industry.slug}/\`, site).href;
const applyHref = \`/apply/?industry=\${applyIndustryQueryValue(industry.title)}\`;
`;

const BREADCRUMB_LD = `const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: \`\${site}/\` },
    { "@type": "ListItem", position: 2, name: "Industries", item: \`\${site}/industries/\` },
    {
      "@type": "ListItem",
      position: 3,
      name: industry.title,
      item: canonical,
    },
  ],
};`;

function transformBody(html) {
  let s = html;
  s = s.replace(
    "</BaseLayout>",
    `  {
    relatedPosts.length > 0 && (
      <section class="section section--tight">
        <div class="container">
          <h2 style="margin-bottom: 1rem;">Related reading</h2>
          <ul style="list-style: none; padding: 0; margin: 0; display: grid; gap: 0.75rem;">
            {relatedPosts.map((post) => (
              <li>
                <a
                  href={\`/blog/\${post.id.replace(/\\.md$/, "")}/\`}
                  style="font-weight: 600; text-decoration: none;"
                >
                  {post.data.title}
                </a>
                <p class="muted" style="margin: 0.25rem 0 0; font-size: 0.95rem;">
                  {post.data.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )
  }
</BaseLayout>`,
  );
  return s;
}

function migrateOne(folder, slugName) {
  const srcPath = path.join(ROOT, "src", "pages", folder, "index.astro");
  let raw = fs.readFileSync(srcPath, "utf8");
  const parts = raw.split("---");
  if (parts.length < 3) throw new Error(`Invalid astro file: ${srcPath}`);
  const fm = parts[1];
  const body = parts.slice(2).join("---");

  const pageTitleMatch = fm.match(/const pageTitle = "[^"]*";/);
  const pageDescMatch =
    fm.match(/const pageDescription =\s*\n\s*"[^"]*";/) || fm.match(/const pageDescription = "[^"]*";/);
  const webPageMatch = fm.match(/const webPageLd = \{[\s\S]*?\n\};/);
  const faqCopyMatch = fm.match(/const faqCopy = (\[[\s\S]*?\]) as const;/);
  const faqLdMatch = fm.match(/const faqLd = \{[\s\S]*?\n\};/);

  if (!pageTitleMatch || !pageDescMatch || !webPageMatch || !faqCopyMatch || !faqLdMatch) {
    throw new Error(`Missing expected const in ${srcPath}`);
  }

  let webPageLd = webPageMatch[0];
  webPageLd = webPageLd.replace(/url: canonical,/, "url: canonical,");

  const newFm =
    NEW_FRONT_TOP +
    "\n" +
    pageTitleMatch[0] +
    "\n" +
    (pageDescMatch ? pageDescMatch[0] : "") +
    "\n\n" +
    webPageLd +
    "\n\n" +
    BREADCRUMB_LD +
    "\n\n" +
    faqCopyMatch[0] +
    "\n\n" +
    faqLdMatch[0] +
    "\n---";

  const outDir = path.join(ROOT, "src", "components", "industries", "long-form");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${slugName}.astro`);
  fs.writeFileSync(outPath, newFm + transformBody(body), "utf8");
  console.log("Wrote", outPath);
}

for (const [folder, slug] of MAPPINGS) {
  migrateOne(folder, slug);
}
