@echo off
echo To create a valid CRX file:
echo.
echo 1. Open Chrome and go to chrome://extensions
echo 2. Enable "Developer mode"
echo 3. Click "Pack extension"
echo 4. Select the "dist" folder
echo 5. Leave private key empty (or use key.pem if it exists)
echo 6. Click "Pack Extension"
echo 7. Chrome will create dist.crx
echo 8. Rename dist.crx to pastas-pomodoro-v1.0.0.crx
echo.
echo OR use the dist folder directly:
echo 1. Go to chrome://extensions
echo 2. Enable "Developer mode"
echo 3. Click "Load unpacked"
echo 4. Select the "dist" folder
echo.
pause
