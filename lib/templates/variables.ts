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
  { tag: "@company_location", label: "Headquarters", field: "location", icon: "📍", example: "Mittapalli" },
  { tag: "@company_website", label: "Website", field: "website", icon: "🌐", example: "https://example.com" },
  { tag: "@company_size", label: "Company Size", field: "companySize", icon: "👥", example: "50-200 employees" },
  { tag: "@company_description", label: "Company Overview", field: "description", icon: "📝", example: "Empowering team collaboration..." },
  { tag: "@company_about", label: "About & Mission Story", field: "aboutText", icon: "📖", example: "Founded to redefine modern products..." },
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
  const companyTagline =
    company?.tagline && company.tagline.trim() !== ""
      ? company.tagline.trim()
      : companyName
      ? `Welcome to ${companyName}`
      : "Building the future of software";
  const companyIndustry =
    company?.industry && company.industry.trim() !== ""
      ? company.industry.trim()
      : "Software & Technology";
  const companyLocation =
    company?.location && company.location.trim() !== ""
      ? company.location.trim()
      : companyName
      ? `${companyName} HQ`
      : "Headquarters";
  const companyWebsite = company?.website || "";
  const companySize =
    company?.companySize && company.companySize.trim() !== ""
      ? company.companySize.trim()
      : "50-200 employees";
  const companyDescription =
    company?.description && company.description.trim() !== ""
      ? company.description.trim()
      : company?.aboutText && company.aboutText.trim() !== ""
      ? company.aboutText.trim()
      : companyName
      ? `Learn more about careers and team culture at ${companyName}.`
      : "We are an ambitious team solving high-impact problems.";
  const companyAbout =
    company?.aboutText && company.aboutText.trim() !== ""
      ? company.aboutText.trim()
      : companyDescription;
  const activeJobsStr = String(jobsCount || 0);

  return text
    .replace(/@company_name/gi, companyName)
    .replace(/@company_tagline/gi, companyTagline)
    .replace(/@company_industry/gi, companyIndustry)
    .replace(/@company_location/gi, companyLocation)
    .replace(/@company-location/gi, companyLocation)
    .replace(/@company_city/gi, companyLocation)
    .replace(/@company-city/gi, companyLocation)
    .replace(/@location/gi, companyLocation)
    .replace(/@company_website/gi, companyWebsite)
    .replace(/@company_size/gi, companySize)
    .replace(/@company_description/gi, companyDescription)
    .replace(/@company_about/gi, companyAbout)
    .replace(/@company_story/gi, companyAbout)
    .replace(/@active_jobs_count/gi, activeJobsStr);
}

