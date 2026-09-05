import { SectionElement, ElementStyles, ElementType } from "./registry";

export interface ResolvedStyleObject extends React.CSSProperties {
  [key: string]: any;
}

/**
 * Returns baseline template defaults for specific element types
 */
export function getTemplateDefaults(type?: ElementType | "card" | "container" | string): ElementStyles {
  switch (type) {
    case "heading":
      return {
        typography: {
          fontWeight: "700",
          lineHeight: "1.2",
        },
      };
    case "button":
      return {
        border: {
          radius: "12px",
          style: "solid",
          width: "1px",
        },
        spacing: {
          paddingTop: "12px",
          paddingBottom: "12px",
          paddingLeft: "24px",
          paddingRight: "24px",
        },
      };
    case "card":
    case "container":
      return {
        border: {
          radius: "16px",
        },
        spacing: {
          paddingTop: "16px",
          paddingBottom: "16px",
          paddingLeft: "16px",
          paddingRight: "16px",
        },
      };
    default:
      return {};
  }
}

/**
 * Deep merges style objects with override precedence
 */
export function mergeStyles(base: ElementStyles = {}, override: ElementStyles = {}): ElementStyles {
  return {
    layout: { ...base.layout, ...override.layout },
    spacing: { ...base.spacing, ...override.spacing },
    typography: { ...base.typography, ...override.typography },
    colors: { ...base.colors, ...override.colors },
    border: { ...base.border, ...override.border },
    shadow: { ...base.shadow, ...override.shadow },
    effects: { ...base.effects, ...override.effects },
    responsive: {
      tablet: { ...base.responsive?.tablet, ...override.responsive?.tablet },
      mobile: { ...base.responsive?.mobile, ...override.responsive?.mobile },
    },
  };
}

/**
 * Automated Responsive Device Engine:
 * Resolves styles according to active device viewport with responsive inheritance & automatic proportional scaling
 */
export function getResponsiveStyles(
  styles: ElementStyles = {},
  deviceMode: "desktop" | "tablet" | "mobile" = "desktop"
): ElementStyles {
  const { responsive, ...baseStyles } = styles;

  if (deviceMode === "desktop") {
    return baseStyles;
  }

  const tabletOverrides = responsive?.tablet || {};
  const mobileOverrides = responsive?.mobile || {};

  let merged: ElementStyles;

  if (deviceMode === "tablet") {
    merged = mergeStyles(baseStyles, tabletOverrides);
  } else {
    // Mobile mode: base -> tablet -> mobile
    const mergedTablet = mergeStyles(baseStyles, tabletOverrides);
    merged = mergeStyles(mergedTablet, mobileOverrides);
  }

  // AUTOMATED DEVICE SCALING ENGINE:
  // If no explicit font size override was set for mobile/tablet, scale down large desktop text
  const hasExplicitFontSize =
    deviceMode === "mobile"
      ? Boolean(mobileOverrides.typography?.fontSize || tabletOverrides.typography?.fontSize)
      : Boolean(tabletOverrides.typography?.fontSize);

  if (!hasExplicitFontSize && merged.typography?.fontSize) {
    const rawSize = merged.typography.fontSize.trim();
    const match = rawSize.match(/^(\d+(\.\d+)?)(px|rem|em)?$/);
    if (match) {
      const num = parseFloat(match[1]);
      const unit = match[3] || "px";
      if (unit === "px" && num >= 24) {
        const scaleFactor = deviceMode === "mobile" ? 0.65 : 0.82;
        const scaledNum = Math.max(16, Math.round(num * scaleFactor));
        merged = {
          ...merged,
          typography: {
            ...merged.typography,
            fontSize: `${scaledNum}px`,
          },
        };
      }
    }
  }

  // Automatic padding adjustment for mobile screens
  if (deviceMode === "mobile") {
    const hasExplicitPadding = Boolean(
      mobileOverrides.spacing?.paddingTop ||
        mobileOverrides.spacing?.paddingLeft ||
        mobileOverrides.spacing?.paddingRight
    );

    if (!hasExplicitPadding && merged.spacing) {
      const adjustPad = (val?: string) => {
        if (!val) return val;
        const m = val.trim().match(/^(\d+)(px)?$/);
        if (m && parseInt(m[1], 10) > 24) {
          return `${Math.round(parseInt(m[1], 10) * 0.5)}px`;
        }
        return val;
      };

      merged = {
        ...merged,
        spacing: {
          ...merged.spacing,
          paddingTop: adjustPad(merged.spacing.paddingTop),
          paddingBottom: adjustPad(merged.spacing.paddingBottom),
          paddingLeft: adjustPad(merged.spacing.paddingLeft),
          paddingRight: adjustPad(merged.spacing.paddingRight),
        },
      };
    }
  }

  return merged;
}

function formatCssValue(val?: string | number): string | undefined {
  if (val === undefined || val === null || val === "") return undefined;
  const trimmed = String(val).trim();
  if (!trimmed) return undefined;
  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    return `${trimmed}px`;
  }
  return trimmed;
}

/**
 * Converts resolved ElementStyles into a clean inline React.CSSProperties object
 */
export function convertStylesToCSS(styles: ElementStyles): ResolvedStyleObject {
  const css: ResolvedStyleObject = {};

  // 1. Layout
  if (styles.layout) {
    if (styles.layout.width) css.width = formatCssValue(styles.layout.width);
    if (styles.layout.height) css.height = formatCssValue(styles.layout.height);
    if (styles.layout.maxWidth) css.maxWidth = formatCssValue(styles.layout.maxWidth);
    if (styles.layout.minHeight) css.minHeight = formatCssValue(styles.layout.minHeight);
    if (styles.layout.display) css.display = styles.layout.display;
    if (styles.layout.flexDirection) css.flexDirection = styles.layout.flexDirection as any;
    if (styles.layout.justifyContent) css.justifyContent = styles.layout.justifyContent;
    if (styles.layout.alignItems) css.alignItems = styles.layout.alignItems;
    if (styles.layout.gap) css.gap = formatCssValue(styles.layout.gap);
    if (styles.layout.objectFit) css.objectFit = styles.layout.objectFit as any;
  }

  // 2. Spacing
  if (styles.spacing) {
    if (styles.spacing.marginTop) css.marginTop = formatCssValue(styles.spacing.marginTop);
    if (styles.spacing.marginRight) css.marginRight = formatCssValue(styles.spacing.marginRight);
    if (styles.spacing.marginBottom) css.marginBottom = formatCssValue(styles.spacing.marginBottom);
    if (styles.spacing.marginLeft) css.marginLeft = formatCssValue(styles.spacing.marginLeft);
    if (styles.spacing.paddingTop) css.paddingTop = formatCssValue(styles.spacing.paddingTop);
    if (styles.spacing.paddingRight) css.paddingRight = formatCssValue(styles.spacing.paddingRight);
    if (styles.spacing.paddingBottom) css.paddingBottom = formatCssValue(styles.spacing.paddingBottom);
    if (styles.spacing.paddingLeft) css.paddingLeft = formatCssValue(styles.spacing.paddingLeft);
  }

  // 3. Typography
  if (styles.typography) {
    if (styles.typography.fontFamily) css.fontFamily = styles.typography.fontFamily;
    if (styles.typography.fontSize) css.fontSize = formatCssValue(styles.typography.fontSize);
    if (styles.typography.fontWeight) css.fontWeight = styles.typography.fontWeight;
    if (styles.typography.lineHeight) css.lineHeight = styles.typography.lineHeight;
    if (styles.typography.letterSpacing) css.letterSpacing = formatCssValue(styles.typography.letterSpacing);
    if (styles.typography.textAlign) css.textAlign = styles.typography.textAlign;
  }

  // 4. Colors
  if (styles.colors) {
    if (styles.colors.color) css.color = styles.colors.color;
    if (styles.colors.backgroundColor) css.backgroundColor = styles.colors.backgroundColor;
    if (styles.colors.borderColor) css.borderColor = styles.colors.borderColor;
  }

  // 5. Border
  if (styles.border) {
    if (styles.border.width) css.borderWidth = formatCssValue(styles.border.width);
    if (styles.border.style) {
      css.borderStyle = styles.border.style;
    }
    if (styles.border.radius) css.borderRadius = formatCssValue(styles.border.radius);
    if (styles.border.color) css.borderColor = styles.border.color;
  }

  // 6. Shadow
  if (styles.shadow) {
    if ((styles.shadow as any).blurRadius !== undefined) {
      const blur = formatCssValue((styles.shadow as any).blurRadius) || "10px";
      const shadowColor = (styles.shadow as any).color || "rgba(0, 0, 0, 0.15)";
      css.boxShadow = `0 4px ${blur} ${shadowColor}`;
    } else if (styles.shadow.preset) {
      switch (styles.shadow.preset) {
        case "sm":
          css.boxShadow = "0 1px 2px 0 rgb(0 0 0 / 0.05)";
          break;
        case "md":
          css.boxShadow = "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)";
          break;
        case "lg":
          css.boxShadow = "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)";
          break;
        case "xl":
          css.boxShadow = "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)";
          break;
        case "none":
          css.boxShadow = "none";
          break;
      }
    }
  }

  // 7. Effects & Glassmorphism
  if (styles.effects) {
    if (typeof styles.effects.opacity === "number") {
      css.opacity = styles.effects.opacity;
    }
    if (styles.effects.backdropBlur) {
      css.backdropFilter = `blur(${formatCssValue(styles.effects.backdropBlur)})`;
      css.WebkitBackdropFilter = `blur(${formatCssValue(styles.effects.backdropBlur)})`;
    }

    if (styles.effects.glass && styles.effects.glass !== "none") {
      switch (styles.effects.glass) {
        case "light":
          css.backgroundColor = css.backgroundColor || "rgba(255, 255, 255, 0.12)";
          css.backdropFilter = "blur(12px)";
          css.WebkitBackdropFilter = "blur(12px)";
          css.borderColor = css.borderColor || "rgba(255, 255, 255, 0.2)";
          css.borderStyle = css.borderStyle || "solid";
          css.borderWidth = css.borderWidth || "1px";
          break;
        case "medium":
          css.backgroundColor = css.backgroundColor || "rgba(255, 255, 255, 0.22)";
          css.backdropFilter = "blur(18px)";
          css.WebkitBackdropFilter = "blur(18px)";
          css.borderColor = css.borderColor || "rgba(255, 255, 255, 0.35)";
          css.borderStyle = css.borderStyle || "solid";
          css.borderWidth = css.borderWidth || "1px";
          break;
        case "strong":
          css.backgroundColor = css.backgroundColor || "rgba(255, 255, 255, 0.38)";
          css.backdropFilter = "blur(24px)";
          css.WebkitBackdropFilter = "blur(24px)";
          css.borderColor = css.borderColor || "rgba(255, 255, 255, 0.5)";
          css.borderStyle = css.borderStyle || "solid";
          css.borderWidth = css.borderWidth || "1px";
          break;
      }
    }
  }

  return css;
}

/**
 * Complete resolver pipeline:
 * Element + Device Mode -> Final CSS Properties Object
 */
export function getElementStyles(
  element: SectionElement,
  deviceMode: "desktop" | "tablet" | "mobile" = "desktop"
): ResolvedStyleObject {
  const defaults = getTemplateDefaults(element.type);
  const elementCustomStyles = element.styles || {};

  const mergedBase = mergeStyles(defaults, elementCustomStyles);
  const responsiveResolved = getResponsiveStyles(mergedBase, deviceMode);

  return convertStylesToCSS(responsiveResolved);
}
