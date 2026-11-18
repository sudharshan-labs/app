# NEXUS AI/ML Progress Tracker — user.json edition

## Files
- `index.html` — complete HTML, CSS and JavaScript application
- `data.json` — read-only 12-week curriculum
- `user.json` — user account and progress database template

## Use
1. Host `index.html` and `data.json` on GitHub Pages.
2. Keep your real `user.json` private on your own device; do not commit personal account data to a public repository.
3. Open the site in Chrome or Edge over HTTPS.
4. Select **Open user.json** or **Create user.json** on the login screen.
5. Register/login. Account data, SHA-256 password digests, learning progress and activity are written to the selected file.

## Limitations and security
GitHub Pages is static hosting and cannot write visitor changes into a repository JSON file. The browser File System Access API writes only to the file selected by that browser user and requires permission; reconnect the file after a new browser session if needed. This does not synchronize users across devices. SHA-256 client-side hashing is not suitable for production authentication. Do not use this for sensitive accounts or publish a populated user.json. A secure shared multi-user service needs a backend/API with proper password hashing and access control.
