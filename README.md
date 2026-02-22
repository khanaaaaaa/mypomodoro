# Pasta's Pomodoro

A Chrome extension that transforms web pages with themed styles and includes a Pomodoro timer for productivity.

[Try the Demo](https://github.com/khanaaaaaa/Pomodoro-x-Themes/releases)

## Update

Recent enhancements to the Pomodoro timer widget include improved visual design and expanded functionality. The timer text now displays in white across all themes for better readability. The medieval theme has been updated with lighter, more refined color tones. Dark mode styling has been removed to maintain consistent appearance across different system preferences.

New productivity features have been added to the timer widget. A session counter tracks completed focus periods throughout your work session. The timer now automatically alternates between 25-minute focus sessions and 5-minute break periods. A visual progress bar provides real-time feedback on remaining time. Users can skip between focus and break sessions using the new skip button. Audio notifications alert users when transitioning between modes.

## Features

- Theme Transformation: Apply Medieval or Kawaii themes to any webpage
- Mood Modifiers: Choose from Adventurous, Nostalgic, Mysterious, or Energetic moods
- Pomodoro Timer: Built-in 25-minute focus timer with draggable widget
- Session Tracking: Monitor completed focus sessions with automatic session counter
- Break Management: Automatic 5-minute breaks after each focus session
- Progress Visualization: Real-time progress bar showing time remaining
- Session Control: Skip between focus and break periods as needed
- Audio Notifications: Sound alerts when switching between modes

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
