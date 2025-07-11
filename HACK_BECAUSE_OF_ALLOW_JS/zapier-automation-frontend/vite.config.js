import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Read the DFX JSON configuration
const DFX_JSON = JSON.parse(readFileSync(resolve(__dirname, '../../dfx.json')).toString());
// Determine the network (local or IC)
const network = process.env.DFX_NETWORK || 'local';
// Function to get canister IDs
function getCanisterIds() {
    let canisterIds;
    try {
        // Try to read the local canister IDs file first
        canisterIds = JSON.parse(readFileSync(resolve(__dirname, '../../.dfx', network, 'canister_ids.json')).toString());
    }
    catch (e) {
        // If local file not found, try to read the root canister IDs file (for CI/other setups)
        canisterIds = JSON.parse(readFileSync(resolve(__dirname, '../../canister_ids.json')).toString());
    }
    return canisterIds;
}
const canisterIds = getCanisterIds();
// --- NEW LOGIC: Get DFX Webserver Port from dfx.json or default ---
let dfxWebserverPort = 8000; // Default DFX port
if (DFX_JSON.defaults && DFX_JSON.defaults.replica && DFX_JSON.defaults.replica.webserver && DFX_JSON.defaults.replica.webserver.port) {
    dfxWebserverPort = DFX_JSON.defaults.replica.webserver.port;
}
// --- END NEW LOGIC ---
// Define environment variables to be injected into the frontend
const env = {
    DFX_NETWORK: network,
    DFX_WEBSERVER_PORT: dfxWebserverPort, // Inject the DFX webserver port
};
// Populate env with canister IDs
for (const canisterName in canisterIds) {
    env[`CANISTER_ID_${canisterName.toUpperCase()}`] = canisterIds[canisterName][network];
}
// Log the environment variables for debugging
console.log('Vite Environment Variables:', env);
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // Define global variables that will be replaced during build
    define: {
        'process.env': JSON.stringify(env),
        global: 'globalThis', // Polyfill global for older libraries, now handled by Vite/Rollup directly
    },
    resolve: {
    // No specific aliases needed here
    },
    optimizeDeps: {
        esbuildOptions: {
            // No specific polyfill plugins needed here after removal of @esbuild-plugins/node-globals-polyfill
            define: {
                global: 'globalThis',
            },
        },
        // Explicitly include Font Awesome packages to ensure they are pre-bundled
        include: [
            '@fortawesome/react-fontawesome',
            '@fortawesome/fontawesome-svg-core',
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/free-brands-svg-icons',
        ],
    },
    build: {
        target: 'es2020', // Target modern JavaScript for better performance
        rollupOptions: {
        // No specific rollup plugins needed here
        },
    },
    server: {
        host: '0.0.0.0', // Allow access from outside localhost (e.g., other devices on network)
        proxy: {
            // Proxy DFX backend calls during development
            '/api': {
                target: `http://127.0.0.1:8000`,
                changeOrigin: true,
            },
        },
    },
});
