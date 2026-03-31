export type RiskTier = "low" | "high";

export type Industry = {
  slug: string;
  title: string;
  risk: RiskTier;
  /** Short SEO + hero description */
  description: string;
  /** One line under H1 */
  tagline: string;
  /** Why processing is sensitive in this vertical */
  painPoints: string[];
  /** How we help — card titles + blurbs */
  valueProps: { title: string; body: string }[];
  /** Optional related blog slugs (without .md) for "Related reading" */
  relatedBlogSlugs?: string[];
};

export const INDUSTRIES: Industry[] = [
  {
    slug: "ecommerce",
    title: "Ecommerce",
    risk: "low",
    description:
      "Payment processing for ecommerce brands: stable card acceptance, clear reserves, and underwriting-aligned onboarding.",
    tagline: "Keep checkout conversion high with processing relationships built for online retail.",
    painPoints: [
      "Seasonal volume swings and fraud patterns draw extra issuer scrutiny.",
      "Chargebacks from delivery and fulfillment disputes can spike without clear policies.",
      "Platform and gateway changes can disrupt continuity if underwriting is not aligned.",
    ],
    valueProps: [
      {
        title: "Volume-aware underwriting",
        body: "We align expectations on peaks, refunds, and product mix before you scale spend.",
      },
      {
        title: "Chargeback readiness",
        body: "Clear communication patterns and monitoring posture that match how you sell.",
      },
      {
        title: "Operational clarity",
        body: "Reserves, settlement timing, and fees explained in plain language.",
      },
    ],
  },
  {
    slug: "healthcare",
    title: "Healthcare",
    risk: "low",
    description:
      "Merchant services for healthcare practices and related businesses with compliance-aware onboarding.",
    tagline: "Processing that respects how regulated healthcare businesses bill and collect.",
    painPoints: [
      "Billing models and third-party payers create complex transaction patterns.",
      "Compliance and data handling expectations differ from typical retail.",
      "Recurring and installment flows need clear customer communication.",
    ],
    valueProps: [
      {
        title: "Underwriting that fits the model",
        body: "We review how you bill, refund, and verify patients as part of the application.",
      },
      {
        title: "Stable operations",
        body: "Fewer surprises on monitoring and reserve treatment when the story is documented.",
      },
      {
        title: "Transparent next steps",
        body: "You get a clear picture of timelines and what underwriting may ask for.",
      },
    ],
  },
  {
    slug: "law-firms",
    title: "Law Firms",
    risk: "low",
    description:
      "Card acceptance for law firms and legal services with disciplined onboarding and settlement clarity.",
    tagline: "Trust-account and fee structures deserve a processor that understands professional services.",
    painPoints: [
      "Retainers, milestones, and trust rules create non-standard payment flows.",
      "Higher average tickets can trigger manual review if not explained upfront.",
      "Client disputes may surface as chargebacks distinct from typical retail.",
    ],
    valueProps: [
      {
        title: "Professional services lens",
        body: "We review fee structures and how clients pay so underwriting sees the full picture.",
      },
      {
        title: "Predictable cash flow",
        body: "Clear reserve and settlement framing so finance can plan around card revenue.",
      },
      {
        title: "Dispute awareness",
        body: "Operational guidance to reduce payment friction with clients when issues arise.",
      },
    ],
  },
  {
    slug: "medspa",
    title: "Medspa",
    risk: "low",
    description:
      "Payment processing for medspas: packages, memberships, and treatment-based revenue with compliant-friendly onboarding.",
    tagline: "Support for high-ticket aesthetics and wellness flows without losing sight of compliance.",
    painPoints: [
      "Prepaid packages and memberships create refund and chargeback patterns issuers watch closely.",
      "Regulatory and marketing claims around treatments add reputational risk.",
      "Card-not-present and recurring billing need clear customer authorization.",
    ],
    valueProps: [
      {
        title: "Vertical-aware review",
        body: "We align your offers, refunds, and marketing touchpoints with underwriting expectations.",
      },
      {
        title: "Membership discipline",
        body: "Help structuring recurring billing and cancellation paths that reduce disputes.",
      },
      {
        title: "Growth without surprises",
        body: "Indicative ranges and monitoring expectations discussed before you scale ad spend.",
      },
    ],
  },
  {
    slug: "bar-restaurant",
    title: "Bar & Restaurant",
    risk: "low",
    description:
      "Processing for bars and restaurants: tips, batch timing, and in-person card present environments.",
    tagline: "Reliable card acceptance tuned for hospitality velocity and thin margins.",
    painPoints: [
      "High ticket variance and tips can complicate risk scoring if not documented.",
      "Chargebacks from service disputes or no-shows need clear policies.",
      "Peak nights and seasonality stress cash flow and reserve expectations.",
    ],
    valueProps: [
      {
        title: "Hospitality-friendly setup",
        body: "We factor tipping, batching, and your real ticket mix into underwriting conversations.",
      },
      {
        title: "Chargeback hygiene",
        body: "Practical patterns for authorization, receipts, and customer resolution.",
      },
      {
        title: "Clear economics",
        body: "Fee and reserve framing you can reconcile against P&L.",
      },
    ],
  },
  {
    slug: "retail",
    title: "Retail",
    risk: "low",
    description:
      "Retail payment processing for brick-and-click merchants with predictable operations and support.",
    tagline: "Omni-channel retail with underwriting that understands inventory and promotions.",
    painPoints: [
      "Promotions and returns can skew chargeback ratios if not tracked.",
      "Omnichannel flows blend CNP and CP risk in ways generic processors misread.",
      "Shrink and fraud patterns vary widely by category.",
    ],
    valueProps: [
      {
        title: "Channel clarity",
        body: "We document how you sell online vs in-store so risk models reflect reality.",
      },
      {
        title: "Return and refund alignment",
        body: "Policies that protect revenue and keep dispute rates explainable.",
      },
      {
        title: "Partner-style support",
        body: "Fewer handoffs — expectations set before you go live.",
      },
    ],
  },
  {
    slug: "home-services",
    title: "Home Services",
    risk: "low",
    description:
      "Payment processing for contractors and service pros: mobile acceptance, invoices, deposits, and job-based billing.",
    tagline: "Get paid in the field with funding clarity and tools that match how jobs run.",
    painPoints: [
      "Cash flow depends on collecting on-site and at milestones.",
      "Invoicing and card-not-present flows can drive disputes if expectations are unclear.",
      "Seasonal swings and job size shift average tickets and underwriting posture.",
    ],
    valueProps: [
      {
        title: "Field-first workflows",
        body: "Mobile, invoicing, and deposit patterns documented for underwriting.",
      },
      {
        title: "Faster funding",
        body: "Settlement expectations you can reconcile against payroll and materials.",
      },
      {
        title: "Simple operations",
        body: "Tools that work on the truck—not only at a desk.",
      },
    ],
  },
  {
    slug: "accounting-cpa-firms",
    title: "Accounting & CPA",
    risk: "low",
    description:
      "Payment processing for CPA firms, bookkeepers, and accounting practices: retainers, recurring billing, and secure client payments.",
    tagline: "Billing that matches recurring client work — with clear funding and professional-grade security expectations.",
    painPoints: [
      "Retainers and monthly engagements need predictable recurring billing.",
      "Client expectations for cards and payment links keep rising.",
      "Seasonal tax volume creates spikes that processors must understand upfront.",
    ],
    valueProps: [
      {
        title: "Retainer-ready flows",
        body: "We document how you bill — monthly, project, or seasonally — for underwriting.",
      },
      {
        title: "Collections clarity",
        body: "Invoicing and payment links that reduce back-and-forth on fees.",
      },
      {
        title: "Security posture",
        body: "Processor-aligned practices for cardholder data — alongside your firm’s own compliance obligations.",
      },
    ],
  },
  {
    slug: "creator-content",
    title: "Creator Content",
    risk: "high",
    description:
      "High-risk merchant accounts for creators, subscriptions, and digital goods with content-aware underwriting.",
    tagline: "Monetize audiences with processing that understands subscription and digital delivery risk.",
    painPoints: [
      "Friendly fraud and refund culture are elevated in fan and subscription businesses.",
      "Platform bans and policy shifts can spike chargebacks overnight.",
      "Cross-border fans add FX and dispute complexity.",
    ],
    valueProps: [
      {
        title: "Subscription realism",
        body: "We align free trials, rebills, and cancellation flows with what issuers expect.",
      },
      {
        title: "Content and fulfillment clarity",
        body: "Underwriting sees how you deliver value so risk is priced fairly.",
      },
      {
        title: "Monitoring partnership",
        body: "Operational cues when dispute patterns move so you can react early.",
      },
    ],
  },
  {
    slug: "ai",
    title: "AI",
    risk: "high",
    description:
      "Payment processing for AI products and services: SaaS, APIs, and usage-based billing under evolving scrutiny.",
    tagline: "Support for fast-moving AI GTM with underwriting that keeps pace.",
    painPoints: [
      "Rapid model and pricing changes can confuse customers and drive disputes.",
      "Usage-based billing creates refund edge cases.",
      "Bank partner appetite for AI verticals shifts with headlines and regulation.",
    ],
    valueProps: [
      {
        title: "Product-led underwriting",
        body: "We capture how you bill, cap usage, and handle refunds as you iterate.",
      },
      {
        title: "Transparent risk dialogue",
        body: "Clear view of reserves and monitoring as your vertical evolves.",
      },
      {
        title: "Scale-minded ops",
        body: "Structures that flex as MRR grows and pricing changes.",
      },
    ],
  },
  {
    slug: "cbd",
    title: "CBD",
    risk: "high",
    description:
      "CBD merchant accounts with compliance-aware onboarding and bank-aligned product disclosure.",
    tagline: "Card acceptance that respects hemp/CBD rules and evolving state requirements.",
    painPoints: [
      "Regulatory patchwork affects bank appetite and allowed marketing.",
      "Chargebacks spike when expectations on effects or shipping are unclear.",
      "Inventory and COAs may be reviewed during underwriting.",
    ],
    valueProps: [
      {
        title: "Compliance-first packaging",
        body: "We align your site, claims, and fulfillment story with partner requirements.",
      },
      {
        title: "Bank matching",
        body: "Introduction to processing relationships that fit your product catalog.",
      },
      {
        title: "Dispute reduction",
        body: "Customer communication patterns that reduce friendly fraud and confusion.",
      },
    ],
  },
  {
    slug: "credit-repair",
    title: "Credit Repair",
    risk: "high",
    description:
      "Merchant services for credit repair and related services with strict attention to marketing and fulfillment.",
    tagline: "Processing aligned with how regulated credit services must present outcomes.",
    painPoints: [
      "Vertical is heavily scrutinized for marketing and recurring billing practices.",
      "Chargebacks often stem from outcome expectations vs reality.",
      "Regulatory frameworks (e.g. CROA) affect what you can promise clients.",
    ],
    valueProps: [
      {
        title: "Marketing-aware review",
        body: "Underwriting sees your funnel and disclosures before go-live.",
      },
      {
        title: "Recurring discipline",
        body: "Structures that reduce dispute rates and support sustainable MRR.",
      },
      {
        title: "Operational guardrails",
        body: "Clear customer communication paths when issues arise.",
      },
    ],
  },
  {
    slug: "fantasy-sports",
    title: "Fantasy Sports",
    risk: "high",
    description:
      "Payment processing for fantasy and skill-based gaming with jurisdictional awareness and underwriting fit.",
    tagline: "Support where gaming law, user expectations, and chargebacks intersect.",
    painPoints: [
      "Regulatory treatment varies by state and product format.",
      "User disputes and bonus structures drive elevated chargeback risk.",
      "Rapid user acquisition can outpace fraud controls without planning.",
    ],
    valueProps: [
      {
        title: "Jurisdiction clarity",
        body: "We document where and how you operate so partners can underwrite accurately.",
      },
      {
        title: "User economics",
        body: "Bonus, deposit, and payout flows reviewed for sustainable dispute rates.",
      },
      {
        title: "Growth with controls",
        body: "Monitoring and velocity expectations matched to your roadmap.",
      },
    ],
  },
  {
    slug: "firearms",
    title: "Firearms",
    risk: "high",
    description:
      "FFL and firearms-adjacent retail with strict adherence to lawful sales and shipping requirements.",
    tagline: "Processing relationships that respect FFL workflows and compliance obligations.",
    painPoints: [
      "Bank appetite is selective; documentation must be exact.",
      "Shipping, verification, and wait periods create customer service pressure.",
      "Chargebacks from denied transfers or buyer remorse need clear policies.",
    ],
    valueProps: [
      {
        title: "Compliance-aligned onboarding",
        body: "We align your verification, shipping, and return policies with underwriting needs.",
      },
      {
        title: "Stable partner fit",
        body: "Matching you with processing relationships suited to lawful firearms commerce.",
      },
      {
        title: "Operational clarity",
        body: "Reserve and settlement expectations communicated upfront.",
      },
    ],
  },
  {
    slug: "online-dating",
    title: "Online Dating",
    risk: "high",
    description:
      "Merchant accounts for dating apps and related digital services with subscription and chargeback awareness.",
    tagline: "Recurring revenue models with underwriting tuned to digital consumer apps.",
    painPoints: [
      "Friendly fraud and subscription cancellations drive chargebacks.",
      "Cross-border users add currency and dispute complexity.",
      "Marketing channels and trial offers are heavily scrutinized.",
    ],
    valueProps: [
      {
        title: "Subscription expertise",
        body: "Trials, upsells, and cancellation paths reviewed for sustainable dispute rates.",
      },
      {
        title: "User trust flows",
        body: "Underwriting understands how you verify users and deliver value.",
      },
      {
        title: "Monitoring partnership",
        body: "Early signals when dispute patterns shift so you can adjust UX and support.",
      },
    ],
  },
  {
    slug: "saas",
    title: "SaaS",
    risk: "high",
    description:
      "Merchant accounts for SaaS and subscription software: recurring billing, usage-based pricing, and high-volume scaling.",
    tagline: "Subscription-heavy platforms need processors that understand MRR, churn, and scale.",
    painPoints: [
      "Rapid growth and volume spikes can trigger issuer and processor scrutiny.",
      "Complex billing — trials, tiers, usage — adds dispute and refund edge cases.",
      "Global customers add FX and cross-border dispute complexity.",
    ],
    valueProps: [
      {
        title: "Billing model clarity",
        body: "We document how you bill, cap usage, and handle refunds for underwriting.",
      },
      {
        title: "Stability at scale",
        body: "Accounts structured for growth — not starter MIDs that break at volume.",
      },
      {
        title: "Chargeback partnership",
        body: "Monitoring and alerts when subscription disputes trend up.",
      },
    ],
  },
  {
    slug: "telemedicine",
    title: "Telemedicine",
    risk: "high",
    description:
      "Telehealth and telemedicine payment processing with attention to regulated prescribing and billing models.",
    tagline: "Virtual care models need processors that understand clinical and billing nuance.",
    painPoints: [
      "Prescribing and state licensing rules affect bank appetite.",
      "Subscription care models blur retail and healthcare risk.",
      "Customer outcomes and refund expectations can drive disputes.",
    ],
    valueProps: [
      {
        title: "Model documentation",
        body: "We capture your clinical workflow, billing, and refund policies for underwriting.",
      },
      {
        title: "Regulatory awareness",
        body: "Conversations aligned with how partners view telehealth risk.",
      },
      {
        title: "Sustainable economics",
        body: "Reserve and fee clarity so you can forecast as you scale visits.",
      },
    ],
  },
  {
    slug: "travel",
    title: "Travel",
    risk: "high",
    description:
      "Travel merchant accounts: agencies, tours, and booking flows with chargeback-heavy vertical expertise.",
    tagline: "Processing that respects long fulfillment horizons and refund-heavy customer behavior.",
    painPoints: [
      "Long lead times between payment and travel increase chargeback exposure.",
      "Supplier failures and weather events drive refunds and disputes.",
      "High tickets attract fraud and issuer scrutiny.",
    ],
    valueProps: [
      {
        title: "Fulfillment-aware underwriting",
        body: "We document booking windows, vouchers, and refund rules up front.",
      },
      {
        title: "Chargeback posture",
        body: "Authorization and customer communication patterns suited to travel.",
      },
      {
        title: "Cash flow planning",
        body: "Clear view of reserves and settlement relative to your booking cycle.",
      },
    ],
    relatedBlogSlugs: ["high-risk-merchant-account", "rolling-reserves-explained"],
  },
  {
    slug: "vape",
    title: "Vape",
    risk: "high",
    description:
      "Vape and alternative products with age-gated commerce and bank-aligned fulfillment.",
    tagline: "Age verification and shipping discipline paired with selective processing fit.",
    painPoints: [
      "Regulatory and platform restrictions shift frequently.",
      "Age verification and shipping compliance are non-negotiable for partners.",
      "Chargebacks from delivery and product expectations are common.",
    ],
    valueProps: [
      {
        title: "Compliance packaging",
        body: "Site, AV, and fulfillment story aligned with underwriting requirements.",
      },
      {
        title: "Partner matching",
        body: "Introduction to processing relationships that fit your catalog and regions.",
      },
      {
        title: "Dispute reduction",
        body: "Customer messaging and policy clarity to reduce avoidable chargebacks.",
      },
    ],
  },
];

const bySlug = new Map(INDUSTRIES.map((i) => [i.slug, i]));

export function getIndustry(slug: string): Industry | undefined {
  return bySlug.get(slug);
}

export function industriesByRisk(tier: RiskTier): Industry[] {
  return INDUSTRIES.filter((i) => i.risk === tier);
}

/** Value for ?industry= on /apply/ — URL-encoded title */
export function applyIndustryQueryValue(title: string): string {
  return encodeURIComponent(title);
}
