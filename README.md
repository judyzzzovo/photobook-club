# PHOTO BOOK

A student archive for personal photography and videography.

## Publish with GitHub Pages

1. Create a public GitHub repository and upload every file in this project, except the ZIP archives.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and the `/ (root)` folder, then save.
5. GitHub will show the live website address after publishing.

## Update the website

Edit `index.html`, `styles.css`, `app.js`, or the files in `assets/`, then commit and push the changes to GitHub. GitHub Pages will publish the update automatically.

## Project files

- `index.html` — page structure and text
- `styles.css` — visual design and responsive layout
- `app.js` — gallery, submissions, editor tools, and interactions
- `assets/` — photographs and video used by the site

## Supabase setup

Before the first upload, run `supabase/schema.sql` once in the Supabase SQL Editor. This creates the shared submissions table, the media bucket, and its access rules.

The editor signs in using a magic link sent to `judyqianqianovo@gmail.com`. The Supabase publishable key in `supabase-config.js` is designed for browser use. Never add a Supabase `service_role` or secret key to this repository.
