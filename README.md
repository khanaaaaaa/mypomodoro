# Pasta's Pomodoro

A Chrome extension that transforms web pages with themed styles and includes a Pomodoro timer for productivity.


## Update

Recent enhancements to the Pomodoro timer widget include improved visual design and expanded functionality. The timer text now displays in white across all themes for better readability. The medieval theme has been updated with lighter, more refined color tones. Dark mode styling has been removed to maintain consistent appearance across different system preferences.

New productivity features have been added to the timer widget. A session counter tracks completed focus periods throughout your work session. The timer now automatically alternates between 25-minute focus sessions and 5-minute break periods. A visual progress bar provides real-time feedback on remaining time. Users can skip between focus and break sessions using the new skip button. Audio notifications alert users when transitioning between modes.

## Features

- Theme Transformation: Apply Medieval or Kawaii themes to any webpage
- Mood Modifiers: Choose from Adventurous, Nostalgic, Mysterious, or Energetic moods
- Pomodoro Timer: Built-in 25-minute focus timer with draggable widget (Press Ctrl + Shift +R if the pop out feature is not working properly.)
- Session Tracking: Monitor completed focus sessions with automatic session counter
- Break Management: Automatic 5-minute breaks after each focus session
- Progress Visualization: Real-time progress bar showing time remaining
- Session Control: Skip between focus and break periods as needed

## Installation

1. Download [pastas-pomodoro-v1.0.0.crx](https://github.com/khanaaaaaa/mypomodoro/releases/download/v1.0.0/pastas-pomodoro-v1.0.0.crx)
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

### Medieval Feast
Transforms webpages into ancient parchment scrolls with a royal aesthetic.
- Background: Warm parchment color with subtle texture pattern
- Typography: Crimson Text and Garamond serif fonts
- Color Scheme: Rich browns and warm earth tones
- Special Effects: Sword emojis on headings, medieval vocabulary injections
- Widget Style: Lighter tan gradient header with refined brown buttons

### Kawaii Dreamscape
Brings cute anime aesthetics with playful pink tones to any webpage.
- Background: Light pink with decorative dot patterns
- Typography: Comic Sans MS with emoji support
- Color Scheme: Hot pink, light pink, and purple accents
- Special Effects: Sparkle emojis on headings, random cute emoji injections
- Widget Style: Pink gradient header with vibrant pink buttons
- Visual Features: Rounded corners on all buttons

### Nature Forest
Creates a calming green environment inspired by natural landscapes.
- Background: Soft green with subtle leaf patterns
- Typography: Georgia serif fonts
- Color Scheme: Various shades of green from light to forest
- Special Effects: Leaf emojis on headings, nature-themed emoji injections
- Widget Style: Green gradient header with nature-toned buttons

## Mood Modifiers

Mood modifiers alter the typography and font styling across all themes:

### Adventurous
- Font: Impact and Arial Black
- Style: Bold weight for dramatic emphasis

### Nostalgic
- Font: Georgia and Times New Roman
- Style: Italic formatting for classic feel

### Mysterious
- Font: Garamond and Palatino
- Style: Increased letter spacing for enigmatic appearance

### Energetic
- Font: Verdana and Trebuchet MS
- Style: Semi-bold weight for dynamic presence

## License

MIT
