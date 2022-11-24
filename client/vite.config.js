import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    assetsInclude: ["assets/*"],
    plugins: [react()],
    optimizeDeps: {
        // include: ["@mui/material", "@mui/icons-material"],
    },
    resolve: {
        // preserveSymlinks: true
    }
});