/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly PUBLIC_APPLY_URL: string;
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_CLARITY_PROJECT_ID?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
