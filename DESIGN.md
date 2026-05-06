---
name: Jamie Kazemier Photography
description: A creative, premium rowing photography portfolio and photo-sales gateway.
colors:
  paper: "#f8f2e7"
  paper-strong: "#ece1ce"
  ink: "#17130f"
  muted: "#736b61"
  line: "#d7c9b1"
  water: "#c2cfcb"
  deep-water: "#1d4141"
  reed: "#707a55"
  oxblood: "#643330"
  clay: "#a85d43"
  gold: "#c99d37"
  gold-dark: "#745925"
  foam: "#fdf9ef"
typography:
  display:
    fontFamily: "Schibsted Grotesk, Arial Narrow, sans-serif"
    fontSize: "clamp(3.8rem, 10.5vw, 10.6rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "normal"
  headline:
    fontFamily: "Schibsted Grotesk, Arial Narrow, sans-serif"
    fontSize: "clamp(2.7rem, 6vw, 6.2rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "normal"
  body:
    fontFamily: "Onest, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
  label:
    fontFamily: "Onest, Segoe UI, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  none: "0px"
spacing:
  gutter: "clamp(1rem, 4vw, 2.5rem)"
  xs: "0.7rem"
  sm: "1rem"
  md: "1.5rem"
  lg: "clamp(2rem, 5vw, 4rem)"
  section: "clamp(5rem, 9vw, 9rem)"
  section-tight: "clamp(3.5rem, 6vw, 6rem)"
  section-xl: "clamp(7rem, 13vw, 13rem)"
components:
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.foam}"
    rounded: "{rounded.none}"
    padding: "0.8rem 1.05rem"
  button-gold:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.8rem 1.05rem"
---

# Design System: Jamie Kazemier Photography

## 1. Overview

**Creative North Star: "The Regatta Print Room"**

The system should feel like an edited wall of rowing photographs in a quiet studio after race day: warm paper, deep water, oxblood club color, ochre-gold marks, and images treated as authored objects. It is a brand surface first and a gallery index second. The design must make race photos easy to find without flattening the work into a generic event-upload grid.

The current implementation is art-directed but calmer than the first bold pass. Future polish should tune crop choices, spacing, and mobile rhythm rather than retreating to safe symmetry. PRODUCT.md says the site must not feel "generic, bland, template-like"; that line is binding.

**Key Characteristics:**
- Image-led, with hero and gallery photography carrying the first impression.
- Warm, premium neutrals cut with muted deep water, oxblood, reed green, clay, and rowing gold.
- Flat, print-room surfaces with color fields, rules, and image scale instead of decorative shadows.
- Practical event browsing that still feels curated and made with intent.
- Layout rhythm built from shared gutter, content, wide, and section spacing tokens rather than one-off padding.

## 2. Colors

The palette is a quiet rowing-club palette: warm paper, dark hull ink, softened deep water, oxblood, reed green, clay, and controlled gold. It should feel collected and premium, not shouty.

Derived colors such as transparent paper overlays, soft foam text, dark panel surfaces, and quiet rules should live as named CSS variables. Avoid scattering one-off hex or rgba values through component CSS.

### Primary
- **Regatta Gold**: Used for primary buying actions, section eyebrows, and rare emphasis. Its scarcity gives it value.
- **Bank Gold Deep**: Used for hover states and small text accents where normal gold needs more contrast.
- **Clay Launch**: Used for hover color, section borders, and warmer art-direction emphasis.

### Secondary
- **River Wash**: Used as an atmospheric support color for water-adjacent surfaces and future art-direction moments.
- **Deep Water**: Used for full-bleed editorial panels and the contact hero.
- **Reed Green**: Used as a secondary gallery accent, never as a default background.
- **Club Oxblood**: Used for the photographer intro and Buy Photos section.

### Neutral
- **Warm Photo Paper**: The main page background. It should feel printed, not sterile.
- **Pressed Paper**: Secondary surface color for the Buy Photos panel and tonal separation.
- **Dark Hull Ink**: Primary text, dark buttons, and hero fallback surfaces.
- **Weathered Caption Gray**: Body-support text, metadata, and low-priority labels.
- **Pale Dock Line**: Borders, separators, and quiet structure.
- **Foam White**: The warm light text color for dark panels.

### Named Rules

**The Gold Has To Earn It Rule.** Gold is for buying, wayfinding, and authored emphasis. Do not sprinkle it as decoration.

**The No Sterile White Rule.** Never introduce pure white or pure black. Neutrals stay warm and photographic.

## 3. Typography

**Display Font:** Schibsted Grotesk, with Arial Narrow fallback
**Body Font:** Onest, with Segoe UI fallback
**Label/Mono Font:** Onest

**Character:** Schibsted Grotesk gives the brand a premium-modern, architectural voice without the ornamental fashion feel of Bodoni. Onest keeps navigation and body copy calm, crisp, and contemporary.

### Hierarchy
- **Display** (800, `clamp(3.8rem, 10.5vw, 10.6rem)`, `0.92`): Home and page-level statements only.
- **Headline** (800, `clamp(2.7rem, 6vw, 6.2rem)`, `0.92`): Section headers and gallery titles.
- **Title** (800, `clamp(2.05rem, 3.4vw, 3.8rem)`, `0.92`): Gallery-card names and compact feature labels.
- **Body** (400, `1rem`, `1.75`): Descriptive copy, capped visually by max-width rather than dense blocks.
- **Label** (700, `0.76rem`, uppercase): Eyebrows, metadata, and functional navigation labels.

### Named Rules

**The Authored Caption Rule.** Text should sound selected, not generated. Short, specific, visual lines beat explanatory paragraphs.

**The Print-Room Scale Rule.** Headlines can be large, but only one element per view should feel monumental. If everything shouts, reduce weight before removing character.

## 4. Elevation

The system is flat by default. Depth comes from scale, cropping, color fields, tonal panels, rules, and image rhythm, not shadows. Hover feedback uses a small upward transform on buttons only; image surfaces remain photographic rather than app-like.

### Named Rules

**The No Floating Gallery Rule.** Do not add card shadows to portfolio or gallery items. A photography portfolio should feel printed and sequenced, not like floating SaaS cards.

## 5. Components

### Buttons

- **Shape:** Sharp rectangular edges (0px radius).
- **Primary:** Dark Hull Ink background with Foam White text, compact confident padding (`0.9rem 1.2rem`).
- **Buy / Accent:** Regatta Gold background with Dark Hull Ink text.
- **Hover / Focus:** A restrained upward transform (`translateY(-1px)`) and color shift only. Focus states must remain visible and high contrast.

### Cards / Containers

- **Corner Style:** No rounded corners.
- **Background:** Cards are not boxed by default. Gallery cards use image scale, typography, and top rules.
- **Shadow Strategy:** No shadows. Use borders and spacing for structure.
- **Border:** Thin Pale Dock Line (`1px`) rules for portfolio rows, contact tiles, and separators.
- **Internal Padding:** Compact on cards, generous at section level.

### Navigation

The header is fixed and wordmark-led. On the homepage it starts transparent over the hero image, then becomes Warm Photo Paper with a Pale Dock Line border after scroll. Navigation labels are practical and direct: Portfolio, Buy Photos, Contact. The current route uses `aria-current="page"` and a quiet underline. Mobile stacks the wordmark over a wrapping nav row with 44px tap targets.

### First Impression

The hero remains a pure photograph, but it should not leave first-time visitors guessing. A narrow race-context strip may sit directly after the hero, naming rowing-specific cues such as race-day coverage, blade timing, crew movement, and finish-line pressure. This gives the first viewport a clear subject without placing marketing text over the image.

### Image Sequences

Gallery detail pages use one dark editorial title block, one large lead image, then masonry. The masonry should feel curated, not dumped. Use varied aspect ratios, generous gaps, and real alt text. On mobile, image sequences collapse to a single column instead of preserving cramped bento fragments. Do not introduce image-viewing modals as the default behavior.

Images should be exported in multiple widths and served through AVIF/WebP/JPG `srcset`s. The photography is the product, but mobile visitors should not download desktop-sized files unless their viewport needs them.

### Responsive Adaptation

The site adapts by context, not by proportional scaling. Desktop keeps the most asymmetric editorial sequencing. Tablet uses two-column and six-track compositions so photography still has rhythm without becoming cramped. Phones collapse to a single clear reading path, full-width actions, scroll-safe navigation, and simpler crops. Short landscape viewports preserve the hero as an image moment without hiding page content behind the fixed header. Wide screens increase the canvas slightly but keep max-width constraints so images do not sprawl into accidental wallpaper.

### Contact Tiles

Contact uses a deep-water hero, two large text-led tiles, and a pressed-paper Buy Photos panel. Instagram can lead because it is Jamie's preferred quick contact route, but email must remain equally available. The Buy Photos section is an external-shop handoff for Pixieset or Oypo, not an onsite checkout promise.

## 6. Do's and Don'ts

### Do:

- **Do** lead with real rowing imagery and treat every image as an authored object.
- **Do** use Warm Photo Paper, Dark Hull Ink, Deep Water, Club Oxblood, and Regatta Gold as the recognizable core.
- **Do** quiet bold moments by thinning rules, softening saturation, and reducing weight before making the layout generic.
- **Do** use rowing-specific interface language: blade timing, crew movement, race-day coverage, finish-line pressure, event names, and race details.
- **Do** keep event browsing practical for rowers and families looking for photos.
- **Do** use asymmetry, stronger crops, and varied pacing on desktop, then simplify to one clear column on mobile.
- **Do** keep every interactive target at least 44px tall and make phone actions full-width when space is tight.
- **Do** preserve alt text, contrast, keyboard navigation, and reduced-motion support.

### Don't:

- **Don't** make the site feel "generic, bland, template-like, or like a default photography grid with swapped-in images."
- **Don't** use modal-first image viewing.
- **Don't** add decorative card shadows, glass effects, gradient text, or side-stripe borders.
- **Don't** let buying feel like a dead placeholder. It must always route to contact or a real sales destination.
- **Don't** imply checkout happens on the portfolio site while sales are planned for Pixieset or Oypo.
- **Don't** retreat to polite centered sections, equal cards, or safe serif typography if the site starts feeling bland again.
