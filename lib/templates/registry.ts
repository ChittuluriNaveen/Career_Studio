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
  | "list"
  | "people"
  | "departments"
  | "techstack"
  | "process"
  | "testimonials";

export interface ElementStyles {
  layout?: {
    width?: string;
    height?: string;
    maxWidth?: string;
    minHeight?: string;
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
    objectFit?: "cover" | "contain" | "fill" | "none";
  };
  spacing?: {
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;
  };
  typography?: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textAlign?: "left" | "center" | "right" | "justify";
  };
  colors?: {
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
  };
  border?: {
    width?: string;
    style?: "none" | "solid" | "dashed" | "dotted";
    radius?: string;
    color?: string;
  };
  shadow?: {
    preset?: "none" | "sm" | "md" | "lg" | "xl";
  };
  effects?: {
    opacity?: number;
    backdropBlur?: string;
    glass?: "none" | "light" | "medium" | "strong";
  };
  animation?: {
    type?: "none" | "fade-in" | "fade-out" | "slide-up" | "slide-down" | "slide-left" | "slide-right" | "zoom-in" | "bounce-in";
    duration?: string;
    delay?: string;
  };
  responsive?: {
    tablet?: Partial<Omit<ElementStyles, "responsive">>;
    mobile?: Partial<Omit<ElementStyles, "responsive">>;
  };
}

export interface SectionElement {
  id: string;
  type: ElementType;
  position: number;
  enabled: boolean;
  width?: "full" | "half" | "third";
  alignment?: "left" | "center" | "right";
  styles?: ElementStyles;
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
      linkUrl?: string;
    }>;
    [key: string]: any;
  };
}

export interface SectionCardStyles {
  background?: "default" | "solid-white" | "dark-glass" | "transparent" | "image" | "gradient" | string;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  bgPosition?: "center" | "top" | "bottom" | "left" | "right" | string;
  bgSize?: "cover" | "contain" | string;
  bgRepeat?: "no-repeat" | "repeat" | string;
  overlayEnabled?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  overlayGradient?: string;
  horizontalAlignment?: "left" | "center" | "right";
  verticalAlignment?: "top" | "center" | "bottom";
  minHeight?: "auto" | "sm" | "md" | "lg" | "full" | string;
  containerWidth?: "wide" | "narrow" | "full" | string;
  contentMaxWidth?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  marginTop?: string;
  marginBottom?: string;
  borderWidth?: number | string;
  borderColor?: string;
  borderStyle?: "solid" | "dashed" | "dotted" | "none";
  borderRadius?: number | string;
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | string;
  glass?: "none" | "light" | "medium" | "strong";
  backdropBlur?: string;
  responsive?: {
    tablet?: Partial<Omit<SectionCardStyles, "responsive">>;
    mobile?: Partial<Omit<SectionCardStyles, "responsive">>;
  };
}

export interface SectionLayoutConfig {
  container: "wide" | "narrow" | "full" | string;
  alignment: "left" | "center" | "right";
  paddingY: "sm" | "md" | "lg" | string;
  backgroundColor?: string;
  verticalAlignment?: "top" | "center" | "bottom";
  minHeight?: string;
}

export interface SectionTemplate {
  templateId: string;
  name: string;
  sectionType: SectionType;
  description: string;
  thumbnailIcon: string;
  layout: SectionLayoutConfig;
  cardStyles?: SectionCardStyles;
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
        content: { text: "We Are Hiring at @company_name · @active_jobs_count Open Roles" },
      },
      {
        id: "hero-heading-1",
        type: "heading",
        position: 1,
        enabled: true,
        alignment: "center",
        content: { text: "Build the Future of @company_industry with @company_name", level: 1 },
      },
      {
        id: "hero-text-1",
        type: "text",
        position: 2,
        enabled: true,
        alignment: "center",
        content: {
          text: "Join @company_name in @company_location to build scalable, mission-critical systems. @company_tagline",
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
    description: "Immersive full-bleed hero banner background image with dark overlay & high-contrast text",
    thumbnailIcon: "Image",
    layout: { container: "full", alignment: "center", paddingY: "lg" },
    cardStyles: {
      background: "image",
      backgroundImageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80",
      bgSize: "cover",
      bgPosition: "center center",
      overlayEnabled: true,
      overlayColor: "#0f172a",
      overlayOpacity: 0.65,
      minHeight: "580px",
      horizontalAlignment: "center",
      verticalAlignment: "center",
      shadow: "xl",
    },
    defaultElements: [
      {
        id: "hero-bg-heading",
        type: "heading",
        position: 0,
        enabled: true,
        alignment: "center",
        content: { text: "Pioneering Next-Generation AI Infrastructure", level: 1 },
        styles: {
          colors: { color: "#ffffff" },
          typography: { fontSize: "44px", fontWeight: "800", textAlign: "center" },
        },
      },
      {
        id: "hero-bg-text",
        type: "text",
        position: 1,
        enabled: true,
        alignment: "center",
        content: { text: "Work on cutting-edge machine learning systems alongside world-renowned research scientists." },
        styles: {
          colors: { color: "#e2e8f0" },
          typography: { fontSize: "18px", textAlign: "center" },
        },
      },
      {
        id: "hero-bg-button",
        type: "button",
        position: 2,
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
          videoUrl: "@culture_video",
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
          videoUrl: "@culture_video",
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

  "people-pillars": {
    templateId: "people-pillars",
    name: "Leadership & Team Pillars",
    sectionType: SectionType.PEOPLE,
    description: "Showcase founders, leaders, and key team pillars driving innovation at your company",
    thumbnailIcon: "Users",
    layout: { container: "wide", alignment: "center", paddingY: "lg" },
    defaultElements: [
      {
        id: "people-badge-1",
        type: "badge",
        position: 0,
        enabled: true,
        alignment: "center",
        content: { text: "Who We Are · Team & Leadership Pillars" },
      },
      {
        id: "people-heading-1",
        type: "heading",
        position: 1,
        enabled: true,
        alignment: "center",
        content: { text: "Meet the People Behind @company_name", level: 2 },
      },
      {
        id: "people-text-1",
        type: "text",
        position: 2,
        enabled: true,
        alignment: "center",
        content: { text: "Our passionate leaders, engineers, and creators building high-impact technology in @company_location." },
      },
      {
        id: "people-grid-1",
        type: "people",
        position: 3,
        enabled: true,
        content: {
          items: [
            {
              id: "p1",
              title: "Sarah Jenkins",
              subtitle: "Co-Founder & Chief Executive Officer",
              description: "Leading strategy, growth, and team mission at @company_name.",
              url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
              linkUrl: "https://linkedin.com",
            },
            {
              id: "p2",
              title: "David Chen",
              subtitle: "Head of AI & Product Architecture",
              description: "Architecting cloud infrastructure, ML models, and candidate portal interfaces.",
              url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
              linkUrl: "https://linkedin.com",
            },
            {
              id: "p3",
              title: "Elena Rostova",
              subtitle: "VP of People Operations & Culture",
              description: "Fostering inclusive culture, career growth, and talent recruitment worldwide.",
              url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
              linkUrl: "https://linkedin.com",
            },
          ],
        },
      },
    ],
  },

  "departments-grid": {
    templateId: "departments-grid",
    name: "Company Departments & Functional Teams",
    sectionType: SectionType.DEPARTMENTS,
    description: "Highlight separate company departments (Engineering, Design, Growth, Operations) with open role badges",
    thumbnailIcon: "Building",
    layout: { container: "wide", alignment: "center", paddingY: "lg" },
    defaultElements: [
      {
        id: "dept-badge-1",
        type: "badge",
        position: 0,
        enabled: true,
        alignment: "center",
        content: { text: "Explore Functional Units at @company_name" },
      },
      {
        id: "dept-heading-1",
        type: "heading",
        position: 1,
        enabled: true,
        alignment: "center",
        content: { text: "Departments & Teams", level: 2 },
      },
      {
        id: "dept-text-1",
        type: "text",
        position: 2,
        enabled: true,
        alignment: "center",
        content: { text: "Find your place across specialized teams driving innovation and building great products." },
      },
      {
        id: "dept-grid-1",
        type: "departments",
        position: 3,
        enabled: true,
        content: {
          items: [
            {
              id: "d1",
              title: "Engineering & AI Platform",
              icon: "💻",
              value: "3 Roles",
              description: "Building cloud backend, microservices, and web experiences.",
              linkUrl: "#open-positions",
            },
            {
              id: "d2",
              title: "Product Design & UX",
              icon: "🎨",
              value: "2 Roles",
              description: "Crafting modern, accessible user interfaces and design systems.",
              linkUrl: "#open-positions",
            },
            {
              id: "d3",
              title: "Growth, Sales & Marketing",
              icon: "🚀",
              value: "1 Role",
              description: "Driving customer adoption, brand story, and global market expansion.",
              linkUrl: "#open-positions",
            },
          ],
        },
      },
    ],
  },
  "company-tech-stack": {
    templateId: "company-tech-stack",
    name: "Company Tech Stack & Tools Showcase",
    sectionType: SectionType.TECH_STACK,
    description: "Showcase tools, frameworks, and technologies used by engineering & design teams (React, Next.js, Python, PostgreSQL, AWS)",
    thumbnailIcon: "Code",
    layout: { container: "wide", alignment: "center", paddingY: "lg" },
    defaultElements: [
      {
        id: "tech-badge-1",
        type: "badge",
        position: 0,
        enabled: true,
        alignment: "center",
        content: { text: "Engineering & Tooling Stack at @company_name" },
      },
      {
        id: "tech-heading-1",
        type: "heading",
        position: 1,
        enabled: true,
        alignment: "center",
        content: { text: "Our Technology Stack", level: 2 },
      },
      {
        id: "tech-text-1",
        type: "text",
        position: 2,
        enabled: true,
        alignment: "center",
        content: { text: "We leverage modern cloud-native tools, AI frameworks, and resilient design systems to build products." },
      },
      {
        id: "tech-grid-1",
        type: "techstack",
        position: 3,
        enabled: true,
        content: {
          items: [
            { id: "t1", title: "Next.js & React 19", icon: "⚛️", value: "Frontend & SSR", description: "Server components, Turbopack, and high-performance UI." },
            { id: "t2", title: "TypeScript & Node.js", icon: "🔷", value: "Core Architecture", description: "Type-safe microservices and robust API routes." },
            { id: "t3", title: "PostgreSQL & Prisma", icon: "🐘", value: "Database Layer", description: "Relational data modeling, schema indexing, and pooler connections." },
            { id: "t4", title: "Python & PyTorch AI", icon: "🐍", value: "AI & Pipeline Engine", description: "Custom LLM integrations, embeddings, and telemetry analytics." },
            { id: "t5", title: "Tailwind CSS & Lucide", icon: "🎨", value: "Design System", description: "Dynamic HSL color tokens, dark mode luminance, and micro-interactions." },
            { id: "t6", title: "Docker & AWS Cloud", icon: "☁️", value: "Infrastructure", description: "Containerized deployments, auto-scaling, and global CDN caching." },
          ],
        },
      },
    ],
  },

  "hiring-process": {
    templateId: "hiring-process",
    name: "Hiring & Interview Process Timeline",
    sectionType: SectionType.PROCESS,
    description: "Outline the step-by-step interview journey for prospective candidates (Screen -> Technical -> Culture -> Offer)",
    thumbnailIcon: "GitCommit",
    layout: { container: "wide", alignment: "center", paddingY: "lg" },
    defaultElements: [
      {
        id: "proc-badge-1",
        type: "badge",
        position: 0,
        enabled: true,
        alignment: "center",
        content: { text: "Transparent Hiring Journey at @company_name" },
      },
      {
        id: "proc-heading-1",
        type: "heading",
        position: 1,
        enabled: true,
        alignment: "center",
        content: { text: "Our Interview & Hiring Process", level: 2 },
      },
      {
        id: "proc-text-1",
        type: "text",
        position: 2,
        enabled: true,
        alignment: "center",
        content: { text: "What to expect from application submit to your first day at @company_name." },
      },
      {
        id: "proc-grid-1",
        type: "process",
        position: 3,
        enabled: true,
        content: {
          items: [
            { id: "step1", title: "Step 1: Application Submit", value: "1-2 Days", description: "Submit your resume or LinkedIn profile URL. Our recruiting team reviews candidate profiles daily." },
            { id: "step2", title: "Step 2: Recruiter Conversation", value: "30 Mins", description: "A casual video call to discuss your background, career goals, role expectations, and answer your questions." },
            { id: "step3", title: "Step 3: Technical & Architecture Deep-Dive", value: "60 Mins", description: "Pair-programming or system design session focused on real-world engineering challenges." },
            { id: "step4", title: "Step 4: Final Founder Call & Offer", value: "30 Mins", description: "Align on compensation, equity, team culture, and welcome you onboard!" },
          ],
        },
      },
    ],
  },

  "employee-testimonials": {
    templateId: "employee-testimonials",
    name: "Employee Culture Quotes & Testimonials",
    sectionType: SectionType.TESTIMONIALS,
    description: "Showcase direct quotes and stories from current team members about career growth at your company",
    thumbnailIcon: "MessageSquare",
    layout: { container: "wide", alignment: "center", paddingY: "lg" },
    defaultElements: [
      {
        id: "test-badge-1",
        type: "badge",
        position: 0,
        enabled: true,
        alignment: "center",
        content: { text: "Life & Career Stories at @company_name" },
      },
      {
        id: "test-heading-1",
        type: "heading",
        position: 1,
        enabled: true,
        alignment: "center",
        content: { text: "What Teammates Say About Working Here", level: 2 },
      },
      {
        id: "test-grid-1",
        type: "testimonials",
        position: 3,
        enabled: true,
        content: {
          items: [
            {
              id: "q1",
              title: "Marcus Vance",
              subtitle: "Staff Software Engineer · 3 Yrs at @company_name",
              description: "“Joining @company_name was the best career decision I ever made. The level of ownership, technical autonomy, and collaborative team environment is unmatched.”",
              url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
            },
            {
              id: "q2",
              title: "Priya Sharma",
              subtitle: "Lead Product Designer · 2 Yrs at @company_name",
              description: "“We ship user-centric products fast without sacrificing design quality or accessibility. Everyone's voice is heard.”",
              url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            },
          ],
        },
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
          videoUrl: "@culture_video",
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
        content: { label: "Learn More", text: "Learn More", linkUrl: "#open-positions", url: "#open-positions", variant: "primary" },
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
    case "people":
      return {
        id,
        type: "people",
        position,
        enabled: true,
        alignment: "center",
        content: {
          items: [
            {
              id: "p1",
              title: "Sarah Jenkins",
              subtitle: "Co-Founder & CEO",
              description: "Leading strategy, growth, and team mission at @company_name.",
              url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
              linkUrl: "https://linkedin.com",
            },
            {
              id: "p2",
              title: "David Chen",
              subtitle: "Head of AI & Product Architecture",
              description: "Building cloud platform infrastructure and web products.",
              url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
              linkUrl: "https://linkedin.com",
            },
          ],
        },
      };
    case "departments":
      return {
        id,
        type: "departments",
        position,
        enabled: true,
        alignment: "center",
        content: {
          items: [
            {
              id: "d1",
              title: "Engineering & AI Platform",
              icon: "💻",
              value: "3 Roles",
              description: "Building cloud backend, microservices, and web experiences.",
              linkUrl: "#open-positions",
            },
            {
              id: "d2",
              title: "Product Design & UX",
              icon: "🎨",
              value: "2 Roles",
              description: "Crafting modern, accessible user interfaces and design systems.",
              linkUrl: "#open-positions",
            },
          ],
        },
      };
    case "techstack":
      return {
        id,
        type: "techstack",
        position,
        enabled: true,
        alignment: "center",
        content: {
          items: [
            { id: "t1", title: "Next.js & React 19", icon: "⚛️", value: "Frontend & SSR", description: "Server components, Turbopack, and high-performance UI." },
            { id: "t2", title: "PostgreSQL & Prisma", icon: "🐘", value: "Database Layer", description: "Relational data modeling, schema indexing, and pooler connections." },
          ],
        },
      };
    case "process":
      return {
        id,
        type: "process",
        position,
        enabled: true,
        alignment: "center",
        content: {
          items: [
            { id: "step1", title: "Step 1: Application Submit", value: "1-2 Days", description: "Submit your resume. Our recruiting team reviews candidate profiles daily." },
            { id: "step2", title: "Step 2: Recruiter Conversation", value: "30 Mins", description: "Casual call to discuss background, role expectations, and answer your questions." },
          ],
        },
      };
    case "testimonials":
      return {
        id,
        type: "testimonials",
        position,
        enabled: true,
        alignment: "center",
        content: {
          items: [
            {
              id: "q1",
              title: "Marcus Vance",
              subtitle: "Staff Software Engineer · 3 Yrs at @company_name",
              description: "“Joining @company_name was the best career decision I ever made. The level of ownership and autonomy is unmatched.”",
              url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
            },
          ],
        },
      };
    case "divider":
      return {
        id,
        type: "divider",
        position,
        enabled: true,
        content: {
          thickness: "2px",
          style: "solid",
          width: "100%",
          margin: "my-6",
        },
      };
    case "spacer":
    default:
      return {
        id,
        type: "spacer",
        position,
        enabled: true,
        content: {
          height: "32px",
          mobileHeight: "16px",
        },
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

  // Find existing content items by type with property fallbacks
  const headingElem = currentElements.find((e) => e.type === "heading");
  const textElem = currentElements.find((e) => e.type === "text" || e.type === "richtext");
  const imageElem = currentElements.find((e) => e.type === "image");
  const videoElem = currentElements.find((e) => e.type === "video");
  const buttonElem = currentElements.find((e) => e.type === "button");

  const headingText = headingElem?.content?.text || headingElem?.content?.title || headingElem?.content?.heading;
  const bodyText = textElem?.content?.text || textElem?.content?.subtitle || textElem?.content?.description;
  const imageUrl = imageElem?.content?.url || imageElem?.content?.src;
  const videoUrl = videoElem?.content?.videoUrl || videoElem?.content?.url;
  const buttonLabel = buttonElem?.content?.label || buttonElem?.content?.text || buttonElem?.content?.ctaText;
  const buttonLink = buttonElem?.content?.linkUrl || buttonElem?.content?.url;

  return targetDefaultElements.map((targetElem) => {
    if (targetElem.type === "heading" && headingText) {
      return { ...targetElem, content: { ...targetElem.content, text: headingText } };
    }
    if ((targetElem.type === "text" || targetElem.type === "richtext") && bodyText) {
      return { ...targetElem, content: { ...targetElem.content, text: bodyText } };
    }
    if (targetElem.type === "image" && imageUrl) {
      return { ...targetElem, content: { ...targetElem.content, url: imageUrl, alt: imageElem?.content?.alt } };
    }
    if (targetElem.type === "video" && videoUrl) {
      return { ...targetElem, content: { ...targetElem.content, videoUrl: videoUrl } };
    }
    if (targetElem.type === "button" && buttonLabel) {
      return {
        ...targetElem,
        content: {
          ...targetElem.content,
          label: buttonLabel,
          text: buttonLabel,
          linkUrl: buttonLink || targetElem.content.linkUrl || "#open-positions",
          url: buttonLink || targetElem.content.url || "#open-positions",
        },
      };
    }
    return targetElem;
  });
}

