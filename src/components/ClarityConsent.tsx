import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

const STORAGE_KEY = "solvantapay_cookie_consent";

function getProjectId(): string | null {
  const explicit = import.meta.env.PUBLIC_CLARITY_PROJECT_ID;
  if (explicit === "") return null;
  return (explicit && String(explicit).trim()) || "w3jzgrtw97";
}

let started = false;

function startClarity() {
  const projectId = getProjectId();
  if (!projectId || started) return;
  started = true;
  Clarity.init(projectId);
  Clarity.consentV2({ ad_Storage: "denied", analytics_Storage: "granted" });
}

export default function ClarityConsent() {
  useEffect(() => {
    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent<{ value?: string }>).detail;
      if (detail?.value === "accepted") startClarity();
    };

    try {
      if (localStorage.getItem(STORAGE_KEY) === "accepted") startClarity();
    } catch {
      /* ignore */
    }

    document.addEventListener("solvantapay:cookie-consent", onConsent);
    return () => document.removeEventListener("solvantapay:cookie-consent", onConsent);
  }, []);

  return null;
}
