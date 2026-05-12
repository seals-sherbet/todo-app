# Supabase Sync Setup

This app can run locally without Supabase. Sync turns on only after `sync-config.js` has a Supabase project URL and public anon key.

## 1. Create the Supabase project

1. Go to Supabase and create a new project.
2. Open the SQL editor.
3. Paste and run the contents of `supabase-schema.sql`.

## 2. Add the public app credentials

In Supabase, go to Project Settings > API and copy:

- Project URL
- anon public key

Then update `sync-config.js`:

```js
window.TASKS_SYNC_CONFIG = {
  supabaseUrl: "https://YOUR-PROJECT.supabase.co",
  supabaseAnonKey: "YOUR-ANON-PUBLIC-KEY"
};
```

The anon key is designed to be public in browser apps. Do not use the service role key in this file.

## 3. Configure email code sign-in

In Supabase, go to Authentication > Email Templates > Magic Link.

Change the email body so it includes the 6-digit token instead of only a magic link. For example:

```html
<h2>Your to-do app login code</h2>
<p>Enter this code in the app:</p>
<h1>{{ .Token }}</h1>
```

Save the template. This lets the iPhone Home Screen app sign in without the email link opening Safari.

## 4. Configure auth redirects

In Supabase, go to Authentication > URL Configuration.

Set the Site URL to:

```text
https://seals-sherbet.github.io/todo-app/
```

Add this Redirect URL:

```text
https://seals-sherbet.github.io/todo-app/
```

## 5. Deploy

Commit the changed files and push to GitHub. After GitHub Pages updates, open the app and tap `Sign in`.

Use the same email address on each device. The first signed-in device uploads the current local lists; other devices download that synced copy after sign-in. On iPhone, open the Home Screen app, request the code, then enter the emailed code in the Home Screen app.

## Current sync behavior

- Today and Tomorrow sync as private data for each signed-in user.
- Standing lists and their tasks sync as rows that can be shared with other signed-in users.
- A shared standing list appears for the invited person after they sign in with the invited email address.
- Changes save locally first, then sync to Supabase.
- Two devices editing at exactly the same time use last save wins.
- Only the list owner can share or delete a shared standing list.
