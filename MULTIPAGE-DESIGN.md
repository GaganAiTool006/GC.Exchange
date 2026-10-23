# GC.Exchange — separate-page frontend redesign

This is a **frontend-only design preview** inspired by the supplied reference screenshot. The original all-screens board has been replaced by a real homepage with independent HTML pages.

## Pages
- `index.html` — marketing homepage / entry point
- `login.html` — separate login form design
- `signup.html` — separate registration form design
- `dashboard.html` — account dashboard, stats, market overview and quick action panels
- `markets.html` — market table and search
- `trade.html` — chart, order book and order-preview UI
- `wallet.html` — asset overview and deposit/withdraw/transfer preview modals
- `p2p.html` — offers, payment methods and create-ad preview
- `history.html` — sample order history
- `profile.html` — profile editor visual
- `verification.html` — KYC journey mockup
- `security.html` — password, session and security-preference UI
- `2fa.html` — authenticator setup mockup
- `settings.html` — appearance and notification preferences

## Shared frontend files
- `multi-page.css` — shared styles, components and mobile breakpoints
- `multi-page.js` — browser-only UI behavior (menu, tabs, modal layouts, toasts, search filtering, theme toggle)
- `assets/reference-login-art.webp` — coin illustration cropped from the user-provided reference
- `assets/reference-sidebar-art.webp` — phone/coins artwork cropped from the user-provided reference

## View locally
Download the repository and open it in VS Code. Use the Live Server extension to serve `index.html`, then navigate between pages through the header/sidebar. Serving with a local web server is recommended for consistent relative asset loading.

## Important scope
There is **no working user login, database, PHP integration, API connection, or transaction processing** in these pages. Login/signup/forms are design-only and prevent submission. Market prices and balances are illustrative data. Deposit, withdrawal, P2P and trade controls are visual previews only; no data or funds are sent or saved.
