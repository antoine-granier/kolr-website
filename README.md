# Kolr - The Complete Color Toolkit

Kolr is a comprehensive color palette platform for designers, developers, and creatives. Generate palettes, check WCAG accessibility, simulate color blindness, convert between formats, create dark themes, and more.

**Live:** [kolr-app.vercel.app](https://kolr-app.vercel.app)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **i18n:** next-intl (English & French)
- **Deployment:** Vercel

## Features

### 15 Free Online Tools

| Tool | Description |
|------|-------------|
| Random Palette | Generate palettes with harmony modes (mono, analogous, complementary, triadic, tetradic) |
| Color Extract | Extract colors from uploaded images |
| Image Extract | Image to palette with intelligent analysis |
| Contrast Checker | WCAG AA/AAA contrast ratio testing |
| Gradient Generator | Create CSS gradients with multiple stops |
| Colorblind Simulator | Simulate protanopia, deuteranopia, tritanopia |
| Colorblind Web | Test any website with colorblind filters |
| Color Converter | Convert between HEX, RGB, HSL, OKLCH, CMYK |
| URL Extract | Extract all colors from any website |
| Dark Theme | Generate dark theme variants |
| Palette Compare | Compare two palettes side by side |
| Tailwind Colors | Preview colors on real UI components |
| SVG Color Editor | Edit colors in SVG files |
| Share Palette | Share palettes via link |

### Integrations

- **Figma Plugin** — Import/export palettes, create Figma styles & variables, gallery of 20+ curated palettes
- **Chrome Extension** — Color picker with zoom magnifier, page color extraction, palette builder, multi-format export

### Export Formats

CSS Variables, Tailwind Config, SCSS Variables, JSON, Figma Design Tokens, SVG Swatches

## Project Structure

```
kolr-website/
  app/
    [locale]/           # i18n routes (en, fr)
      page.tsx          # Homepage
      tools/            # 15 color tools
      blog/             # Blog articles
      integrations/     # Figma & Chrome integrations page
      ...
    api/
      extract-url/      # API: extract colors from URLs
  components/           # Reusable React components
  lib/                  # Utilities (color parsing, metadata)
  locales/              # Translation files (en.json, fr.json)
  public/               # Static assets
  chrome-extension/     # Chrome Extension (Manifest V3)
    popup/              # Extension popup UI
    content/            # Content scripts (color picker, extraction)
    lib/                # Shared utilities
    background.js       # Service worker
  figma-plugin/         # Figma Plugin
    code.js             # Figma API sandbox
    ui.html             # Plugin UI
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Chrome Extension (Development)

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the `chrome-extension/` folder

## Figma Plugin (Development)

1. Open **Figma Desktop**
2. Go to **Plugins > Development > Import plugin from manifest**
3. Select `figma-plugin/manifest.json`

## Mobile App

Available on iOS: [App Store](https://apps.apple.com/uy/app/kolr-color-palette-generator/id6757849651)

Android coming soon.

## License

All rights reserved.
