const storageKey = "taskLists.v2";
const legacyStorageKey = "tasks.v1";
const themeKey = "tasks.theme";
const tomorrowQueueKey = "tasks.tomorrowQueue.v1";
const tomorrowCollapsedKey = "tasks.tomorrowCollapsed.v1";
const syncDeviceKey = "tasks.syncDeviceId.v1";
const completedArchiveKey = "tasks.completedArchive.v1";
const todayDateKeyStorageKey = "tasks.todayDateKey.v1";
const todayListId = "pinned-today";
const todayListType = "today";
const completedPreviewLimit = 2;
const syncDebounceMs = 700;
const syncRefreshDebounceMs = 500;
const syncDialogPauseMs = 5000;
const syncLocalWritePauseMs = 3500;
const taskFormPointerGraceMs = 800;
const undoTimeoutMs = 8000;
const appVersion = "v0.87";

const listForm = document.querySelector("#listForm");
const listName = document.querySelector("#listName");
const todayBoard = document.querySelector("#todayBoard");
const listBoard = document.querySelector("#listBoard");
const emptyState = document.querySelector("#emptyState");
const settingsMenuButton = document.querySelector("#settingsMenuButton");
const settingsMenu = document.querySelector("#settingsMenu");
const appVersionLabel = document.querySelector("#appVersion");
const themeToggle = document.querySelector("#themeToggle");
const updateAppButton = document.querySelector("#updateAppButton");
const viewArchiveButton = document.querySelector("#viewArchiveButton");
const copyArchiveButton = document.querySelector("#copyArchiveButton");
const downloadArchiveButton = document.querySelector("#downloadArchiveButton");
const syncButton = document.querySelector("#syncButton");
const refreshSyncButton = document.querySelector("#refreshSyncButton");
const syncStatus = document.querySelector("#syncStatus");
const syncErrorButton = document.querySelector("#syncErrorButton");
const syncAuthDialog = document.querySelector("#syncAuthDialog");
const syncAuthClose = document.querySelector("#syncAuthClose");
const syncAuthTitle = document.querySelector("#syncAuthTitle");
const syncAuthCopy = document.querySelector("#syncAuthCopy");
const syncAuthMessage = document.querySelector("#syncAuthMessage");
const syncEmailForm = document.querySelector("#syncEmailForm");
const syncEmailInput = document.querySelector("#syncEmailInput");
const syncCodeForm = document.querySelector("#syncCodeForm");
const syncCodeInput = document.querySelector("#syncCodeInput");
const syncCodeBack = document.querySelector("#syncCodeBack");
const archiveDialog = document.querySelector("#archiveDialog");
const archiveClose = document.querySelector("#archiveClose");
const archiveContent = document.querySelector("#archiveContent");
const archiveCopy = document.querySelector("#archiveCopy");
const archiveDownload = document.querySelector("#archiveDownload");
const undoToast = document.querySelector("#undoToast");
const undoMessage = document.querySelector("#undoMessage");
const undoButton = document.querySelector("#undoButton");
const undoDismiss = document.querySelector("#undoDismiss");
const todayLabel = document.querySelector("#todayLabel");
const filterMenuButton = document.querySelector("#filterMenuButton");
const filterMenu = document.querySelector("#filterMenu");
const filterMenuLabel = document.querySelector("#filterMenuLabel");
const tomorrowSection = document.querySelector(".tomorrow-section");
const tomorrowToggle = document.querySelector("#tomorrowToggle");
const tomorrowBody = document.querySelector("#tomorrowBody");
const tomorrowCount = document.querySelector("#tomorrowCount");
const tomorrowList = document.querySelector("#tomorrowList");
const tomorrowForm = document.querySelector("#tomorrowForm");
const tomorrowInput = document.querySelector("#tomorrowInput");
const taskBoards = [todayBoard, listBoard].filter(Boolean);
const filterLabels = {
  all: "All",
  active: "Open",
  completed: "Done"
};

let completedArchiveText = loadCompletedArchiveText();
let lastTodayDateKey = localStorage.getItem(todayDateKeyStorageKey) || getDateKey();
let lists = loadLists();
hydrateArchiveStateFromLists(lists);
lists = applyArchiveMetadataToLists(lists);
persistArchiveState();
let tomorrowQueue = loadTomorrowQueue();
let filter = "all";
let dragState = null;
let openMenu = null;
let filterMenuOpen = false;
let settingsMenuOpen = false;
let editingListId = null;
let editingTask = null;
let tomorrowCollapsed = localStorage.getItem(tomorrowCollapsedKey) === "true";
let expandedCompletedLists = new Set();
let activeTaskFormListId = null;
const taskFormDrafts = new Map();
let taskFormPointerActiveUntil = 0;
let suppressHandleClick = false;
let todayText = formatTodayDate();
let rolloverTimer = null;
let syncClient = null;
let syncUser = null;
let syncChannel = null;
let syncPushTimer = null;
let syncRefreshTimer = null;
let syncApplyingRemoteState = false;
let syncLastRemoteUpdatedAt = "";
let syncSkipRemoteRefreshUntil = 0;
let syncDialogOpen = false;
let syncPendingAllShared = false;
let syncPendingSharedListIds = new Set();
let syncLastErrorDetails = "";
let pendingOtpEmail = "";
let undoAction = null;
let undoTimer = null;
const syncDeviceId = getOrCreateDeviceId();
const syncConfig = window.TASKS_SYNC_CONFIG || {};

if (todayLabel) todayLabel.textContent = todayText;
if (appVersionLabel) appVersionLabel.textContent = appVersion;
rollTomorrowQueueIntoToday();
scheduleNextRollover();

const savedTheme = localStorage.getItem(themeKey);
if (savedTheme) {
  document.documentElement.dataset.theme = savedTheme;
}

if ("ResizeObserver" in window) {
  new ResizeObserver(updateTomorrowFooterSpace).observe(tomorrowSection);
}

window.addEventListener("resize", updateTomorrowFooterSpace);
window.addEventListener("online", () => updateSyncUi());
window.addEventListener("offline", () => updateSyncUi());

listForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = listName.value.trim();

  if (!name) return;

  const list = createList(name, false, [], {
    ownerId: getActiveUserId()
  });
  lists = ensureTodayList([list, ...lists]);
  listForm.reset();
  listName.focus();
  persistAndRender({ sharedListIds: [list.id] });
});

taskBoards.forEach((board) => {
  board.addEventListener("submit", handleTaskBoardSubmit);
  board.addEventListener("keydown", handleTaskBoardKeydown);
  board.addEventListener("input", handleTaskBoardFormInput);
  board.addEventListener("change", handleTaskBoardFormInput);
  board.addEventListener("focusout", handleTaskBoardFocusout);
  board.addEventListener("pointerdown", handleTaskFormPointerDown);
  board.addEventListener("pointerdown", handleDragPointerDown);
  board.addEventListener("click", handleTaskBoardClick);
});

function handleTaskBoardSubmit(event) {
  const taskRenameForm = event.target.closest("form[data-task-rename-form]");
  if (taskRenameForm) {
    event.preventDefault();
    finishTaskRename(taskRenameForm);
    return;
  }

  const renameForm = event.target.closest("form[data-list-rename-form]");
  if (renameForm) {
    event.preventDefault();
    finishListRename(renameForm);
    return;
  }

  const form = event.target.closest("form[data-list-form]");
  if (!form) return;

  event.preventDefault();
  const list = findList(form.dataset.listId);
  const title = form.elements.title.value.trim();

  if (!list || !title) return;

  list.tasks.push(createTask(title, {
    due: form.elements.due?.value || "",
    priority: form.elements.priority?.value || "normal"
  }));
  list.collapsed = false;
  clearTaskFormDraft(list.id);
  activeTaskFormListId = list.id;
  persistAndRender({ sharedListIds: [list.id] });
  focusTaskInput(list.id);
}

function handleTaskBoardKeydown(event) {
  const taskRenameInput = event.target.closest("input[data-task-rename-input]");
  if (taskRenameInput && event.key === "Enter" && !event.isComposing) {
    event.preventDefault();
    finishTaskRename(taskRenameInput.form);
    return;
  }

  if (taskRenameInput && event.key === "Escape") {
    event.preventDefault();
    editingTask = null;
    render();
    return;
  }

  const renameInput = event.target.closest("input[data-list-rename-input]");
  if (renameInput && event.key === "Enter" && !event.isComposing) {
    event.preventDefault();
    finishListRename(renameInput.form);
    return;
  }

  if (renameInput && event.key === "Escape") {
    event.preventDefault();
    editingListId = null;
    render();
    return;
  }

  if (event.key !== "Enter" || event.isComposing) return;

  const input = event.target.closest("form[data-list-form] input[name='title']");
  if (!input) return;

  event.preventDefault();
  input.form.requestSubmit();
}

function handleTaskBoardFocusout(event) {
  const taskRenameInput = event.target.closest("input[data-task-rename-input]");
  if (taskRenameInput) {
    finishTaskRename(taskRenameInput.form);
    return;
  }

  const renameInput = event.target.closest("input[data-list-rename-input]");
  if (renameInput) {
    finishListRename(renameInput.form);
    return;
  }

  const taskForm = event.target.closest("form[data-list-form]");
  if (!taskForm) return;

  rememberTaskFormDraft(taskForm);
  if (event.relatedTarget && taskForm.contains(event.relatedTarget)) return;

  const listId = taskForm.dataset.listId;
  window.setTimeout(() => {
    if (activeTaskFormListId !== listId) return;
    if (isTaskFormPointerActive()) return;

    const currentForm = findInTaskBoards(`form[data-list-form][data-list-id="${listId}"]`);
    if (currentForm?.contains(document.activeElement)) return;

    activeTaskFormListId = null;
    render();
  }, 0);
}

function handleTaskBoardFormInput(event) {
  const taskForm = event.target.closest("form[data-list-form]");
  if (!taskForm) return;

  rememberTaskFormDraft(taskForm);
}

function handleTaskFormPointerDown(event) {
  if (!event.target.closest("form[data-list-form]")) return;
  taskFormPointerActiveUntil = Date.now() + taskFormPointerGraceMs;
}

async function handleTaskBoardClick(event) {
  const handle = event.target.closest("[data-menu-type]");
  if (handle && isInsideTaskBoard(handle)) {
    if (suppressHandleClick) {
      suppressHandleClick = false;
      return;
    }

    toggleHandleMenu(handle);
    return;
  }

  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const listElement = button.closest("[data-list-id]");
  const list = findList(listElement?.dataset.listId);
  if (!list) return;

  if (button.dataset.action === "toggle-list") {
    list.collapsed = !list.collapsed;
    if (list.collapsed && activeTaskFormListId === list.id) {
      activeTaskFormListId = null;
    }
    if (list.collapsed && editingTask?.listId === list.id) {
      editingTask = null;
    }
    persistAndRender({ sharedListIds: [list.id] });
    return;
  }

  if (button.dataset.action === "show-task-form") {
    activeTaskFormListId = list.id;
    list.collapsed = false;
    render();
    focusTaskInput(list.id);
    return;
  }

  if (button.dataset.action === "toggle-fields") {
    list.showDetails = !list.showDetails;
    openMenu = null;
    persistAndRender({ sharedListIds: [list.id] });
    return;
  }

  if (button.dataset.action === "toggle-completed-list") {
    if (expandedCompletedLists.has(list.id)) {
      expandedCompletedLists.delete(list.id);
    } else {
      expandedCompletedLists.add(list.id);
    }
    render();
    return;
  }

  if (button.dataset.action === "edit-list") {
    if (isTodayList(list)) return;
    editingListId = list.id;
    editingTask = null;
    activeTaskFormListId = null;
    openMenu = null;
    render();
    focusListRenameInput(list.id);
    return;
  }

  if (button.dataset.action === "share-list") {
    if (isTodayList(list)) return;
    openMenu = null;
    render();
    await shareListByEmail(list);
    return;
  }

  if (button.dataset.action === "delete-list") {
    if (isTodayList(list)) return;
    const hasTasks = list.tasks.length > 0;
    const shouldDelete = !hasTasks || askToConfirm(`Delete "${list.name}" and its tasks?`);
    if (!shouldDelete) return;
    const deletedList = cloneList(list);
    const deletedListId = list.id;
    const deletedListIndex = lists.findIndex((item) => item.id === list.id);
    lists = lists.filter((item) => item.id !== list.id);
    expandedCompletedLists.delete(list.id);
    if (editingTask?.listId === list.id) {
      editingTask = null;
    }
    clearTaskFormDraft(list.id);
    if (activeTaskFormListId === list.id) {
      activeTaskFormListId = null;
    }
    openMenu = null;
    persistAndRender({ syncShared: false });
    await deleteRemoteList(deletedListId);
    showUndo(`Deleted "${deletedList.name}".`, () => {
      insertListAt(deletedList, deletedListIndex);
      persistAndRender({ sharedListIds: [deletedList.id] });
    });
    return;
  }

  const taskElement = button.closest("[data-task-id]");
  const task = list.tasks.find((item) => item.id === taskElement?.dataset.taskId);
  if (!task) return;

  if (button.dataset.action === "toggle-task") {
    const previousTask = cloneTask(task);
    const previousIndex = list.tasks.findIndex((item) => item.id === task.id);
    const wasCompleted = task.completed;
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : "";
    if (wasCompleted && !task.completed) {
      moveTaskToOpenBottom(list, task.id);
    }
    showUndo(`${task.completed ? "Completed" : "Reopened"} "${task.title}".`, () => {
      const currentList = findList(list.id);
      restoreTaskSnapshot(currentList, previousTask, previousIndex);
      persistAndRender({ sharedListIds: [list.id] });
    });
  }

  if (button.dataset.action === "edit-task") {
    editingTask = { listId: list.id, taskId: task.id };
    activeTaskFormListId = null;
    openMenu = null;
    render();
    focusTaskRenameInput(list.id, task.id);
    return;
  }

  if (button.dataset.action === "delete-task") {
    const deletedTask = cloneTask(task);
    const deletedTaskIndex = list.tasks.findIndex((item) => item.id === task.id);
    list.tasks = list.tasks.filter((item) => item.id !== task.id);
    if (isEditingTask(list.id, task.id)) {
      editingTask = null;
    }
    openMenu = null;
    showUndo(`Deleted "${deletedTask.title}".`, () => {
      const currentList = findList(list.id);
      insertTaskAt(currentList, deletedTask, deletedTaskIndex);
      persistAndRender({ sharedListIds: [list.id] });
    });
  }

  if (button.dataset.action === "move-task-tomorrow") {
    const movedTask = cloneTask(task);
    const movedTaskIndex = list.tasks.findIndex((item) => item.id === task.id);
    const queueItem = createTomorrowQueueItem(task.title);
    tomorrowQueue.push(queueItem);
    list.tasks = list.tasks.filter((item) => item.id !== task.id);
    if (isEditingTask(list.id, task.id)) {
      editingTask = null;
    }
    openMenu = null;
    persistTomorrowQueue();
    persistAndRender({ sharedListIds: [list.id] });
    scrollTomorrowQueueToBottom();
    showUndo(`Bumped "${movedTask.title}" to Tomorrow.`, () => {
      tomorrowQueue = tomorrowQueue.filter((entry) => entry.id !== queueItem.id);
      insertTaskAt(findList(list.id), movedTask, movedTaskIndex);
      persistTomorrowQueue();
      persistAndRender({ sharedListIds: [list.id] });
      renderTomorrowQueue();
    });
    return;
  }

  persistAndRender({ sharedListIds: [list.id] });
}

document.addEventListener("click", (event) => {
  const insideFilterMenu = event.target.closest(".filter-menu-shell");
  const insideSettingsMenu = event.target.closest(".settings-menu-shell");

  if (filterMenuOpen && !insideFilterMenu) {
    filterMenuOpen = false;
    renderFilterMenu();
  }

  if (settingsMenuOpen && !insideSettingsMenu) {
    settingsMenuOpen = false;
    renderSettingsMenu();
  }

  collapseActiveTaskFormFromOutsideClick(event);

  if (!openMenu) return;
  if (event.target.closest("[data-menu-type], .handle-menu")) return;

  openMenu = null;
  render();
});

filterMenuButton.addEventListener("click", () => {
  filterMenuOpen = !filterMenuOpen;
  settingsMenuOpen = false;
  if (openMenu) {
    openMenu = null;
    render();
    return;
  }

  renderFilterMenu();
  renderSettingsMenu();
});

filterMenu.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;

  filter = button.dataset.filter;
  filterMenuOpen = false;
  settingsMenuOpen = false;
  openMenu = null;
  render();
});

settingsMenuButton.addEventListener("click", () => {
  settingsMenuOpen = !settingsMenuOpen;
  filterMenuOpen = false;
  if (openMenu) {
    openMenu = null;
    render();
    return;
  }

  renderFilterMenu();
  renderSettingsMenu();
});

tomorrowToggle.addEventListener("click", () => {
  tomorrowCollapsed = !tomorrowCollapsed;
  localStorage.setItem(tomorrowCollapsedKey, String(tomorrowCollapsed));
  renderTomorrowQueue({ scrollToBottom: true });
});

tomorrowForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = tomorrowInput.value.trim();
  if (!title) return;

  tomorrowQueue.push(createTomorrowQueueItem(title));
  tomorrowForm.reset();
  tomorrowInput.focus();
  persistTomorrowQueue();
  renderTomorrowQueue({ scrollToBottom: true });
});

tomorrowForm.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.isComposing || event.target !== tomorrowInput) return;

  event.preventDefault();
  tomorrowForm.requestSubmit();
});

tomorrowList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-tomorrow-action]");
  if (!button) return;

  const item = button.closest("[data-tomorrow-id]");
  if (!item) return;

  if (button.dataset.tomorrowAction === "delete") {
    const removedIndex = tomorrowQueue.findIndex((entry) => entry.id === item.dataset.tomorrowId);
    const removedItem = cloneTomorrowQueueItem(tomorrowQueue[removedIndex]);
    tomorrowQueue = tomorrowQueue.filter((entry) => entry.id !== item.dataset.tomorrowId);
    persistTomorrowQueue();
    renderTomorrowQueue();
    if (removedItem) {
      showUndo(`Removed "${removedItem.title}" from Tomorrow.`, () => {
        insertTomorrowQueueItemAt(removedItem, removedIndex);
        persistTomorrowQueue();
        renderTomorrowQueue();
      });
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (!syncAuthDialog.hidden) {
    closeSyncAuthDialog();
    return;
  }

  if (!archiveDialog.hidden) {
    closeArchiveDialog();
    return;
  }

  if (filterMenuOpen) {
    filterMenuOpen = false;
    renderFilterMenu();
  }

  if (settingsMenuOpen) {
    settingsMenuOpen = false;
    renderSettingsMenu();
  }

  if (openMenu) {
    openMenu = null;
    render();
  }
});

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  if (nextTheme) {
    localStorage.setItem(themeKey, nextTheme);
  } else {
    localStorage.removeItem(themeKey);
  }
  settingsMenuOpen = false;
  renderSettingsMenu();
});

updateAppButton.addEventListener("click", async () => {
  settingsMenuOpen = false;
  renderSettingsMenu();

  if (!("serviceWorker" in navigator) || !window.caches) {
    window.location.reload();
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.update().catch(() => {})));
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.filter((name) => name.startsWith("tasks-cache-")).map((name) => caches.delete(name)));
  } catch {
    // A normal reload still gives the browser a chance to pick up new app files.
  }

  window.location.reload();
});

viewArchiveButton.addEventListener("click", () => {
  if (!getCompletedArchiveExportText().trim()) {
    notifyUser("No completed tasks have been archived yet.");
    return;
  }

  settingsMenuOpen = false;
  renderSettingsMenu();
  openArchiveDialog();
});

copyArchiveButton.addEventListener("click", async () => {
  settingsMenuOpen = false;
  renderSettingsMenu();
  await copyArchiveToClipboard();
});

downloadArchiveButton.addEventListener("click", () => {
  settingsMenuOpen = false;
  renderSettingsMenu();
  downloadArchiveText();
});

refreshSyncButton.addEventListener("click", async () => {
  settingsMenuOpen = false;
  renderSettingsMenu();
  await refreshSyncNow();
});

archiveClose.addEventListener("click", closeArchiveDialog);
archiveDialog.addEventListener("click", (event) => {
  if (event.target === archiveDialog) {
    closeArchiveDialog();
  }
});
archiveCopy.addEventListener("click", copyArchiveToClipboard);
archiveDownload.addEventListener("click", downloadArchiveText);
undoButton.addEventListener("click", runUndoAction);
undoDismiss.addEventListener("click", clearUndoAction);

syncButton.addEventListener("click", handleSyncButtonClick);
syncErrorButton.addEventListener("click", handleSyncErrorButtonClick);
syncEmailForm.addEventListener("submit", handleSyncEmailSubmit);
syncCodeForm.addEventListener("submit", handleSyncCodeSubmit);
syncAuthClose.addEventListener("click", closeSyncAuthDialog);
syncCodeBack.addEventListener("click", () => showSyncEmailStep());
syncAuthDialog.addEventListener("click", (event) => {
  if (event.target === syncAuthDialog) {
    closeSyncAuthDialog();
  }
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    rollTomorrowQueueIntoToday({ renderAfter: true });
    refreshRemoteState();
  }
});

window.addEventListener("focus", () => {
  rollTomorrowQueueIntoToday({ renderAfter: true });
  refreshRemoteState();
});

if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js", {
      updateViaCache: "none"
    }).then((registration) => {
      registration.update().catch(() => {});
    }).catch(() => {});
  });
}

render();
initializeSync();

function persistAndRender(options = {}) {
  persistLists(options);
  render();
}

function persistLists(options = {}) {
  lists = applyArchiveMetadataToLists(ensureTodayList(lists));
  localStorage.setItem(storageKey, JSON.stringify(lists));
  persistArchiveState();
  queueRemoteSync(options);
}

function persistTomorrowQueue() {
  localStorage.setItem(tomorrowQueueKey, JSON.stringify(tomorrowQueue));
  queueRemoteSync({ syncShared: false });
}

async function initializeSync() {
  updateSyncUi();

  if (!isSupabaseConfigured()) return;

  if (!window.supabase?.createClient) {
    updateSyncUi("Sync unavailable");
    return;
  }

  syncClient = window.supabase.createClient(syncConfig.supabaseUrl, syncConfig.supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true
    }
  });

  updateSyncUi("Checking sync...");

  const { data, error } = await syncClient.auth.getSession();
  if (error) {
    updateSyncUi("Sync error");
    return;
  }

  await handleAuthSession(data.session);

  syncClient.auth.onAuthStateChange((_event, session) => {
    handleAuthSession(session);
  });
}

async function handleAuthSession(session) {
  const nextUser = session?.user || null;

  if (!nextUser) {
    syncUser = null;
    syncLastRemoteUpdatedAt = "";
    clearRemoteSubscription();
    updateSyncUi("Signed out");
    return;
  }

  if (syncUser?.id === nextUser.id && syncLastRemoteUpdatedAt) {
    updateSyncUi();
    return;
  }

  syncUser = nextUser;
  updateSyncUi("Loading sync...");
  await syncUserProfile();
  await loadRemoteState();
  subscribeToRemoteChanges();
}

function openSyncAuthDialog() {
  pendingOtpEmail = normalizeEmail(syncEmailInput.value || pendingOtpEmail);
  syncEmailInput.value = pendingOtpEmail;
  syncCodeInput.value = "";
  showSyncEmailStep();
  syncAuthDialog.hidden = false;
  document.body.classList.add("has-modal");
  window.setTimeout(() => {
    syncEmailInput.focus();
    syncEmailInput.select();
  }, 0);
}

function closeSyncAuthDialog() {
  syncAuthDialog.hidden = true;
  document.body.classList.remove("has-modal");
  setSyncAuthBusy(syncEmailForm, false);
  setSyncAuthBusy(syncCodeForm, false);
  setSyncAuthMessage("");
}

function showSyncEmailStep(message = "") {
  syncAuthTitle.textContent = "Sign in to sync";
  syncAuthCopy.textContent = "Enter your email and we will send a 6-digit code.";
  syncEmailForm.hidden = false;
  syncCodeForm.hidden = true;
  setSyncAuthMessage(message);
  window.setTimeout(() => syncEmailInput.focus(), 0);
}

function showSyncCodeStep(message = "") {
  syncAuthTitle.textContent = "Enter code";
  syncAuthCopy.textContent = "Use the 6-digit code from your email.";
  syncEmailForm.hidden = true;
  syncCodeForm.hidden = false;
  syncCodeInput.value = "";
  setSyncAuthMessage(message);
  window.setTimeout(() => syncCodeInput.focus(), 0);
}

function setSyncAuthMessage(message = "", isError = false) {
  syncAuthMessage.textContent = message;
  syncAuthMessage.classList.toggle("is-error", Boolean(isError));
}

function setSyncAuthBusy(form, isBusy) {
  form.querySelectorAll("input, button").forEach((control) => {
    control.disabled = isBusy;
  });
}

async function handleSyncButtonClick() {
  settingsMenuOpen = false;
  renderSettingsMenu();

  if (!isSupabaseConfigured()) {
    notifyUser("Add your Supabase URL and anon key to sync-config.js, then run supabase-schema.sql in Supabase.");
    return;
  }

  if (!syncClient) {
    notifyUser("Supabase is configured, but the sync library did not load. Check your internet connection and refresh.");
    return;
  }

  if (syncUser) {
    const shouldSignOut = askToConfirm("Sign out of synced tasks on this device?");
    if (!shouldSignOut) return;
    updateSyncUi("Signing out...");
    await syncClient.auth.signOut();
    return;
  }

  openSyncAuthDialog();
}

async function handleSyncEmailSubmit(event) {
  event.preventDefault();
  if (!syncClient) return;

  const email = normalizeEmail(syncEmailInput.value);
  if (!email) {
    setSyncAuthMessage("Enter an email address.", true);
    return;
  }

  pendingOtpEmail = email;
  setSyncAuthBusy(syncEmailForm, true);
  setSyncAuthMessage("");
  updateSyncUi("Sending code...");

  const { error } = await syncClient.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true
    }
  });

  setSyncAuthBusy(syncEmailForm, false);

  if (error) {
    updateSyncUi("Sign-in error");
    setSyncAuthMessage(error.message || "Could not send the code.", true);
    return;
  }

  updateSyncUi("Enter code");
  showSyncCodeStep(`Code sent to ${email}.`);
}

async function handleSyncCodeSubmit(event) {
  event.preventDefault();
  if (!syncClient) return;

  const token = syncCodeInput.value.replace(/\s+/g, "");
  if (!pendingOtpEmail || !token) {
    setSyncAuthMessage("Enter the code from your email.", true);
    return;
  }

  setSyncAuthBusy(syncCodeForm, true);
  setSyncAuthMessage("");
  updateSyncUi("Verifying...");

  const { data, error } = await syncClient.auth.verifyOtp({
    email: pendingOtpEmail,
    token,
    type: "email"
  });

  setSyncAuthBusy(syncCodeForm, false);

  if (error) {
    updateSyncUi("Sign-in error");
    setSyncAuthMessage(error.message || "That code did not work.", true);
    return;
  }

  closeSyncAuthDialog();
  updateSyncUi("Loading sync...");
  window.setTimeout(async () => {
    if (syncUser) return;
    try {
      const sessionResult = await syncClient.auth.getSession();
      await handleAuthSession(sessionResult.data.session || data.session);
    } catch {
      if (data.session) {
        await handleAuthSession(data.session);
      }
    }
  }, 250);
}

async function loadRemoteState() {
  if (!syncClient || !syncUser) return;

  const inviteResult = await claimPendingListInvites();
  if (inviteResult?.error) {
    updateSyncUi("Setup needed");
    notifyUser(`Shared invite sync could not load. ${inviteResult.error.message}`);
    return;
  }

  const privateResult = await fetchPrivateDocument();
  if (privateResult.error) {
    updateSyncUi("Setup needed");
    notifyUser(`Supabase sync could not load. ${privateResult.error.message}`);
    return;
  }

  let sharedResult = await fetchSharedLists();
  if (sharedResult.error) {
    updateSyncUi("Setup needed");
    notifyUser(`Shared list sync could not load. ${sharedResult.error.message}`);
    return;
  }

  const localStandingLists = getStandingLists(lists);
  const privateDocument = privateResult.data;
  const privateRemoteLists = Array.isArray(privateDocument?.lists)
    ? privateDocument.lists.map(normalizeList)
    : null;
  const privateLists = privateRemoteLists
    ? ensureTodayList(privateRemoteLists).filter(isTodayList)
    : getPrivateLists(lists);
  const documentStandingLists = privateRemoteLists
    ? privateRemoteLists.filter((list) => !isTodayListCandidate(list))
    : [];
  const nextTomorrowQueue = privateDocument
    ? normalizeTomorrowQueue(privateDocument.tomorrow_queue)
    : tomorrowQueue;

  if (documentStandingLists.length > 0) {
    await pushSharedLists(documentStandingLists);
    await pushPrivateState(privateLists, nextTomorrowQueue);
    sharedResult = await fetchSharedLists();
    if (sharedResult.error) {
      updateSyncUi("Setup needed");
      notifyUser(`Shared list sync could not load. ${sharedResult.error.message}`);
      return;
    }
  } else if (!privateDocument) {
    await pushPrivateState(privateLists, nextTomorrowQueue);
  }

  const sharedListIds = new Set(sharedResult.lists.map((list) => list.id));
  const localListsMissingFromRemote = localStandingLists.filter((list) => canManageList(list) && !sharedListIds.has(list.id));
  if (localListsMissingFromRemote.length > 0) {
    await pushSharedLists(localStandingLists.filter(canManageList));
    sharedResult = await fetchSharedLists();
    if (sharedResult.error) {
      updateSyncUi("Setup needed");
      notifyUser(`Shared list sync could not load. ${sharedResult.error.message}`);
      return;
    }
  }

  applyRemoteState({
    lists: [...privateLists, ...sharedResult.lists],
    tomorrowQueue: nextTomorrowQueue,
    updatedAt: privateDocument?.updated_at || new Date().toISOString()
  });
  updateSyncUi("Synced");
}

async function refreshRemoteState() {
  if (!syncClient || !syncUser || document.hidden) return;
  if (shouldSkipRemoteRefresh()) return;
  await loadRemoteState();
}

async function refreshSyncNow() {
  if (!isSupabaseConfigured()) {
    notifyUser("Add Supabase settings before refreshing sync.");
    return;
  }

  if (!syncClient) {
    notifyUser("Sync is configured, but Supabase did not load. Check your connection and refresh the app.");
    return;
  }

  if (!syncUser) {
    openSyncAuthDialog();
    return;
  }

  updateSyncUi("Checking sync...");
  await loadRemoteState();
}

function queueRemoteSync(options = {}) {
  if (syncApplyingRemoteState || !syncClient || !syncUser) return;

  rememberSyncScope(options);
  window.clearTimeout(syncPushTimer);
  pauseRemoteRefresh(syncDebounceMs + syncLocalWritePauseMs);
  updateSyncUi("Saving...");
  syncPushTimer = window.setTimeout(() => {
    pushRemoteState();
  }, syncDebounceMs);
}

function rememberSyncScope(options = {}) {
  if (options.syncShared === false) return;

  if (Array.isArray(options.sharedListIds)) {
    options.sharedListIds.filter(Boolean).forEach((listId) => {
      syncPendingSharedListIds.add(listId);
    });
    return;
  }

  syncPendingAllShared = true;
}

async function pushRemoteState() {
  if (!syncClient || !syncUser) return;

  window.clearTimeout(syncPushTimer);
  syncPushTimer = null;
  await refreshSyncUser();
  if (!syncUser) return;

  const updatedAt = new Date().toISOString();
  const sharedLists = getPendingSharedLists();

  const privateError = await pushPrivateState(getPrivateLists(lists), tomorrowQueue, updatedAt);
  if (privateError) {
    reportSyncError("Private sync", privateError);
    return;
  }

  const sharedError = await pushSharedLists(sharedLists, updatedAt);
  if (sharedError) {
    clearPendingSharedSync();
    reportSyncError("Shared list sync", sharedError);
    return;
  }

  clearPendingSharedSync();
  syncLastRemoteUpdatedAt = updatedAt;
  updateSyncUi("Synced");
}

function getPendingSharedLists() {
  const standingLists = getStandingLists(lists);
  if (syncPendingAllShared) return standingLists;
  if (syncPendingSharedListIds.size === 0) return [];

  return standingLists.filter((list) => syncPendingSharedListIds.has(list.id));
}

function clearPendingSharedSync() {
  syncPendingAllShared = false;
  syncPendingSharedListIds.clear();
}

async function refreshSyncUser() {
  if (!syncClient) return;

  const { data, error } = await syncClient.auth.getUser();
  if (!error && data?.user) {
    syncUser = data.user;
  }
}

function subscribeToRemoteChanges() {
  if (!syncClient || !syncUser) return;

  clearRemoteSubscription();
  syncChannel = syncClient
    .channel(`tasks-sync-${syncUser.id}`)
    .on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "task_documents",
      filter: `user_id=eq.${syncUser.id}`
    }, scheduleRemoteRefresh)
    .on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "task_lists"
    }, scheduleRemoteRefresh)
    .on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "tasks"
    }, scheduleRemoteRefresh)
    .on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "list_members"
    }, scheduleRemoteRefresh)
    .on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "list_invites"
    }, scheduleRemoteRefresh)
    .subscribe();
}

function clearRemoteSubscription() {
  window.clearTimeout(syncRefreshTimer);
  syncRefreshTimer = null;
  if (!syncClient || !syncChannel) return;

  syncClient.removeChannel(syncChannel);
  syncChannel = null;
}

function applyRemoteState(remoteState) {
  syncApplyingRemoteState = true;
  editingListId = null;
  editingTask = null;
  lists = Array.isArray(remoteState.lists)
    ? ensureTodayList(remoteState.lists.map(normalizeList))
    : ensureTodayList([createList("Personal")]);
  hydrateArchiveStateFromLists(lists);
  lists = applyArchiveMetadataToLists(lists);
  tomorrowQueue = normalizeTomorrowQueue(remoteState.tomorrowQueue);
  syncLastRemoteUpdatedAt = remoteState.updatedAt || "";

  localStorage.setItem(storageKey, JSON.stringify(lists));
  localStorage.setItem(tomorrowQueueKey, JSON.stringify(tomorrowQueue));
  persistArchiveState();
  syncApplyingRemoteState = false;

  rollTomorrowQueueIntoToday();
  render();
}

async function fetchPrivateDocument() {
  return syncClient
    .from("task_documents")
    .select("lists,tomorrow_queue,updated_at,device_id")
    .eq("user_id", syncUser.id)
    .maybeSingle();
}

async function fetchSharedLists() {
  const listResult = await syncClient
    .from("task_lists")
    .select("id,name,collapsed,type,show_details,created_at,position,owner_id,updated_at")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (listResult.error) {
    return { lists: [], error: listResult.error };
  }

  const listRows = listResult.data || [];
  const listIds = listRows.map((list) => list.id);
  let taskRows = [];
  let memberRows = [];

  if (listIds.length > 0) {
    const taskResult = await syncClient
      .from("tasks")
      .select("id,list_id,title,due,priority,completed,completed_at,created_at,position,updated_at")
      .in("list_id", listIds)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });

    if (taskResult.error) {
      return { lists: [], error: taskResult.error };
    }

    taskRows = taskResult.data || [];

    const memberResult = await syncClient
      .from("list_members")
      .select("list_id,role")
      .in("list_id", listIds)
      .eq("user_id", syncUser.id);

    if (memberResult.error) {
      return { lists: [], error: memberResult.error };
    }

    memberRows = memberResult.data || [];
  }

  const tasksByList = taskRows.reduce((groups, row) => {
    groups[row.list_id] ||= [];
    groups[row.list_id].push(rowToTask(row));
    return groups;
  }, {});
  const roleByList = memberRows.reduce((roles, row) => {
    roles[row.list_id] = row.role || "";
    return roles;
  }, {});

  return {
    lists: listRows.map((row) => rowToList(row, tasksByList[row.id] || [], roleByList[row.id] || "")),
    error: null
  };
}

async function pushPrivateState(privateLists = getPrivateLists(lists), queue = tomorrowQueue, updatedAt = new Date().toISOString()) {
  const { error } = await syncClient
    .from("task_documents")
    .upsert({
      user_id: syncUser.id,
      lists: privateLists,
      tomorrow_queue: queue,
      updated_at: updatedAt,
      device_id: syncDeviceId
    }, {
      onConflict: "user_id"
    });

  return error;
}

async function pushSharedLists(standingLists = getStandingLists(lists), updatedAt = new Date().toISOString()) {
  const uniqueStandingLists = uniqueListsById(standingLists);
  if (uniqueStandingLists.length === 0) return null;

  uniqueStandingLists.forEach(ensureManagedListOwner);

  const managedListRows = uniqueStandingLists
    .map((list, index) => ({ list, index }))
    .filter(({ list }) => canManageList(list))
    .map(({ list, index }) => listToRow(list, index, updatedAt));

  for (const row of managedListRows) {
    const listResult = await upsertOwnedTaskList(row);
    if (listResult.error) return listResult.error;

    const list = uniqueStandingLists.find((item) => item.id === row.id);
    const ownerId = listResult.data?.[0]?.list_owner_id || listResult.data?.[0]?.owner_id;
    if (list && ownerId) {
      list.ownerId = ownerId;
    }
  }

  for (const [index, list] of uniqueStandingLists.entries()) {
    if (canManageList(list) || !canEditList(list)) continue;

    const listResult = await syncClient
      .from("task_lists")
      .update(listToEditableRow(list, index, updatedAt))
      .eq("id", list.id);

    if (listResult.error) return listResult.error;
  }

  for (const list of uniqueStandingLists) {
    if (!canEditList(list)) continue;

    const taskError = await syncSharedTasks(list, updatedAt);
    if (taskError) return taskError;
  }

  return null;
}

async function upsertOwnedTaskList(row) {
  return syncClient.rpc("upsert_task_list", {
    target_id: row.id,
    target_name: row.name,
    target_collapsed: row.collapsed,
    target_type: row.type,
    target_show_details: row.show_details,
    target_created_at: row.created_at,
    target_position: row.position,
    target_updated_at: row.updated_at,
    target_device_id: row.device_id
  });
}

function uniqueListsById(sourceLists) {
  const seen = new Set();
  return sourceLists.filter((list) => {
    if (!list?.id || seen.has(list.id)) return false;
    seen.add(list.id);
    return true;
  });
}

function ensureManagedListOwner(list) {
  if (!syncUser?.id || !canManageList(list)) return;

  list.ownerId = syncUser.id;
}

async function syncSharedTasks(list, updatedAt) {
  const taskRows = list.tasks.map((task, index) => taskToRow(task, list.id, index, updatedAt));

  if (taskRows.length > 0) {
    const taskResult = await syncClient
      .from("tasks")
      .upsert(taskRows, {
        onConflict: "id"
      });

    if (taskResult.error) return taskResult.error;
  }

  const existingResult = await syncClient
    .from("tasks")
    .select("id")
    .eq("list_id", list.id);

  if (existingResult.error) return existingResult.error;

  const localTaskIds = new Set(taskRows.map((task) => task.id));
  const staleTaskIds = (existingResult.data || [])
    .map((task) => task.id)
    .filter((taskId) => !localTaskIds.has(taskId));

  if (staleTaskIds.length === 0) return null;

  const deleteResult = await syncClient
    .from("tasks")
    .delete()
    .eq("list_id", list.id)
    .in("id", staleTaskIds);

  return deleteResult.error;
}

async function deleteRemoteList(listId) {
  if (!syncClient || !syncUser || !listId) return;

  const { error } = await syncClient
    .from("task_lists")
    .delete()
    .eq("id", listId);

  if (error) {
    updateSyncUi("Sync error");
    notifyUser(`Could not delete the shared list remotely. ${error.message}`);
    return;
  }

  updateSyncUi("Synced");
}

async function shareListByEmail(list) {
  if (!syncClient || !syncUser) {
    notifyUser("Sign in before sharing a list.");
    return;
  }

  if (!canManageList(list)) {
    notifyUser("Only the list owner can share this list.");
    return;
  }

  const email = normalizeEmail(askForText(`Share "${list.name}" with email`, ""));
  if (!email) return;

  if (!isValidEmail(email)) {
    notifyUser("Enter a valid email address.");
    return;
  }

  updateSyncUi("Sharing...");
  const listError = await pushSharedLists([list]);
  if (listError) {
    updateSyncUi("Share error");
    notifyUser(`Could not prepare this list for sharing. ${listError.message}`);
    return;
  }

  const { error } = await syncClient
    .from("list_invites")
    .upsert({
      list_id: list.id,
      email,
      role: "editor",
      invited_by: syncUser.id,
      accepted_at: null
    }, {
      onConflict: "list_id,email"
    });

  if (error) {
    updateSyncUi("Share error");
    notifyUser(`Could not share this list. ${error.message}`);
    return;
  }

  updateSyncUi("Synced");
  notifyUser(`Shared "${list.name}" with ${email}. They will see it after signing in with that email.`);
}

async function syncUserProfile() {
  const email = normalizeEmail(syncUser.email || "");
  if (!email) return;

  const { error } = await syncClient
    .from("profiles")
    .upsert({
      id: syncUser.id,
      email
    }, {
      onConflict: "id"
    });

  if (error) {
    updateSyncUi("Setup needed");
    notifyUser(`Supabase profile setup could not load. ${error.message}`);
  }
}

async function claimPendingListInvites() {
  const email = normalizeEmail(syncUser?.email || "");
  if (!email) return { claimed: 0, error: null };

  const { data, error } = await syncClient.rpc("claim_pending_list_invites");
  return {
    claimed: Number(data) || 0,
    error
  };
}

function scheduleRemoteRefresh(payload) {
  const source = payload.new || payload.old || {};
  if (shouldSkipRemoteRefresh()) return;
  if (syncApplyingRemoteState || source.device_id === syncDeviceId) return;

  window.clearTimeout(syncRefreshTimer);
  syncRefreshTimer = window.setTimeout(() => {
    loadRemoteState();
  }, syncRefreshDebounceMs);
}

function updateSyncUi(message = "") {
  const configured = isSupabaseConfigured();
  const defaultMessage = configured ? (syncUser ? "Saved" : "Not syncing") : "Local only";
  const offline = configured && !navigator.onLine;
  const nextMessage = message === "Sync error"
    ? "Sync error"
    : (offline ? "Offline" : normalizeSyncMessage(message || defaultMessage));

  if (message !== "Sync error") {
    clearSyncErrorDetails();
  }
  syncStatus.textContent = nextMessage;
  syncStatus.classList.toggle("is-error", nextMessage === "Sync error");
  syncStatus.classList.toggle("is-saving", nextMessage === "Saving...");
  syncStatus.classList.toggle("is-offline", nextMessage === "Offline");
  syncButton.textContent = configured ? (syncUser ? "Account" : "Sign in") : "Local";
  syncButton.classList.toggle("is-active", configured && Boolean(syncUser));
  syncButton.title = configured
    ? (syncUser ? `Signed in as ${syncUser.email || "Supabase user"}` : "Sign in to sync tasks")
    : "Add Supabase settings to enable sync";
  syncStatus.title = syncButton.title;
}

function normalizeSyncMessage(message) {
  const messages = {
    "Checking sync...": "Checking...",
    "Loading sync...": "Loading...",
    "Sending code...": "Sending code...",
    "Enter code": "Code sent",
    "Verifying...": "Verifying...",
    "Signing out...": "Signing out...",
    "Signed out": "Not syncing",
    "Synced": "Saved",
    "Saving...": "Saving...",
    "Setup needed": "Setup needed",
    "Sync unavailable": "Sync unavailable",
    "Sign-in error": "Sign-in error",
    "Share error": "Share error"
  };
  return messages[message] || message;
}

function reportSyncError(context, error) {
  const message = formatSyncError(context, error);
  console.error(message, error);
  updateSyncUi("Sync error");
  showSyncErrorDetails(message);
}

function formatSyncError(context, error) {
  const details = [
    `${context}: ${error?.message || "Unknown sync error"}`,
    error?.code ? `code: ${error.code}` : "",
    error?.details ? `details: ${error.details}` : "",
    error?.hint ? `hint: ${error.hint}` : ""
  ].filter(Boolean);
  return details.join("\n");
}

function showSyncErrorDetails(message) {
  syncLastErrorDetails = message;
  syncErrorButton.hidden = false;
  syncErrorButton.title = message;
  syncButton.title = message;
  syncStatus.title = message;
}

function clearSyncErrorDetails() {
  syncLastErrorDetails = "";
  syncErrorButton.hidden = true;
  syncErrorButton.title = "";
  syncStatus.title = "";
}

async function handleSyncErrorButtonClick() {
  if (!syncLastErrorDetails) return;
  settingsMenuOpen = false;
  renderSettingsMenu();

  let copied = false;
  try {
    await navigator.clipboard?.writeText(syncLastErrorDetails);
    copied = true;
  } catch {
    copied = false;
  }

  notifyUser(`${copied ? "Copied sync error details:\n\n" : "Sync error details:\n\n"}${syncLastErrorDetails}`);
}

function isSupabaseConfigured() {
  return Boolean(syncConfig.supabaseUrl && syncConfig.supabaseAnonKey);
}

function loadLists() {
  try {
    const savedLists = JSON.parse(localStorage.getItem(storageKey));
    if (Array.isArray(savedLists)) {
      return ensureTodayList(savedLists.map(normalizeList));
    }

    const legacyTasks = JSON.parse(localStorage.getItem(legacyStorageKey));
    if (Array.isArray(legacyTasks) && legacyTasks.length > 0) {
      return ensureTodayList([createList("Inbox", false, legacyTasks.map(normalizeTask))]);
    }
  } catch {
    return ensureTodayList([createList("Personal")]);
  }

  return ensureTodayList([createList("Personal")]);
}

function loadTomorrowQueue() {
  try {
    const savedQueue = JSON.parse(localStorage.getItem(tomorrowQueueKey));
    if (Array.isArray(savedQueue)) {
      return savedQueue.map(normalizeTomorrowQueueItem).filter(Boolean);
    }
  } catch {
    return [];
  }

  return [];
}

function loadCompletedArchiveText() {
  return localStorage.getItem(completedArchiveKey) || "";
}

function render() {
  refreshTodayText();
  const todayList = lists.find(isTodayList);
  const visibleLists = lists.filter((list) => !isTodayList(list) && shouldShowList(list));

  renderFilterMenu();
  renderSettingsMenu();
  renderTomorrowQueue();
  emptyState.hidden = visibleLists.length > 0;

  todayBoard.replaceChildren(todayList ? createListElement(todayList) : []);
  listBoard.replaceChildren(...visibleLists.map(createListElement));
}

function renderFilterMenu() {
  filterMenuLabel.textContent = filterLabels[filter] || filterLabels.all;
  filterMenuButton.setAttribute("aria-expanded", String(filterMenuOpen));
  filterMenu.hidden = !filterMenuOpen;

  filterMenu.querySelectorAll("[data-filter]").forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-checked", String(isActive));
  });
}

function renderSettingsMenu() {
  settingsMenuButton.setAttribute("aria-expanded", String(settingsMenuOpen));
  settingsMenu.hidden = !settingsMenuOpen;

  const isDark = document.documentElement.dataset.theme === "dark";
  themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.title = isDark ? "Switch to light mode" : "Switch to dark mode";
  refreshSyncButton.disabled = !isSupabaseConfigured() || !syncClient || !syncUser;
  const hasArchive = Boolean(getCompletedArchiveExportText().trim());
  viewArchiveButton.disabled = !hasArchive;
  copyArchiveButton.disabled = !hasArchive;
  downloadArchiveButton.disabled = !hasArchive;

  if (appVersionLabel) appVersionLabel.textContent = appVersion;
}

function openArchiveDialog() {
  renderArchiveDialog();
  archiveDialog.hidden = false;
  document.body.classList.add("has-modal");
}

function closeArchiveDialog() {
  archiveDialog.hidden = true;
  document.body.classList.remove("has-modal");
}

function renderArchiveDialog() {
  const entries = getArchiveEntries();
  archiveContent.replaceChildren();

  if (entries.length === 0) {
    const empty = document.createElement("p");
    empty.className = "archive-empty";
    empty.textContent = "No completed tasks have been archived yet.";
    archiveContent.append(empty);
    return;
  }

  entries.slice().reverse().forEach((entry) => {
    const section = document.createElement("section");
    section.className = "archive-day";

    const title = document.createElement("h3");
    title.textContent = entry.date;

    const list = document.createElement("ul");
    list.replaceChildren(...entry.items.map((item) => {
      const row = document.createElement("li");
      row.textContent = item;
      return row;
    }));

    section.append(title, list);
    archiveContent.append(section);
  });
}

async function copyArchiveToClipboard() {
  const archive = getCompletedArchiveExportText();
  if (!archive.trim()) {
    notifyUser("No completed tasks have been archived yet.");
    return;
  }

  let copied = false;
  try {
    await navigator.clipboard?.writeText(archive);
    copied = true;
  } catch {
    copied = false;
  }

  notifyUser(copied ? "Completed archive copied." : archive);
}

function downloadArchiveText() {
  const archive = getCompletedArchiveExportText();
  if (!archive.trim()) {
    notifyUser("No completed tasks have been archived yet.");
    return;
  }

  const url = URL.createObjectURL(new Blob([archive], { type: "text/plain" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `completed-tasks-archive-${getDateKey()}.txt`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function renderTomorrowQueue(options = {}) {
  const { scrollToBottom = false } = options;

  tomorrowToggle.setAttribute("aria-expanded", String(!tomorrowCollapsed));
  tomorrowBody.hidden = tomorrowCollapsed;
  tomorrowCount.textContent = tomorrowQueue.length === 1 ? "1 queued" : `${tomorrowQueue.length} queued`;

  if (tomorrowQueue.length === 0) {
    const empty = document.createElement("li");
    empty.className = "tomorrow-empty";
    empty.textContent = "No tasks queued.";
    tomorrowList.replaceChildren(empty);
    updateTomorrowFooterSpace();
    return;
  }

  tomorrowList.replaceChildren(...tomorrowQueue.map(createTomorrowQueueElement));
  updateTomorrowFooterSpace();
  if (scrollToBottom) {
    scrollTomorrowQueueToBottom();
  }
}

function scrollTomorrowQueueToBottom() {
  window.requestAnimationFrame(() => {
    tomorrowList.scrollTop = tomorrowList.scrollHeight;
  });
}

function createTomorrowQueueElement(entry) {
  const item = document.createElement("li");
  item.className = "tomorrow-item";
  item.dataset.tomorrowId = entry.id;

  const title = document.createElement("p");
  title.className = "tomorrow-title";
  title.textContent = entry.title;

  const button = document.createElement("button");
  button.className = "tomorrow-remove";
  button.type = "button";
  button.dataset.tomorrowAction = "delete";
  button.setAttribute("aria-label", `Remove ${entry.title}`);
  button.textContent = "Remove";

  item.append(title, button);
  return item;
}

function shouldShowList(list) {
  if (isTodayList(list)) return true;
  if (filter === "all") return true;
  const groups = getTaskGroups(list);
  return groups.openTasks.length > 0 || groups.completedTasks.length > 0;
}

function getTaskGroups(list) {
  const openTasks = list.tasks.filter((task) => !task.completed);
  const completedTasks = list.tasks.filter((task) => task.completed).sort(compareCompletedTasks);

  if (filter === "active") {
    return {
      openTasks,
      completedTasks: [],
      visibleCompletedTasks: [],
      hiddenCompletedCount: 0,
      isCompletedExpanded: false,
      showCompletedToggle: false
    };
  }

  const showAllCompleted = filter === "completed" || expandedCompletedLists.has(list.id);
  const visibleCompletedTasks = showAllCompleted ? completedTasks : completedTasks.slice(0, completedPreviewLimit);

  return {
    openTasks: filter === "completed" ? [] : openTasks,
    completedTasks,
    visibleCompletedTasks,
    hiddenCompletedCount: Math.max(0, completedTasks.length - visibleCompletedTasks.length),
    isCompletedExpanded: showAllCompleted,
    showCompletedToggle: filter === "all" && completedTasks.length > completedPreviewLimit
  };
}

function compareCompletedTasks(first, second) {
  return getCompletedTime(second) - getCompletedTime(first);
}

function getCompletedTime(task) {
  return new Date(task.completedAt || task.createdAt || 0).getTime();
}

function createListScopeLabel(list) {
  if (isTodayList(list)) return null;

  const label = document.createElement("span");
  const shared = isSharedList(list);
  label.className = `list-scope-label${shared ? " is-shared" : ""}`;
  label.textContent = shared ? "Shared" : "Private";
  return label;
}

function createListElement(list) {
  const item = document.createElement("li");
  const taskGroups = getTaskGroups(list);
  const openTasks = list.tasks.filter((task) => !task.completed).length;
  const doneTasks = list.tasks.length - openTasks;
  const bodyId = `list-body-${list.id}`;

  item.className = `standing-list${list.collapsed ? " is-collapsed" : ""}`;
  if (isTodayList(list)) {
    item.classList.add("is-pinned");
  }
  if (openMenu?.listId === list.id) {
    item.classList.add("has-open-menu");
  }
  item.dataset.listId = list.id;

  const header = document.createElement("div");
  header.className = "list-header";

  const dragHandle = createDragHandle("list", isTodayList(list) ? "Today options" : `Drag ${list.name}`, {
    draggable: !isTodayList(list),
    fixed: isTodayList(list),
    open: isMenuOpen("list", list.id)
  });

  const chevron = document.createElement("span");
  chevron.className = "chevron";
  chevron.setAttribute("aria-hidden", "true");
  chevron.textContent = list.collapsed ? "+" : "-";

  let titleControl;
  if (editingListId === list.id && !isTodayList(list)) {
    titleControl = createListRenameForm(list);
  } else {
    const toggle = document.createElement("button");
    toggle.className = "list-toggle";
    toggle.type = "button";
    toggle.dataset.action = "toggle-list";
    toggle.setAttribute("aria-expanded", String(!list.collapsed));
    toggle.setAttribute("aria-controls", bodyId);

    const title = document.createElement("span");
    title.className = "list-title";

    const titleLine = document.createElement("span");
    titleLine.className = "list-title-line";

    const name = document.createElement("span");
    name.className = "list-name";
    name.textContent = list.name;
    titleLine.append(name);
    const scopeLabel = createListScopeLabel(list);
    if (scopeLabel) {
      titleLine.append(scopeLabel);
    }
    title.append(titleLine);

    toggle.append(chevron, title);
    titleControl = toggle;
  }

  const progressText = document.createElement("span");
  progressText.className = "list-progress-text";
  progressText.textContent = formatProgressText(doneTasks, list.tasks.length);

  header.append(dragHandle, titleControl, progressText);

  const body = document.createElement("div");
  body.className = "list-body";
  body.id = bodyId;
  body.hidden = list.collapsed;

  const nestedTasks = document.createElement("ul");
  nestedTasks.className = "nested-task-list open-task-list";
  nestedTasks.replaceChildren(...taskGroups.openTasks.map((task) => createTaskElement(task, list)));

  if (taskGroups.openTasks.length > 0) {
    body.append(nestedTasks);
  } else if (shouldShowInlineEmpty(list, taskGroups)) {
    body.append(createInlineEmpty(getInlineEmptyText(list, taskGroups)));
  }
  body.append(createTaskForm(list));
  if (taskGroups.visibleCompletedTasks.length > 0) {
    body.append(createCompletedSection(list, taskGroups));
  }

  item.append(header);
  if (isMenuOpen("list", list.id)) {
    item.append(createListMenu(list));
  }
  item.append(body);
  return item;
}

function createTaskForm(list) {
  if (activeTaskFormListId !== list.id) {
    return createTaskFormLauncher(list);
  }

  const form = document.createElement("form");
  form.className = `inline-task-form${list.showDetails ? "" : " is-simple"}`;
  form.setAttribute("data-list-form", "");
  form.dataset.listId = list.id;
  form.autocomplete = "off";
  const draft = getTaskFormDraft(list.id);

  const title = document.createElement("input");
  title.name = "title";
  title.type = "text";
  title.placeholder = "Add a to-do";
  title.required = true;
  title.maxLength = 120;
  title.value = draft.title;

  const due = document.createElement("input");
  due.name = "due";
  due.type = "date";
  due.value = draft.due;

  const priority = document.createElement("select");
  priority.name = "priority";
  priority.append(createOption("normal", "Normal"), createOption("high", "High"), createOption("low", "Low"));
  priority.value = draft.priority;

  const button = document.createElement("button");
  button.className = "primary-button";
  button.type = "submit";
  button.textContent = "Add";

  const check = document.createElement("span");
  check.className = "add-task-check";
  check.setAttribute("aria-hidden", "true");

  form.append(check, createField("Task", title));
  if (list.showDetails) {
    form.append(createField("Due", due), createField("Priority", priority));
  }
  form.append(button);
  return form;
}

function createTaskFormLauncher(list) {
  const button = document.createElement("button");
  button.className = "inline-task-launcher";
  button.type = "button";
  button.dataset.action = "show-task-form";
  button.textContent = "Add a to-do";
  button.setAttribute("aria-label", `Add a to-do to ${list.name}`);
  return button;
}

function createListRenameForm(list) {
  const form = document.createElement("form");
  form.className = "list-rename-form";
  form.setAttribute("data-list-rename-form", "");
  form.dataset.listId = list.id;
  form.autocomplete = "off";

  const input = document.createElement("input");
  input.className = "list-rename-input";
  input.name = "name";
  input.type = "text";
  input.value = list.name;
  input.required = true;
  input.maxLength = 80;
  input.dataset.listRenameInput = "";
  input.setAttribute("aria-label", `Rename ${list.name}`);

  form.append(input);
  return form;
}

function createTaskRenameForm(task, list) {
  const form = document.createElement("form");
  form.className = "task-rename-form";
  form.setAttribute("data-task-rename-form", "");
  form.dataset.listId = list.id;
  form.dataset.taskId = task.id;
  form.autocomplete = "off";

  const input = document.createElement("input");
  input.className = "task-rename-input";
  input.name = "title";
  input.type = "text";
  input.value = task.title;
  input.required = true;
  input.maxLength = 120;
  input.dataset.taskRenameInput = "";
  input.setAttribute("aria-label", `Rename ${task.title}`);

  form.append(input);
  return form;
}

function createTaskElement(task, list) {
  const item = document.createElement("li");
  item.className = `task-row${task.completed ? " is-complete" : ""}`;
  if (isMenuOpen("task", list.id, task.id)) {
    item.classList.add("has-open-menu");
  }
  item.dataset.taskId = task.id;

  const dragHandle = createDragHandle("task", `Drag ${task.title}`, {
    open: isMenuOpen("task", list.id, task.id)
  });

  const check = document.createElement("button");
  check.className = "check";
  check.type = "button";
  check.dataset.action = "toggle-task";
  check.setAttribute("aria-label", task.completed ? "Mark open" : "Mark done");
  check.textContent = task.completed ? "✓" : "";

  const body = document.createElement("div");
  body.className = "task-body";
  const isEditing = isEditingTask(list.id, task.id);

  const meta = document.createElement("div");
  meta.className = "task-meta";
  if (list.showDetails) {
    meta.append(createPriorityPill(task.priority));

    if (task.due) {
      meta.append(createDuePill(task.due));
    }
  }

  if (isEditing) {
    body.append(createTaskRenameForm(task, list));
  } else {
    const title = document.createElement("p");
    title.className = "task-title";
    title.textContent = task.title;
    body.append(title);
  }
  if (!isEditing && meta.childElementCount > 0) {
    body.append(meta);
  }

  item.append(dragHandle, check, body);
  if (isMenuOpen("task", list.id, task.id)) {
    item.append(createTaskMenu(task, list));
  }
  return item;
}

function createField(labelText, control) {
  const label = document.createElement("label");
  const text = document.createElement("span");

  label.className = "field";
  text.textContent = labelText;
  label.append(text, control);
  return label;
}

function createOption(value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  return option;
}

function formatProgressText(doneTasks, totalTasks) {
  return totalTasks > 0 ? `${doneTasks}/${totalTasks} completed` : "0 completed";
}

function createInlineEmpty(text) {
  const empty = document.createElement("p");
  empty.className = "inline-empty";
  empty.textContent = text;
  return empty;
}

function createCompletedSection(list, taskGroups) {
  const section = document.createElement("div");
  section.className = "completed-section";

  const completedList = document.createElement("ul");
  completedList.className = "nested-task-list completed-task-list";
  completedList.replaceChildren(...taskGroups.visibleCompletedTasks.map((task) => createTaskElement(task, list)));
  section.append(completedList);

  if (taskGroups.showCompletedToggle) {
    const button = document.createElement("button");
    button.className = "completed-toggle";
    button.type = "button";
    button.dataset.action = "toggle-completed-list";
    button.setAttribute("aria-expanded", String(taskGroups.isCompletedExpanded));
    button.textContent = taskGroups.isCompletedExpanded
      ? "Show fewer completed to-dos"
      : `And ${taskGroups.hiddenCompletedCount} more completed to-dos...`;
    section.append(button);
  }

  return section;
}

function shouldShowInlineEmpty(list, taskGroups) {
  if (filter === "active") return list.tasks.length === 0 || list.tasks.some((task) => task.completed);
  if (filter === "completed") return taskGroups.completedTasks.length === 0;
  return list.tasks.length === 0;
}

function getInlineEmptyText(list, taskGroups) {
  if (filter === "active" && list.tasks.length > 0 && taskGroups.openTasks.length === 0) return "No open tasks in this list.";
  if (filter === "completed") return "No completed tasks in this list.";
  return "No tasks in this list.";
}

function createDragHandle(type, label, options = {}) {
  const button = document.createElement("button");
  button.className = "drag-handle";
  button.type = "button";
  button.draggable = false;
  button.dataset.menuType = type;
  if (options.draggable !== false) {
    button.dataset.dragType = type;
  }
  button.classList.toggle("is-open", Boolean(options.open));
  button.classList.toggle("is-fixed", Boolean(options.fixed));
  button.setAttribute("aria-label", label);
  button.setAttribute("aria-haspopup", "menu");
  button.title = label;
  button.setAttribute("aria-expanded", String(Boolean(options.open)));
  button.innerHTML = '<span class="drag-lines" aria-hidden="true"></span>';
  return button;
}

function createListMenu(list) {
  const menu = document.createElement("div");
  menu.className = "handle-menu list-handle-menu";
  menu.setAttribute("role", "menu");

  menu.append(createMenuButton("Details", "toggle-fields", list.showDetails ? `Hide details for ${list.name}` : `Show details for ${list.name}`, list.showDetails));
  if (!isTodayList(list)) {
    if (canShareList(list)) {
      menu.append(createMenuButton("Share", "share-list", `Share ${list.name}`));
    }
    menu.append(createMenuButton("Edit", "edit-list", `Edit ${list.name}`));
    if (canManageList(list)) {
      menu.append(createMenuButton("Delete", "delete-list", `Delete ${list.name}`, false, true));
    }
  }

  return menu;
}

function createTaskMenu(task, list) {
  const menu = document.createElement("div");
  menu.className = "handle-menu task-handle-menu";
  menu.setAttribute("role", "menu");
  menu.append(
    createMenuButton("Edit", "edit-task", `Edit ${task.title}`),
    createMenuButton("Delete", "delete-task", `Delete ${task.title}`, false, true)
  );
  if (isTodayList(list)) {
    menu.append(createMenuButton("Bump to Tomorrow", "move-task-tomorrow", `Bump ${task.title} to Tomorrow`));
  }
  return menu;
}

function createMenuButton(label, action, ariaLabel = label, active = false, danger = false) {
  const button = createActionButton(label, action, ariaLabel);
  button.className = "menu-link";
  button.classList.toggle("is-active", active);
  button.classList.toggle("is-danger", danger);
  if (action === "toggle-fields") {
    button.setAttribute("role", "menuitemcheckbox");
    button.setAttribute("aria-checked", String(Boolean(active)));
  } else {
    button.setAttribute("role", "menuitem");
  }
  return button;
}

function createPriorityPill(priority) {
  const pill = document.createElement("span");
  pill.className = `pill ${priority}`;
  pill.textContent = priority === "high" ? "High" : priority === "low" ? "Low" : "Normal";
  return pill;
}

function createDuePill(due) {
  const pill = document.createElement("span");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(`${due}T00:00:00`);

  pill.className = `pill${dueDate < today ? " overdue" : ""}`;
  pill.textContent = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric"
  }).format(dueDate);
  return pill;
}

function createActionButton(label, action, ariaLabel = label) {
  const button = document.createElement("button");
  button.className = `task-action ${action.includes("delete") ? "delete" : ""}`;
  button.type = "button";
  button.dataset.action = action;
  button.setAttribute("aria-label", ariaLabel);
  button.textContent = label;
  return button;
}

function toggleHandleMenu(handle) {
  const listElement = handle.closest("[data-list-id]");
  const list = findList(listElement?.dataset.listId);
  if (!list) return;

  const type = handle.dataset.menuType;
  const taskElement = handle.closest("[data-task-id]");
  const taskId = type === "task" ? taskElement?.dataset.taskId : null;
  const nextMenu = { type, listId: list.id, taskId };

  openMenu = isMenuOpen(type, list.id, taskId) ? null : nextMenu;
  render();
}

function isMenuOpen(type, listId, taskId = null) {
  return openMenu?.type === type && openMenu?.listId === listId && (type !== "task" || openMenu?.taskId === taskId);
}

function finishListRename(form) {
  const list = findList(form?.dataset.listId);
  if (!list || isTodayList(list) || editingListId !== list.id) return;

  const nextName = form.elements.name.value.trim();
  if (nextName) {
    list.name = nextName;
  }

  editingListId = null;
  openMenu = null;
  persistAndRender({ sharedListIds: [list.id] });
}

function finishTaskRename(form) {
  const listId = form?.dataset.listId;
  const taskId = form?.dataset.taskId;
  const list = findList(listId);
  const task = list?.tasks.find((item) => item.id === taskId);
  if (!list || !task || !isEditingTask(list.id, task.id)) return;

  const nextTitle = form.elements.title.value.trim();
  if (nextTitle) {
    task.title = nextTitle;
  }

  editingTask = null;
  openMenu = null;
  persistAndRender({ sharedListIds: [list.id] });
}

function askForText(message, currentValue) {
  return runWithRemoteRefreshPaused(() => {
    try {
      return window.prompt(message, currentValue);
    } catch {
      return null;
    }
  }, null);
}

function askToConfirm(message) {
  return runWithRemoteRefreshPaused(() => {
    try {
      return window.confirm(message);
    } catch {
      return true;
    }
  }, true);
}

function notifyUser(message) {
  runWithRemoteRefreshPaused(() => {
    window.alert(message);
  });
}

function showUndo(message, undo) {
  window.clearTimeout(undoTimer);
  undoAction = typeof undo === "function" ? undo : null;
  undoMessage.textContent = message;
  undoToast.hidden = false;

  undoTimer = window.setTimeout(clearUndoAction, undoTimeoutMs);
}

function clearUndoAction() {
  window.clearTimeout(undoTimer);
  undoTimer = null;
  undoAction = null;
  undoToast.hidden = true;
  undoMessage.textContent = "";
}

function runUndoAction() {
  const action = undoAction;
  clearUndoAction();
  action?.();
}

function runWithRemoteRefreshPaused(callback, fallbackValue = undefined) {
  syncDialogOpen = true;
  pauseRemoteRefresh(syncDialogPauseMs);
  try {
    return callback();
  } catch {
    return fallbackValue;
  } finally {
    pauseRemoteRefresh(syncDialogPauseMs);
    window.setTimeout(() => {
      syncDialogOpen = false;
    }, 0);
  }
}

function pauseRemoteRefresh(durationMs = syncDialogPauseMs) {
  syncSkipRemoteRefreshUntil = Math.max(syncSkipRemoteRefreshUntil, Date.now() + durationMs);
}

function shouldSkipRemoteRefresh() {
  return syncDialogOpen || Date.now() < syncSkipRemoteRefreshUntil;
}

function createTask(title, options = {}) {
  const completed = Boolean(options.completed);
  const createdAt = options.createdAt || new Date().toISOString();
  const priorities = ["normal", "high", "low"];

  return {
    id: options.id || uid(),
    title,
    due: options.due || "",
    priority: priorities.includes(options.priority) ? options.priority : "normal",
    completed,
    completedAt: options.completedAt || (completed ? createdAt : ""),
    createdAt
  };
}

function createList(name, collapsed = false, tasks = [], options = {}) {
  return {
    id: options.id || uid(),
    name,
    collapsed,
    tasks,
    createdAt: options.createdAt || new Date().toISOString(),
    type: options.type || "standard",
    showDetails: Boolean(options.showDetails),
    ownerId: options.ownerId || "",
    shared: Boolean(options.shared),
    memberRole: options.memberRole || "",
    completedArchiveText: typeof options.completedArchiveText === "string" ? options.completedArchiveText : "",
    lastTodayDateKey: options.lastTodayDateKey || ""
  };
}

function normalizeList(list) {
  return {
    id: list.id || uid(),
    name: list.name || "Untitled",
    collapsed: Boolean(list.collapsed),
    tasks: Array.isArray(list.tasks) ? list.tasks.map(normalizeTask) : [],
    createdAt: list.createdAt || new Date().toISOString(),
    type: list.type || "standard",
    showDetails: Boolean(list.showDetails),
    ownerId: list.ownerId || list.owner_id || "",
    shared: Boolean(list.shared),
    memberRole: list.memberRole || list.member_role || "",
    completedArchiveText: typeof list.completedArchiveText === "string" ? list.completedArchiveText : "",
    lastTodayDateKey: list.lastTodayDateKey || ""
  };
}

function normalizeTask(task) {
  return createTask(task.title || "Untitled task", task);
}

function cloneList(list) {
  return normalizeList(JSON.parse(JSON.stringify(list)));
}

function cloneTask(task) {
  return normalizeTask({ ...task });
}

function cloneTomorrowQueueItem(item) {
  return item ? normalizeTomorrowQueueItem({ ...item }) : null;
}

function insertListAt(list, index) {
  const nextList = cloneList(list);
  const nextLists = ensureTodayList(lists).filter((item) => item.id !== nextList.id);
  const insertIndex = Math.max(1, Math.min(Number.isInteger(index) ? index : nextLists.length, nextLists.length));
  nextLists.splice(insertIndex, 0, nextList);
  lists = ensureTodayList(nextLists);
}

function insertTaskAt(list, task, index) {
  if (!list || !task) return;

  const nextTask = cloneTask(task);
  list.tasks = list.tasks.filter((item) => item.id !== nextTask.id);
  const insertIndex = Math.max(0, Math.min(Number.isInteger(index) ? index : list.tasks.length, list.tasks.length));
  list.tasks.splice(insertIndex, 0, nextTask);
}

function restoreTaskSnapshot(list, task, index) {
  insertTaskAt(list, task, index);
}

function insertTomorrowQueueItemAt(item, index) {
  const nextItem = cloneTomorrowQueueItem(item);
  if (!nextItem) return;

  tomorrowQueue = tomorrowQueue.filter((entry) => entry.id !== nextItem.id);
  const insertIndex = Math.max(0, Math.min(Number.isInteger(index) ? index : tomorrowQueue.length, tomorrowQueue.length));
  tomorrowQueue.splice(insertIndex, 0, nextItem);
}

function listToRow(list, position, updatedAt) {
  return {
    id: list.id,
    owner_id: list.ownerId || syncUser.id,
    name: list.name,
    collapsed: Boolean(list.collapsed),
    type: list.type || "standard",
    show_details: Boolean(list.showDetails),
    created_at: list.createdAt || updatedAt,
    position,
    updated_at: updatedAt,
    device_id: syncDeviceId
  };
}

function listToEditableRow(list, position, updatedAt) {
  return {
    name: list.name,
    collapsed: Boolean(list.collapsed),
    type: list.type || "standard",
    show_details: Boolean(list.showDetails),
    created_at: list.createdAt || updatedAt,
    position,
    updated_at: updatedAt,
    device_id: syncDeviceId
  };
}

function taskToRow(task, listId, position, updatedAt) {
  return {
    id: task.id,
    list_id: listId,
    title: task.title,
    due: task.due || null,
    priority: task.priority || "normal",
    completed: Boolean(task.completed),
    completed_at: task.completedAt || null,
    created_at: task.createdAt || updatedAt,
    position,
    updated_at: updatedAt,
    device_id: syncDeviceId
  };
}

function rowToList(row, tasks, memberRole = "") {
  return createList(row.name || "Untitled", Boolean(row.collapsed), tasks, {
    id: row.id,
    createdAt: row.created_at,
    type: row.type || "standard",
    showDetails: row.show_details,
    ownerId: row.owner_id,
    shared: row.owner_id !== syncUser?.id,
    memberRole
  });
}

function rowToTask(row) {
  return createTask(row.title || "Untitled task", {
    id: row.id,
    due: row.due || "",
    priority: row.priority || "normal",
    completed: row.completed,
    completedAt: row.completed_at || "",
    createdAt: row.created_at
  });
}

function createTomorrowQueueItem(title, options = {}) {
  return {
    id: options.id || uid(),
    title,
    targetDate: options.targetDate || getTomorrowDateKey(),
    createdAt: options.createdAt || new Date().toISOString()
  };
}

function normalizeTomorrowQueueItem(item) {
  if (typeof item === "string") {
    const title = item.trim();
    return title ? createTomorrowQueueItem(title) : null;
  }

  const title = item?.title?.trim();
  if (!title) return null;

  return createTomorrowQueueItem(title, {
    id: item.id,
    targetDate: item.targetDate || getTomorrowDateKey(new Date(item.createdAt || Date.now())),
    createdAt: item.createdAt
  });
}

function normalizeTomorrowQueue(queue) {
  return Array.isArray(queue) ? queue.map(normalizeTomorrowQueueItem).filter(Boolean) : [];
}

function findList(id) {
  return lists.find((list) => list.id === id);
}

function getActiveUserId() {
  return syncUser?.id || "";
}

function getPrivateLists(sourceLists = lists) {
  return ensureTodayList(sourceLists).filter(isTodayList).map((list) => ({
    ...list,
    completedArchiveText,
    lastTodayDateKey
  }));
}

function getStandingLists(sourceLists = lists) {
  return ensureTodayList(sourceLists).filter((list) => !isTodayList(list));
}

function canManageList(list) {
  return !list.ownerId || list.ownerId === syncUser?.id;
}

function canEditList(list) {
  return canManageList(list) || ["admin", "editor"].includes(list.memberRole);
}

function canShareList(list) {
  return !isTodayList(list) && canManageList(list);
}

function isSharedList(list) {
  return Boolean(list?.shared || list?.memberRole);
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getTaskFormDraft(listId) {
  return taskFormDrafts.get(listId) || {
    title: "",
    due: "",
    priority: "normal"
  };
}

function rememberTaskFormDraft(form) {
  const title = form.elements.title?.value || "";
  const due = form.elements.due?.value || "";
  const priority = form.elements.priority?.value || "normal";
  const hasDraft = title.trim() || due || priority !== "normal";

  if (!hasDraft) {
    clearTaskFormDraft(form.dataset.listId);
    return;
  }

  taskFormDrafts.set(form.dataset.listId, {
    title,
    due,
    priority
  });
}

function clearTaskFormDraft(listId) {
  taskFormDrafts.delete(listId);
}

function isTaskFormPointerActive() {
  return Date.now() < taskFormPointerActiveUntil;
}

function collapseActiveTaskFormFromOutsideClick(event) {
  if (!activeTaskFormListId) return;
  if (event.target.closest("form[data-list-form], .inline-task-launcher")) return;

  const form = findInTaskBoards(`form[data-list-form][data-list-id="${activeTaskFormListId}"]`);
  if (form) {
    rememberTaskFormDraft(form);
  }

  activeTaskFormListId = null;
  render();
}

function focusTaskInput(listId) {
  const forms = taskBoards.flatMap((board) => Array.from(board.querySelectorAll("form[data-list-form]")));
  const form = forms.find((item) => item.dataset.listId === listId);
  const input = form?.elements.title;

  if (!input) return;
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
}

function focusListRenameInput(listId) {
  const input = findInTaskBoards(`[data-list-id="${listId}"] input[data-list-rename-input]`);
  if (!input) return;

  input.focus();
  input.select();
}

function focusTaskRenameInput(listId, taskId) {
  const input = findInTaskBoards(`[data-list-id="${listId}"] [data-task-id="${taskId}"] input[data-task-rename-input]`);
  if (!input) return;

  input.focus();
  input.select();
}

function handleDragPointerDown(event) {
  const handle = event.target.closest("[data-drag-type]");
  if (!handle || !isInsideTaskBoard(handle) || event.button > 0) return;

  const listElement = handle.closest("[data-list-id]");
  const list = findList(listElement?.dataset.listId);
  if (!list) return;

  const type = handle.dataset.dragType;
  if (type === "list" && isTodayList(list)) return;

  const taskElement = handle.closest("[data-task-id]");
  if (type === "task" && !taskElement) return;

  dragState = {
    active: false,
    handle,
    listId: list.id,
    pointerId: event.pointerId,
    position: "after",
    startX: event.clientX,
    startY: event.clientY,
    targetListId: null,
    targetTaskId: null,
    taskId: taskElement?.dataset.taskId || null,
    type
  };

  handle.setPointerCapture?.(event.pointerId);
  document.addEventListener("pointermove", handleDragPointerMove);
  document.addEventListener("pointerup", handleDragPointerUp, { once: true });
  document.addEventListener("pointercancel", handleDragPointerCancel, { once: true });
}

function handleDragPointerMove(event) {
  if (!dragState || event.pointerId !== dragState.pointerId) return;

  const movement = Math.hypot(event.clientX - dragState.startX, event.clientY - dragState.startY);
  if (!dragState.active && movement < 6) return;

  if (!dragState.active) {
    dragState.active = true;
    openMenu = null;
    document.body.classList.add("is-reordering");
    getDragSourceElement()?.classList.add("is-dragging");
  }

  event.preventDefault();
  updateDragTarget(event.clientX, event.clientY);
}

function handleDragPointerUp(event) {
  if (!dragState || event.pointerId !== dragState.pointerId) return;

  suppressHandleClick = dragState.active;

  if (dragState.active && dragState.targetListId) {
    if (dragState.type === "list") {
      moveList(dragState.listId, dragState.targetListId, dragState.position);
    } else {
      moveTask(dragState.listId, dragState.taskId, dragState.targetListId, dragState.targetTaskId, dragState.position);
    }
  }

  cleanupDragState();
}

function handleDragPointerCancel() {
  cleanupDragState();
}

function updateDragTarget(x, y) {
  clearDragIndicators();
  if (!dragState) return;

  const element = document.elementFromPoint(x, y);
  if (!element) return;

  if (dragState.type === "list") {
    updateListDragTarget(element, y);
    return;
  }

  updateTaskDragTarget(element, y);
}

function updateListDragTarget(element, y) {
  const targetElement = element.closest(".standing-list[data-list-id]");
  const targetList = findList(targetElement?.dataset.listId);
  if (!targetElement || !targetList || targetList.id === dragState.listId) return;

  const box = targetElement.getBoundingClientRect();
  let position = y > box.top + box.height / 2 ? "after" : "before";
  if (isTodayList(targetList)) {
    position = "after";
  }

  targetElement.classList.add(position === "before" ? "is-drag-over-before" : "is-drag-over-after");
  dragState.targetListId = targetList.id;
  dragState.position = position;
}

function updateTaskDragTarget(element, y) {
  const targetListElement = element.closest(".standing-list[data-list-id]");
  const targetList = findList(targetListElement?.dataset.listId);
  if (!targetListElement || !targetList) return;

  const targetTaskElement = element.closest(".task-row[data-task-id]");
  if (targetTaskElement && targetListElement.contains(targetTaskElement)) {
    const targetTaskId = targetTaskElement.dataset.taskId;
    if (targetList.id === dragState.listId && targetTaskId === dragState.taskId) return;

    const box = targetTaskElement.getBoundingClientRect();
    const position = y > box.top + box.height / 2 ? "after" : "before";
    targetTaskElement.classList.add(position === "before" ? "is-drag-over-before" : "is-drag-over-after");
    dragState.targetListId = targetList.id;
    dragState.targetTaskId = targetTaskId;
    dragState.position = position;
    return;
  }

  targetListElement.classList.add("is-task-drop-target");
  dragState.targetListId = targetList.id;
  dragState.targetTaskId = null;
  dragState.position = "after";
}

function moveList(sourceListId, targetListId, position) {
  if (sourceListId === targetListId) return;

  const sourceIndex = lists.findIndex((list) => list.id === sourceListId);
  if (sourceIndex < 0 || isTodayList(lists[sourceIndex])) return;

  const [list] = lists.splice(sourceIndex, 1);
  const targetIndex = lists.findIndex((item) => item.id === targetListId);
  if (targetIndex < 0) {
    lists.push(list);
    persistAndRender();
    return;
  }

  let insertIndex = targetIndex + (position === "after" ? 1 : 0);
  if (targetIndex === 0 && isTodayList(lists[targetIndex])) {
    insertIndex = 1;
  }
  insertIndex = Math.max(1, insertIndex);
  lists.splice(insertIndex, 0, list);
  persistAndRender();
}

function moveTask(sourceListId, taskId, targetListId, targetTaskId, position) {
  const sourceList = findList(sourceListId);
  const targetList = findList(targetListId);
  if (!sourceList || !targetList || !taskId) return;
  if (sourceListId === targetListId && taskId === targetTaskId) return;

  const sourceIndex = sourceList.tasks.findIndex((task) => task.id === taskId);
  if (sourceIndex < 0) return;

  const [task] = sourceList.tasks.splice(sourceIndex, 1);
  let insertIndex = targetList.tasks.length;

  if (targetTaskId) {
    const targetIndex = targetList.tasks.findIndex((item) => item.id === targetTaskId);
    if (targetIndex >= 0) {
      insertIndex = targetIndex + (position === "after" ? 1 : 0);
    }
  }

  targetList.tasks.splice(insertIndex, 0, task);
  targetList.collapsed = false;
  if (isEditingTask(sourceListId, taskId)) {
    editingTask = null;
  }
  persistAndRender({ sharedListIds: [sourceList.id, targetList.id] });
}

function moveTaskToOpenBottom(list, taskId) {
  const sourceIndex = list.tasks.findIndex((task) => task.id === taskId);
  if (sourceIndex < 0) return;

  const [task] = list.tasks.splice(sourceIndex, 1);
  list.tasks.push(task);
}

function isEditingTask(listId, taskId) {
  return editingTask?.listId === listId && editingTask?.taskId === taskId;
}

function getDragSourceElement() {
  if (!dragState) return null;

  if (dragState.type === "list") {
    return findInTaskBoards(`[data-list-id="${dragState.listId}"]`);
  }

  return findInTaskBoards(`[data-task-id="${dragState.taskId}"]`);
}

function clearDragIndicators() {
  taskBoards.forEach((board) => {
    board.querySelectorAll(".is-drag-over-before, .is-drag-over-after, .is-task-drop-target").forEach((element) => {
      element.classList.remove("is-drag-over-before", "is-drag-over-after", "is-task-drop-target");
    });
  });
}

function findInTaskBoards(selector) {
  for (const board of taskBoards) {
    const match = board.querySelector(selector);
    if (match) return match;
  }

  return null;
}

function isInsideTaskBoard(element) {
  return taskBoards.some((board) => board.contains(element));
}

function cleanupDragState() {
  document.removeEventListener("pointermove", handleDragPointerMove);
  document.removeEventListener("pointerup", handleDragPointerUp);
  document.removeEventListener("pointercancel", handleDragPointerCancel);
  clearDragIndicators();
  getDragSourceElement()?.classList.remove("is-dragging");
  document.body.classList.remove("is-reordering");
  dragState = null;
}

function rollTomorrowQueueIntoToday(options = {}) {
  const dateChanged = refreshTodayText();

  const todayKey = getDateKey();
  const dayChanged = lastTodayDateKey !== todayKey;
  if (dayChanged) {
    lists = ensureTodayList(lists);
    archiveCompletedTodayTasks(lastTodayDateKey);
    lastTodayDateKey = todayKey;
    lists = applyArchiveMetadataToLists(lists);
    persistArchiveState();
  }

  const dueItems = tomorrowQueue.filter((item) => item.targetDate <= todayKey);
  if (dueItems.length === 0) {
    if (dayChanged) {
      persistLists({ syncShared: false });
    }
    if (options.renderAfter && (dateChanged || dayChanged)) render();
    return;
  }

  lists = ensureTodayList(lists);
  const todayList = lists.find(isTodayList);
  if (!todayList) return;

  dueItems.forEach((item) => {
    todayList.tasks.push(createTask(item.title));
  });
  todayList.collapsed = false;
  tomorrowQueue = tomorrowQueue.filter((item) => item.targetDate > todayKey);
  persistLists({ syncShared: false });
  persistTomorrowQueue();

  if (options.renderAfter) {
    render();
  }
}

function scheduleNextRollover() {
  if (rolloverTimer) {
    window.clearTimeout(rolloverTimer);
  }

  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 1, 0);
  rolloverTimer = window.setTimeout(() => {
    rollTomorrowQueueIntoToday({ renderAfter: true });
    scheduleNextRollover();
  }, Math.max(1000, nextMidnight.getTime() - now.getTime()));
}

function ensureTodayList(rawLists) {
  const todayList = createList("Today", false, [], {
    id: todayListId,
    type: todayListType
  });
  const regularLists = [];

  rawLists.forEach((list) => {
    if (isTodayListCandidate(list)) {
      todayList.collapsed = Boolean(list.collapsed);
      todayList.createdAt = list.createdAt || todayList.createdAt;
      todayList.showDetails = Boolean(list.showDetails);
      todayList.completedArchiveText = typeof list.completedArchiveText === "string"
        ? list.completedArchiveText
        : todayList.completedArchiveText;
      todayList.lastTodayDateKey = list.lastTodayDateKey || todayList.lastTodayDateKey;
      todayList.tasks.push(...list.tasks);
      return;
    }

    regularLists.push({
      ...list,
      type: list.type === todayListType ? "standard" : list.type
    });
  });

  return [todayList, ...regularLists];
}

function archiveCompletedTodayTasks(archiveDateKey) {
  const todayList = lists.find(isTodayList);
  if (!todayList) return false;

  const completedTasks = todayList.tasks.filter((task) => task.completed);
  if (completedTasks.length === 0) return false;

  const archiveBlock = [
    formatArchiveDate(archiveDateKey),
    ...completedTasks.map((task) => `- ${task.title}`),
    ""
  ].join("\n");

  completedArchiveText = appendArchiveText(completedArchiveText, archiveBlock);
  todayList.tasks = todayList.tasks.filter((task) => !task.completed);
  return true;
}

function appendArchiveText(existingText, nextBlock) {
  const trimmedExisting = existingText.trimEnd();
  return trimmedExisting ? `${trimmedExisting}\n\n${nextBlock}` : `${nextBlock}`;
}

function hydrateArchiveStateFromLists(sourceLists) {
  const todayList = sourceLists.find(isTodayListCandidate);
  if (!todayList) return;

  if (typeof todayList.completedArchiveText === "string" && todayList.completedArchiveText.trim()) {
    completedArchiveText = todayList.completedArchiveText;
  }

  if (todayList.lastTodayDateKey) {
    lastTodayDateKey = todayList.lastTodayDateKey;
  }

  persistArchiveState();
}

function applyArchiveMetadataToLists(sourceLists) {
  const nextLists = ensureTodayList(sourceLists);
  const todayList = nextLists.find(isTodayList);
  if (todayList) {
    todayList.completedArchiveText = completedArchiveText;
    todayList.lastTodayDateKey = lastTodayDateKey;
  }
  return nextLists;
}

function persistArchiveState() {
  localStorage.setItem(completedArchiveKey, completedArchiveText);
  localStorage.setItem(todayDateKeyStorageKey, lastTodayDateKey);
}

function isTodayList(list) {
  return list?.id === todayListId || list?.type === todayListType;
}

function isTodayListCandidate(list) {
  return isTodayList(list) || list?.name?.trim().toLowerCase() === "today";
}

function refreshTodayText() {
  const nextTodayText = formatTodayDate();
  const changed = nextTodayText !== todayText;
  todayText = nextTodayText;
  if (todayLabel) todayLabel.textContent = todayText;
  return changed;
}

function updateTomorrowFooterSpace() {
  window.requestAnimationFrame(() => {
    const footerHeight = tomorrowSection?.getBoundingClientRect().height || 0;
    document.documentElement.style.setProperty("--tomorrow-footer-space", `${footerHeight + 18}px`);
  });
}

function formatTodayDate() {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(new Date());
}

function formatArchiveDate(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = Number.isInteger(year) && Number.isInteger(month) && Number.isInteger(day)
    ? new Date(year, month - 1, day)
    : new Date();

  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

function getCompletedArchiveExportText() {
  return completedArchiveText.trimEnd();
}

function getArchiveEntries() {
  return getCompletedArchiveExportText()
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const [date, ...taskLines] = block.split("\n").map((line) => line.trim()).filter(Boolean);
      return {
        date: date || "Archived tasks",
        items: taskLines.map((line) => line.replace(/^-\s*/, "")).filter(Boolean)
      };
    })
    .filter((entry) => entry.items.length > 0);
}

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTomorrowDateKey(date = new Date()) {
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getDateKey(tomorrow);
}

function getOrCreateDeviceId() {
  const existing = localStorage.getItem(syncDeviceKey);
  if (existing) return existing;

  const nextId = uid();
  localStorage.setItem(syncDeviceKey, nextId);
  return nextId;
}

function uid() {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
