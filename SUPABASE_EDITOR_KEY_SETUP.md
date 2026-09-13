# Editor Key setup (one-time)

This website now uses a Supabase Edge Function for the editorial desk. It does **not** use an editor email, password, or magic-link email. The browser sends the Editor Key to the function over HTTPS; the function checks it privately and performs editorial actions server-side.

## 1. Set a new private key

In the Supabase project dashboard:

1. Open **Edge Functions** in the left sidebar.
2. Open **Secrets** / **Secrets management**.
3. Add a secret named exactly `EDITOR_KEY`.
4. Give it a new, long, random value (at least 24 characters). Keep it only in a password manager. Do not put it in this repository or send it in chat.

## 2. Deploy the function

1. In **Edge Functions**, choose **Deploy a new function** → **Via Editor**.
2. Name the function exactly `editor-desk`.
3. Replace the editor contents with the contents of `supabase/functions/editor-desk/index.ts` in this repository.
4. Turn **off** “Verify JWT” / “Require JWT verification” for this function. The Editor Key is the authentication method.
5. Choose **Deploy function**.

`supabase/config.toml` documents the same Verify-JWT setting for command-line deployments. The dashboard deployment still needs the toggle set there.

## 3. Publish the website changes

In GitHub Desktop, commit and push `app.js`, `supabase/`, `.gitignore`, and this setup guide. Wait for GitHub Pages to finish publishing, then refresh the site without cache.

## Test

1. Open the live website.
2. Click **Editors**.
3. Enter the new Editor Key.
4. The Incoming frames desk should open. Approve/reject, delete, and Save Monthly Picks are now handled by the private function.

The key is deliberately kept only in memory. Refreshing or closing the page signs the editor out, and the key is never placed in localStorage, GitHub, or the public source code.
