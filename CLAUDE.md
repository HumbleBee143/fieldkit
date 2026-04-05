# Field-Kit

A suite of browser-based tools for IT technicians doing real hands-on work.

**Domain:** field-kit.co.uk
**Hosting:** Cloudflare Pages — auto-deploys from GitHub on push to main
**Repo:** HumbleBee143/fieldkit

---

## Tech Stack

- Pure HTML/CSS/JS — no framework, no build step, no bundler
- Each tool is a single self-contained `index.html` file
- Nothing leaves the browser — all processing is client-side only
- Cloudflare Pages serves the `public/` directory as the site root

---

## Repo Structure

```
public/
├── index.html              # Homepage — links to all tools
├── favicon.svg
├── site-card/
│   └── index.html          # Site Summary Card Generator (live)
├── patch-panel/
│   └── index.html          # Patch Panel Port Mapper (live)
└── incident-report/
    └── index.html          # Incident Report Generator (live)
```

Each tool lives at its own path: `field-kit.co.uk/site-card`, `/patch-panel`, `/incident-report`

---

## Live Tools (3)

| Tool | Path | Status |
|---|---|---|
| Site Summary Card Generator | `/site-card` | Live v1 |
| Patch Panel Port Mapper | `/patch-panel` | Live v1 |
| Incident Report Generator | `/incident-report` | Live v1 |

---

## Build Conventions

- One tool = one folder in `public/` with a single `index.html`
- All styles inline or in a `<style>` block in the HTML file
- All JS inline or in a `<script>` block — no external JS files
- No npm dependencies for tools (the `patch-panel/node_modules` is leftover test scaffolding — ignore it)
- Print/PDF export via `window.print()` with a `@media print` stylesheet
- Watermark present on all free-tier output — do not remove this

---

## Branding

- Brand name: **Field-Kit**
- Tagline: Tools for techs in the field.
- Tone: Sharp, no-nonsense, functional — not corporate
- Colour: dark background with clean contrast — check existing tools for reference

---

## Monetisation

- **Free tier:** Field-Kit watermark on output, Google AdSense below tool
- **Pro unlock:** One-time ~£6-8 via Gumroad licence key, stored in localStorage — removes watermark, adds logo upload
- Watermark is already baked into every tool

---

## Next Tool to Build

**IP/VLAN Planner** (`/ip-vlan`) — medium difficulty

Define a network (e.g. `192.168.0.0/16`), add VLANs with names and purposes, visually allocates subnets, shows used/free space, conflict detection. Export to PDF. Pure JS, no backend.

After that (in order):
1. Job Sheet Generator — easy
2. Technician Visit Log — easy
3. Change Request / Maintenance Window Generator — easy
4. Hardware Decommission Record Generator — easy

---

## Deployment

Push to main branch — Cloudflare Pages auto-deploys. No build command needed. Publish directory: `public`.
