# Solienne Management Portal Setup

## Prerequisites
- Node.js installed
- A Privy account (sign up at https://dashboard.privy.io/)
- Eden API access

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**

   Open `.env.local` and configure the following:

   **Privy (Wallet Authentication):**
   - Go to https://dashboard.privy.io/ and create a new app
   - Copy your App ID
   - Set `NEXT_PUBLIC_PRIVY_APP_ID`

   **Eden API:**
   - Get your Eden API key from https://eden.art
   - Find Solienne's Agent ID
   - Set `EDEN_API_KEY` and `SOLIENNE_AGENT_ID`

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open the portal**
   Navigate to http://localhost:3000

## Admin Wallets

Admin wallets are stored in `data/admins.json`. Current admins:
- Henry: `0x38E27a59d3cffB945aC8d41b7c398618354c08F6`
- Seth: `0xda3c325aB45b30AeB476B026FE6A777443cA04f3`
- Jmill: `0x123a3c28eB9e701C173D3A73412489f3554F3005`

To add more admins, edit `data/admins.json`.

## Features

- Wallet authentication using Privy
- Admin wallet verification
- Eden API integration (server-side proxy)
- Display of recent creations in a responsive grid
- Sleek dark theme with Helvetica typography
- Minimalist design inspired by Solienne.ai

## Architecture

**Eden API Integration:**
- Extensible `EdenApiClient` class in `lib/eden-api.ts`
- Server-side API proxy in `app/api/creations/route.ts`
- All Eden API requests go through Next.js API routes (never exposed to client)

**Adding New Eden Endpoints:**
1. Add method to `EdenApiClient` class in `lib/eden-api.ts`
2. Create corresponding Next.js API route in `app/api/`
3. Use the new endpoint in your client components

## Design

The portal follows the Solienne brand aesthetic:
- Black background with white text
- Helvetica font family
- High-contrast, minimalist interface
- Clean, gallery-style layout
