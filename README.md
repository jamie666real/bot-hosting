# BotHosting

BotHosting is a Next.js dashboard starter with a server-side integration for controlling existing Discord-bot servers in a Pterodactyl panel. It is not a replacement for Pterodactyl: Pterodactyl/Wings runs the bot containers, while this app provides a small authenticated API bridge.

## Pterodactyl integration

The integration uses a **Pterodactyl Client API key**, which can only access the panel account's servers. It does not use an Application API key and does not create servers or manage panel users. Create each bot server in Pterodactyl first, install the bot files there, and add its server identifier (the short identifier shown in the panel) to the allowlist. The allowlist is important: requests can only control explicitly listed servers.

1. Set up Pterodactyl Panel and Wings and create a server for each bot with a suitable Node.js egg and resource limits.
2. In the panel, create a Client API key with the minimum permissions needed to list servers, read resources, and send power signals. Do not put this key in browser code or expose it to bot containers.
3. Configure the app environment:

```env
PTERODACTYL_PANEL_URL=https://panel.example.com
PTERODACTYL_CLIENT_API_KEY=ptlc_your_client_api_key
PTERODACTYL_ALLOWED_SERVER_IDS=abc12345,def67890
BOT_HOSTING_API_TOKEN=use-a-long-random-secret-at-least-32-bytes
```

Generate the app API token with `openssl rand -base64 48`. Keep it server-side and send it only from trusted admin tooling using `Authorization: Bearer <BOT_HOSTING_API_TOKEN>`. Never add either API key to a `NEXT_PUBLIC_*` variable or commit real credentials. Use HTTPS for the panel and for the deployed app. The integration rejects non-HTTPS panel URLs except localhost.

### Available endpoints

All endpoints below require the app API bearer token. Server `id` is the Pterodactyl short identifier, and is checked against the configured allowlist.

- `GET /api/pterodactyl/servers` — list servers available to the Pterodactyl API key. Keep the Pterodactyl key restricted to the intended panel account.
- `GET /api/pterodactyl/servers/{id}/resources` — read server state and resource usage.
- `POST /api/pterodactyl/servers/{id}/power` with JSON `{"signal":"start"}`, `{"signal":"stop"}`, or `{"signal":"restart"}` — send a power action.

Example:

```sh
curl -X POST 'https://your-app.example.com/api/pterodactyl/servers/abc12345/power' \
  -H 'Authorization: Bearer YOUR_BOT_HOSTING_API_TOKEN' \
  -H 'Content-Type: application/json' \
  --data '{"signal":"restart"}'
```

The app never returns the Pterodactyl API key. Avoid sharing the app bearer token with end users; this starter does not yet include account login, per-user ownership checks, billing enforcement, bot file uploads, or automated server provisioning. Do not expose this API publicly until you add user authentication/authorization, rate limiting, and audit logging. Pterodactyl server file upload and console access are intentionally not exposed by these routes.

## Run the dashboard

1. Install Node.js 20+ and npm.
2. Install dependencies: `npm install`.
3. Copy `.env.example` to `.env` and set a strong `BOT_HOSTING_API_TOKEN` and the Pterodactyl settings if using the integration.
4. Run `npm run dev`, then open `http://localhost:3000`.

The dashboard currently contains demo/sample data. The Pterodactyl API routes are real, but the demo UI and login form are not an authentication system. Do not use the dashboard as a production SaaS until identity, tenant isolation, billing, and persistence have been implemented and reviewed.

## Deploy the web app

Deploy the Next.js app to a Node.js 20+ host that can make outbound HTTPS requests to your panel. Set the environment variables in the hosting provider's secret manager. Do not put the web app container inside a bot's Pterodactyl server; run the panel integration as a separate trusted service. The included Dockerfile can build the web app; configure its runtime secrets using your deployment platform rather than baking secrets into the image.

## Stack

- Next.js 14 / React 18 / TypeScript
- Tailwind CSS
- Pterodactyl Client API integration
- Prisma schema retained for future persistence (the current demo routes do not yet use it)
