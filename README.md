# NEXUS AI/ML Progress Tracker — GitHub JSON edition

## Files
- `index.html` — complete HTML, CSS and JavaScript application
- `data.json` — 12-week curriculum, loaded automatically from GitHub Pages
- `user.json` — initial account database, loaded automatically from GitHub Pages

## GitHub Pages setup
1. Put all three files in the same folder in your GitHub repository (the published Pages folder).
2. Commit and push the files.
3. Enable GitHub Pages for the repository.
4. Open the published Pages URL. The app automatically fetches `./data.json` and `./user.json`; there is no file picker or manual file creation.

If you use a project site such as `https://USERNAME.github.io/REPOSITORY/`, relative paths make the app fetch the JSON files from that same project folder. Keep the filenames exactly `data.json` and `user.json`.

## How account and progress storage works
- `user.json` is fetched as a read-only starting account list. It must be valid JSON with a top-level `users` object.
- New registrations and progress updates are saved in the current browser's `localStorage`. They remain on that browser/device and are not written back to GitHub.
- The local browser records override matching entries from the fetched `user.json`.
- The existing backup export/import controls can be used to move a learner's progress manually.

## Important limitations and security
- GitHub Pages is static hosting. Browser JavaScript can fetch public JSON files but cannot commit edits to the repository. Writing to GitHub requires a trusted server-side API or backend; never place a GitHub personal access token in `index.html`.
- Do not put real passwords, private account data, or sensitive information in a public `user.json`. Anyone can download it. The included SHA-256 digest is not suitable for production password storage.
- This version is a personal/demo tracker, not secure multi-user authentication. For shared accounts and cross-device progress syncing, use a backend database with secure password hashing and access controls.
- Run the site through GitHub Pages or another HTTP(S) web server. Fetching local JSON from a `file://` URL may be blocked by browser security.
