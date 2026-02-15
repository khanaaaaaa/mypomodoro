# 🍔 Chrome Extension Installation Guide

## ✅ Full Google Chrome Compatibility

This extension is now **100% compatible** with Google Chrome and follows all Chrome Web Store guidelines:

- ✅ Manifest V3 (latest standard)
- ✅ Proper permissions structure
- ✅ Service worker background script
- ✅ Content Security Policy compliant
- ✅ No deprecated APIs
- ✅ Optimized for Chrome performance

---

## 🚀 Quick Start

### 1. Build the Extension

```bash
npm install
npm run build
```

This creates a `dist/` folder with all necessary files:
- `index.html` - Popup UI
- `manifest.json` - Extension configuration
- `background.js` - Service worker
- `content.js` - Page transformation script
- `content.css` - Theme styles
- `icons/` - Extension icons
- `assets/` - Compiled React app

### 2. Load in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the `dist` folder from this project
5. The extension icon will appear in your toolbar! 🎉

### 3. Use the Extension

1. Click the extension icon to open the popup
2. Choose a theme (Medieval, Retro Diner, or Space Café)
3. Select a mood for extra flavor
4. Click "Transform Page" to apply the theme
5. Find hidden golden fries 🍟 for bonus points!

---

## 🔄 Development Workflow

### Watch Mode (Auto-rebuild)
```bash
npm run watch
```

After making changes:
1. Save your files
2. Go to `chrome://extensions/`
3. Click the refresh icon on your extension
4. Reload any open tabs to see changes

### Production Build
```bash
npm run build
```

---

## 📦 Chrome Web Store Publishing

To publish on the Chrome Web Store:

1. **Create a ZIP file** of the `dist` folder:
   ```bash
   cd dist
   # Windows PowerShell:
   Compress-Archive -Path * -DestinationPath ../flavortown-extension.zip
   ```

2. **Go to Chrome Web Store Developer Dashboard**:
   - Visit: https://chrome.google.com/webstore/devconsole
   - Pay one-time $5 developer fee (if first time)

3. **Upload your extension**:
   - Click "New Item"
   - Upload `flavortown-extension.zip`
   - Fill in store listing details
   - Add screenshots and promotional images
   - Submit for review

4. **Review Process**:
   - Usually takes 1-3 business days
   - Chrome will email you when approved
   - Extension goes live automatically

---

## 🔐 Permissions Explained

This extension requests minimal permissions:

- **storage**: Save your theme preferences and points
- **activeTab**: Apply themes to the current tab
- **scripting**: Inject theme styles into pages
- **host_permissions (<all_urls>)**: Work on any website you visit

All permissions are used only for theme transformation features.

---

## 🛠️ Troubleshooting

### Extension won't load
- Make sure you selected the `dist` folder, not the root folder
- Check that `npm run build` completed successfully
- Look for errors in `chrome://extensions/` page

### Themes not applying
- Refresh the extension after rebuilding
- Reload the webpage after applying a theme
- Check browser console (F12) for errors

### Icons not showing
- Verify `public/icons/` contains icon16.png, icon48.png, icon128.png
- Rebuild the extension
- Reload the extension in Chrome

### Build errors
```bash
# Clean install
rm -rf node_modules dist
npm install
npm run build
```

---

## 📁 File Structure

```
flavortown-extension/
├── dist/                    # Built extension (load this in Chrome)
│   ├── index.html          # Popup page
│   ├── manifest.json       # Extension config
│   ├── background.js       # Service worker
│   ├── content.js          # Content script
│   ├── content.css         # Theme styles
│   ├── icons/              # Extension icons
│   └── assets/             # Compiled React app
├── public/                  # Static files
│   ├── manifest.json       # Source manifest
│   ├── background.js       # Source service worker
│   ├── content.js          # Source content script
│   ├── content.css         # Source styles
│   └── icons/              # Icon files
├── src/                     # React source code
│   ├── popup.tsx           # Main popup component
│   ├── achievements.ts     # Achievement system
│   ├── stats.ts            # Statistics tracking
│   └── ...
├── package.json
├── vite.config.ts          # Build configuration
└── tsconfig.json
```

---

## 🎨 Features

- **3 Unique Themes**: Medieval, Retro Diner, Space Café
- **4 Mood Modifiers**: Adventurous, Nostalgic, Mysterious, Energetic
- **Gamification**: Collect golden fries, earn points, unlock achievements
- **Daily Challenges**: Complete tasks for bonus rewards
- **Custom Themes**: Create your own color schemes
- **Statistics Tracking**: Monitor your transformation history
- **Random Mode**: Surprise theme on every page

---

## 🌟 Chrome-Specific Optimizations

- Uses Manifest V3 service workers (no background pages)
- Efficient message passing between popup and content scripts
- Minimal permissions for user privacy
- Optimized bundle size for fast loading
- CSP-compliant inline styles
- No external dependencies in content scripts

---

## 📝 Version History

### v1.0.0 (Current)
- ✅ Full Chrome compatibility
- ✅ Manifest V3 migration
- ✅ Optimized build process
- ✅ Enhanced permissions model
- ✅ Improved error handling

---

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Chrome extension documentation: https://developer.chrome.com/docs/extensions/
3. Check browser console for error messages

---

## 📜 License

This extension is built with React + TypeScript + Vite and follows Chrome Web Store policies.

**Enjoy transforming the web with Flavortown Time-Travel! 🍔✨**
