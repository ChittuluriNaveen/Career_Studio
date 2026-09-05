import { SectionType } from "@prisma/client";

export type ElementType =
  | "heading"
  | "text"
  | "richtext"
  | "image"
  | "video"
  | "button"
  | "badge"
  | "icon"
  | "divider"
  | "spacer"
  | "gallery"
  | "stats"
  | "list";

export interface SectionElement {
  id: string;
  type: ElementType;
  position: number;
  enabled: boolean;
  width?: "full" | "half" | "third";
  alignment?: "left" | "center" | "right";
  content: {
    text?: string;
    subtitle?: string;
    level?: 1 | 2 | 3 | 4;
    url?: string;
    alt?: string;
    fit?: "cover" | "contain";
    videoUrl?: string;
    posterUrl?: string;
    linkUrl?: string;
    label?: string;
    variant?: "primary" | "secondary" | "outline";
    items?: Array<{
      id: string;
      title: string;
      subtitle?: string;
      value?: string;
      description?: string;
      url?: string;
      icon?: string;
    }>;
    [key: string]: any;
  };
}

export interface SectionLayoutConfig {
  container: "wide" | "narrow" | "full";
  alignment: "left" | "center" | "right";
  paddingY: "sm" | "md" | "lg";
  backgroundColor?: string;
}

export interface SectionTemplate {
  templateId: string;
  name: string;
  sectionType: SectionType;
  description: string;
  thumbnailIcon: string;
  layout: SectionLayoutConfig;
  defaultElements: SectionElement[];
}

export const TEMPLATE_REGISTRY: Record<string, SectionTemplate> = {
  // HERO TEMPLATES
  "hero-centered": {
    templateId: "hero-centered",
    name: "Hero Centered",
    sectionType: "HERO",
    description: "Centered impactful headline with supporting narrative and primary CTA button",
    thumbnailIcon: "Sparkles",
    layout: { container: "narrow", alignment: "center", paddingY: "lg" },
    defaultElements: [
      {
        id: "hero-badge-1",
        type: "badge",
        position: 0,
        enabled: true,
        alignment: "center",
        content: { text: "We Are Hiring · 15 Open Roles" },
      },
      {
        id: "hero-heading-1",
        type: "heading",
        position: 1,
        enabled: true,
        alignment: "center",
        content: { text: "Shape the Future of Enterprise Technology", level: 1 },
      },
      {
        id: "hero-text-1",
        type: "text",
        position: 2,
        enabled: true,
        alignment: "center",
        content: {
          text: "Join our world-class engineering team to build scalable, mission-critical systems used by over 50,000 global enterprises.",
        },
      },
      {
        id: "hero-button-1",
        type: "button",
        position: 3,
        enabled: true,
        alignment: "center",
        content: { label: "Explore Open Positions", linkUrl: "#open-positions", variant: "primary" },
      },
    ],
  },

  "hero-split": {
    templateId: "hero-split",
    name: "Hero Split Side-by-Side",
    sectionType: "HERO",
    description: "Headline and copy on one side with high-resolution brand image on the other",
    thumbnailIcon: "LayoutGrid",
    layout: { container: "wide", alignment: "left", paddingY: "lg" },
    defaultElements: [
      {
        id: "hero-split-heading",
        type: "heading",
        position: 0,
        enabled: true,
        width: "half",
        alignment: "left",
        content: { text: "Build Meaningful Products with Exceptional People", level: 1 },
      },
      {
        id: "hero-split-text",
        type: "text",
        position: 1,
        enabled: true,
        width: "half",
        alignment: "left",
        content: {
          text: "We empower remote-first teams to solve high-impact challenges with autonomy, transparency, and top-tier benefits.",
        },
      },
      {
        id: "hero-split-button",
        type: "button",
        position: 2,
        enabled: true,
        width: "half",
        alignment: "left",
        content: { label: "View All Teams & Careers", linkUrl: "#open-positions", variant: "primary" },
      },
      {
        id: "hero-split-image",
        type: "image",
        position: 3,
        enabled: true,
        width: "half",
        alignment: "center",
        content: {
          url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
          alt: "Collaborative Engineering Team",
          fit: "cover",
        },
      },
    ],
  },

  "hero-image-bg": {
    templateId: "hero-image-bg",
    name: "Hero Full Banner Background",
    sectionType: "HERO",
    description: "Immersive background image overlay with high-contrast text overlay",
    thumbnailIcon: "Image",
    layout: { container: "full", alignment: "center", paddingY: "lg" },
    defaultElements: [
      {
        id: "hero-bg-heading",
        type: "heading",
        position: 0,
        enabled: true,
        alignment: "center",
        content: { text: "Pioneering Next-Generation AI Infrastructure", level: 1 },
      },
      {
        id: "hero-bg-text",
        type: "text",
        position: 1,
        enabled: true,
        alignment: "center",
        content: { text: "Work on cutting-edge machine learning systems alongside world-renowned research scientists." },
      },
      {
        id: "hero-bg-image",
        type: "image",
        position: 2,
        enabled: true,
        alignment: "center",
        content: {
          url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80",
          alt: "Modern Office Space",
          fit: "cover",
        },
      },
      {
        id: "hero-bg-button",
        type: "button",
        position: 3,
        enabled: true,
        alignment: "center",
        content: { label: "Join Our Mission", linkUrl: "#open-positions", variant: "primary" },
      },
    ],
  },

  // ABOUT TEMPLATES
  "about-image-left": {
    templateId: "about-image-left",
    name: "About Us - Image Left",
    sectionType: "ABOUT_US",
    description: "Featured story photo on the left with narrative paragraph on the right",
    thumbnailIcon: "Info",
    layout: { container: "wide", alignment: "left", paddingY: "md" },
    defaultElements: [
      {
        id: "about-img-left-img",
        type: "image",
        position: 0,
        enabled: true,
        width: "half",
        content: {
          url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80",
          alt: "Team workshop session",
          fit: "cover",
        },
      },
      {
        id: "about-img-left-heading",
        type: "heading",
        position: 1,
        enabled: true,
        width: "half",
        content: { text: "Driven by Purpose, Built for Impact", level: 2 },
      },
      {
        id: "about-img-left-text",
        type: "text",
        position: 2,
        enabled: true,
        width: "half",
        content: {
          text: "Founded in 2021, our mission is to redefine how cloud software is developed and deployed. We foster an environment of radical candor, continuous learning, and shared ownership.",
        },
      },
    ],
  },

  "about-image-right": {
    templateId: "about-image-right",
    name: "About Us - Image Right",
    sectionType: "ABOUT_US",
    description: "Company narrative on the left with workspace visual on the right",
    thumbnailIcon: "Info",
    layout: { container: "wide", alignment: "left", paddingY: "md" },
    defaultElements: [
      {
        id: "about-img-right-heading",
        type: "heading",
        position: 0,
        enabled: true,
        width: "half",
        content: { text: "Our Origins & Global Growth", level: 2 },
      },
      {
        id: "about-img-right-text",
        type: "text",
        position: 1,
        enabled: true,
        width: "half",
        content: {
          text: "From a garage setup to 300+ teammates across 18 countries, our culture prioritizes async workflows, deep focus time, and high compensation standards.",
        },
      },
      {
        id: "about-img-right-img",
        type: "image",
        position: 2,
        enabled: true,
        width: "half",
        content: {
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80",
          alt: "Global Office Headquarters",
          fit: "cover",
        },
      },
    ],
  },

  "about-centered": {
    templateId: "about-centered",
    name: "About Us - Centered Story",
    sectionType: "ABOUT_US",
    description: "Clean centered story narrative with key milestone stats",
    thumbnailIcon: "FileText",
    layout: { container: "narrow", alignment: "center", paddingY: "md" },
    defaultElements: [
      {
        id: "about-cnt-heading",
        type: "heading",
        position: 0,
        enabled: true,
        alignment: "center",
        content: { text: "Why Top Engineers Choose Us", level: 2 },
      },
      {
        id: "about-cnt-text",
        type: "text",
        position: 1,
        enabled: true,
        alignment: "center",
        content: {
          text: "We believe exceptional talent deserves high autonomy, flexible schedules, and direct influence over product architecture.",
        },
      },
      {
        id: "about-cnt-stats",
        type: "stats",
        position: 2,
        enabled: true,
        alignment: "center",
        content: {
          items: [
            { id: "s1", title: "Global Team", value: "350+" },
            { id: "s2", title: "Glassdoor Rating", value: "4.9 ★" },
            { id: "s3", title: "Retention Rate", value: "96%" },
          ],
        },
      },
    ],
  },

  // CULTURE VIDEO TEMPLATES
  "culture-video-embed": {
    templateId: "culture-video-embed",
    name: "Culture Video Spotlight",
    sectionType: "CULTURE_VIDEO",
    description: "Full responsive video player showcasing life at your company",
    thumbnailIcon: "Tv",
    layout: { container: "wide", alignment: "center", paddingY: "md" },
    defaultElements: [
      {
        id: "cv-heading",
        type: "heading",
        position: 0,
        enabled: true,
        alignment: "center",
        content: { text: "Life Inside Our Engineering Hub", level: 2 },
      },
      {
        id: "cv-text",
        type: "text",
        position: 1,
        enabled: true,
        alignment: "center",
        content: { text: "Watch team members discuss product vision, hackathons, and our work culture." },
      },
      {
        id: "cv-video",
        type: "video",
        position: 2,
        enabled: true,
        width: "full",
        content: {
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          posterUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
        },
      },
    ],
  },

  "culture-split-video": {
    templateId: "culture-split-video",
    name: "Culture Video + Narrative",
    sectionType: "CULTURE_VIDEO",
    description: "Video player alongside culture highlights and team values",
    thumbnailIcon: "PlaySquare",
    layout: { container: "wide", alignment: "left", paddingY: "md" },
    defaultElements: [
      {
        id: "csv-heading",
        type: "heading",
        position: 0,
        enabled: true,
        width: "half",
        content: { text: "Hear Directly From Our Team", level: 2 },
      },
      {
        id: "csv-text",
        type: "text",
        position: 1,
        enabled: true,
        width: "half",
        content: {
          text: "We prioritize open communication, weekly knowledge shares, and annual team retreats in Mediterranean coastlines.",
        },
      },
      {
        id: "csv-video",
        type: "video",
        position: 2,
        enabled: true,
        width: "half",
        content: {
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          posterUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
        },
      },
    ],
  },

  // PERKS & BENEFITS TEMPLATES
  "benefits-grid-cards": {
    templateId: "benefits-grid-cards",
    name: "Benefits Cards Grid",
    sectionType: "PERKS_BENEFITS",
    description: "Visual grid of employee perks including health, equity, and remote stipends",
    thumbnailIcon: "Gift",
    layout: { container: "wide", alignment: "center", paddingY: "md" },
    defaultElements: [
      {
        id: "ben-heading",
        type: "heading",
        position: 0,
        enabled: true,
        alignment: "center",
        content: { text: "Perks & Total Rewards", level: 2 },
      },
      {
        id: "ben-text",
        type: "text",
        position: 1,
        enabled: true,
        alignment: "center",
        content: { text: "We invest in your long-term success, health, and personal growth." },
      },
      {
        id: "ben-list",
        type: "list",
        position: 2,
        enabled: true,
        content: {
          items: [
            { id: "b1", title: "100% Remote Flexibility", description: "Work from anywhere with home office stipends." },
            { id: "b2", title: "Top-Tier Health & Dental", description: "Comprehensive coverage for you and your family." },
            { id: "b3", title: "Competitive Equity Options", description: "Direct ownership in company growth." },
            { id: "b4", title: "$3,000 L&D Budget", description: "Annual allowance for courses, books, & conferences." },
            { id: "b5", title: "Unlimited PTO & Wellness Days", description: "Minimum 25 mandatory vacation days guaranteed." },
            { id: "b6", title: "Parental Leave Package", description: "16 weeks fully paid parental leave for primary caregivers." },
          ],
        },
      },
    ],
  },

  // GALLERY TEMPLATES
  "gallery-grid-3col": {
    templateId: "gallery-grid-3col",
    name: "Image Gallery 3-Column Grid",
    sectionType: "GALLERY",
    description: "Responsive 3-column photo grid highlighting team retreats and workspace culture",
    thumbnailIcon: "Grid",
    layout: { container: "wide", alignment: "center", paddingY: "md" },
    defaultElements: [
      {
        id: "gal-heading",
        type: "heading",
        position: 0,
        enabled: true,
        alignment: "center",
        content: { text: "Behind the Scenes at Our HQ & Retreats", level: 2 },
      },
      {
        id: "gal-gallery",
        type: "gallery",
        position: 1,
        enabled: true,
        content: {
          items: [
            { id: "g1", title: "Annual Team Retreat 2025", url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80" },
            { id: "g2", title: "Engineering Hackathon", url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80" },
            { id: "g3", title: "Product Design Workshop", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" },
          ],
        },
      },
    ],
  },

  // OPEN ROLES TEMPLATES
  "jobs-grid-cards": {
    templateId: "jobs-grid-cards",
    name: "Open Positions Grid",
    sectionType: "OPEN_ROLES",
    description: "Filterable list of open job vacancies grouped by department and location",
    thumbnailIcon: "Briefcase",
    layout: { container: "wide", alignment: "left", paddingY: "md" },
    defaultElements: [
      {
        id: "jobs-heading",
        type: "heading",
        position: 0,
        enabled: true,
        alignment: "left",
        content: { text: "Explore Open Opportunities", level: 2 },
      },
      {
        id: "jobs-text",
        type: "text",
        position: 1,
        enabled: true,
        alignment: "left",
        content: { text: "Find your next career step across Engineering, Product, and Sales." },
      },
    ],
  },

  // CTA TEMPLATES
  "cta-banner-centered": {
    templateId: "cta-banner-centered",
    name: "Call To Action Banner",
    sectionType: "CTA",
    description: "High-visibility closing section encouraging candidates to apply",
    thumbnailIcon: "Megaphone",
    layout: { container: "narrow", alignment: "center", paddingY: "lg" },
    defaultElements: [
      {
        id: "cta-heading",
        type: "heading",
        position: 0,
        enabled: true,
        alignment: "center",
        content: { text: "Ready to Build Next-Generation Cloud Tools?", level: 2 },
      },
      {
        id: "cta-text",
        type: "text",
        position: 1,
        enabled: true,
        alignment: "center",
        content: { text: "Don't see an exact role? Submit an open application and let's start a conversation." },
      },
      {
        id: "cta-button",
        type: "button",
        position: 2,
        enabled: true,
        alignment: "center",
        content: { label: "Apply Now or Send Resume", linkUrl: "#open-positions", variant: "primary" },
      },
    ],
  },

  // CUSTOM BUILDER TEMPLATE
  "custom-builder": {
    templateId: "custom-builder",
    name: "Custom Section Canvas",
    sectionType: "CUSTOM_TEXT",
    description: "Blank canvas for constructing customized responsive section layouts",
    thumbnailIcon: "Sliders",
    layout: { container: "wide", alignment: "left", paddingY: "md" },
    defaultElements: [
      {
        id: "custom-h1",
        type: "heading",
        position: 0,
        enabled: true,
        content: { text: "Custom Title Block", level: 2 },
      },
      {
        id: "custom-t1",
        type: "text",
        position: 1,
        enabled: true,
        content: { text: "Add, remove, and reorder elements to customize this section layout." },
      },
    ],
  },
};

export function createDefaultElement(type: ElementType, position: number = 0): SectionElement {
  const id = `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  
  switch (type) {
    case "heading":
      return {
        id,
        type: "heading",
        position,
        enabled: true,
        alignment: "left",
        width: "full",
        content: { text: "Section Heading", level: 2 },
      };
    case "text":
    case "richtext":
      return {
        id,
        type,
        position,
        enabled: true,
        alignment: "left",
        width: "full",
        content: { text: "Enter narrative copy or paragraph description here..." },
      };
    case "image":
      return {
        id,
        type: "image",
        position,
        enabled: true,
        alignment: "center",
        width: "full",
        content: {
          url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
          alt: "Team collaboration",
          fit: "cover",
        },
      };
    case "video":
      return {
        id,
        type: "video",
        position,
        enabled: true,
        alignment: "center",
        width: "full",
        content: {
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          posterUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
        },
      };
    case "button":
      return {
        id,
        type: "button",
        position,
        enabled: true,
        alignment: "left",
        width: "full",
        content: { label: "Learn More", linkUrl: "#open-positions", variant: "primary" },
      };
    case "badge":
    case "icon":
      return {
        id,
        type,
        position,
        enabled: true,
        alignment: "left",
        content: { text: "We Are Hiring" },
      };
    case "stats":
      return {
        id,
        type: "stats",
        position,
        enabled: true,
        alignment: "center",
        content: {
          items: [
            { id: "s1", title: "Global Teammates", value: "350+" },
            { id: "s2", title: "Glassdoor Rating", value: "4.9 ★" },
            { id: "s3", title: "Retention Rate", value: "96%" },
          ],
        },
      };
    case "list":
      return {
        id,
        type: "list",
        position,
        enabled: true,
        content: {
          items: [
            { id: "l1", title: "Remote-First Flexibility", description: "Work anywhere with monthly stipends." },
            { id: "l2", title: "Learning & Development", description: "$2,500 annual allowance for books & courses." },
          ],
        },
      };
    case "gallery":
      return {
        id,
        type: "gallery",
        position,
        enabled: true,
        content: {
          items: [
            { id: "g1", title: "Team Retreat 2025", url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80" },
            { id: "g2", title: "Engineering Hackathon", url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80" },
            { id: "g3", title: "Design Workshop", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" },
          ],
        },
      };
    case "divider":
      return {
        id,
        type: "divider",
        position,
        enabled: true,
        content: {},
      };
    case "spacer":
    default:
      return {
        id,
        type: "spacer",
        position,
        enabled: true,
        content: {},
      };
  }
}

export function getTemplateById(templateId: string): SectionTemplate {
  return TEMPLATE_REGISTRY[templateId] || TEMPLATE_REGISTRY["hero-centered"];
}

export function getDefaultElementsForSectionType(sectionType: SectionType): SectionElement[] {
  const matching = Object.values(TEMPLATE_REGISTRY).find((t) => t.sectionType === sectionType);
  return matching ? matching.defaultElements : TEMPLATE_REGISTRY["custom-builder"].defaultElements;
}

/**
 * Switch a section template while preserving compatible elements (Heading, Subtitle, Text, Image, Video, Button).
 */
export function preserveElementsOnTemplateSwitch(
  currentElements: SectionElement[],
  targetTemplateId: string
): SectionElement[] {
  const targetTemplate = getTemplateById(targetTemplateId);
  const targetDefaultElements = JSON.parse(JSON.stringify(targetTemplate.defaultElements)) as SectionElement[];

  // Find existing content items by type
  const headingElem = currentElements.find((e) => e.type === "heading");
  const textElem = currentElements.find((e) => e.type === "text" || e.type === "richtext");
  const imageElem = currentElements.find((e) => e.type === "image");
  const videoElem = currentElements.find((e) => e.type === "video");
  const buttonElem = currentElements.find((e) => e.type === "button");

  return targetDefaultElements.map((targetElem) => {
    if (targetElem.type === "heading" && headingElem?.content?.text) {
      return { ...targetElem, content: { ...targetElem.content, text: headingElem.content.text } };
    }
    if ((targetElem.type === "text" || targetElem.type === "richtext") && textElem?.content?.text) {
      return { ...targetElem, content: { ...targetElem.content, text: textElem.content.text } };
    }
    if (targetElem.type === "image" && imageElem?.content?.url) {
      return { ...targetElem, content: { ...targetElem.content, url: imageElem.content.url, alt: imageElem.content.alt } };
    }
    if (targetElem.type === "video" && videoElem?.content?.videoUrl) {
      return { ...targetElem, content: { ...targetElem.content, videoUrl: videoElem.content.videoUrl } };
    }
    if (targetElem.type === "button" && buttonElem?.content?.label) {
      return {
        ...targetElem,
        content: { ...targetElem.content, label: buttonElem.content.label, linkUrl: buttonElem.content.linkUrl },
      };
    }
    return targetElem;
  });
}

