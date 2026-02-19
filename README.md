# Pasta's Pomodoro

A Chrome extension that transforms web pages with themed styles and includes a Pomodoro timer for productivity.

[Try the Demo](https://github.com/khanaaaaaa/Pomodoro-x-Themes/releases)

## Features

- Theme Transformation: Apply Medieval or Kawaii themes to any webpage
- Mood Modifiers: Choose from Adventurous, Nostalgic, Mysterious, or Energetic moods
- Pomodoro Timer: Built-in 25-minute focus timer with draggable widget

## Installation

1. Download [pastas-pomodoro-v1.0.0.crx](https://github.com/khanaaaaaa/Pomodoro-x-Themes/releases/download/v1.0.0/pastas-pomodoro-v1.0.0.crx)
2. Open Chrome and go to `chrome://extensions`
3. Enable "Developer mode" (top right)
4. Drag and drop the .crx file onto the extensions page

## Usage

Click the extension icon to open the popup:

- Timer Tab: Start/pause/reset Pomodoro timer, pop out to page
- Transform Tab: Select theme and mood, apply to current page
- Random Adventure: Apply random theme combination
- Stop All Effects: Remove all transformations

## Development

```bash
npm install
npm run build
```

## Tech Stack

- React + TypeScript
- Vite
- Chrome Extension Manifest V3

## Project Structure

```
public/
  manifest.json
  background.js
  content.js
  content.css
src/
  popup.tsx
  popup.css
  stats.ts
dist/
```

## Themes

Medieval: Parchment background, serif fonts, brown color scheme

Kawaii: Pink background, rounded corners, cute anime aesthetic

## License

MIT
