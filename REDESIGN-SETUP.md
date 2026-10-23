# GC Exchange — redesign + PHP authentication starter

## What's included
- Responsive dark navy / electric-blue visual redesign layer in `redesign.css`.
- PHP 8.1+ authentication endpoint in `api/auth.php`: registration, login, logout, current-session check, password hashing, PDO prepared statements, HttpOnly/SameSite session cookies, CSRF token checks, generic invalid-login responses.
- MySQL schema in `database/schema.sql`.

## Important honest status
This repo began as a browser-only demo: simulated prices, localStorage wallet balances and mock social/QR login. The PHP API is a real authentication backend, but the existing trading/wallet/P2P screens are **not** connected to server-authoritative services by these files. Do not accept real deposits, withdrawals, trades or customer funds until those services, ledger, reconciliation, rate limits, monitoring, KYC/AML and security review are implemented. Google/Apple OAuth and email password reset are not configured here.

## Install
1. Host this project on a PHP 8.1+ server with HTTPS and MySQL 8+; PHP must serve the API at `/api/auth.php`.
2. Create a database and least-privilege DB account. Import `database/schema.sql` (or execute the table definition using an admin account).
3. Set environment variables `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS` in your hosting panel. Never commit real secrets.
4. Ensure PHP extensions `pdo_mysql`, `json`, and `mbstring` are enabled.
5. Serve the site and API from the same origin. HTTPS is required for secure session cookies in production.
6. Test `GET /api/auth.php?action=csrf`, then POST JSON to `?action=register` or `?action=login` with the returned `X-CSRF-Token` header.

## API examples
```sh
curl -i https://YOUR-DOMAIN/api/auth.php?action=csrf
```
Use the returned `csrf` value in `X-CSRF-Token` for POST requests. JSON body for register/login: `{"email":"you@example.com","password":"a-long-unique-password","displayName":"Your Name"}`.

## Before production
- Add IP/account-based rate limiting and alerting at the reverse proxy/application layer.
- Configure verified email, password-reset tokens with expiry, MFA, OAuth providers, session idle/absolute expiry, and audit logging.
- Add server-side authorization and a transactional double-entry ledger before enabling any wallet/trading actions.
- Keep secrets outside the web root; deny public access to SQL/config files; run PHP lint and automated tests on your hosting environment.
