[React Frontend (served via ICP Canister)]
   │
   └── User clicks "Connect Google Calendar"
            ↓
   Frontend sends user to Google OAuth
            ↓
   Google redirects back with code
            ↓
   Frontend calls → ICP Canister Method: exchange_code(code)
            ↓
   Rust/Motoko Canister exchanges code for tokens (via HTTPS outcall)
            ↓
   Stores tokens in stable memory or encrypted state
            ↓
   Periodic trigger (via heartbeat / polling canister)
            ↓
   On new calendar event: call Discord Webhook via HTTPS


