import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,                // Ensure your project runs on port 3000
    host: "0.0.0.0",           // Allow external access (important for EC2)
    strictPort: true,          // Ensure Vite only runs on the specified port
    allowedHosts: true  // Allow EC2 host
  }
})
