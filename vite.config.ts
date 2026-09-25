import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Single-file build: one index.html that runs on Vercel, any static host, or opened directly.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
});
