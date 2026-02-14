/**
 * 企業文化（Company Culture）設定
 * AI の添削基準を変化させる
 */
export type CompanyCultureId =
  | "tech-startup"
  | "traditional-corporate"
  | "global-team";

export const COMPANY_CULTURE_OPTIONS: {
  id: CompanyCultureId;
  label: string;
  sublabel: string;
}[] = [
  {
    id: "tech-startup",
    label: "Tech Startup (West Coast)",
    sublabel: "カジュアル・結論ファースト",
  },
  {
    id: "traditional-corporate",
    label: "Traditional Corporate",
    sublabel: "フォーマル・丁寧語重視",
  },
  {
    id: "global-team",
    label: "Global Team",
    sublabel: "シンプル・誰にでも伝わる英語",
  },
];

const STORAGE_KEY = "biz-english-company-culture";

export function getStoredCompanyCulture(): CompanyCultureId {
  if (typeof window === "undefined") return "tech-startup";
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && COMPANY_CULTURE_OPTIONS.some((o) => o.id === raw)) {
      return raw as CompanyCultureId;
    }
  } catch {
    // ignore
  }
  return "tech-startup";
}

export function setStoredCompanyCulture(value: CompanyCultureId): void {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // ignore
  }
}
