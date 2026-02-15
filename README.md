# Pasta's Pomodoro

A Chrome extension that transforms web pages with themed styles and includes a Pomodoro timer for productivity.

[Try the Demo](https://khanaaaaaa.github.io/Pomodoro-x-Themes/demo.html)

## Features

- Theme Transformation: Apply Medieval or Kawaii themes to any webpage
- Mood Modifiers: Choose from Adventurous, Nostalgic, Mysterious, or Energetic moods
- Pomodoro Timer: Built-in 25-minute focus timer with draggable widget

## Installation

1. Clone or download this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to create the `dist/` folder
4. Open Chrome and go to `chrome://extensions`
5. Enable "Developer mode" (top right)
6. Click "Load unpacked" and select the `dist/` folder

## Usage

Click the extension icon to open the popup:

- Timer Tab: Start/pause/reset Pomodoro timer, pop out to page
- Transform Tab: Select theme and mood, apply to current page
- Random Adventure: Apply random theme combination
- Stop All Effects: Remove all transformations

## Development

```bash
npm install          # Install dependencies
npm run build        # Build for production
```

## Tech Stack

- React + TypeScript
- Vite
- Chrome Extension Manifest V3

## Project Structure

```
├── public/
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   └── content.css
├── src/
│   ├── popup.tsx
│   ├── popup.css
│   └── stats.ts
└── dist/
```

## Themes

Medieval: Parchment background, serif fonts, brown color scheme
Kawaii: Pink background, rounded corners, cute anime aesthetic

## License

MIT
