# BotHosting

A private, single-administrator website for managing Discord bot servers that run on Pterodactyl. The website itself is a separate Node.js app; Pterodactyl/Wings hosts the actual bot server instances. This project does **not** make the website's own container a bot runtime.

## What works

- Password-protected administrator login with signed, HTTP-only session cookie.
- Pterodactyl Client API integration to list allowlisted servers, view CPU/memory/disk/status, and send start/stop/restart commands.
- Server-side credentials only; the panel API key is never sent to the browser.
- HTTPS enforcement for remote panel URLs; origin checking on power actions.
- Designed to run as a Node.js process in its own Pterodactyl server/container.

This is a self-hosted admin MVP, **not** a multi-user commercial hosting SaaS. It deliberately does not create/delete panel servers, accept bot source uploads, expose file manager/console/websocket access, process payments, or support customer accounts. Those features need tenant identity/authorization, resource quotas, abuse controls, billing and operational auditing before safely exposing them to users.

## Host the website on Pterodactyl

1. In Pterodactyl, create a separate server for this website using a maintained Node.js 20 egg. Do not run this app inside one of the customer bot servers. Give the website server persistent disk and expose its allocated port.
2. Install this repository into that server using the egg's Git clone/install feature or upload the source. Run `npm install` and `npm run build` during installation. Set the server startup command to `npm start` (or `npm run start:pterodactyl` if the egg does not run a build/install step separately).
3. Set the egg's `PORT` to its allocated port. `npm start` binds to `0.0.0.0` and uses `PORT` (fallback 3000). Set `NEXT_PUBLIC_APP_URL` to the public HTTPS URL serving this website.
4. Configure the environment variables below in the Pterodactyl server's startup variables. Never commit secrets or put them in a `NEXT_PUBLIC_*` variable.
5. Put a TLS-terminating reverse proxy/domain in front of this website. The panel URL must also be HTTPS when remote.

### App environment

- `SESSION_SECRET`: generate with `openssl rand -base64 48`; keep stable across restarts.
- `ADMIN_PASSWORD_HASH`: generate locally with `npm run auth:hash -- "a-long-password-of-14-or-more-characters"`, then copy the printed `salt:hash` value to the server environment. This app has a single admin account and no public registration.
- `PTERODACTYL_PANEL_URL`: panel base URL, e.g. `https://panel.example.com`.
- `PTERODACTYL_CLIENT_API_KEY`: a Client API key belonging to the account that owns the bot servers. Create it with only the client permissions needed for list/read resources and power controls. Never use an Application API key in this app.
- `PTERODACTYL_ALLOWED_SERVER_IDS`: comma-separated short server identifiers from the panel. Only these IDs can be operated through the dashboard; the key's other servers are hidden.
- `NEXT_PUBLIC_APP_URL`: exact public website origin, e.g. `https://hosting.example.com` (used to validate power action origins).
- `PORT`: Pterodactyl allocation port.

The Pterodactyl bot servers must be created separately in the panel, with a Node.js egg, resource limits, and the bot files/configuration set up there. Add only their short identifiers to the allowlist. The dashboard can then monitor and power-manage those servers.

## Local development

Use Node.js 20+:

```sh
npm install
cp .env.example .env
npm run auth:hash -- "a-long-password-of-14-or-more-characters"
# Put the generated hash and a random SESSION_SECRET in .env.
npm run dev
```

Open `http://localhost:3000/login`. For local HTTP, set `NEXT_PUBLIC_APP_URL=http://localhost:3000`. To test Pterodactyl calls, configure the panel URL, Client API key, and allowed server identifiers.

## Security and production limitations

- This app is an admin dashboard; do not provide its admin password/session to customers.
- Do not expose panel API keys to browser code, bot containers, logs, source control, or image build args.
- Protect the website with HTTPS, keep Node.js and dependencies current, back up Pterodactyl data, and restrict outbound access where practical.
- There is no signup, per-customer ownership, tenant isolation, billing, rate limiting, audit log, automated provisioning, source upload, or account recovery. Add/review those before offering third-party hosting.
- The API key should be dedicated to the panel account whose servers are being managed; the allowlist is an additional guard, not a substitute for least privilege.
