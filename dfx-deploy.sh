#!/bin/bash

# Optional: Clean and restart local replica
# dfx stop && dfx start --background --clean

echo "📦 Step 1: Generating WASM + Candid..."
./deploy.sh || { echo "❌ deploy.sh failed"; exit 1; }

echo "🚀 Step 2: Deploying to local canister..."
dfx deploy || { echo "❌ dfx deploy failed"; exit 1; }

echo "✅ Deployment completed successfully!"
