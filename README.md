# Cover Generator — Figma Plugin

Generate branded cover pages across multiple Figma pages in one click.

Covers are 1920x1080 frames with a gradient background, logo, project title, badge, contributors bar, and date — automatically set as your file thumbnail.

## Features

- **Multi-page support** — Generate covers on multiple pages at once with a page checklist
- **6 gradient presets** — Blue, Purple, Green, Dark, Sunset, Ocean, plus custom gradients
- **Badge labels** — Design, Research, Prototype, Engineering, or custom text
- **Contributors bar** — Optional bottom bar listing design POCs
- **File thumbnail** — Automatically sets the cover as the file thumbnail
- **Auto-populated fields** — Team name is pre-filled from the file name

## Installation

### From Figma Community (recommended)

Search for **"Cover Generator"** in the Figma Community and click **Install**.

### From source

1. Clone this repo:
   ```
   git clone https://github.com/vwaite21/figma-cover-plugin.git
   cd figma-cover-plugin
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Build:
   ```
   npm run build
   ```
4. In Figma, go to **Plugins > Development > Import plugin from manifest...** and select `manifest.json`

## Usage

1. Open a Figma file
2. Run the plugin from the **Plugins** menu
3. Choose a gradient, enter your team name and badge label
4. Select which pages should get covers using the checklist
5. Click **Generate Cover**

## Customization

| Option | Choices |
|--------|---------|
| Gradient | Blue, Purple, Green, Dark, Sunset, Ocean, Custom |
| Badge | Design, Research, Prototype, Engineering, Custom |
| Contributors | Free text (optional) |
| Pages | Select any combination via checklist |

## Development

The plugin consists of two files:

- `code.ts` — Plugin logic (compiled to `code.js`)
- `ui.html` — Plugin UI

Rebuild after changes:

```
npm run build
```

## Publishing to Figma Community

1. In Figma, go to **Plugins > Development > Cover Generator**
2. Click **"..." > Publish**
3. Upload the icon (`assets/icon.svg` — export as 128x128 PNG) and cover image (`assets/cover.svg` — export as 1920x960 PNG)
4. Copy the description from `LISTING.md`
5. Submit for review

## License

MIT
