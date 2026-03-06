# Cover Generator - Figma Plugin

A Figma plugin that generates branded cover pages for your design files. Covers are 1920x1080 frames with a gradient background, Meta logo, project title, badge, contributors bar, and date.

## Features

- **Multi-page support** - Generate covers on multiple pages at once with a page checklist
- **Gradient presets** - Blue, Purple, Green, Dark, Sunset, Ocean, or a custom gradient
- **Badge labels** - Design, Research, Prototype, Engineering, or custom text
- **Contributors bar** - Optional bar listing design POCs
- **File thumbnail** - Automatically sets the cover as the file thumbnail
- **Auto-populated fields** - Team name is pre-filled from the file name

## Installation

1. Clone this repo
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
2. Run the plugin via **Plugins > Development > Cover Generator**
3. Configure gradient, team name, badge, and contributors
4. Select which pages should get covers
5. Click **Generate Cover**

## Development

The plugin consists of two files:

- `code.ts` - Plugin logic (compiled to `code.js`)
- `ui.html` - Plugin UI

Rebuild after changes:

```
npm run build
```
