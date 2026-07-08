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

## Live Version Bump Checklist

Before any live commit/push, explicitly check whether the app version/cache should be bumped. The answer is usually yes for any change that affects `index.html`, `app.js`, `styles.css`, `sw.js`, or visible behavior.

Update all matching version references together:

- `app.js`: `const appVersion = "...";`
- `index.html`: `styles.css?v=...` and `app.js?v=...`
- `sw.js`: `tasks-cache-v...`, `styles.css?v=...`, and `app.js?v=...`

Use this check before committing live changes:

`rg -n "tasks-cache-v|styles.css\\?v=|app.js\\?v=|const appVersion" index.html app.js sw.js`

If the user explicitly says to leave the version alone, note that in the final answer and in project memory/history. Otherwise, include the version bump in the same live commit so iPhone/Mac Home Screen installs and service-worker caches refresh predictably.

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

## Native iOS / Widgets Direction

- Current product direction: start and continue with the PWA, then consider native iOS later if the PWA hits a real platform limit.
- A native iOS switch becomes more worth it when the user wants real WidgetKit widgets, Lock Screen widgets, App Intents/Shortcuts/Siri integration, share extensions, richer notification actions, haptics, background refresh, App Store/TestFlight distribution, or a more fully native daily-use feel.
- PWA advantages: one codebase, fast deploys, no App Review, no annual Apple Developer Program fee, and a good fit for a personal Mac/iPhone Home Screen todo app.
- PWA drawbacks: Home Screen install friction, Safari/iOS web quirks, limited background behavior and OS integration, no App Store listing, and no true native iOS widgets.
- Cost/distribution note as of 2026-06-19: a free Apple Account can be used with Xcode to prototype/install on personal devices, but it is limited and provisioning is short-lived. A paid Apple Developer Program membership is the reliable path for TestFlight, App Store distribution, and some native capabilities; fee waivers are generally for eligible nonprofit, educational, and government entities.
- Widget-specific idea: prototype a tiny SwiftUI app plus WidgetKit widget first with free Xcode signing. If the widget only fetches from Supabase, it may avoid some local app/widget storage sharing. If it needs robust shared local state between app and widget, expect native entitlements such as App Groups and likely paid-account friction.

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
- 2026-06-19: Shipped Tomorrow rollover hardening and a blanket mobile focus zoom guard.
  - Tomorrow queue rollover now writes deleted/tombstone markers for due queue items after they roll, so a stale device should not reintroduce the same Tomorrow items after another device has already moved them into Today.
  - Legacy string-based Tomorrow queue items infer their target date from `lastTodayDateKey`, helping older saved queue formats roll correctly after a missed midnight update.
  - Mobile/coarse-pointer text controls now get a final project-wide `16px` font-size guard in `styles.css` to prevent iOS/Safari focus zoom across footer lists and future text inputs.
  - Verified with `node --check app.js`, `git diff --check`, and a mobile viewport computed-style check for Today, Tomorrow, Scheduled, On hold, Projects, and sync inputs.
  - Important: this live commit did not bump the version/cache from `0.2.17`; the user chose to leave it for now. Future live work should revisit the version bump checklist.
  - Live commit: `baf0478 Harden tomorrow rollover and mobile focus`.
- 2026-07-08: Fixed the production frozen-date bug and bumped version `0.2.19` -> `0.2.20`.
  - Root cause: the sandbox-date feature (added in `0.2.17`) made `getSandboxDate()` always parse `sandboxTodayDateKey`, which is set once at page load and never refreshed in production. Long-lived PWA sessions (iOS Home Screen) kept yesterday's date until a full reload: header date, midnight rollover, and `getCurrentAppTimestamp()` were all frozen.
  - Fix: `getSandboxDate()` now returns `new Date()` when `sandboxDateEnabled` is false; sandbox behavior on localhost/file is unchanged.
  - Side effect worth watching: the frozen date also produced stale `updatedAt` timestamps via `getCurrentAppTimestamp()`, a likely contributor to the checkbox bounce-back issue in `future-cleanups.md`.
  - Possible future hardening: a once-a-minute date-key check plus a `pageshow` listener as backup for the single midnight `setTimeout`.
  - Note: the working tree also contained uncommitted task badge group refactor changes (`app.js`, `styles.css`) from a prior session; committed together as `d51a490 Fix frozen production date and group task badges`.
- 2026-07-08: Shipped checkbox bounce-back fix via dirty-task tracking in live version `0.2.21`.
  - Root cause confirmed: `markTaskOrderUpdated` re-stamps every task in a list on reorder/un-complete, so another device's reorder timestamp beats a slightly older completion; `upsert_task_if_newer` then silently skips the completion write (empty `returning` result) while the UI shows `Synced`, and the next refresh merge restores the remote open state.
  - Fix: `syncDirtyTaskStamps` map records `taskId -> updatedAt` in `markTaskUpdated`; `mergeTaskState` lets the matching dirty version win merges; `syncSharedTasks` re-stamps dirty rows blocked by newer remote timestamps to now and pushes anyway; `upsertTaskRow` now returns `{ error, skipped }` (skip detected via empty RPC result) with a one-shot restamp retry; markers are cleared in `pushRemoteState` only after both pushes succeed, snapshot-guarded so mid-push edits stay protected.
  - Verified with `node --check` and a 7-case merge-logic harness (reproduced old bounce-back, confirmed dirty protection both directions, snapshot-guarded clearing, stale-marker fallback).
  - Version bumped `0.2.20` -> `0.2.21` across `app.js`, `index.html`, and `sw.js`.
  - Real-device verification still worth doing: complete tasks on one device right after reordering the same shared list on another.

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
