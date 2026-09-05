export interface CompanyVariableItem {
  tag: string;
  label: string;
  field: string;
  icon: string;
  example: string;
}

export const COMPANY_VARIABLES: CompanyVariableItem[] = [
  { tag: "@company_name", label: "Company Name", field: "name", icon: "🏢", example: "Acme Corp" },
  { tag: "@company_tagline", label: "Tagline", field: "tagline", icon: "✨", example: "Building the future of software" },
  { tag: "@company_industry", label: "Industry", field: "industry", icon: "🚀", example: "Software & Technology" },
  { tag: "@company_location", label: "Headquarters", field: "location", icon: "📍", example: "San Francisco, CA" },
  { tag: "@company_website", label: "Website", field: "website", icon: "🌐", example: "https://example.com" },
  { tag: "@company_size", label: "Company Size", field: "companySize", icon: "👥", example: "50-200 employees" },
  { tag: "@company_description", label: "Company Overview", field: "description", icon: "📝", example: "Empowering team collaboration..." },
  { tag: "@active_jobs_count", label: "Active Open Roles", field: "activeJobsCount", icon: "💼", example: "5" },
];

export function interpolateCompanyVariables(
  text: string | null | undefined,
  company: any,
  jobsCount: number = 0
): string {
  if (!text) return "";
  if (typeof text !== "string") return text;

  const companyName = company?.name || "";
  const companyTagline = company?.tagline || company?.name || "";
  const companyIndustry = company?.industry || "";
  const companyLocation = company?.location || "";
  const companyWebsite = company?.website || "";
  const companySize = company?.companySize || "";
  const companyDescription = company?.description || "";
  const activeJobsStr = String(jobsCount || 0);

  return text
    .replace(/@company_name/g, companyName)
    .replace(/@company_tagline/g, companyTagline)
    .replace(/@company_industry/g, companyIndustry)
    .replace(/@company_location/g, companyLocation)
    .replace(/@company_website/g, companyWebsite)
    .replace(/@company_size/g, companySize)
    .replace(/@company_description/g, companyDescription)
    .replace(/@active_jobs_count/g, activeJobsStr);
}
