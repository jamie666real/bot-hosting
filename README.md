# BotHosting

A private, single- or multi-administrator website for managing Discord bot servers through Pterodactyl. The website runs as a Node.js process in its own Pterodactyl server; separate panel servers run the hosted bots.

## Add admin accounts from the Pterodactyl Console

Start the website with the repository startup command `npm start`. The panel runner keeps the Next.js website running and listens for these commands in the website server's **Console**:

```text
help
admin:add admin@example.com a-long-unique-password
admin:list
```

`admin:add` requires a password of at least 14 characters. It stores a salted scrypt hash in the SQLite database; the password is not stored as plaintext. Sign in at `/login` using the email and password. Only give Pterodactyl console access for the website server to people you trust as website administrators: anyone with console access can run admin-management commands.

**Console caution:** Pterodactyl consoles may retain command input/output in logs or browser history. Use a unique password, avoid reusing other credentials, and restrict console access. For safer initial setup or account removal, stop the website server and use the Pterodactyl Startup command temporarily:

```sh
npm run admin:add -- admin@example.com 'a-long-unique-password'
npm start
```

Restore the startup command to `npm start` after one-off commands. The app database must be on persistent storage. Remove another admin while the app is stopped with `npm run admin:remove -- admin@example.com`; it refuses to remove the final account. Back up the website server's `prisma` database file before upgrades.

## Pterodactyl provisioning integration

The admin page at `/dashboard/admin/servers/new` provisions servers through the panel Application API. Configure:

- `PTERODACTYL_PANEL_URL`: HTTPS panel URL.
- `PTERODACTYL_APPLICATION_API_KEY`: highly privileged Application API key with the minimum permissions to list locations/nodes/nests/eggs/allocations and create servers. Keep private.
- `PTERODACTYL_CLIENT_API_KEY`: Client API key for monitoring and power controls.
- `PTERODACTYL_DEFAULT_USER_ID`: panel user ID that owns provisioned servers.
- `PTERODACTYL_ALLOWED_SERVER_IDS`: comma-separated allowed IDs. `*` only for a dedicated client API account used exclusively by this app.
- `SESSION_SECRET`: at least 32 random characters; generate with `openssl rand -base64 48`.
- `NEXT_PUBLIC_APP_URL`: exact public website origin, HTTPS in production.
- `DATABASE_URL`: persistent SQLite path, default `file:./dev.db` (Prisma resolves it relative to the schema file in `prisma/`).

The Application key is never sent to the browser. The server form loads panel locations/nodes/nests/eggs/available allocations and creates with validated limits. It does not upload source code; install bot files/configuration using the panel separately.

## Host this website on Pterodactyl

1. Create a separate website server with a maintained Node.js 20 egg and persistent storage.
2. Install repository dependencies with `npm install`, build with `npm run build`, and set the startup command to `npm start`.
3. Set `PORT` to the server's allocation. The runner binds the website to `0.0.0.0` and `PORT` (fallback 3000), while also accepting the admin commands above from the panel console.
4. Configure all secret environment variables in the server startup settings. Use a TLS-terminating reverse proxy/domain and HTTPS.

## Security and production limitations

- Admin passwords are scrypt-hashed and sessions are signed, HTTP-only cookies.
- Admin console commands can create privileged website accounts; treat Pterodactyl console permissions as website admin permissions.
- Console command lines may be stored in panel logs. Use unique passwords, restrict panel permissions, and avoid reusing credentials.
- Application API keys are powerful. Use least privilege, dedicated keys, and rotate exposed keys.
- This project has no public sign-up, customer accounts, billing, rate limiting, or audit trail. It is an admin control panel, not yet a multi-tenant hosting SaaS.
