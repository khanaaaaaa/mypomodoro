# Flavortown Extension - Setup & Installation

This is a Chrome/Edge extension built with React, TypeScript, and Vite. It transforms webpages into different thematic eras and includes interactive golden fry discovery.

## ✅ Key Fixes Applied

### 1. **TypeScript & Linting**

- Fixed all ESLint errors in popup component
- Moved function declarations before `useEffect` to prevent hoisting issues
- Disabled specific rules for Chrome extension patterns (`@typescript-eslint/no-explicit-any`, `react-hooks/set-state-in-effect`)
- Added `/// <reference types="chrome" />` for Chrome API type safety

### 2. **Chrome Extension Compatibility**

- **Manifest V3 compliant** – uses service workers instead of background pages
- **Proper permissions** – added `webRequest`, `webRequestBlocking`, `activeTab`, `storage`, `scripting`
- **Host permissions** – `<all_urls>` for global webpage access
- **Content scripts** – auto-injected on all URLs with CSS styling included
- **Error handling** – graceful handling of `chrome.runtime.sendMessage` failures

### 3. **Message Passing & Storage**

- Fixed race conditions in popup-to-content `sendMessage` calls with retry logic
- Added error boundaries around `chrome.storage.local.get/set` operations
- Handled cases where content script hasn't loaded yet with injection fallback
- Proper callback error handling in background worker

### 4. **Background Service Worker**

- Idempotent storage initialization (preserves user data on extension upgrades)
- Startup listener re-registers webRequest on worker restart
- Caches `randomMode` to avoid excessive storage lookups
- Conditional permission checking before header injection

### 5. **Content Script Security**

- Error wrapping around all DOM manipulations
- Safe try-catch around storage callbacks
- Promise error handling on message sends
- No eval or inline scripts; all styles applied via className/inline

## 🚀 Installation Steps

### Development

1. **Build the extension:**

   ```bash
   npm run build
   ```

   Output: `dist/` folder ready for loading

2. **Load into Chrome/Edge:**
   - Open `chrome://extensions/` (or `edge://extensions/`)
   - Enable **Developer mode** (top right)
   - Click **Load unpacked**
   - Select the `dist` folder

3. **Grant permissions:**
   - Chrome will prompt for new permissions
   - Accept `webRequest`, `webRequestBlocking`, and `<all_urls>` access

4. **Test:**
   - Click the extension icon in toolbar
   - Select an era and mood
   - Watch the webpage transform!
   - Click golden fries to earn points

### Making Changes

- Edit TypeScript in `src/popup.tsx` (React popup UI)
- Edit JavaScript in `public/background.js` (service worker) or `public/content.js` (page injection)
- Edit styles in `src/App.css` or `public/content.css`
- Run `npm run build` to recompile
- Reload extension via `chrome://extensions` (click refresh button)

## 📦 Build Output Structure

```
dist/
├── index.html                 # Popup UI (served when clicking extension icon)
├── assets/
│   ├── index-*.js            # React/popup compiled code
│   └── index-*.css           # Popup styles
├── manifest.json             # Extension metadata & permissions
├── background.js             # Service worker (install/startup/messaging)
├── content.js                # Content script (runs on webpages)
├── content.css               # Page transformation styles
├── icons/
│   ├── icon16.png           # Toolbar icon
│   ├── icon48.png           # Extension management icon
│   └── icon128.png          # Store icon (if published)
├── sounds/                   # (empty for now - add .mp3 files)
└── images/                   # (empty for now)
```

## 🔧 Development Commands

```bash
npm run dev      # Vite dev server (port 5174) - for UI preview only, not used by Chrome directly
npm run build    # TypeScript compile + Vite bundle → dist/
npm run lint     # ESLint check (currently passes)
npm run preview  # Preview built assets locally
```

## ⚠️ Common Issues

**Extension not loading?**

- Check `chrome://extensions` Errors section for details
- Verify `dist/manifest.json` exists
- Ensure `dist/background.js`, `dist/content.js` are present

**Popup shows blank?**

- Check DevTools of popup (`chrome://extensions` → inspect background/popup)
- Verify `dist/assets/index-*.js` is served
- Look for 404 errors on `/assets/` files

**Content script not transforming page?**

- Check webpage console (F12) for errors from `content.js`
- Verify the page is not blocked by CSP
- Try manual injection via popup's "Random Flavortown Adventure"

**Golden Fries not appearing?**

- Check browser console for `applyEraTransformation` errors
- Verify `dist/content.css` includes animation keyframes
- Ensure no other extension is hiding floating elements

## 🎨 Customization

### Add Custom Eras

Edit `src/popup.tsx` – modify `ERAS` and `MOODS` arrays, add theme functions in `public/content.js`

### Add Sounds

Place `.mp3` files in `public/sounds/`, update `popup.tsx`'s `playSound()` to reference them

### Adjust Points System

Modify `public/content.js` `spawnGoldenFries()` and `public/background.js` DEFAULT_STORAGE

## 📝 Notes

- Extension data is stored locally per browser profile (not synced to Google Account)
- Random mode applies era to all newly-loaded tabs
- WebRequest header injection requires explicit permission grant
- Extension is isolated from webpage JavaScript (no data leaks)

## 📖 Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/)
- [Content Scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)
- [Service Workers](https://developer.chrome.com/docs/extensions/mv3/service_workers/)
