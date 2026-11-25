# daily-expense-quick-note

A tiny Chrome extension (Manifest V3) for noting expenses the moment
they happen — no account, no server, no sync. Everything is stored
only in your browser (`chrome.storage.local`).

## Features

- Add an expense (amount + short note) in one click from the toolbar.
- See today's entries and today's total at a glance.
- See the current month's total.
- Delete a single entry, or clear everything.
- Export this month's expenses to CSV.

## Install (Load unpacked)

1. Download or clone this repository.
2. Open `chrome://extensions` in Chrome (or `edge://extensions` in Edge).
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select this folder.
5. Pin the extension to the toolbar and click it to start.

## Privacy

The extension asks for only one permission: `storage`. It makes no
network requests and sends no data anywhere.

## Files

- `manifest.json` — Manifest V3 definition
- `popup.html` / `popup.js` / `popup.css` — the popup UI and logic
- `icons/` — toolbar icon (SVG)

## Developer

- **Developer:** Md Jahirul Islam
- **Portfolio:** https://jahirulofficial.me
- **Company:** Cloud Tech Digital — https://cloudtechdigital.info
- **Phone:** +971 56 720 6899

## License

MIT — see [LICENSE](LICENSE).
