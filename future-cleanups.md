# Future Cleanups

Use this file as the short list of future improvements. Items in `Completed Or Stale` are kept only for history so future chats do not re-suggest them as active work.

## Active Future Work

- Add a cleaner empty-day label for reset counters. When a list rolls over from something like `5/5 completed` to a blank next day, show `List completed` instead of `0 completed`; once a new open item is added, resume normal counter behavior like `0/1 completed`.
- Confirm or improve the pinned `Projects` drag/options menu placement so it opens in a usable, polished position above the footer when needed.
- Show older completed project items instead of hiding them after midnight. Projects should stop inheriting Today-only completed-task grouping: keep open project counts as-is, but let completed projects remain available in a collapsed completed section and in the Completed filter without sending them to the daily archive.
- Decouple the Today list display from the shared-list View menu. The Today list should always show its own normal Today layout; choosing views like Completed, Shared, or Private for shareable standing lists should not hide or reshape Today tasks.
- Investigate and fix live-app checkbox bounce-back when completing tasks. Sometimes a checked item moves to completed, then returns to open and needs to be checked again; likely areas to inspect include sync refresh timing, stale remote state winning a merge, duplicate app instances, and task updated-at/order writes. Possible fix: track locally dirty task IDs after checkbox/reorder edits, keep those local versions from being overwritten by remote refresh until their push is confirmed, clear the dirty markers only after successful private/shared writes, and surface timestamp-guarded upserts that skipped a row instead of treating them as saved.

## Backup And Recovery

- Add a versioned JSON backup format that can be exported and imported by the app.
- Structure backups around stable record IDs so lists and tasks can be restored without duplication.
- Include private account state, shared lists, tasks, list members, list invites, scheduled queue, tomorrow queue, completed archive, deleted-task tombstones, and basic preferences.
- Support restore modes: Preview Only, Merge Backup, and later Replace My Data.
- Treat Merge Backup as the safest first implementation: add missing records and keep whichever copy has the newer `updatedAt`.
- Keep tombstones in the backup so old backups do not accidentally resurrect intentionally deleted tasks.
- Add an in-app `Export Backup` option first, then consider daily automatic off-site JSON exports.

## Later Ideas

- Explore adding a mobile pull-down gesture to trigger Refresh Sync from the Home Screen app, if iOS allows it cleanly.

## Completed Or Stale

- Update the sign-in text to match the code email. Historical note: the app once said to look for a six digit code while Supabase sent an eight digit code.
- Change app version numbers to `0.1.0`. Stale; the app has moved past this version series.
- Rename the pinned `Project` list to `Projects`.
- Remove sharing/sharability from the pinned `Projects` list.
- Add `Shared` and `Private` filter options to the View dropdown.
- Rename `Done` to `Completed` in the View dropdown.
- Expand repeating task custom rules while keeping the repeat menu clean. Shipped in live version `0.2.7` with `First Weekday` and `Last Weekday`; skipped `First Wednesday` and `Second Friday` because they felt too specific for the menu.
- Fix Tomorrow item removals that only lasted a few seconds before the item returned. Shipped in the live app by adding hidden Tomorrow deletion tombstones, hiding those tombstones from the footer UI, preserving them through private sync merges, and covering undo paths that remove temporary Tomorrow/On hold queue items.
- Streamline Scheduled item flow so scheduled items move into Tomorrow the day before they are due, with a `Scheduled` badge that carries into Today. Shipped in live version `0.2.17`; includes localhost-only `Simulate Tomorrow` and `Reset Date` controls for testing rollover paths.
- Clean up the footer list styling so Tomorrow, Scheduled, On hold, and Projects share a uniform aesthetic. Shipped in live version `0.2.17` with shared utility row styling, footer empty states, form treatment, and a compact Projects footer renderer.
- Prevent repeated scheduled tasks from keeping the `Scheduled` badge after the original Today instance repeats. Shipped in live version `0.2.17`; the original scheduled task keeps the badge, but reopened repeat cycles clear scheduled-origin metadata.
