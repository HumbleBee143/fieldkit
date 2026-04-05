---
name: field-kit-qa
description: >
  Use this skill when reviewing or verifying a completed Field-Kit tool.
  Defines the mandatory QA checklist that must pass before any task is accepted.
  Run this before marking any deliverable as reviewed or reassigning to CEO.
---

# Field-Kit QA Checklist

Run every check below in order. All must pass before accepting a task.

## 1. File Exists

```bash
find public/tool-name -type f -not -path '*/node_modules/*'
```

- `public/tool-name/index.html` must exist
- No other `.js`, `.css`, or asset files should be present (test files are ok)
- If `index.html` is missing — FAIL, send back to engineer

## 2. Single File Convention

Open `public/tool-name/index.html` and verify:

- Contains a `<style>` block inside `<head>` — no external stylesheet links
- Contains a `<script>` block before `</body>` — no external script src (CDN links are ok)
- All logic is self-contained in this one file

If separate files exist or styles/scripts are missing — FAIL, send back to engineer.

## 3. Watermark Present

Check the file contains:

```html
<div class="watermark">
```

And in the CSS:

```css
@media print {
  .watermark { display: block; }
}
```

If missing — FAIL, send back to engineer.

## 4. Print Export

Check the file contains a print/export button:

```html
window.print()
```

And a `@media print` block that hides buttons and shows the watermark.

If missing — FAIL, send back to engineer.

## 5. Basic Syntax Check

```bash
node --check public/tool-name/index.html 2>&1 || true
```

No fatal JS syntax errors should be present.

## 6. Homepage Card

Check `public/index.html` contains a link to the new tool. Try both paths:

```bash
grep "tool-name" public/index.html 2>/dev/null || grep "tool-name" /home/mh/projects/fieldkit/public/index.html
```

If the tool isn't linked from the homepage — FAIL, send back to engineer.

---

## Posting Results

Always post a comment with your findings in this format:

```
QA Report — [Tool Name]

1. File exists: PASS / FAIL
2. Single file convention: PASS / FAIL
3. Watermark: PASS / FAIL
4. Print export: PASS / FAIL
5. Syntax check: PASS / FAIL
6. Homepage card: PASS / FAIL

Overall: PASS (accepted) / FAIL (returned to engineer — [reason])
```

If all 6 pass — mark the task accepted and notify the CEO.
If any fail — reassign to the Founding Engineer with the QA report as context.
