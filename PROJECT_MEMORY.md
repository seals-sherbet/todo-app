# Todo App Project Memory

This file exists so future Codex chats can quickly recover the important context from the long-running build conversation.

## Project Path

Use this as the project root:

`/Users/mobi/Documents/Projects/todo-app`

The active working path is `/Users/mobi/Documents/Projects/todo-app`.

## Core Files

- `index.html` - live app markup.
- `app.js` - main app logic.
- `styles.css` - live app styles.
- `sw.js` - service worker/cache versioning.
- `manifest.webmanifest` - PWA metadata.
- `sync-config.js` - Supabase project URL and anon key.
- `supabase-schema.sql` - database schema, RLS policies, and sync helper functions.
- `future-cleanups.md` - running list of future improvements.
- `PROJECT_CHAT_HISTORY.txt` - full pasted transcript from the prior long-running Codex chat.
- `working-todo-sandbox.html`, `working-todo-sandbox.js`, `working-todo-sandbox.css` - local sandbox used to test UI/functionality before merging into the live app.

## User Workflow Preferences

- Use the sandbox first for larger UI/function changes.
- Once the user says it looks good, copy the change into the live app.
- Bump the visible/app version with every live change.
- When committing live changes, ask/send approval requests as usual.
- Pushes from terminal may fail because GitHub credentials are handled by GitHub Desktop. If push fails, tell the user to use GitHub Desktop `Push origin`.
- The user does not need another browser verification when they explicitly say to push something live, unless there is a clear reason.
- Keep the UI clean, small, and quiet. Avoid bulky panels and avoid cluttering list cards.

## App Shape

This is a todo PWA for Mac/iPhone with:

- A pinned Today list at the top.
- User-created regular/shareable lists in the main stack.
- Footer tabs for Tomorrow, Scheduled, On hold, and Projects.
- Supabase sync across devices and users.
- Shared lists with invite/member support.
- Repeating tasks.
- Repeating tasks now include monthly pattern options for `First Weekday` and `Last Weekday`.
- Scheduled tasks.
- Tomorrow queue rollover.
- Weekend mode / 5-day versus 7-day queue behavior.
- Local sandbox versions for experiments.

## Design Direction

Current palette:

- Pinned lists use lavender/periwinkle.
- Regular/shareable list stack uses red violet.
- Footer uses a dark inverted theme.
- Shared badge should read visually like a filled pill.
- Private/shared state should be visible without overwhelming the list title.
- Avoid heavy bold text.
- Avoid extra underline styling on list names.
- Compact mode exists for denser UI.

## Important Sync/Data Notes

- Supabase is the source of truth for synced data.
- Private account state lives mainly in `task_documents`, including private lists, tomorrow queue, scheduled queue, and some account-level state.
- Shareable lists are stored in normalized tables:
  - `task_lists`
  - `tasks`
  - `list_members`
  - `list_invites`
- Sync must avoid old devices overwriting newer state. `updatedAt` ordering is important.
- Tombstones/deleted markers are important so old data does not reappear after sync.
- Collapsed/open UI state should generally be local per device/user, not shared between all users.
- Shared list order should be per account, not changed by another user's ordering.

## Supabase/Auth Notes

- The user has run schema updates manually in Supabase SQL Editor when needed.
- Supabase email rate limit on the free/default setup has made testing auth annoying.
- Magic-link email behavior caused Home Screen app login loops; the app moved toward code-based login.
- The wording may still need cleanup if Supabase sends an 8-digit code while app text says 6 digits.

## Backup/Recovery Direction

Future backup work should use a versioned JSON export/import format.

Preferred first implementation:

- Add `Export Backup`.
- Backup should include private account state, shared lists, tasks, list members, list invites, tomorrow queue, scheduled queue, completed archive, tombstones, and basic preferences.
- Add import with `Preview Only` and `Merge Backup` first.
- Later add `Replace My Data`.
- Merge should preserve newer records by `updatedAt` and should not resurrect tombstoned/deleted tasks.

See `future-cleanups.md` for the saved backup cleanup list.

## Current Future Cleanup Themes

Check `future-cleanups.md` before starting future work. Recent items include:

- Backup and recovery.
- Cleaner reset-counter empty state: show `List completed` instead of `0 completed`.
- Fix/clean future auth text and menu polish.

## Recent Live Changes

- 2026-06-02: Shipped repeating task monthly pattern options in live version `0.2.7`.
  - Added `First Weekday` and `Last Weekday` to the Today task Repeat menu.
  - Did not keep the earlier sandbox examples `First Wednesday` or `Second Friday`; those felt too specific.
  - Repeat pattern data is stored as `mode: "monthly-pattern"` with `monthlyPattern` set to `first-weekday` or `last-weekday`.
  - Pinned Today/Projects no longer show old completed tasks as previous completed items; that behavior remains for regular/shareable list cards.
  - Live commit: `5fcf600 Add monthly weekday repeat options`.
- 2026-06-18: Prepared live version `0.2.17` with Scheduled flow and footer cleanup.
  - Scheduled items move into Tomorrow the day before they are due, then into Today with a `Scheduled` badge.
  - Tomorrow-origin scheduled tasks carry the badge into the original Today task, but repeated future cycles clear scheduled-origin metadata so the badge does not repeat.
  - Footer tabs now share one compact utility-row aesthetic across Tomorrow, Scheduled, On hold, and Projects.
  - Projects in the footer use a compact task-row renderer instead of a full list card.
  - Localhost builds show `Simulate Tomorrow` and `Reset Date` controls for testing rollover paths; production hides them.

## Testing Notes

- Use `node --check app.js` after JS changes.
- Use browser/local server for visual changes when useful.
- Local static server commands have commonly used ports like `8767` or nearby alternatives.
- The in-app browser may retain stale service worker/cache behavior, so version bumps matter.

## Git Notes

- Repo path: `/Users/mobi/Documents/Projects/todo-app`
- Remote: `https://github.com/seals-sherbet/todo-app.git`
- GitHub Desktop is usually the practical way to push.
- Do not stage unrelated untracked files unless the user explicitly asks.
