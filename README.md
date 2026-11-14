# BotHosting

A private, single-administrator website for managing Discord bot servers through Pterodactyl. The web app runs as a Node.js process in its own Pterodactyl server; separate Pterodactyl servers run the hosted bots.

## Admin server provisioning

The admin page at `/dashboard/admin/servers/new` can provision a server through the Pterodactyl **Application API**. It loads locations, nodes, nests, eggs, and unassigned allocations from the panel, then creates a server with validated resource limits and the egg's default startup/Docker image. Optional egg environment values may be supplied as JSON overrides. This is intentionally restricted to the signed-in single admin.

Configure these server-side environment variables:

- `PTERODACTYL_PANEL_URL`: HTTPS panel URL.
- `PTERODACTYL_APPLICATION_API_KEY`: Application API key with only the permissions needed to view locations/nodes/nests/eggs/allocations and create servers. This is a highly privileged key. Keep it private and rotate it if exposed.
- `PTERODACTYL_CLIENT_API_KEY`: Client API key for monitoring and power controls.
- `PTERODACTYL_DEFAULT_USER_ID`: panel user ID that owns created servers. This should match the account for the Client API key so created servers can be managed.
- `PTERODACTYL_ALLOWED_SERVER_IDS`: explicit comma-separated server identifiers. `*` is supported only if the Client API key belongs to a dedicated account used exclusively for this app; it permits any server visible to that key. Prefer explicit IDs when possible.

Create separate panel keys; the Application key is never sent to the browser. Restrict panel users/keys and back up your panel. Server creation allocates the selected existing unassigned port allocation; it does not install bot source code or configure a Discord bot token for you.

## Website admin authentication

This version uses one administrator password, not customer accounts or public sign-up.

1. Set `SESSION_SECRET` to `openssl rand -base64 48`.
2. Generate a password hash locally with `npm run auth:hash -- "a-long-password-of-14-or-more-characters"` and put its `salt:hash` output in `ADMIN_PASSWORD_HASH`.
3. Set `NEXT_PUBLIC_APP_URL` to the exact public origin (HTTPS in production).

Never commit secrets or use `NEXT_PUBLIC_` for API keys. The admin app does not yet include customer accounts, per-tenant ownership, billing, subscriptions, rate limiting, or audit logging; do not offer it as a public hosting SaaS without implementing and reviewing those safeguards.

## Host the website on Pterodactyl

1. Create a separate website server with a maintained Node.js 20 egg and persistent storage.
2. Install this repo, run `npm install` and `npm run build`, then set the startup command to `npm start`.
3. Set `PORT` to the server's allocated port. `npm start` binds to `0.0.0.0` and uses `PORT` (fallback 3000).
4. Add the environment variables above in the server configuration. Put a TLS-terminating reverse proxy/domain in front of it and use HTTPS.

The bot servers are separate panel servers. Add the desired Node.js egg, provide the bot files, set required egg variables, and configure resource limits when creating them. The website itself is not a bot runtime.

## Local development

Requires Node.js 20+:

```sh
npm install
cp .env.example .env
npm run auth:hash -- "a-long-password-of-14-or-more-characters"
# Set SESSION_SECRET, ADMIN_PASSWORD_HASH, panel keys, and IDs in .env.
npm run dev
```

Open `/login`. For local HTTP, use `NEXT_PUBLIC_APP_URL=http://localhost:3000`.

## Security limitations

- Application API key is highly privileged. Use only a dedicated key with least privilege; never expose or commit it.
- Only signed-in admin routes perform provisioning, and create requests must have the configured origin.
- No public user registration, billing, customer server isolation, rate limiting, audit log, bot file uploads, or account recovery exists.
- The current `PTERODACTYL_ALLOWED_SERVER_IDS=*` mode is constrained by the servers visible to the Client API account, but is still broad. Use a dedicated panel account/key or explicit server IDs.
