import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../server/.env') });

export default defineConfig({
  plugins: [vue()],
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    'process.env.VITE_API_PORT': JSON.stringify(process.env.VITE_API_PORT)
  },
})
