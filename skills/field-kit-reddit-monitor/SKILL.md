---
name: field-kit-reddit-monitor
description: >
  Use this skill when monitoring Reddit for threads where someone is asking for a tool
  that Field-Kit already provides. Covers search strategy, how to query Reddit's JSON API,
  how to evaluate matches, and how to report findings as Paperclip tasks.
---

# Field-Kit Reddit Monitor

## Purpose

Search Reddit for threads where someone is asking for a tool that Field-Kit already solves.
These are warm leads — people actively looking for exactly what we built. Flag them so a human
can reply manually with the relevant tool link.

Do NOT post automatically. Your job is to find the thread and draft a reply. A human posts it.

---

## How to Search Reddit (No API Key Required)

Reddit serves public search results as JSON. Use this URL pattern:

```
https://www.reddit.com/r/{subreddit}/search.json?q={query}&restrict_sr=1&sort=new&limit=25
```

Set the User-Agent header or requests may be blocked:
```
User-Agent: field-kit-monitor/1.0
```

Use `curl`:
```bash
curl -s -H "User-Agent: field-kit-monitor/1.0" \
  "https://www.reddit.com/r/sysadmin/search.json?q=patch+panel+tool&restrict_sr=1&sort=new&limit=25"
```

---

## Subreddits to Monitor

Search these subreddits every run:

| Subreddit | Keywords to search |
|---|---|
| r/sysadmin | patch panel tool, vlan planner, ip planning tool, job sheet, incident report template, hardware decommission |
| r/msp | job sheet generator, site visit report, incident report, change request template, free tool |
| r/homelab | patch panel mapper, vlan planner, subnet planner, rack documentation |
| r/networking | vlan planner, subnet calculator, ip address planner |
| r/ITCareerQuestions | job sheet, site visit log, technician log |

---

## What Counts as a Match

A thread is a match if:
- Someone is **asking** for a tool or template (not just discussing one)
- The problem they describe is something Field-Kit already solves
- The post is less than 7 days old (check `created_utc` in the JSON)
- The thread has not already been replied to by field-kit or a similar tool

Ignore:
- Threads older than 7 days
- Threads where the problem is clearly already solved in the comments
- Threads that are rants or discussions, not requests

---

## Field-Kit Tool Matching

Match threads to the right tool:

| If they ask about... | Link them to... |
|---|---|
| patch panel labelling, port documentation | field-kit.co.uk/patch-panel |
| VLAN planning, subnet layout, IP addressing | field-kit.co.uk/ip-vlan |
| job sheets, site visit paperwork, work records | field-kit.co.uk/job-sheet-generator |
| incident reports, major incident documentation | field-kit.co.uk/incident-report |
| hardware disposal, data destruction records, GDPR compliance | field-kit.co.uk/hardware-decommission |
| change requests, maintenance windows, change control | field-kit.co.uk/change-request |
| technician visit logs, onsite time tracking | field-kit.co.uk/visit-log |
| switch port labelling, port label sheets | field-kit.co.uk/switch-labels |
| site summary, network summary card | field-kit.co.uk/site-card |

---

## Reply Format

Keep replies short, natural, and helpful. Never sound like marketing.

Template:
```
I built something for exactly this — [field-kit.co.uk/tool-slug]

It's free, runs entirely in the browser, nothing leaves your machine. No login needed.

[One sentence describing what it does.]
```

Example for a patch panel thread:
```
I built something for exactly this — field-kit.co.uk/patch-panel

It's free, runs entirely in the browser, nothing leaves your machine. No login needed.

You map out each port, colour-code by device type, and it generates a clean printable label sheet.
```

---

## How to Report Findings

For each matching thread found, create a Paperclip task with:

**Title:** `Reddit lead: r/{subreddit} — "{thread title}"`

**Body:**
```
Thread: {full Reddit URL}
Subreddit: r/{subreddit}
Posted: {date}
Tool match: {tool name and URL}

Drafted reply:
{the reply text}
```

**Assignee:** Leave unassigned (human review)
**Priority:** low

If no matches are found, post a comment on the monitoring task: "No new leads found — {date}"

---

## Telegram Notifications

After creating each Paperclip task for a lead, send a Telegram notification via Alfred's bot.

```bash
curl -s -X POST "https://api.telegram.org/bot8677411040:AAFYPxVc8aJAvoYpziD7M9rWwHlFqdcZijw/sendMessage" \
  -H "Content-Type: application/json" \
  -d "{\"chat_id\": \"7965175590\", \"text\": \"Field-Kit lead found\nr/{subreddit}: {thread title}\n{thread URL}\n\nTool: {tool URL}\"}"
```

Keep the message short. Include the subreddit, thread title, thread URL, and which tool matches. No need to include the full drafted reply in the Telegram message.

If no matches are found in a run, do not send a Telegram message.

---

## Run Frequency

This skill should be run once per day. Do not hammer the Reddit API — one search per keyword per run is enough. Space requests at least 2 seconds apart.
