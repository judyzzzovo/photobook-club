# Supabase setup for PHOTO BOOK

## 1. Create the database and storage rules

Open **Supabase → SQL Editor → New query**. Copy the full contents of `supabase/schema.sql`, paste it into the editor, then click **Run**.

This creates:

- the `submissions` table for pending and approved work;
- the `submissions` Storage bucket for images and videos;
- public upload and approved-gallery access rules;
- editor-only review, publish, rejection, and deletion permissions for `judyqianqianovo@gmail.com`.

## 2. Configure editor sign-in

Open **Authentication → URL Configuration** and set:

- **Site URL:** `https://judyzzzovo.github.io/photobook-club/`
- **Redirect URLs:** `https://judyzzzovo.github.io/photobook-club/`

Then open **Authentication → Providers → Email** and confirm Email sign-in is enabled.

## 3. Publish the code

Commit and push `index.html`, `app.js`, `supabase-config.js`, and the `supabase/` folder to the `main` branch. GitHub Pages will deploy the update.

## 4. Test

1. Open the live site in a private browser window.
2. If the `submissions` bucket already exists, run `supabase/set-photo-limit-20mb.sql` in Supabase SQL Editor once.
3. Run `supabase/enable-shared-monthly-picks.sql` in Supabase SQL Editor once.
4. Submit an image up to 20 MB.
5. Click **Editors** on your normal browser, enter `judyqianqianovo@gmail.com`, and open the magic-link email.
6. Return to the site, click **Editors** again, approve the submission, and confirm it appears in the gallery.
7. In the same editor panel, select four Monthly picks and save. Refresh another browser to confirm it shows the shared selection.

Never add a `service_role` or secret key to this project. The publishable key in `supabase-config.js` is intentionally safe for the browser and is protected by the SQL policies.
