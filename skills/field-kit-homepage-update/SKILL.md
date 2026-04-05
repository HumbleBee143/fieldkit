---
name: field-kit-homepage-update
description: >
  Use this skill when adding a new live tool to the Field-Kit homepage.
  Defines the exact card format, badge types, section groups, and how to
  convert a coming-soon card to a live card in public/index.html.
---

# Field-Kit Homepage Update

The homepage is at `/home/mh/projects/fieldkit/public/index.html`.

---

## Card Format

### Live tool card (clickable link)

```html
<a href="/tool-slug" class="tool-card">
  <span class="tool-badge live">Live</span>
  <span class="tool-icon">EMOJI</span>
  <div class="tool-name">Tool Name</div>
  <div class="tool-desc">One sentence describing what it does.</div>
</a>
```

### Coming soon card (not clickable)

```html
<div class="tool-card coming-soon">
  <span class="tool-badge soon">Coming soon</span>
  <span class="tool-icon">EMOJI</span>
  <div class="tool-name">Tool Name</div>
  <div class="tool-desc">One sentence describing what it does.</div>
</div>
```

---

## Promoting a Tool from Coming Soon to Live

Find the existing `coming-soon` card for the tool and replace it with a live card.

**Before:**
```html
<div class="tool-card coming-soon">
  <span class="tool-badge soon">Coming soon</span>
  <span class="tool-icon">📝</span>
  <div class="tool-name">Job Sheet Generator</div>
  <div class="tool-desc">Structured job sheet for a site visit — work done, parts used, time spent, sign-off.</div>
</div>
```

**After:**
```html
<a href="/job-sheet" class="tool-card">
  <span class="tool-badge live">Live</span>
  <span class="tool-icon">📝</span>
  <div class="tool-name">Job Sheet Generator</div>
  <div class="tool-desc">Structured job sheet for a site visit — work done, parts used, time spent, sign-off.</div>
</a>
```

Changes:
- `<div>` becomes `<a href="/tool-slug">`
- `coming-soon` class is removed
- Badge changes from `soon` to `live` and text from `Coming soon` to `Live`
- Closing `</div>` becomes `</a>`

---

## Section Groups

Tools are organised into 4 groups. Add new tools to the correct group:

| Group | Section header | Tools |
|---|---|---|
| 01 | After the visit | Site Summary Card, Incident Report, Job Sheet, Change Request, Hardware Decommission, Client Onboarding Pack |
| 02 | On site | Patch Panel Port Mapper, Switch Port Label Sheet, Technician Visit Log, Credentials Sheet |
| 03 | Before the visit | IP/VLAN Planner, Network Site Survey Report, Bulk SSL Expiry Checker |
| 04 | AI-powered | Rack Photo to Doc |

---

## Tool Slugs and Icons

| Tool | Slug | Emoji |
|---|---|---|
| Site Summary Card | `/site-card` | 🗂️ |
| Incident Report Generator | `/incident-report` | 📋 |
| Job Sheet Generator | `/job-sheet` | 📝 |
| Change Request Generator | `/change-request` | 🔄 |
| Hardware Decommission Record | `/hardware-decommission` | 🗑️ |
| Client Onboarding Pack | `/client-onboarding` | 📦 |
| Patch Panel Port Mapper | `/patch-panel` | 🔌 |
| Switch Port Label Sheet | `/switch-labels` | 🏷️ |
| Technician Visit Log | `/visit-log` | 🕐 |
| Credentials Sheet | `/credentials` | 🔐 |
| IP/VLAN Planner | `/ip-vlan` | 🌐 |
| Network Site Survey Report | `/site-survey` | 📡 |
| Bulk SSL Expiry Checker | `/ssl-checker` | 🔒 |
| Rack Photo to Doc | `/rack-photo` | 📸 |

---

## Verification

After editing, run:

```bash
grep "tool-slug" /home/mh/projects/fieldkit/public/index.html
```

Confirm the card is now an `<a>` tag with `class="tool-card"` (no `coming-soon`) and the correct `href`.
