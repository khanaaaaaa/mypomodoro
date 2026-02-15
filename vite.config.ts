import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync } from 'fs'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'copy-extension-files',
      closeBundle() {
        const files = [
          { src: 'public/manifest.json', dest: 'dist/manifest.json' },
          { src: 'public/background.js', dest: 'dist/background.js' },
          { src: 'public/content.js', dest: 'dist/content.js' },
          { src: 'public/content.css', dest: 'dist/content.css' }
        ];
        
        const dirs = ['dist/icons', 'dist/images', 'dist/sounds'];
        dirs.forEach(dir => {
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
        });
        
        files.forEach(({ src, dest }) => {
          try {
            copyFileSync(src, dest);
            console.log(`Copied ${src} to ${dest}`);
          } catch (err) {
            console.error(`Failed to copy ${src}:`, err);
          }
        });
        
        // Copy icons
        try {
          ['icon16.png', 'icon48.png', 'icon128.png'].forEach(icon => {
            copyFileSync(`public/icons/${icon}`, `dist/icons/${icon}`);
          });
          console.log('Icons copied successfully');
        } catch (err) {
          console.error('Failed to copy icons:', err);
        }
      }
    }
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})
