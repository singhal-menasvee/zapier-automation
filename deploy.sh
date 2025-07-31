#!/bin/bash
set -e

echo "🧹 Cleaning previous build..."
rm -rf target .dfx

echo "🔨 Building WASM..."
RUSTFLAGS="-C link-arg=-s" cargo build --release --target wasm32-unknown-unknown --package zapier-automation-backend

echo "📦 Generating Candid..."
cargo test --lib -- generate_did_file --nocapture
mv zapier_automation_backend.did src/zapier-automation-backend/

echo "🚀 Deploying..."
dfx deploy

echo "✅ Success!"