# Flavortown Extension - Manifest V3 Compatibility Guide

## Overview

This extension has been fully updated to be compatible with Chrome's Manifest V3 (MV3) specification. All deprecated APIs and patterns have been removed, and best practices have been implemented.

## Key MV3 Compliance Updates

### 1. Manifest Configuration (`public/manifest.json`)

✅ **Manifest Version**: Set to version 3
✅ **Permissions Cleaned**:

- Removed: `webRequest`, `webRequestBlocking` (not available in MV3)
- Kept: `activeTab`, `storage`, `scripting` (MV3 compatible)

✅ **Content Security Policy**:

- Added proper CSP headers for extension pages
- `script-src 'self'` - Only extension's own scripts allowed
- `object-src 'self'` - Only extension's own objects allowed
- `style-src 'self' 'unsafe-inline'` - Allows styles (inline for styling)

✅ **Service Worker Configuration**:

- Background script is properly configured as a service worker
- Added `"type": "module"` for modern JavaScript module support

✅ **Content Script Security**:

- Set `"run_at": "document_start"` for earliest injection
- All content scripts validated for security

✅ **Popup Entry Point**:

- Changed from `popup.html` to `index.html` (built React app)
- Ensures React UI runs with proper bundling

### 2. Background Service Worker (`public/background.js`)

✅ **Removed Deprecated APIs**:

- Removed all `chrome.webRequest` API calls
- Removed `chrome.permissions.contains()` calls
- Removed header injection functionality

✅ **Proper Initialization**:

- Service worker initializes on `chrome.runtime.onInstalled`
- Proper data structure initialization for all features
- Service worker restart handling with `chrome.runtime.onStartup`

✅ **Message Passing**:

- All message listeners properly validate data
- Error handling for failed message sends
- Type-safe callbacks with null checks

✅ **Type Safety**:

```typescript
// Proper type checking for storage callbacks
if (message.points !== undefined) {
  chrome.storage.local.set({ points: message.points });
}
```

### 3. Content Script (`public/content.js`)

✅ **Error Handling**:

- All chrome API calls check for `chrome.runtime.lastError`
- Try-catch blocks around critical operations
- Graceful failure when APIs unavailable

✅ **Storage Safety**:

```javascript
// Proper null-checking for storage data
chrome.storage.local.get(["points"], (data) => {
  if (chrome.runtime.lastError) {
    console.error("Storage error:", chrome.runtime.lastError);
    return;
  }
  // SafeData[cess:
  const points = (data && data.points) || 0;
});
```

✅ **Message Listener**:

- Validates message object before accessing properties
- Proper error responses
- DOM ready state checking before transformation

✅ **No Dangerous APIs**:

- No use of `eval()` or `Function()` constructor
- No unsafe `innerHTML` with user input
- Safe DOM manipulation practices

### 4. Popup UI (`index.html`)

✅ **Content Security Policy**:

- Added CSP meta tag in HTML head
- Restricts scripts to extension's own code
- Allows inline styles (necessary for UI)

✅ **React Integration**:

- Built with Vite + React (TypeScript)
- All scripts bundled and minified
- No inline JavaScript in HTML source

✅ **Extension Popup Properties**:

- Width: 380px
- Min-height: 500px
- Proper viewport meta tags

### 5. TypeScript Configuration (`tsconfig.app.json`)

✅ **Web Worker Support**:

- Includes `"WebWorker"` in lib for service worker compatibility
- `"ES2020"` target for modern JavaScript
- Strict type checking enabled

✅ **Module System**:

- ESNext modules with bundler resolution
- Proper import handling for Chrome types

## Security Features

### Content Security Policy (CSP)

**Extension Pages**:

```
script-src 'self'        // Only extension scripts allowed
object-src 'self'       // Only extension objects allowed
style-src 'self'        // Only extension styles allowed
        'unsafe-inline' // Inline styles permitted (necessary for UI)
```

This prevents:

- Inline event handlers (onclick, onload, etc.)
- External script injection
- Malicious script execution

### API Usage Restrictions

✅ **Allowed in MV3**:

- `chrome.runtime.*` - Message passing, lifecycle
- `chrome.storage.local` - Local data storage
- `chrome.tabs.*` - Tab management
- `chrome.scripting.*` - Content script injection
- `chrome.permissions.*` - Query permissions

❌ **Removed from MV3**:

- `chrome.webRequest.*` - Use declarativeNetRequest instead
- Synchronous messaging
- Background pages (use service workers instead)

## Error Handling Best Practices

### Storage Operations

```javascript
chrome.storage.local.get(keys, (data) => {
  if (chrome.runtime.lastError) {
    console.error("Storage error:", chrome.runtime.lastError);
    return;
  }
  // Process data safely
});
```

### Message Passing

```javascript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    if (message && message.action === "updatePoints") {
      // Process message
      sendResponse({ received: true });
    }
  } catch (error) {
    sendResponse({ received: false, error: String(error) });
  }
  return true; // Keep channel open for async response
});
```

### Tab Communication

```javascript
chrome.tabs.sendMessage(tabId, message).catch((error) => {
  console.error("Tab communication error:", error);
  // Content script might not be injected yet
});
```

## Permissions Justification

| Permission        | Reason                                            | MV3 Status  |
| ----------------- | ------------------------------------------------- | ----------- |
| `activeTab`       | Access to user's active tab                       | ✅ Required |
| `storage`         | Persist user data (points, stats, achievements)   | ✅ Required |
| `scripting`       | Inject content scripts for webpage transformation | ✅ Required |
| `<all_urls>` host | Apply transformations to any webpage              | ✅ Required |

## Testing Checklist

- ✅ Manifest validates with Chrome extension linter
- ✅ No deprecated APIs used
- ✅ All permissions properly declared
- ✅ CSP headers properly configured
- ✅ Service worker starts correctly
- ✅ Content scripts inject safely
- ✅ Message passing works bidirectionally
- ✅ Storage operations handle errors
- ✅ No inline scripts in HTML
- ✅ TypeScript compilation succeeds
- ✅ Build produces valid extension package

## Installation Instructions

1. **Build the extension**:

   ```bash
   npm run build
   ```

2. **Load in Chrome**:
   - Open `chrome://extensions/`
   - Enable "Developer mode" (top-right)
   - Click "Load unpacked"
   - Select the `dist/` directory

3. **Verify Installation**:
   - Extension appears in the toolbar
   - Popup opens without errors
   - Content scripts inject on webpages
   - All features work as expected

## Troubleshooting

### Error: "Execution of script blocked by CSP"

- **Cause**: Inline scripts in HTML
- **Solution**: Move scripts to external files or use bundled assets

### Error: "chrome.webRequest is not available"

- **Cause**: Using deprecated MV2 API
- **Solution**: Already fixed - use storage-based approach

### Missing permissions warning

- **Cause**: APIs used without proper permission declaration
- **Solution**: All required permissions declared in manifest

### Service worker restart issues

- **Cause**: Long-lived listeners without proper cleanup
- **Solution**: Proper error handling and listener registration

## Performance Optimizations

✅ **Service Worker**:

- Efficient memory management
- Minimal listener overhead
- Quick startup time

✅ **Content Script**:

- Minimal DOM manipulation
- Efficient event handling
- Safe error recovery

✅ **Popup UI**:

- React component optimization
- Lazy loading of data
- Efficient state management

## Compliance Status

| Feature         | MV3 Compliant |
| --------------- | ------------- |
| Permissions     | ✅ Yes        |
| APIs            | ✅ Yes        |
| Security Policy | ✅ Yes        |
| Service Worker  | ✅ Yes        |
| Content Scripts | ✅ Yes        |
| Message Passing | ✅ Yes        |
| Storage         | ✅ Yes        |
| UI/Popup        | ✅ Yes        |

## Future Compatibility

This extension is ready for:

- ✅ Modern Chrome versions (latest)
- ✅ Edge browsers (Chromium-based)
- ✅ Brave browser
- ✅ Opera browser

Not compatible with:

- ❌ Older Chrome versions (pre-MV3 migration)
- ❌ Firefox (different extension format)

## References

- [Chrome Manifest V3 Documentation](https://developer.chrome.com/docs/extensions/mv3/)
- [Migration Guide from MV2 to MV3](https://developer.chrome.com/docs/extensions/migrating/)
- [Chrome Extension Security Guidelines](https://developer.chrome.com/docs/extensions/mv3/security/)
- [Service Workers API](https://developer.chrome.com/docs/extensions/mv3/service_workers/)
