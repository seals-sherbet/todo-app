const storageKey = "taskLists.v2";
const legacyStorageKey = "tasks.v1";
const themeKey = "tasks.theme";
const tomorrowQueueKey = "tasks.tomorrowQueue.v1";
const scheduledQueueKey = "tasks.scheduledQueue.v1";
const onHoldQueueKey = "tasks.onHoldQueue.v1";
const tomorrowCollapsedKey = "tasks.tomorrowCollapsed.v1";
const footerTabKey = "tasks.footerTab.v1";
const appOptionsKey = "tasks.options.v1";
const listCollapseKey = "tasks.listCollapse.v1";
const syncDeviceKey = "tasks.syncDeviceId.v1";
const syncUserStorageKey = "tasks.syncUserId.v1";
const completedArchiveKey = "tasks.completedArchive.v1";
const sharedTaskDeletionKey = "tasks.sharedTaskDeletions.v1";
const todayDateKeyStorageKey = "tasks.todayDateKey.v1";
const syncLastSuccessKey = "tasks.lastSyncSuccess.v1";
const deletedTaskTitle = "__tasks_deleted__";
const privateDocumentFields = "lists,tomorrow_queue,scheduled_queue,on_hold_queue,updated_at,device_id";
const legacyPrivateDocumentFields = "lists,tomorrow_queue,scheduled_queue,updated_at,device_id";
const sharedTaskRowFields = "id,list_id,title,due,priority,completed,completed_at,created_at,position,updated_at,repeat";
const legacySharedTaskRowFields = "id,list_id,title,due,priority,completed,completed_at,created_at,position,updated_at";
const todayListId = "pinned-today";
const todayListType = "today";
const projectListName = "Projects";
const projectListType = "project";
const syncDebounceMs = 700;
const syncRefreshDebounceMs = 500;
const syncDialogPauseMs = 5000;
const syncLocalWritePauseMs = 3500;
const taskFormPointerGraceMs = 800;
const undoTimeoutMs = 8000;
const pullToSyncStartZone = 140;
const pullToSyncThreshold = 70;
const appVersion = "0.2.11";

const listForm = document.querySelector("#listForm");
const listName = document.querySelector("#listName");
const listComposer = document.querySelector(".composer");
const todayBoard = document.querySelector("#todayBoard");
const listBoard = document.querySelector("#listBoard");
const projectBoard = document.querySelector("#projectBoard");
const emptyState = document.querySelector("#emptyState");
const settingsMenuButton = document.querySelector("#settingsMenuButton");
const settingsMenu = document.querySelector("#settingsMenu");
const appVersionLabel = document.querySelector("#appVersion");
const lastSyncedAtLabel = document.querySelector("#lastSyncedAt");
const themeToggle = document.querySelector("#themeToggle");
const optionsToggleButton = document.querySelector("#optionsToggleButton");
const settingsOptions = document.querySelector("#settingsOptions");
const showProjectsOption = document.querySelector("#showProjectsOption");
const showTomorrowOption = document.querySelector("#showTomorrowOption");
const showScheduledOption = document.querySelector("#showScheduledOption");
const showOnHoldOption = document.querySelector("#showOnHoldOption");
const compactModeOption = document.querySelector("#compactModeOption");
const weekendModeOption = document.querySelector("#weekendModeOption");
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
const footerTray = document.querySelector("#footerTray");
const footerTabs = [...document.querySelectorAll("[data-footer-tab]")];
const footerPanels = [...document.querySelectorAll("[data-footer-panel]")];
const projectSection = document.querySelector(".project-section");
const scheduledSection = document.querySelector(".scheduled-section");
const onHoldSection = document.querySelector(".on-hold-section");
const tomorrowSection = document.querySelector(".tomorrow-section");
const tomorrowToggle = document.querySelector("#tomorrowToggle");
const tomorrowLabel = document.querySelector("#tomorrowLabel");
const tomorrowBody = document.querySelector("#tomorrowBody");
const tomorrowCount = document.querySelector("#tomorrowCount");
const projectCount = document.querySelector("#projectCount");
const scheduledCount = document.querySelector("#scheduledCount");
const onHoldCount = document.querySelector("#onHoldCount");
const scheduledList = document.querySelector("#scheduledList");
const scheduledForm = document.querySelector("#scheduledForm");
const scheduledInput = document.querySelector("#scheduledInput");
const scheduledDateInput = document.querySelector("#scheduledDateInput");
const scheduledDateButton = document.querySelector("#scheduledDateButton");
const scheduledDatePicker = document.querySelector("#scheduledDatePicker");
const scheduledDatePickerLabel = document.querySelector("#scheduledDatePickerLabel");
const scheduledDateGrid = document.querySelector("#scheduledDateGrid");
const onHoldList = document.querySelector("#onHoldList");
const onHoldForm = document.querySelector("#onHoldForm");
const onHoldInput = document.querySelector("#onHoldInput");
const tomorrowList = document.querySelector("#tomorrowList");
const tomorrowForm = document.querySelector("#tomorrowForm");
const tomorrowInput = document.querySelector("#tomorrowInput");
const taskBoards = [todayBoard, listBoard, projectBoard].filter(Boolean);
const filterLabels = {
  all: "All",
  active: "Open",
  completed: "Completed",
  shared: "Shared",
  private: "Private",
  hidden: "All Hidden"
};
const defaultListColor = "default";
const listColorOptions = [
  { value: defaultListColor, label: "Red Violet" },
  { value: "sage", label: "Sage" },
  { value: "sky", label: "Sky" },
  { value: "amber", label: "Amber" },
  { value: "slate", label: "Slate" }
];
const listColorValues = new Set(listColorOptions.map((option) => option.value));
const repeatOffValue = "off";
const repeatOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekdays", label: "Weekdays" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" }
];
const repeatOptionValues = new Set(repeatOptions.map((option) => option.value));
const monthlyPatternRepeatMode = "monthly-pattern";
const monthlyRepeatNamedDayOrdinalOptions = [
  ...Array.from({ length: 4 }, (_, index) => createMonthlyRepeatOrdinalOption(index + 1)),
  { value: "last", label: "Last", index: -1 }
];
const monthlyRepeatWeekdayOrdinalOptions = [
  ...Array.from({ length: 20 }, (_, index) => createMonthlyRepeatOrdinalOption(index + 1)),
  { value: "last", label: "Last", index: -1 }
];
const monthlyRepeatDayOptions = [
  { value: "weekday", label: "Weekday", match: "weekday" },
  { value: "monday", label: "Monday", day: 1 },
  { value: "tuesday", label: "Tuesday", day: 2 },
  { value: "wednesday", label: "Wednesday", day: 3 },
  { value: "thursday", label: "Thursday", day: 4 },
  { value: "friday", label: "Friday", day: 5 },
  { value: "saturday", label: "Saturday", day: 6 },
  { value: "sunday", label: "Sunday", day: 0 }
];
const monthlyRepeatPatternOptions = monthlyRepeatDayOptions.flatMap((dayOption) =>
  getMonthlyRepeatOrdinalOptionsForDay(dayOption.value).map((ordinal) => ({
    value: getMonthlyRepeatPatternValue(ordinal.value, dayOption.value),
    label: `${ordinal.label} ${dayOption.label}`,
    fullLabel: `${ordinal.fullLabel || ordinal.label.toLowerCase()} ${dayOption.match ? dayOption.label.toLowerCase() : dayOption.label}`,
    badge: `${ordinal.badgeLabel || ordinal.label} ${dayOption.label}`,
    ordinal: ordinal.value,
    ordinalIndex: ordinal.index,
    day: dayOption.value,
    dayIndex: dayOption.day,
    match: dayOption.match
  }))
);
const supportedMonthlyRepeatPatternOptions = monthlyRepeatPatternOptions;
const monthlyRepeatPatternValues = new Set(supportedMonthlyRepeatPatternOptions.map((option) => option.value));

let completedArchiveText = loadCompletedArchiveText();
let deletedSharedTasks = loadDeletedSharedTasks();
let listCollapsePrefs = loadListCollapsePrefs();
let lastTodayDateKey = localStorage.getItem(todayDateKeyStorageKey) || getDateKey();
const syncDeviceId = getOrCreateDeviceId();
let syncUser = null;
let lists = loadLists();
hydrateArchiveStateFromLists(lists);
lists = applyArchiveMetadataToLists(lists);
persistArchiveState();
let appOptions = loadAppOptions();
let tomorrowQueue = loadTomorrowQueue();
let scheduledQueue = loadScheduledQueue();
let onHoldQueue = loadOnHoldQueue();
let filter = "all";
let dragState = null;
let openMenu = null;
let filterMenuOpen = false;
let settingsMenuOpen = false;
let settingsOptionsOpen = false;
let editingListId = null;
let editingTask = null;
let tomorrowCollapsed = localStorage.getItem(tomorrowCollapsedKey) === "true";
let activeFooterTab = localStorage.getItem(footerTabKey) ?? (tomorrowCollapsed ? "" : "tomorrow");
let scheduledDatePickerOpen = false;
let scheduledDatePickerViewDate = null;
let expandedCompletedLists = new Set();
let activeTaskFormListId = null;
const taskFormDrafts = new Map();
const inviteStatusCache = new Map();
let taskFormPointerActiveUntil = 0;
let suppressHandleClick = false;
let todayText = formatTodayDate();
let rolloverTimer = null;
let syncClient = null;
let syncChannel = null;
let syncPushTimer = null;
let syncRefreshTimer = null;
let syncTransientRetryTimer = null;
let syncApplyingRemoteState = false;
let syncLastRemoteUpdatedAt = "";
let syncLastSuccessAt = localStorage.getItem(syncLastSuccessKey) || "";
let syncSkipRemoteRefreshUntil = 0;
let syncDialogOpen = false;
let syncPendingAllShared = false;
let syncPendingSharedListIds = new Set();
let syncPendingTaskOrderListIds = new Set();
let syncLastErrorDetails = "";
let pendingOtpEmail = "";
let undoAction = null;
let undoTimer = null;
let pullToSyncState = null;
let pullToSyncRefreshing = false;
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
  const footerResizeObserver = new ResizeObserver(updateTomorrowFooterSpace);
  if (footerTray) footerResizeObserver.observe(footerTray);
  if (tomorrowSection) footerResizeObserver.observe(tomorrowSection);
  if (scheduledSection) footerResizeObserver.observe(scheduledSection);
  if (onHoldSection) footerResizeObserver.observe(onHoldSection);
  if (projectSection) footerResizeObserver.observe(projectSection);
}

window.addEventListener("resize", updateTomorrowFooterSpace);
window.addEventListener("online", () => updateSyncUi());
window.addEventListener("offline", () => updateSyncUi());
window.addEventListener("touchstart", handlePullToSyncStart, { passive: true });
window.addEventListener("touchmove", handlePullToSyncMove, { passive: true });
window.addEventListener("touchend", handlePullToSyncEnd);
window.addEventListener("touchcancel", resetPullToSync);

listForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = listName.value.trim();

  if (!name) return;

  const list = createList(name, false, [], {
    ownerId: getActiveUserId()
  });
  const shouldRevealNewList = !shouldShowList(list);
  lists = ensureTodayList([...lists, list]);
  if (shouldRevealNewList) {
    filter = "all";
    filterMenuOpen = false;
  }
  markSharedListOrderUpdated();
  listForm.reset();
  listName.focus();
  persistAndRender({ sharedListIds: [list.id] });
});

taskBoards.forEach((board) => {
  board.addEventListener("submit", handleTaskBoardSubmit);
  board.addEventListener("keydown", handleTaskBoardKeydown);
  board.addEventListener("input", handleTaskBoardFormInput);
  board.addEventListener("change", handleTaskBoardChange);
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
  rememberListCollapsed(list.id, false);
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

function handleTaskBoardChange(event) {
  const repeatSelect = event.target.closest("select[data-action='draft-monthly-pattern-repeat']");
  if (!repeatSelect) return;

  const picker = repeatSelect.closest(".menu-repeat-pattern-picker");
  if (repeatSelect.dataset.repeatPatternPart === "day") {
    syncMonthlyPatternOrdinalSelect(picker);
  }
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
    rememberListCollapsed(list.id, list.collapsed);
    if (list.collapsed && activeTaskFormListId === list.id) {
      activeTaskFormListId = null;
    }
    if (list.collapsed && editingTask?.listId === list.id) {
      editingTask = null;
    }
    if (list.collapsed) {
      expandedCompletedLists.delete(list.id);
    }
    persistLocalListsOnly();
    render();
    return;
  }

  if (button.dataset.action === "show-task-form") {
    activeTaskFormListId = list.id;
    list.collapsed = false;
    rememberListCollapsed(list.id, false);
    persistLocalListsOnly();
    render();
    focusTaskInput(list.id);
    return;
  }

  if (button.dataset.action === "toggle-fields") {
    list.showDetails = !list.showDetails;
    markListUpdated(list);
    openMenu = null;
    persistAndRender({ sharedListIds: [list.id] });
    return;
  }

  if (button.dataset.action === "toggle-list-color-panel") {
    if (isPinnedList(list)) return;
    openMenu = {
      type: "list",
      listId: list.id,
      taskId: null,
      colorOpen: !isListColorPanelOpen(list.id)
    };
    render();
    return;
  }

  if (button.dataset.action === "set-list-color") {
    if (isPinnedList(list)) return;
    setListColor(list, button.dataset.listColor);
    openMenu = null;
    persistAndRender({ syncShared: false });
    return;
  }

  if (button.dataset.action === "toggle-list-invites-panel") {
    if (!canShareList(list)) return;
    const willOpen = !isListInvitesPanelOpen(list.id);
    openMenu = {
      type: "list",
      listId: list.id,
      taskId: null,
      invitesOpen: willOpen
    };
    render();
    if (willOpen) {
      await refreshListInviteStatuses(list, { renderAfter: true });
    }
    return;
  }

  if (button.dataset.action === "refresh-list-invites") {
    if (!canShareList(list)) return;
    await refreshListInviteStatuses(list, { renderAfter: true, forceLoading: true });
    return;
  }

  if (button.dataset.action === "remove-list-invite") {
    if (!canShareList(list)) return;
    await removeListInvite(list, button.dataset.inviteEmail);
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
    if (isPinnedList(list)) return;
    editingListId = list.id;
    editingTask = null;
    activeTaskFormListId = null;
    openMenu = null;
    render();
    focusListRenameInput(list.id);
    return;
  }

  if (button.dataset.action === "share-list") {
    if (!canShareList(list)) return;
    openMenu = null;
    render();
    await shareListByEmail(list);
    return;
  }

  if (button.dataset.action === "delete-list") {
    if (isPinnedList(list)) return;
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

  if (button.dataset.action === "toggle-task-repeat-panel") {
    if (!isTodayList(list)) return;
    openMenu = {
      type: "task",
      listId: list.id,
      taskId: task.id,
      repeatOpen: !isTaskRepeatPanelOpen(list.id, task.id)
    };
    render();
    return;
  }

  if (button.dataset.action === "set-task-repeat") {
    if (!isTodayList(list)) return;
    setTaskRepeat(task, button.dataset.repeatMode, {
      monthlyPattern: button.dataset.repeatPattern
    });
    openMenu = null;
    persistAndRender({ syncShared: false });
    return;
  }

  if (button.dataset.action === "save-custom-repeat") {
    if (!isTodayList(list)) return;
    const input = button.closest(".menu-repeat-custom")?.querySelector(".menu-repeat-day-input");
    setTaskRepeat(task, "monthly-date", {
      dayOfMonth: normalizeRepeatDay(input?.value)
    });
    openMenu = null;
    persistAndRender({ syncShared: false });
    return;
  }

  if (button.dataset.action === "save-monthly-pattern-repeat") {
    if (!isTodayList(list)) return;
    const picker = button.closest(".menu-repeat-patterns")?.querySelector(".menu-repeat-pattern-picker");
    const monthlyPattern = getMonthlyPatternValueFromPicker(picker);
    if (!monthlyPattern) return;

    setTaskRepeat(task, monthlyPatternRepeatMode, { monthlyPattern });
    openMenu = null;
    persistAndRender({ syncShared: false });
    return;
  }

  if (button.dataset.action === "toggle-task") {
    const wasCompleted = task.completed;
    const previousCompletedAt = task.completedAt;
    const wasPreviousCompleted = wasCompleted && getTaskCompletionDateKey(task) !== getDateKey();
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : "";
    if (wasPreviousCompleted && !task.completed) {
      task.previousCompletedAt = previousCompletedAt;
    } else {
      delete task.previousCompletedAt;
    }
    markTaskUpdated(task);
    const syncTaskOrderListIds = [];
    if (wasCompleted && !task.completed) {
      moveTaskToOpenBottom(list, task.id);
      markTaskOrderUpdated(list);
      syncTaskOrderListIds.push(list.id);
    }
    persistAndRender({ sharedListIds: [list.id], syncTaskOrderListIds });
    return;
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
    const shouldReturnToPrevious = isReusedPreviousTask(deletedTask);
    const deletedAt = new Date().toISOString();
    rememberTaskDeletion(list, deletedTask, deletedAt);
    list.tasks = list.tasks.filter((item) => item.id !== task.id);
    if (isEditingTask(list.id, task.id)) {
      editingTask = null;
    }
    openMenu = null;
    if (shouldReturnToPrevious) {
      showUndo(`Removed "${deletedTask.title}" from open tasks.`, () => {
        returnTaskToPreviousCompleted(list.id, deletedTask, deletedTaskIndex);
      }, { actionLabel: "Return to Previous" });
      persistAndRender({ sharedListIds: [list.id] });
      return;
    }
    showUndo(`Deleted "${deletedTask.title}".`, () => {
      const currentList = findList(list.id);
      forgetTaskDeletion(currentList, deletedTask.id);
      markTaskUpdated(deletedTask);
      insertTaskAt(currentList, deletedTask, deletedTaskIndex);
      persistAndRender({ sharedListIds: [list.id] });
    });
  }

  if (button.dataset.action === "move-task-tomorrow") {
    const movedTask = cloneTask(task);
    const movedTaskIndex = list.tasks.findIndex((item) => item.id === task.id);
    const queueItem = createTomorrowQueueItem(task.title);
    const deletedAt = new Date().toISOString();
    rememberTaskDeletion(list, movedTask, deletedAt);
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
      forgetTaskDeletion(findList(list.id), movedTask.id);
      markTaskUpdated(movedTask);
      insertTaskAt(findList(list.id), movedTask, movedTaskIndex);
      persistTomorrowQueue();
      persistAndRender({ sharedListIds: [list.id] });
      renderTomorrowQueue();
    });
    return;
  }

  if (button.dataset.action === "move-task-on-hold") {
    if (!isTodayList(list)) return;
    const movedTask = cloneTask(task);
    const movedTaskIndex = list.tasks.findIndex((item) => item.id === task.id);
    const queueItem = createOnHoldQueueItem(task.title);
    const deletedAt = new Date().toISOString();
    rememberTaskDeletion(list, movedTask, deletedAt);
    onHoldQueue.push(queueItem);
    list.tasks = list.tasks.filter((item) => item.id !== task.id);
    if (isEditingTask(list.id, task.id)) {
      editingTask = null;
    }
    openMenu = null;
    persistOnHoldQueue();
    persistAndRender({ syncShared: false });
    renderOnHoldQueue({ scrollToBottom: true });
    showUndo(`Moved "${movedTask.title}" to On hold.`, () => {
      onHoldQueue = onHoldQueue.filter((entry) => entry.id !== queueItem.id);
      forgetTaskDeletion(findList(list.id), movedTask.id);
      markTaskUpdated(movedTask);
      insertTaskAt(findList(list.id), movedTask, movedTaskIndex);
      persistOnHoldQueue();
      persistAndRender({ syncShared: false });
      renderOnHoldQueue();
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

  if (scheduledDatePickerOpen && !event.target.closest("#scheduledDatePicker, #scheduledDateButton")) {
    closeScheduledDatePicker();
  }

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
  const commandButton = event.target.closest("[data-filter-command]");
  if (commandButton?.dataset.filterCommand === "hide-all-lists") {
    hideAllShareableLists();
    return;
  }

  const button = event.target.closest("[data-filter]");
  if (!button) return;

  filter = button.dataset.filter;
  filterMenuOpen = false;
  settingsMenuOpen = false;
  openMenu = null;
  render();
});

function hideAllShareableLists() {
  const hiddenLists = lists.filter((list) => !isTodayList(list) && !isProjectList(list));
  if (activeTaskFormListId && hiddenLists.some((list) => list.id === activeTaskFormListId)) {
    activeTaskFormListId = null;
  }
  if (editingTask && hiddenLists.some((list) => list.id === editingTask.listId)) {
    editingTask = null;
  }
  if (editingListId && hiddenLists.some((list) => list.id === editingListId)) {
    editingListId = null;
  }

  filter = "hidden";
  filterMenuOpen = false;
  settingsMenuOpen = false;
  openMenu = null;
  render();
}

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

footerTray?.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-footer-tab]");
  if (!tab) return;

  activeFooterTab = activeFooterTab === tab.dataset.footerTab ? "" : tab.dataset.footerTab;
  localStorage.setItem(footerTabKey, activeFooterTab);
  tomorrowCollapsed = activeFooterTab !== "tomorrow";
  localStorage.setItem(tomorrowCollapsedKey, String(tomorrowCollapsed));
  if (activeFooterTab === "projects") {
    expandProjectFooterLists();
  }
  render();
});

if (tomorrowToggle && !tomorrowToggle.closest("#footerTray")) {
  tomorrowToggle.addEventListener("click", () => {
    tomorrowCollapsed = !tomorrowCollapsed;
    localStorage.setItem(tomorrowCollapsedKey, String(tomorrowCollapsed));
    renderTomorrowQueue({ scrollToBottom: true });
  });
}

scheduledForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = scheduledInput.value.trim();
  const targetDate = scheduledDateInput.value || getDateKey();
  if (!title) return;

  scheduledQueue.push(createScheduledQueueItem(title, { targetDate }));
  scheduledForm.reset();
  setScheduledDateValue(getTomorrowDateKey(), { renderPicker: false });
  persistScheduledQueue();
  const rolledToday = rollScheduledQueueIntoToday();
  if (rolledToday) {
    render();
  } else {
    renderScheduledQueue({ scrollToBottom: true });
  }
  focusScheduledInput();
});

scheduledForm?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.isComposing || event.target !== scheduledInput) return;

  event.preventDefault();
  scheduledForm.requestSubmit();
});

scheduledDateButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  if (scheduledDatePickerOpen) {
    closeScheduledDatePicker();
    return;
  }

  openScheduledDatePicker();
});

scheduledDatePicker?.addEventListener("click", (event) => {
  event.stopPropagation();
  const navButton = event.target.closest("[data-scheduled-date-nav]");
  if (navButton) {
    moveScheduledDatePickerMonth(navButton.dataset.scheduledDateNav === "next" ? 1 : -1);
    return;
  }

  const dayButton = event.target.closest("[data-scheduled-date]");
  if (!dayButton) return;

  setScheduledDateValue(dayButton.dataset.scheduledDate);
  closeScheduledDatePicker();
});

scheduledList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-scheduled-action]");
  if (!button) return;

  const item = button.closest("[data-scheduled-id]");
  if (!item) return;

  if (button.dataset.scheduledAction === "delete") {
    const removedIndex = scheduledQueue.findIndex((entry) => entry.id === item.dataset.scheduledId);
    const removedItem = cloneScheduledQueueItem(scheduledQueue[removedIndex]);
    scheduledQueue = scheduledQueue.filter((entry) => entry.id !== item.dataset.scheduledId);
    if (removedItem) {
      scheduledQueue.push(createDeletedScheduledQueueItem(removedItem));
    }
    persistScheduledQueue();
    renderScheduledQueue();
    if (removedItem) {
      showUndo(`Removed "${removedItem.title}" from Scheduled.`, () => {
        insertScheduledQueueItemAt({
          ...removedItem,
          deleted: false,
          deletedAt: "",
          updatedAt: new Date().toISOString()
        }, removedIndex);
        persistScheduledQueue();
        renderScheduledQueue();
      });
    }
  }
});

onHoldForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = onHoldInput.value.trim();
  if (!title) return;

  onHoldQueue.push(createOnHoldQueueItem(title));
  onHoldForm.reset();
  onHoldInput.focus();
  persistOnHoldQueue();
  renderOnHoldQueue({ scrollToBottom: true });
});

onHoldForm?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.isComposing || event.target !== onHoldInput) return;

  event.preventDefault();
  onHoldForm.requestSubmit();
});

onHoldList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-on-hold-action]");
  if (!button) return;

  const item = button.closest("[data-on-hold-id]");
  if (!item) return;

  const removedIndex = onHoldQueue.findIndex((entry) => entry.id === item.dataset.onHoldId);
  const removedItem = cloneOnHoldQueueItem(onHoldQueue[removedIndex]);
  if (!removedItem) return;

  onHoldQueue = onHoldQueue.filter((entry) => entry.id !== item.dataset.onHoldId);
  onHoldQueue.push(createDeletedOnHoldQueueItem(removedItem));

  if (button.dataset.onHoldAction === "today") {
    lists = ensureTodayList(lists);
    const todayList = lists.find(isTodayList);
    if (!todayList) return;
    const createdTask = createTask(removedItem.title);
    todayList.tasks.push(createdTask);
    persistOnHoldQueue();
    persistAndRender({ syncShared: false });
    renderOnHoldQueue();
    showUndo(`Moved "${removedItem.title}" to Today.`, () => {
      lists = ensureTodayList(lists);
      const currentTodayList = lists.find(isTodayList);
      if (currentTodayList) {
        rememberPrivateTaskDeletion(currentTodayList, createdTask);
        currentTodayList.tasks = currentTodayList.tasks.filter((task) => task.id !== createdTask.id);
      }
      insertOnHoldQueueItemAt({
        ...removedItem,
        deleted: false,
        deletedAt: "",
        updatedAt: new Date().toISOString()
      }, removedIndex);
      persistOnHoldQueue();
      persistAndRender({ syncShared: false });
      renderOnHoldQueue();
    });
    return;
  }

  if (button.dataset.onHoldAction === "tomorrow") {
    const queueItem = createTomorrowQueueItem(removedItem.title);
    tomorrowQueue.push(queueItem);
    persistOnHoldQueue();
    persistTomorrowQueue();
    renderOnHoldQueue();
    renderTomorrowQueue({ scrollToBottom: activeFooterTab === "tomorrow" });
    showUndo(`Bumped "${removedItem.title}" to Tomorrow.`, () => {
      tomorrowQueue = tomorrowQueue.filter((entry) => entry.id !== queueItem.id);
      insertOnHoldQueueItemAt({
        ...removedItem,
        deleted: false,
        deletedAt: "",
        updatedAt: new Date().toISOString()
      }, removedIndex);
      persistOnHoldQueue();
      persistTomorrowQueue();
      renderOnHoldQueue();
      renderTomorrowQueue();
    });
    return;
  }

  if (button.dataset.onHoldAction === "delete") {
    persistOnHoldQueue();
    renderOnHoldQueue();
    showUndo(`Removed "${removedItem.title}" from On hold.`, () => {
      insertOnHoldQueueItemAt({
        ...removedItem,
        deleted: false,
        deletedAt: "",
        updatedAt: new Date().toISOString()
      }, removedIndex);
      persistOnHoldQueue();
      renderOnHoldQueue();
    });
  }
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

  if (scheduledDatePickerOpen) {
    closeScheduledDatePicker();
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

optionsToggleButton.addEventListener("click", () => {
  settingsOptionsOpen = !settingsOptionsOpen;
  renderSettingsMenu();
});

showProjectsOption.addEventListener("change", () => {
  appOptions.showProjects = showProjectsOption.checked;
  saveAppOptions();
  render();
});

showTomorrowOption.addEventListener("change", () => {
  appOptions.showTomorrow = showTomorrowOption.checked;
  saveAppOptions();
  render();
});

showScheduledOption.addEventListener("change", () => {
  appOptions.showScheduled = showScheduledOption.checked;
  saveAppOptions();
  render();
});

showOnHoldOption.addEventListener("change", () => {
  appOptions.showOnHold = showOnHoldOption.checked;
  saveAppOptions();
  render();
});

compactModeOption.addEventListener("change", () => {
  appOptions.compactMode = compactModeOption.checked;
  saveAppOptions();
  render();
});

weekendModeOption.addEventListener("change", () => {
  setAccountTomorrowMode(weekendModeOption.checked ? "weekdays" : "daily");
  render();
});

settingsOptions.addEventListener("click", (event) => {
  const modeButton = event.target.closest("[data-queue-mode]");
  if (!modeButton) return;

  setAccountTomorrowMode(modeButton.dataset.queueMode);
  render();
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

function persistLocalListsOnly() {
  lists = applyArchiveMetadataToLists(ensureTodayList(lists));
  localStorage.setItem(storageKey, JSON.stringify(lists));
  rememberLocalTaskStateUser();
  persistArchiveState();
}

function persistLists(options = {}) {
  lists = applyArchiveMetadataToLists(ensureTodayList(lists));
  localStorage.setItem(storageKey, JSON.stringify(lists));
  rememberLocalTaskStateUser();
  persistArchiveState();
  queueRemoteSync(options);
}

function persistTomorrowQueue() {
  localStorage.setItem(tomorrowQueueKey, JSON.stringify(tomorrowQueue));
  rememberLocalTaskStateUser();
  queueRemoteSync({ syncShared: false });
}

function persistScheduledQueue() {
  localStorage.setItem(scheduledQueueKey, JSON.stringify(scheduledQueue));
  rememberLocalTaskStateUser();
  queueRemoteSync({ syncShared: false });
}

function persistOnHoldQueue() {
  localStorage.setItem(onHoldQueueKey, JSON.stringify(onHoldQueue));
  rememberLocalTaskStateUser();
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
    inviteStatusCache.clear();
    clearRemoteSubscription();
    updateSyncUi("Signed out");
    return;
  }

  if (syncUser?.id === nextUser.id && syncLastRemoteUpdatedAt) {
    updateSyncUi();
    return;
  }

  if (syncUser?.id && syncUser.id !== nextUser.id) {
    clearRemoteSubscription();
  }

  const localStateBelongsToUser = isLocalTaskStateForUser(nextUser.id);
  if (!localStateBelongsToUser) {
    resetInMemoryTaskStateForAccountBoundary();
  }

  syncUser = nextUser;
  updateSyncUi("Loading sync...");
  await syncUserProfile();
  await loadRemoteState({ trustLocalState: localStateBelongsToUser });
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
  syncAuthCopy.textContent = "Enter your email and we will send an 8-digit code.";
  syncEmailForm.hidden = false;
  syncCodeForm.hidden = true;
  setSyncAuthMessage(message);
  window.setTimeout(() => syncEmailInput.focus(), 0);
}

function showSyncCodeStep(message = "") {
  syncAuthTitle.textContent = "Enter code";
  syncAuthCopy.textContent = "Use the 8-digit code from your email.";
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
    await syncClient.auth.signOut({ scope: "local" });
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

async function loadRemoteState(options = {}) {
  if (!syncClient || !syncUser) return;
  const trustLocalState = options.trustLocalState ?? isLocalTaskStateForUser(syncUser.id);
  const retryTransientErrors = options.retryTransientErrors !== false;

  const inviteResult = await claimPendingListInvites();
  if (inviteResult?.error) {
    handleRemoteSyncError("Shared invite sync", inviteResult.error, { retryTransientErrors });
    return;
  }

  const privateResult = await fetchPrivateDocument();
  if (privateResult.error) {
    handleRemoteSyncError("Private sync", privateResult.error, { retryTransientErrors });
    return;
  }

  let sharedResult = await fetchSharedLists();
  if (sharedResult.error) {
    handleRemoteSyncError("Shared list sync", sharedResult.error, { retryTransientErrors });
    return;
  }

  const localStandingLists = trustLocalState ? getStandingLists(lists) : [];
  const privateDocument = privateResult.data;
  const privateRemoteLists = Array.isArray(privateDocument?.lists)
    ? privateDocument.lists.map(normalizeList)
    : null;
  const localPrivateLists = trustLocalState ? getPrivateLists(lists) : [];
  const remotePrivateLists = privateRemoteLists
    ? ensureTodayList(privateRemoteLists).filter(isTodayList)
    : [];
  const documentStandingLists = privateRemoteLists
    ? privateRemoteLists.filter((list) => !isTodayListCandidate(list))
    : [];
  const remoteTomorrowQueue = privateDocument
    ? normalizeTomorrowQueue(privateDocument.tomorrow_queue)
    : [];
  const remoteScheduledQueue = privateDocument
    ? normalizeScheduledQueue(privateDocument.scheduled_queue)
    : [];
  const remoteOnHoldQueue = privateDocument
    ? normalizeOnHoldQueue(privateDocument.on_hold_queue)
    : [];
  const mergedPrivateState = privateDocument
    ? (trustLocalState
      ? mergePrivateState(localPrivateLists, tomorrowQueue, scheduledQueue, onHoldQueue, remotePrivateLists, remoteTomorrowQueue, remoteScheduledQueue, remoteOnHoldQueue)
      : rollDueQueuesIntoPrivateState(remotePrivateLists, remoteTomorrowQueue, remoteScheduledQueue, remoteOnHoldQueue))
    : rollDueQueuesIntoPrivateState(localPrivateLists, trustLocalState ? tomorrowQueue : [], trustLocalState ? scheduledQueue : [], trustLocalState ? onHoldQueue : []);
  const privateLists = mergedPrivateState.lists;
  const nextTomorrowQueue = mergedPrivateState.tomorrowQueue;
  const nextScheduledQueue = mergedPrivateState.scheduledQueue;
  const nextOnHoldQueue = mergedPrivateState.onHoldQueue;

  if (documentStandingLists.length > 0) {
    await pushSharedLists(documentStandingLists);
    await pushPrivateState(privateLists, nextTomorrowQueue, nextScheduledQueue, nextOnHoldQueue);
    sharedResult = await fetchSharedLists();
    if (sharedResult.error) {
      handleRemoteSyncError("Shared list sync", sharedResult.error, { retryTransientErrors });
      return;
    }
  } else if (privateDocument && hasPrivateStateChanged(remotePrivateLists, remoteTomorrowQueue, remoteScheduledQueue, remoteOnHoldQueue, privateLists, nextTomorrowQueue, nextScheduledQueue, nextOnHoldQueue)) {
    const privateError = await pushPrivateState(privateLists, nextTomorrowQueue, nextScheduledQueue, nextOnHoldQueue);
    if (privateError) {
      reportSyncError("Private sync", privateError);
      return;
    }
  } else if (!privateDocument) {
    await pushPrivateState(privateLists, nextTomorrowQueue, nextScheduledQueue, nextOnHoldQueue);
  }

  const sharedListIds = new Set(sharedResult.lists.map((list) => list.id));
  const localListsMissingFromRemote = localStandingLists.filter((list) => canManageList(list) && !sharedListIds.has(list.id));
  if (localListsMissingFromRemote.length > 0) {
    await pushSharedLists(localStandingLists.filter(canManageList));
    sharedResult = await fetchSharedLists();
    if (sharedResult.error) {
      handleRemoteSyncError("Shared list sync", sharedResult.error, { retryTransientErrors });
      return;
    }
  }

  const mergedSharedLists = applySharedListOrder(mergeSharedLists(localStandingLists, sharedResult.lists), privateLists);
  if (trustLocalState && sharedResult.supportsTaskRepeat && hasSharedRepeatBackfill(localStandingLists, sharedResult.lists)) {
    const sharedRepeatError = await pushSharedLists(mergedSharedLists);
    if (sharedRepeatError) {
      reportSyncError("Shared list sync", sharedRepeatError);
      return;
    }
  }

  applyRemoteState({
    lists: [...privateLists, ...mergedSharedLists],
    tomorrowQueue: nextTomorrowQueue,
    scheduledQueue: nextScheduledQueue,
    onHoldQueue: nextOnHoldQueue,
    updatedAt: privateDocument?.updated_at || new Date().toISOString()
  });
  markSyncSuccess();
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

function handlePullToSyncStart(event) {
  if (!canStartPullToSync(event)) return;

  pullToSyncState = {
    startY: event.touches[0].clientY,
    ready: false
  };
}

function handlePullToSyncMove(event) {
  if (!pullToSyncState || event.touches.length !== 1) return;

  const distance = event.touches[0].clientY - pullToSyncState.startY;
  if (distance < 0 || window.scrollY > 2) {
    resetPullToSync();
    return;
  }

  pullToSyncState.ready = distance >= pullToSyncThreshold;
}

async function handlePullToSyncEnd() {
  const shouldRefresh = Boolean(pullToSyncState?.ready);
  resetPullToSync();
  if (!shouldRefresh || pullToSyncRefreshing) return;

  pullToSyncRefreshing = true;
  try {
    await refreshSyncNow();
  } finally {
    pullToSyncRefreshing = false;
  }
}

function resetPullToSync() {
  pullToSyncState = null;
}

function canStartPullToSync(event) {
  if (!navigator.maxTouchPoints || pullToSyncRefreshing || window.scrollY > 2) return false;
  if (event.touches.length !== 1) return false;
  if (event.touches[0].clientY > pullToSyncStartZone) return false;
  if (event.target.closest("button, input, select, textarea, [contenteditable='true'], .handle-menu")) return false;
  return true;
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

  if (Array.isArray(options.syncTaskOrderListIds)) {
    options.syncTaskOrderListIds.filter(Boolean).forEach((listId) => {
      syncPendingTaskOrderListIds.add(listId);
    });
  }

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
  const syncTaskOrderListIds = new Set(syncPendingTaskOrderListIds);

  const privateError = await pushPrivateState(getPrivateLists(lists), tomorrowQueue, scheduledQueue, onHoldQueue, updatedAt);
  if (privateError) {
    reportSyncError("Private sync", privateError);
    return;
  }

  const sharedError = await pushSharedLists(sharedLists, updatedAt, {
    syncTaskOrderListIds
  });
  if (sharedError) {
    clearPendingSharedSync();
    reportSyncError("Shared list sync", sharedError);
    return;
  }

  clearPendingSharedSync();
  syncLastRemoteUpdatedAt = updatedAt;
  markSyncSuccess();
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
  syncPendingTaskOrderListIds.clear();
  inviteStatusCache.clear();
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
  window.clearTimeout(syncTransientRetryTimer);
  syncRefreshTimer = null;
  syncTransientRetryTimer = null;
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
  applySyncedAccountOptions(getAccountOptionsFromLists(lists));
  hydrateArchiveStateFromLists(lists);
  lists = applyArchiveMetadataToLists(lists);
  tomorrowQueue = normalizeTomorrowQueue(remoteState.tomorrowQueue);
  scheduledQueue = normalizeScheduledQueue(remoteState.scheduledQueue);
  onHoldQueue = normalizeOnHoldQueue(remoteState.onHoldQueue);
  syncLastRemoteUpdatedAt = remoteState.updatedAt || "";

  localStorage.setItem(storageKey, JSON.stringify(lists));
  localStorage.setItem(tomorrowQueueKey, JSON.stringify(tomorrowQueue));
  localStorage.setItem(scheduledQueueKey, JSON.stringify(scheduledQueue));
  localStorage.setItem(onHoldQueueKey, JSON.stringify(onHoldQueue));
  rememberLocalTaskStateUser();
  persistDeletedSharedTasks();
  persistArchiveState();
  syncApplyingRemoteState = false;

  rollTomorrowQueueIntoToday();
  render();
}

function isLocalTaskStateForUser(userId) {
  return Boolean(userId) && localStorage.getItem(syncUserStorageKey) === userId;
}

function rememberLocalTaskStateUser() {
  if (syncUser?.id) {
    localStorage.setItem(syncUserStorageKey, syncUser.id);
  }
}

function resetInMemoryTaskStateForAccountBoundary() {
  completedArchiveText = "";
  deletedSharedTasks = [];
  lastTodayDateKey = getDateKey();
  appOptions = normalizeAppOptions({
    ...appOptions,
    tomorrowMode: "daily",
    tomorrowModeUpdatedAt: ""
  });
  saveAppOptions();
  lists = [];
  tomorrowQueue = [];
  scheduledQueue = [];
  onHoldQueue = [];
  expandedCompletedLists.clear();
  activeTaskFormListId = null;
  editingListId = null;
  editingTask = null;
  openMenu = null;
  taskFormDrafts.clear();
  syncLastRemoteUpdatedAt = "";
  syncPendingAllShared = false;
  syncPendingSharedListIds.clear();
  syncPendingTaskOrderListIds.clear();
}

async function fetchPrivateDocument() {
  const result = await syncClient
    .from("task_documents")
    .select(privateDocumentFields)
    .eq("user_id", syncUser.id)
    .maybeSingle();
  if (!isMissingOnHoldColumnError(result.error)) return result;

  const fallback = await syncClient
    .from("task_documents")
    .select(legacyPrivateDocumentFields)
    .eq("user_id", syncUser.id)
    .maybeSingle();
  return {
    ...fallback,
    missingOnHoldColumn: true
  };
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
  let sharedMarkerRows = [];
  let inviteRows = [];
  let supportsTaskRepeat = true;

  if (listIds.length > 0) {
    const taskResult = await selectSharedTaskRows((fields) =>
      syncClient
        .from("tasks")
        .select(fields)
        .in("list_id", listIds)
        .order("position", { ascending: true })
        .order("created_at", { ascending: true })
    );

    if (taskResult.error) {
      return { lists: [], error: taskResult.error };
    }

    taskRows = taskResult.data || [];
    supportsTaskRepeat = !taskResult.missingRepeatColumn;

    const memberResult = await syncClient
      .from("list_members")
      .select("list_id,role")
      .in("list_id", listIds)
      .eq("user_id", syncUser.id);

    if (memberResult.error) {
      return { lists: [], error: memberResult.error };
    }

    memberRows = memberResult.data || [];

    const sharedMarkerResult = await syncClient
      .from("list_members")
      .select("list_id")
      .in("list_id", listIds);

    if (!sharedMarkerResult.error) {
      sharedMarkerRows = sharedMarkerResult.data || [];
    }

    const inviteResult = await syncClient
      .from("list_invites")
      .select("list_id")
      .in("list_id", listIds);

    if (!inviteResult.error) {
      inviteRows = inviteResult.data || [];
    }
  }

  const deletedTasksByList = {};
  const tasksByList = taskRows.reduce((groups, row) => {
    if (isDeletedTaskRow(row)) {
      deletedTasksByList[row.list_id] ||= [];
      deletedTasksByList[row.list_id].push(taskTombstoneFromRow(row));
      return groups;
    }

    groups[row.list_id] ||= [];
    groups[row.list_id].push(rowToTask(row));
    return groups;
  }, {});
  const roleByList = memberRows.reduce((roles, row) => {
    roles[row.list_id] = row.role || "";
    return roles;
  }, {});
  const sharedListIds = new Set([
    ...sharedMarkerRows.map((row) => row.list_id),
    ...inviteRows.map((row) => row.list_id)
  ]);

  return {
    lists: listRows.map((row) => {
      const list = rowToList(row, tasksByList[row.id] || [], roleByList[row.id] || "", sharedListIds.has(row.id));
      list.deletedTaskTombstones = normalizeTaskTombstones(deletedTasksByList[row.id] || []);
      list.tasks = filterTasksDeletedByTombstones(list.tasks, list.deletedTaskTombstones);
      return list;
    }),
    supportsTaskRepeat,
    error: null
  };
}

async function pushPrivateState(privateLists = getPrivateLists(lists), queue = tomorrowQueue, scheduled = scheduledQueue, onHold = onHoldQueue, updatedAt = new Date().toISOString()) {
  const mergedState = await getMergedPrivateStateForPush(privateLists, queue, scheduled, onHold);
  if (mergedState.error) return mergedState.error;

  let { error } = await syncClient
    .from("task_documents")
    .upsert(privateStateToDocumentRow(mergedState, updatedAt), {
      onConflict: "user_id"
    });

  if (isMissingOnHoldColumnError(error)) {
    const fallbackResult = await syncClient
      .from("task_documents")
      .upsert(stripOnHoldQueueFromDocumentRow(privateStateToDocumentRow(mergedState, updatedAt)), {
        onConflict: "user_id"
      });
    error = fallbackResult.error;
  }

  if (!error) {
    applySyncedAccountOptions(getAccountOptionsFromLists(mergedState.lists));
    hydrateArchiveStateFromLists(mergedState.lists);
    lists = applyArchiveMetadataToLists(ensureTodayList([...mergedState.lists, ...getStandingLists(lists)]));
    tomorrowQueue = mergedState.tomorrowQueue;
    scheduledQueue = mergedState.scheduledQueue;
    onHoldQueue = mergedState.onHoldQueue;
    localStorage.setItem(storageKey, JSON.stringify(lists));
    localStorage.setItem(tomorrowQueueKey, JSON.stringify(tomorrowQueue));
    localStorage.setItem(scheduledQueueKey, JSON.stringify(scheduledQueue));
    localStorage.setItem(onHoldQueueKey, JSON.stringify(onHoldQueue));
    rememberLocalTaskStateUser();
    persistArchiveState();
  }

  return error;
}

async function pushSharedLists(standingLists = getStandingLists(lists), updatedAt = new Date().toISOString(), options = {}) {
  const uniqueStandingLists = uniqueListsById(standingLists);
  if (uniqueStandingLists.length === 0) return null;

  const syncTaskOrderListIds = options.syncTaskOrderListIds instanceof Set
    ? options.syncTaskOrderListIds
    : new Set(options.syncTaskOrderListIds || []);

  uniqueStandingLists.forEach(ensureManagedListOwner);
  const sharedPositionById = getSharedPositionByListId(uniqueStandingLists);
  const existingListRowsResult = await fetchExistingListRows(uniqueStandingLists.map((list) => list.id));
  if (existingListRowsResult.error) return existingListRowsResult.error;
  const existingListRowsById = new Map((existingListRowsResult.data || []).map((row) => [row.id, row]));

  const managedListRows = uniqueStandingLists
    .map((list, index) => ({ list, index }))
    .filter(({ list }) => canManageList(list))
    .map(({ list, index }) => {
      const existingRow = existingListRowsById.get(list.id);
      return listToRow(list, getSharedListPosition(sharedPositionById, list, index, existingRow), updatedAt);
    })
    .filter((row) => shouldPushListRow(row, existingListRowsById.get(row.id)));

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
    const existingRow = existingListRowsById.get(list.id);
    const row = listToEditableRow(list, getSharedListPosition(sharedPositionById, list, index, existingRow), updatedAt);
    if (!shouldPushListRow({ id: list.id, ...row }, existingListRowsById.get(list.id))) continue;

    const listResult = await syncClient
      .from("task_lists")
      .update(row)
      .eq("id", list.id)
      .lte("updated_at", row.updated_at);

    if (listResult.error) return listResult.error;
  }

  for (const list of uniqueStandingLists) {
    if (!canEditList(list)) continue;

    const taskError = await syncSharedTasks(list, updatedAt, {
      syncTaskOrder: syncTaskOrderListIds.has(list.id)
    });
    if (taskError) return taskError;
  }

  return null;
}

function getSharedPositionByListId(fallbackLists = []) {
  const positionById = new Map();
  getStandingLists(lists).forEach((list, index) => {
    positionById.set(list.id, index);
  });

  fallbackLists.forEach((list, index) => {
    if (!positionById.has(list.id)) {
      positionById.set(list.id, index);
    }
  });

  return positionById;
}

function getSharedListPosition(positionById, list, fallbackIndex, existingRow = null) {
  if (Number.isInteger(existingRow?.position)) {
    return existingRow.position;
  }
  return positionById.has(list.id) ? positionById.get(list.id) : fallbackIndex;
}

async function fetchExistingListRows(listIds) {
  const uniqueListIds = [...new Set(listIds.filter(Boolean))];
  if (uniqueListIds.length === 0) return { data: [], error: null };

  return syncClient
    .from("task_lists")
    .select("id,position,updated_at")
    .in("id", uniqueListIds);
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

async function syncSharedTasks(list, updatedAt, options = {}) {
  const syncTaskOrder = Boolean(options.syncTaskOrder);
  const taskRows = list.tasks.map((task, index) => taskToRow(task, list.id, index, updatedAt));
  const existingResult = await selectSharedTaskRows((fields) =>
    syncClient
      .from("tasks")
      .select(fields)
      .eq("list_id", list.id)
  );

  if (existingResult.error) return existingResult.error;

  const existingRowsById = new Map((existingResult.data || []).map((row) => [row.id, row]));
  const nextTaskRows = preserveRemoteTaskPositions(taskRows, existingResult.data || [], syncTaskOrder);
  const tombstoneRows = getSharedDeletionTombstones(list).map((tombstone, index) => deletedTaskToRow(tombstone, taskRows.length + index));
  const rowsToUpsert = [...nextTaskRows, ...tombstoneRows].filter((row) => shouldPushTaskRow(row, existingRowsById.get(row.id)));

  if (rowsToUpsert.length > 0) {
    for (const row of rowsToUpsert) {
      const taskError = await upsertTaskRow(row);
      if (taskError) return taskError;
    }
  }

  clearSyncedSharedDeletionTombstones(list.id);
  return null;
}

async function selectSharedTaskRows(buildQuery) {
  const result = await buildQuery(sharedTaskRowFields);
  if (!isMissingRepeatColumnError(result.error)) return result;
  const fallback = await buildQuery(legacySharedTaskRowFields);
  return {
    ...fallback,
    missingRepeatColumn: true
  };
}

function preserveRemoteTaskPositions(taskRows, existingRows = [], syncTaskOrder = false) {
  if (syncTaskOrder) return taskRows;

  const existingPositionById = new Map(existingRows.map((row) => [row.id, row.position]));
  return taskRows.map((row) => {
    const existingPosition = existingPositionById.get(row.id);
    if (!Number.isInteger(existingPosition)) return row;

    return {
      ...row,
      position: existingPosition
    };
  });
}

async function upsertTaskRow(row) {
  const result = await syncClient.rpc("upsert_task_if_newer", {
    target_id: row.id,
    target_list_id: row.list_id,
    target_title: row.title,
    target_due: row.due,
    target_priority: row.priority,
    target_completed: row.completed,
    target_completed_at: row.completed_at,
    target_created_at: row.created_at,
    target_position: row.position,
    target_updated_at: row.updated_at,
    target_device_id: row.device_id,
    target_repeat: row.repeat
  });

  if (!result.error) return null;
  if (isMissingRepeatColumnError(result.error)) return upsertLegacyTaskRow(row);
  if (!isMissingRpcError(result.error)) return result.error;

  const fallbackResult = await syncClient
    .from("tasks")
    .upsert(row, {
      onConflict: "id"
    });
  if (isMissingRepeatColumnError(fallbackResult.error)) return upsertLegacyTaskRow(row);
  return fallbackResult.error;
}

async function upsertLegacyTaskRow(row) {
  const legacyRow = stripTaskRepeatFromRow(row);
  const result = await syncClient.rpc("upsert_task_if_newer", {
    target_id: legacyRow.id,
    target_list_id: legacyRow.list_id,
    target_title: legacyRow.title,
    target_due: legacyRow.due,
    target_priority: legacyRow.priority,
    target_completed: legacyRow.completed,
    target_completed_at: legacyRow.completed_at,
    target_created_at: legacyRow.created_at,
    target_position: legacyRow.position,
    target_updated_at: legacyRow.updated_at,
    target_device_id: legacyRow.device_id
  });

  if (!result.error) return null;
  if (!isMissingRpcError(result.error)) return result.error;

  const fallbackResult = await syncClient
    .from("tasks")
    .upsert(legacyRow, {
      onConflict: "id"
    });
  return fallbackResult.error;
}

function isMissingRpcError(error) {
  return error?.code === "42883"
    || error?.code === "PGRST202"
    || /function .* does not exist/i.test(error?.message || "")
    || /could not find .*function/i.test(error?.message || "");
}

function isMissingRepeatColumnError(error) {
  const message = `${error?.message || ""} ${error?.details || ""}`.toLowerCase();
  return (error?.code === "42703" && message.includes("repeat"))
    || (message.includes("repeat") && message.includes("does not exist"))
    || (message.includes("repeat") && message.includes("schema cache"));
}

function isMissingOnHoldColumnError(error) {
  const message = `${error?.message || ""} ${error?.details || ""}`.toLowerCase();
  return (error?.code === "42703" && message.includes("on_hold_queue"))
    || (message.includes("on_hold_queue") && message.includes("does not exist"))
    || (message.includes("on_hold_queue") && message.includes("schema cache"));
}

function stripTaskRepeatFromRow(row) {
  const { repeat: _repeat, ...legacyRow } = row;
  return legacyRow;
}

function privateStateToDocumentRow(state, updatedAt) {
  return {
    user_id: syncUser.id,
    lists: state.lists,
    tomorrow_queue: state.tomorrowQueue,
    scheduled_queue: state.scheduledQueue,
    on_hold_queue: state.onHoldQueue,
    updated_at: updatedAt,
    device_id: syncDeviceId
  };
}

function stripOnHoldQueueFromDocumentRow(row) {
  const { on_hold_queue: _onHoldQueue, ...legacyRow } = row;
  return legacyRow;
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

  list.shared = true;
  await refreshListInviteStatuses(list);
  persistAndRender({ sharedListIds: [list.id] });
  updateSyncUi("Synced");
  notifyUser(`Shared "${list.name}" with ${email}. They will see it after signing in with that email.`);
}

function getInviteStatusState(listId) {
  return inviteStatusCache.get(listId) || {
    status: "idle",
    invites: [],
    error: ""
  };
}

function setInviteStatusState(listId, state) {
  inviteStatusCache.set(listId, {
    status: state.status || "idle",
    invites: Array.isArray(state.invites) ? state.invites : [],
    error: state.error || ""
  });
}

async function refreshListInviteStatuses(list, options = {}) {
  if (!list?.id) return;
  const { renderAfter = false, forceLoading = false } = options;

  if (!isSupabaseConfigured()) {
    setInviteStatusState(list.id, { status: "ready", invites: [] });
    if (renderAfter) render();
    return;
  }

  if (!syncClient || !syncUser) {
    setInviteStatusState(list.id, { status: "ready", invites: [] });
    if (renderAfter) render();
    return;
  }

  if (forceLoading) {
    setInviteStatusState(list.id, {
      ...getInviteStatusState(list.id),
      status: "loading"
    });
    if (renderAfter) render();
  }

  const { data, error } = await syncClient
    .from("list_invites")
    .select("email,role,created_at,accepted_at")
    .eq("list_id", list.id)
    .order("created_at", { ascending: true });

  if (error) {
    setInviteStatusState(list.id, {
      status: "error",
      invites: [],
      error: error.message || "Invite status could not load."
    });
    if (renderAfter) render();
    return;
  }

  setInviteStatusState(list.id, {
    status: "ready",
    invites: (data || []).map(normalizeInviteStatusRow)
  });

  if (renderAfter) render();
}

function normalizeInviteStatusRow(row) {
  return {
    email: normalizeEmail(row.email),
    role: row.role || "editor",
    createdAt: row.created_at || "",
    acceptedAt: row.accepted_at || ""
  };
}

async function removeListInvite(list, email) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return;

  if (!syncClient || !syncUser) {
    notifyUser("Sign in before removing an invite.");
    return;
  }

  const shouldRemove = askToConfirm(`Remove ${normalizedEmail} from "${list.name}"?`);
  if (!shouldRemove) return;

  updateSyncUi("Removing invite...");
  const rpcResult = await syncClient.rpc("remove_list_member_by_email", {
    target_list_id: list.id,
    target_email: normalizedEmail
  });

  if (rpcResult.error && !isMissingRpcError(rpcResult.error)) {
    updateSyncUi("Invite error");
    notifyUser(`Could not remove this invite. ${rpcResult.error.message}`);
    return;
  }

  if (rpcResult.error && isMissingRpcError(rpcResult.error)) {
    const invite = getInviteStatusState(list.id).invites.find((item) => item.email === normalizedEmail);
    if (invite?.acceptedAt) {
      updateSyncUi("Schema update needed");
      notifyUser("Accepted members need the updated Supabase sharing helper before they can be removed.");
      return;
    }

    const { error } = await syncClient
      .from("list_invites")
      .delete()
      .eq("list_id", list.id)
      .eq("email", normalizedEmail);

    if (error) {
      updateSyncUi("Invite error");
      notifyUser(`Could not remove this invite. ${error.message}`);
      return;
    }
  }

  await refreshListInviteStatuses(list, { renderAfter: true });
  await refreshSyncNow();
  updateSyncUi("Synced");
  notifyUser(`Removed ${normalizedEmail}.`);
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

  try {
    const { data, error } = await syncClient.rpc("claim_pending_list_invites");
    return {
      claimed: Number(data) || 0,
      error
    };
  } catch (error) {
    return {
      claimed: 0,
      error
    };
  }
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

function handleRemoteSyncError(context, error, options = {}) {
  reportSyncError(context, error);
  if (options.retryTransientErrors !== false && isTransientSyncError(error)) {
    scheduleTransientSyncRetry();
  }
}

function isTransientSyncError(error) {
  const message = String(error?.message || error || "").toLowerCase();
  return [
    "load fail",
    "load failed",
    "failed to fetch",
    "network",
    "fetch",
    "timeout",
    "timed out",
    "offline"
  ].some((text) => message.includes(text));
}

function scheduleTransientSyncRetry() {
  if (!syncClient || !syncUser) return;

  window.clearTimeout(syncTransientRetryTimer);
  syncTransientRetryTimer = window.setTimeout(() => {
    syncTransientRetryTimer = null;
    if (!syncClient || !syncUser || document.hidden) return;
    updateSyncUi("Checking sync...");
    loadRemoteState({ retryTransientErrors: false });
  }, 3000);
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

function loadScheduledQueue() {
  try {
    const savedQueue = JSON.parse(localStorage.getItem(scheduledQueueKey));
    if (Array.isArray(savedQueue)) {
      return savedQueue.map(normalizeScheduledQueueItem).filter(Boolean);
    }
  } catch {
    return [];
  }

  return [];
}

function loadOnHoldQueue() {
  try {
    const savedQueue = JSON.parse(localStorage.getItem(onHoldQueueKey));
    if (Array.isArray(savedQueue)) {
      return savedQueue.map(normalizeOnHoldQueueItem).filter(Boolean);
    }
  } catch {
    return [];
  }

  return [];
}

function loadCompletedArchiveText() {
  return mergeArchiveText(localStorage.getItem(completedArchiveKey) || "");
}

function loadAppOptions() {
  try {
    const savedOptions = JSON.parse(localStorage.getItem(appOptionsKey));
    const normalizedOptions = normalizeAppOptions(savedOptions);
    if (savedOptions?.tomorrowMode === "weekdays" && !normalizedOptions.tomorrowModeUpdatedAt) {
      normalizedOptions.tomorrowModeUpdatedAt = new Date().toISOString();
      localStorage.setItem(appOptionsKey, JSON.stringify(normalizedOptions));
    }
    return normalizedOptions;
  } catch {
    return normalizeAppOptions();
  }
}

function normalizeAppOptions(options = {}) {
  return {
    showProjects: options.showProjects !== false,
    showTomorrow: options.showTomorrow !== false,
    showScheduled: options.showScheduled !== false,
    showOnHold: options.showOnHold !== false,
    tomorrowMode: options.tomorrowMode === "weekdays" ? "weekdays" : "daily",
    tomorrowModeUpdatedAt: isValidDateValue(options.tomorrowModeUpdatedAt || options.updatedAt)
      ? options.tomorrowModeUpdatedAt || options.updatedAt
      : "",
    compactMode: Boolean(options.compactMode)
  };
}

function saveAppOptions() {
  appOptions = normalizeAppOptions(appOptions);
  localStorage.setItem(appOptionsKey, JSON.stringify(appOptions));
}

function setAccountTomorrowMode(mode) {
  const tomorrowMode = mode === "weekdays" ? "weekdays" : "daily";
  if (appOptions.tomorrowMode === tomorrowMode && appOptions.tomorrowModeUpdatedAt) return;

  const updatedAt = new Date().toISOString();
  appOptions = normalizeAppOptions({
    ...appOptions,
    tomorrowMode,
    tomorrowModeUpdatedAt: updatedAt
  });
  saveAppOptions();
  applyAccountOptionsToTodayList(getAccountOptionsForSync());
  persistLists({ syncShared: false });
}

function getAccountOptionsForSync() {
  const currentOptions = getAccountOptionsFromLists(lists);
  const latestUpdatedAt = appOptions.tomorrowModeUpdatedAt && isTimestampNewer(appOptions.tomorrowModeUpdatedAt, currentOptions.updatedAt)
    ? appOptions.tomorrowModeUpdatedAt
    : currentOptions.updatedAt || appOptions.tomorrowModeUpdatedAt;

  return normalizeAccountOptions({
    ...currentOptions,
    tomorrowMode: appOptions.tomorrowMode,
    updatedAt: latestUpdatedAt
  });
}

function normalizeAccountOptions(options = {}) {
  return {
    tomorrowMode: options.tomorrowMode === "weekdays" ? "weekdays" : "daily",
    updatedAt: isValidDateValue(options.updatedAt) ? options.updatedAt : "",
    listColors: normalizeListColorMap(options.listColors)
  };
}

function normalizeListColor(color) {
  const value = String(color || defaultListColor).trim().toLowerCase().replace(/\s+/g, "-");
  if (value === "sun" || value === "sun-yellow" || value === "some-sun-yellow" || value === "yellow") return "amber";
  return listColorValues.has(value) ? value : defaultListColor;
}

function normalizeListColorMap(colors = {}) {
  if (!colors || typeof colors !== "object" || Array.isArray(colors)) return {};

  return Object.fromEntries(
    Object.entries(colors)
      .map(([listId, color]) => [listId, normalizeListColor(color)])
      .filter(([listId, color]) => listId && color !== defaultListColor)
  );
}

function getListColorMap() {
  return normalizeListColorMap(getAccountOptionsFromLists(lists).listColors);
}

function getListColor(list) {
  if (!list || isPinnedList(list)) return defaultListColor;
  return normalizeListColor(getListColorMap()[list.id] || list.color);
}

function setListColor(list, color) {
  const selectedColor = normalizeListColor(color);
  const currentOptions = getAccountOptionsFromLists(lists);
  const listColors = {
    ...normalizeListColorMap(currentOptions.listColors)
  };
  const updatedAt = new Date().toISOString();

  if (selectedColor === defaultListColor) {
    delete listColors[list.id];
    delete list.color;
  } else {
    listColors[list.id] = selectedColor;
    list.color = selectedColor;
  }

  applyAccountOptionsToTodayList({
    ...currentOptions,
    tomorrowMode: appOptions.tomorrowMode,
    listColors,
    updatedAt
  });
}

function getAccountOptionsFromLists(sourceLists = lists) {
  const todayList = ensureTodayList(sourceLists).find(isTodayList);
  return normalizeAccountOptions(todayList?.accountOptions);
}

function getLatestAccountOptions(...sourceLists) {
  return sourceLists.reduce((latest, list) => {
    const candidate = normalizeAccountOptions(list?.accountOptions);
    if (!candidate.updatedAt && !latest.updatedAt) {
      return candidate.tomorrowMode !== "daily" ? candidate : latest;
    }
    if (!candidate.updatedAt) return latest;
    if (!latest.updatedAt || isTimestampNewer(candidate.updatedAt, latest.updatedAt) || candidate.updatedAt === latest.updatedAt) {
      return candidate;
    }
    return latest;
  }, normalizeAccountOptions());
}

function applySyncedAccountOptions(accountOptions) {
  const syncedOptions = normalizeAccountOptions(accountOptions);
  const localOptions = getAccountOptionsForSync();
  if (!syncedOptions.updatedAt) return false;
  if (localOptions.updatedAt && isTimestampNewer(localOptions.updatedAt, syncedOptions.updatedAt)) return false;

  appOptions = normalizeAppOptions({
    ...appOptions,
    tomorrowMode: syncedOptions.tomorrowMode,
    tomorrowModeUpdatedAt: syncedOptions.updatedAt
  });
  saveAppOptions();
  return true;
}

function applyAccountOptionsToTodayList(accountOptions = getAccountOptionsForSync()) {
  lists = ensureTodayList(lists);
  const todayList = lists.find(isTodayList);
  if (!todayList) return;

  const syncedOptions = normalizeAccountOptions(accountOptions);
  todayList.accountOptions = syncedOptions;
  if (syncedOptions.updatedAt) {
    markListUpdated(todayList, syncedOptions.updatedAt);
  }
}

function loadListCollapsePrefs() {
  try {
    const savedPrefs = JSON.parse(localStorage.getItem(listCollapseKey));
    return savedPrefs && typeof savedPrefs === "object" && !Array.isArray(savedPrefs)
      ? Object.fromEntries(Object.entries(savedPrefs).map(([listId, collapsed]) => [listId, Boolean(collapsed)]))
      : {};
  } catch {
    return {};
  }
}

function persistListCollapsePrefs() {
  localStorage.setItem(listCollapseKey, JSON.stringify(listCollapsePrefs));
}

function getLocalListCollapsed(list) {
  if (!list?.id) return Boolean(list?.collapsed);
  if (Object.prototype.hasOwnProperty.call(listCollapsePrefs, list.id)) {
    return Boolean(listCollapsePrefs[list.id]);
  }
  return Boolean(list.collapsed);
}

function rememberListCollapsed(listId, collapsed) {
  if (!listId) return;
  listCollapsePrefs[listId] = Boolean(collapsed);
  persistListCollapsePrefs();
}

function expandProjectFooterLists() {
  let changed = false;
  lists.forEach((list) => {
    if (!isProjectList(list) || !list.collapsed) return;
    list.collapsed = false;
    rememberListCollapsed(list.id, false);
    changed = true;
  });
  if (changed) {
    persistLocalListsOnly();
  }
}

function render() {
  refreshTodayText();
  const todayList = lists.find(isTodayList);
  const visibleLists = lists.filter((list) => !isTodayList(list) && !isProjectList(list) && shouldShowList(list));
  const visibleProjectLists = lists.filter((list) => isProjectList(list) && shouldShowList(list));

  syncFooterTrayState();
  renderFilterMenu();
  renderSettingsMenu();
  renderTomorrowQueue();
  renderScheduledQueue();
  renderOnHoldQueue();
  listComposer.hidden = filter === "hidden";
  projectSection.hidden = !appOptions.showProjects;
  tomorrowSection.hidden = !appOptions.showTomorrow;
  emptyState.hidden = visibleLists.length + (appOptions.showProjects ? visibleProjectLists.length : 0) > 0;
  document.body.classList.toggle("has-no-pinned-footer", getVisibleFooterTabs().length === 0);
  document.body.classList.toggle("is-compact", appOptions.compactMode);

  todayBoard.replaceChildren(todayList ? createListElement(todayList) : []);
  listBoard.replaceChildren(...visibleLists.map(createListElement));
  projectBoard.replaceChildren(...visibleProjectLists.map(createListElement));
  renderFooterTray();
  updateTomorrowFooterSpace();
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
  optionsToggleButton.setAttribute("aria-expanded", String(settingsOptionsOpen));
  settingsOptions.hidden = !settingsOptionsOpen;

  const isDark = document.documentElement.dataset.theme === "dark";
  themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.title = isDark ? "Switch to light mode" : "Switch to dark mode";
  showProjectsOption.checked = appOptions.showProjects;
  showTomorrowOption.checked = appOptions.showTomorrow;
  showScheduledOption.checked = appOptions.showScheduled;
  showOnHoldOption.checked = appOptions.showOnHold;
  compactModeOption.checked = appOptions.compactMode;
  weekendModeOption.checked = appOptions.tomorrowMode === "weekdays";
  settingsOptions.querySelectorAll("[data-queue-mode]").forEach((button) => {
    const isActive = button.dataset.queueMode === appOptions.tomorrowMode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  refreshSyncButton.disabled = !isSupabaseConfigured() || !syncClient || !syncUser;
  const hasArchive = Boolean(getCompletedArchiveExportText().trim());
  viewArchiveButton.disabled = !hasArchive;
  copyArchiveButton.disabled = !hasArchive;
  downloadArchiveButton.disabled = !hasArchive;
  if (appVersionLabel) appVersionLabel.textContent = appVersion;
  if (lastSyncedAtLabel) lastSyncedAtLabel.textContent = formatLastSyncedText();
}

function markSyncSuccess() {
  syncLastSuccessAt = new Date().toISOString();
  localStorage.setItem(syncLastSuccessKey, syncLastSuccessAt);
  if (lastSyncedAtLabel) lastSyncedAtLabel.textContent = formatLastSyncedText();
}

function formatLastSyncedText() {
  if (!isSupabaseConfigured()) return "Local only";
  if (!syncUser) return "Not syncing";
  if (!syncLastSuccessAt) return "Never";

  const date = new Date(syncLastSuccessAt);
  if (Number.isNaN(date.getTime())) return "Never";
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
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

function renderFooterTray() {
  const visibleTabs = syncFooterTrayState();

  footerTray.hidden = visibleTabs.length === 0;
  document.body.classList.toggle("has-no-pinned-footer", visibleTabs.length === 0);
  footerTray.querySelector(".footer-tabs")?.setAttribute("data-visible-count", String(visibleTabs.length));

  footerTabs.forEach((tab) => {
    const tabName = tab.dataset.footerTab;
    const visible = visibleTabs.includes(tabName);
    const active = activeFooterTab === tabName;
    tab.hidden = !visible;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.setAttribute("tabindex", active ? "0" : "-1");
  });

  footerPanels.forEach((panel) => {
    const tabName = panel.dataset.footerPanel;
    panel.hidden = activeFooterTab !== tabName || !visibleTabs.includes(tabName);
  });

  if (projectCount) {
    const projectList = lists.find(isProjectList);
    const openProjects = projectList?.tasks.filter((task) => !task.completed).length || 0;
    projectCount.textContent = String(openProjects);
  }

  updateTomorrowFooterSpace();
}

function syncFooterTrayState() {
  const visibleTabs = getVisibleFooterTabs();
  let nextActiveTab = activeFooterTab;

  if (nextActiveTab && !visibleTabs.includes(nextActiveTab)) {
    nextActiveTab = visibleTabs.includes("tomorrow") ? "tomorrow" : visibleTabs[0] || "";
  }

  if (nextActiveTab !== activeFooterTab) {
    activeFooterTab = nextActiveTab;
    localStorage.setItem(footerTabKey, activeFooterTab);
  }

  const nextTomorrowCollapsed = activeFooterTab !== "tomorrow";
  if (tomorrowCollapsed !== nextTomorrowCollapsed) {
    tomorrowCollapsed = nextTomorrowCollapsed;
    localStorage.setItem(tomorrowCollapsedKey, String(tomorrowCollapsed));
  }

  return visibleTabs;
}

function getVisibleFooterTabs() {
  return [
    ...(appOptions.showTomorrow ? ["tomorrow"] : []),
    ...(appOptions.showScheduled ? ["scheduled"] : []),
    ...(appOptions.showOnHold ? ["on-hold"] : []),
    ...(appOptions.showProjects ? ["projects"] : [])
  ];
}

function renderTomorrowQueue(options = {}) {
  const { scrollToBottom = false } = options;
  const queueLabel = getTomorrowQueueLabel();

  tomorrowLabel.textContent = queueLabel;
  tomorrowInput.placeholder = queueLabel === "Tomorrow" ? "Add to tomorrow" : `Add to ${queueLabel}`;
  tomorrowInput.setAttribute("aria-label", tomorrowInput.placeholder);
  tomorrowToggle.setAttribute("aria-expanded", String(!tomorrowCollapsed));
  tomorrowBody.hidden = tomorrowCollapsed;
  tomorrowCount.textContent = String(tomorrowQueue.length);

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

function renderScheduledQueue(options = {}) {
  const { scrollToBottom = false } = options;
  const visibleScheduledItems = getSortedScheduledQueue();
  ensureScheduledDateValue();
  scheduledCount.textContent = String(visibleScheduledItems.length);

  if (visibleScheduledItems.length === 0) {
    const empty = document.createElement("li");
    empty.className = "scheduled-empty";
    empty.textContent = "No scheduled tasks.";
    scheduledList.replaceChildren(empty);
    updateTomorrowFooterSpace();
    return;
  }

  scheduledList.replaceChildren(...visibleScheduledItems.map(createScheduledQueueElement));
  updateTomorrowFooterSpace();
  if (scrollToBottom) {
    window.requestAnimationFrame(() => {
      scheduledList.scrollTop = scheduledList.scrollHeight;
    });
  }
}

function focusScheduledInput() {
  window.requestAnimationFrame(() => {
    if (!scheduledInput || activeFooterTab !== "scheduled") return;
    scheduledInput.focus();
    const cursorIndex = scheduledInput.value.length;
    try {
      scheduledInput.setSelectionRange(cursorIndex, cursorIndex);
    } catch {
      // Some mobile browsers can reject selection updates during focus transitions.
    }
  });
}

function renderOnHoldQueue(options = {}) {
  const { scrollToBottom = false } = options;
  const visibleOnHoldItems = getVisibleOnHoldQueue();
  onHoldCount.textContent = String(visibleOnHoldItems.length);

  if (visibleOnHoldItems.length === 0) {
    const empty = document.createElement("li");
    empty.className = "on-hold-empty";
    empty.textContent = "No tasks on hold.";
    onHoldList.replaceChildren(empty);
    updateTomorrowFooterSpace();
    return;
  }

  onHoldList.replaceChildren(...visibleOnHoldItems.map(createOnHoldQueueElement));
  updateTomorrowFooterSpace();
  if (scrollToBottom) {
    scrollOnHoldQueueToBottom();
  }
}

function getVisibleOnHoldQueue() {
  return normalizeOnHoldQueue(onHoldQueue).filter((item) => !isDeletedOnHoldQueueItem(item));
}

function ensureScheduledDateValue() {
  const dateKey = isDateKey(scheduledDateInput?.value) ? scheduledDateInput.value : getTomorrowDateKey();
  setScheduledDateValue(dateKey, { renderPicker: false });
}

function setScheduledDateValue(dateKey, options = {}) {
  const { renderPicker = true } = options;
  const nextDateKey = isDateKey(dateKey) ? dateKey : getTomorrowDateKey();
  if (scheduledDateInput) scheduledDateInput.value = nextDateKey;
  if (scheduledDateButton) scheduledDateButton.textContent = formatScheduledDateButton(nextDateKey);
  scheduledDatePickerViewDate = getMonthStart(parseDateKey(nextDateKey) || new Date());
  if (renderPicker) renderScheduledDatePicker();
}

function openScheduledDatePicker() {
  ensureScheduledDateValue();
  scheduledDatePickerOpen = true;
  scheduledDatePicker.hidden = false;
  scheduledDateButton.setAttribute("aria-expanded", "true");
  renderScheduledDatePicker();
}

function closeScheduledDatePicker() {
  scheduledDatePickerOpen = false;
  if (scheduledDatePicker) scheduledDatePicker.hidden = true;
  if (scheduledDateButton) scheduledDateButton.setAttribute("aria-expanded", "false");
}

function moveScheduledDatePickerMonth(offset) {
  const current = scheduledDatePickerViewDate || getMonthStart(parseDateKey(scheduledDateInput?.value) || new Date());
  scheduledDatePickerViewDate = new Date(current.getFullYear(), current.getMonth() + offset, 1);
  renderScheduledDatePicker();
}

function renderScheduledDatePicker() {
  if (!scheduledDatePicker || !scheduledDatePickerLabel || !scheduledDateGrid) return;
  const selectedDateKey = isDateKey(scheduledDateInput?.value) ? scheduledDateInput.value : getTomorrowDateKey();
  const selectedDate = parseDateKey(selectedDateKey) || new Date();
  const viewDate = scheduledDatePickerViewDate || getMonthStart(selectedDate);
  scheduledDatePickerViewDate = getMonthStart(viewDate);
  scheduledDatePickerLabel.textContent = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric"
  }).format(scheduledDatePickerViewDate);

  const firstVisibleDate = new Date(scheduledDatePickerViewDate);
  firstVisibleDate.setDate(1 - firstVisibleDate.getDay());
  const todayKey = getDateKey();
  const days = [];

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(firstVisibleDate);
    date.setDate(firstVisibleDate.getDate() + index);
    const dateKey = getDateKey(date);
    const button = document.createElement("button");
    button.className = "scheduled-date-day";
    button.type = "button";
    button.dataset.scheduledDate = dateKey;
    button.textContent = String(date.getDate());
    button.setAttribute("aria-label", formatScheduledDateButton(dateKey));
    button.classList.toggle("is-outside-month", date.getMonth() !== scheduledDatePickerViewDate.getMonth());
    button.classList.toggle("is-today", dateKey === todayKey);
    button.classList.toggle("is-selected", dateKey === selectedDateKey);
    if (dateKey === selectedDateKey) button.setAttribute("aria-current", "date");
    days.push(button);
  }

  scheduledDateGrid.replaceChildren(...days);
}

function getMonthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatScheduledDateButton(dateKey) {
  const date = parseDateKey(dateKey);
  if (!date) return "Choose date";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function scrollTomorrowQueueToBottom() {
  window.requestAnimationFrame(() => {
    tomorrowList.scrollTop = tomorrowList.scrollHeight;
  });
}

function scrollOnHoldQueueToBottom() {
  window.requestAnimationFrame(() => {
    onHoldList.scrollTop = onHoldList.scrollHeight;
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

function createScheduledQueueElement(entry) {
  const item = document.createElement("li");
  item.className = "scheduled-item";
  item.dataset.scheduledId = entry.id;

  const title = document.createElement("p");
  title.className = "scheduled-title";
  title.textContent = entry.title;

  const date = document.createElement("span");
  date.className = "scheduled-date";
  date.textContent = formatScheduledDate(entry.targetDate);

  const button = document.createElement("button");
  button.className = "scheduled-remove";
  button.type = "button";
  button.dataset.scheduledAction = "delete";
  button.setAttribute("aria-label", `Remove ${entry.title}`);
  button.textContent = "Remove";

  item.append(title, date, button);
  return item;
}

function createOnHoldQueueElement(entry) {
  const item = document.createElement("li");
  item.className = "on-hold-item";
  item.dataset.onHoldId = entry.id;

  const title = document.createElement("p");
  title.className = "on-hold-title";
  title.textContent = entry.title;

  const actions = document.createElement("div");
  actions.className = "on-hold-actions";

  const todayButton = document.createElement("button");
  todayButton.className = "on-hold-action";
  todayButton.type = "button";
  todayButton.dataset.onHoldAction = "today";
  todayButton.setAttribute("aria-label", `Bump ${entry.title} to Today`);
  todayButton.textContent = "Today";

  const tomorrowButton = document.createElement("button");
  tomorrowButton.className = "on-hold-action";
  tomorrowButton.type = "button";
  tomorrowButton.dataset.onHoldAction = "tomorrow";
  tomorrowButton.setAttribute("aria-label", `Bump ${entry.title} to Tomorrow`);
  tomorrowButton.textContent = "Tomorrow";

  const removeButton = document.createElement("button");
  removeButton.className = "on-hold-action";
  removeButton.type = "button";
  removeButton.dataset.onHoldAction = "delete";
  removeButton.setAttribute("aria-label", `Remove ${entry.title}`);
  removeButton.textContent = "Remove";

  actions.append(todayButton, tomorrowButton, removeButton);
  item.append(title, actions);
  return item;
}

function getSortedScheduledQueue() {
  return getSortedScheduledQueueItems(scheduledQueue);
}

function getSortedScheduledQueueItems(queue = [], options = {}) {
  const { includeDeleted = false } = options;
  return normalizeScheduledQueue(queue).filter((item) => includeDeleted || !isDeletedScheduledQueueItem(item)).sort((first, second) => {
    const dateCompare = first.targetDate.localeCompare(second.targetDate);
    if (dateCompare) return dateCompare;
    return (first.createdAt || "").localeCompare(second.createdAt || "");
  });
}

function formatScheduledDate(dateKey) {
  const date = parseDateKey(dateKey);
  if (!date) return "No date";
  const todayKey = getDateKey();
  if (dateKey === todayKey) return "Today";
  if (dateKey === getTomorrowDateKey()) return "Tomorrow";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric"
  }).format(date);
}

function shouldShowList(list) {
  if (isTodayList(list)) return true;
  if (isProjectList(list)) return true;
  if (filter === "hidden") return false;
  if (filter === "all") return true;
  if (filter === "shared") return isSharedList(list);
  if (filter === "private") return !isSharedList(list);
  const groups = getTaskGroups(list);
  return groups.openTasks.length > 0 || groups.completedTasks.length > 0;
}

function getTaskGroups(list) {
  const openTasks = list.tasks.filter((task) => !task.completed);
  const allCompletedTasks = list.tasks.filter((task) => task.completed).sort(compareCompletedTasks);
  const completedTodayTasks = allCompletedTasks.filter(isTaskCompletedToday);
  const canShowPreviousCompletedTasks = !isPinnedList(list);
  const completedTasks = canShowPreviousCompletedTasks ? allCompletedTasks : completedTodayTasks;
  const previousCompletedTasks = canShowPreviousCompletedTasks
    ? allCompletedTasks.filter((task) => !isTaskCompletedToday(task))
    : [];

  if (filter === "active") {
    return {
      openTasks,
      completedTasks: [],
      completedTodayTasks: [],
      previousCompletedTasks: [],
      visibleCompletedTasks: [],
      visiblePreviousCompletedTasks: [],
      hiddenCompletedCount: 0,
      isCompletedExpanded: false,
      showCompletedToggle: false
    };
  }

  if (filter === "completed") {
    return {
      openTasks: [],
      completedTasks,
      completedTodayTasks,
      previousCompletedTasks,
      visibleCompletedTasks: completedTasks,
      visiblePreviousCompletedTasks: [],
      hiddenCompletedCount: 0,
      isCompletedExpanded: true,
      showCompletedToggle: false
    };
  }

  const showAllCompleted = canShowPreviousCompletedTasks && (filter === "completed" || expandedCompletedLists.has(list.id));
  const visiblePreviousCompletedTasks = showAllCompleted ? previousCompletedTasks : [];

  return {
    openTasks,
    completedTasks,
    completedTodayTasks,
    previousCompletedTasks,
    visibleCompletedTasks: completedTodayTasks,
    visiblePreviousCompletedTasks,
    hiddenCompletedCount: showAllCompleted ? 0 : previousCompletedTasks.length,
    isCompletedExpanded: showAllCompleted,
    showCompletedToggle: canShowPreviousCompletedTasks && ["all", "shared", "private"].includes(filter) && previousCompletedTasks.length > 0
  };
}

function compareCompletedTasks(first, second) {
  return getCompletedTime(second) - getCompletedTime(first);
}

function getCompletedTime(task) {
  return new Date(task.completedAt || task.createdAt || 0).getTime();
}

function createListScopeLabel(list) {
  if (isPinnedList(list)) return null;

  const label = document.createElement("span");
  const shared = isSharedList(list);
  label.className = `list-scope-label${shared ? " is-shared" : ""}`;
  label.textContent = shared ? "Shared" : "Private";
  return label;
}

function getListDisplayName(list) {
  if (isTodayList(list) && isWeekendModeToday()) return "Weekend";
  return list.name;
}

function createListElement(list) {
  const item = document.createElement("li");
  const taskGroups = getTaskGroups(list);
  const openTasks = list.tasks.filter((task) => !task.completed).length;
  const bodyId = `list-body-${list.id}`;
  const listDisplayName = getListDisplayName(list);

  item.className = `standing-list${list.collapsed ? " is-collapsed" : ""}`;
  if (isTodayList(list)) {
    item.classList.add("is-pinned");
  }
  if (isProjectList(list)) {
    item.classList.add("is-project-pinned");
  }
  if (openMenu?.listId === list.id) {
    item.classList.add("has-open-menu");
  }
  item.dataset.listId = list.id;
  const listColor = getListColor(list);
  if (listColor !== defaultListColor) {
    item.dataset.listColor = listColor;
  }

  const header = document.createElement("div");
  header.className = "list-header";

  const dragHandle = createDragHandle("list", isPinnedList(list) ? `${listDisplayName} options` : `Drag ${listDisplayName}`, {
    draggable: !isPinnedList(list),
    fixed: isPinnedList(list),
    open: isMenuOpen("list", list.id)
  });

  const chevron = document.createElement("span");
  chevron.className = "chevron";
  chevron.setAttribute("aria-hidden", "true");
  chevron.textContent = list.collapsed ? "+" : "-";

  let titleControl;
  if (editingListId === list.id && !isPinnedList(list)) {
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
    name.textContent = listDisplayName;
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
  progressText.textContent = isProjectList(list)
    ? formatProjectProgressText(openTasks)
    : formatDailyProgressText(list);

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
  if (taskGroups.visibleCompletedTasks.length > 0 || taskGroups.visiblePreviousCompletedTasks.length > 0 || taskGroups.showCompletedToggle) {
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
  const addLabel = getTaskFormAddLabel(list);

  const title = document.createElement("input");
  title.name = "title";
  title.type = "text";
  title.placeholder = addLabel;
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
  const addLabel = getTaskFormAddLabel(list);
  button.className = "inline-task-launcher";
  button.type = "button";
  button.dataset.action = "show-task-form";
  button.textContent = addLabel;
  button.setAttribute("aria-label", `${addLabel} to ${list.name}`);
  return button;
}

function getTaskFormAddLabel(list) {
  return isProjectList(list) ? "Add a project" : "Add a to-do";
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

function createTaskElement(task, list, variant = "") {
  const item = document.createElement("li");
  item.className = `task-row${task.completed ? " is-complete" : ""}${variant === "previous" ? " is-previous-complete" : ""}`;
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
  const repeatBadge = task.repeat?.enabled ? createRepeatBadge(task.repeat) : null;

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
  if (repeatBadge) {
    item.append(repeatBadge);
  }
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

function formatDailyProgressText(list) {
  const progress = getDailyProgress(list);
  return formatProgressText(progress.completedToday, progress.total);
}

function getDailyProgress(list) {
  const openTasks = list.tasks.filter((task) => !task.completed).length;
  const completedToday = list.tasks.filter(isTaskCompletedToday).length;
  return {
    completedToday,
    total: openTasks + completedToday
  };
}

function isTaskCompletedToday(task) {
  return Boolean(task.completed) && getTaskCompletionDateKey(task) === getDateKey();
}

function isReusedPreviousTask(task) {
  return Boolean(task && !task.completed && task.previousCompletedAt);
}

function returnTaskToPreviousCompleted(listId, task, index) {
  const currentList = findList(listId);
  if (!currentList || !task) return;

  const restoredTask = cloneTask(task);
  restoredTask.completed = true;
  restoredTask.completedAt = restoredTask.previousCompletedAt || restoredTask.completedAt || restoredTask.updatedAt || new Date().toISOString();
  delete restoredTask.previousCompletedAt;
  forgetTaskDeletion(currentList, restoredTask.id);
  markTaskUpdated(restoredTask);
  insertTaskAt(currentList, restoredTask, index);
  persistAndRender({ sharedListIds: [listId] });
}

function setTaskRepeat(task, mode, options = {}) {
  if (!task) return;

  if (!mode || mode === repeatOffValue) {
    task.repeat = null;
    markTaskUpdated(task);
    return;
  }

  const todayKey = getDateKey();
  const dayOfMonth = options.dayOfMonth || new Date().getDate();
  const monthlyPattern = mode === monthlyPatternRepeatMode
    ? normalizeMonthlyRepeatPattern(options.monthlyPattern) || monthlyRepeatPatternOptions[0].value
    : "";
  const repeat = {
    mode,
    dayOfMonth,
    monthlyPattern,
    anchorDate: todayKey
  };

  task.repeat = normalizeTaskRepeat({
    enabled: true,
    mode,
    anchorDate: todayKey,
    dayOfMonth,
    monthlyPattern,
    lastRunDate: isRepeatDueOnDate(repeat, todayKey)
      ? todayKey
      : ""
  });
  markTaskUpdated(task);
}

function getTaskCompletionDateKey(task) {
  if (!task?.completedAt) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(task.completedAt)) return task.completedAt;

  const completedDate = new Date(task.completedAt);
  return Number.isNaN(completedDate.getTime()) ? "" : getDateKey(completedDate);
}

function formatProjectProgressText(openTasks) {
  return `${openTasks} open`;
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
  if (taskGroups.visibleCompletedTasks.length > 0) {
    section.append(completedList);
  }

  if (taskGroups.visiblePreviousCompletedTasks.length > 0) {
    const previousList = document.createElement("ul");
    previousList.className = "nested-task-list completed-task-list previous-completed-task-list";
    previousList.replaceChildren(...taskGroups.visiblePreviousCompletedTasks.map((task) => createTaskElement(task, list, "previous")));
    section.append(previousList);
  }

  if (taskGroups.showCompletedToggle) {
    const button = document.createElement("button");
    button.className = "completed-toggle";
    button.type = "button";
    button.dataset.action = "toggle-completed-list";
    button.setAttribute("aria-expanded", String(taskGroups.isCompletedExpanded));
    button.textContent = taskGroups.isCompletedExpanded
      ? "Hide previous items"
      : `View ${taskGroups.hiddenCompletedCount} previous item${taskGroups.hiddenCompletedCount === 1 ? "" : "s"}`;
    section.append(button);
  }

  return section;
}

function shouldShowInlineEmpty(list, taskGroups) {
  if (filter === "active") return list.tasks.length === 0 || list.tasks.some((task) => task.completed);
  if (filter === "completed") return taskGroups.completedTasks.length === 0;
  if (filter === "shared" || filter === "private") return list.tasks.length === 0;
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
  if (!isPinnedList(list)) {
    const colorPanelOpen = isListColorPanelOpen(list.id);
    const colorPanelId = `list-color-panel-${list.id}`;
    const colorButton = createMenuButton("Color", "toggle-list-color-panel", `Choose color for ${list.name}`, colorPanelOpen);
    colorButton.setAttribute("aria-expanded", String(colorPanelOpen));
    colorButton.setAttribute("aria-controls", colorPanelId);
    menu.append(colorButton);
    if (colorPanelOpen) {
      menu.append(createListColorPanel(list, colorPanelId));
    }
    if (canShareList(list)) {
      menu.append(createMenuButton("Share", "share-list", `Share ${list.name}`));
      const invitesPanelOpen = isListInvitesPanelOpen(list.id);
      const invitesPanelId = `list-invites-panel-${list.id}`;
      const invitesButton = createMenuButton("Invites", "toggle-list-invites-panel", `View invites for ${list.name}`, invitesPanelOpen);
      invitesButton.setAttribute("aria-expanded", String(invitesPanelOpen));
      invitesButton.setAttribute("aria-controls", invitesPanelId);
      menu.append(invitesButton);
      if (invitesPanelOpen) {
        menu.append(createListInvitesPanel(list, invitesPanelId));
      }
    }
    menu.append(createMenuButton("Edit", "edit-list", `Edit ${list.name}`));
    if (canManageList(list)) {
      menu.append(createMenuButton("Delete", "delete-list", `Delete ${list.name}`, false, true));
    }
  }

  return menu;
}

function createListColorPanel(list, panelId) {
  const panel = document.createElement("div");
  panel.className = "menu-color-panel";
  panel.id = panelId;
  panel.setAttribute("role", "group");
  panel.setAttribute("aria-label", "List color");

  const choices = document.createElement("div");
  choices.className = "menu-color-choices";
  const selectedColor = getListColor(list);
  listColorOptions.forEach((option) => {
    choices.append(createListColorChoice(option, selectedColor === option.value));
  });

  panel.append(choices);
  return panel;
}

function createListColorChoice(option, active = false) {
  const button = createActionButton(option.label, "set-list-color", `${option.label} list color`);
  button.className = "menu-color-choice";
  button.dataset.listColor = option.value;
  button.classList.toggle("is-active", active);
  button.setAttribute("role", "menuitemradio");
  button.setAttribute("aria-checked", String(Boolean(active)));

  const swatch = document.createElement("span");
  swatch.className = "menu-color-swatch";
  swatch.setAttribute("aria-hidden", "true");

  const label = document.createElement("span");
  label.textContent = option.label;

  button.replaceChildren(swatch, label);
  return button;
}

function createListInvitesPanel(list, panelId) {
  const panel = document.createElement("div");
  const state = getInviteStatusState(list.id);

  panel.className = "menu-invites-panel";
  panel.id = panelId;
  panel.setAttribute("role", "group");
  panel.setAttribute("aria-label", "Invite status");

  const actions = document.createElement("div");
  actions.className = "menu-invites-actions";

  const refresh = createActionButton(state.status === "loading" ? "Refreshing..." : "Refresh", "refresh-list-invites", `Refresh invites for ${list.name}`);
  refresh.className = "menu-invites-refresh";
  refresh.disabled = state.status === "loading" || !syncClient || !syncUser;
  actions.append(refresh);
  panel.append(actions);

  if (!isSupabaseConfigured()) {
    panel.append(createInviteStatusMessage("Add Supabase settings to view invite status."));
    return panel;
  }

  if (!syncUser) {
    panel.append(createInviteStatusMessage("Sign in to view invite status."));
    return panel;
  }

  if (state.status === "loading") {
    panel.append(createInviteStatusMessage("Loading invites..."));
    return panel;
  }

  if (state.status === "error") {
    panel.append(createInviteStatusMessage(state.error || "Invite status could not load.", true));
    return panel;
  }

  if (state.invites.length === 0) {
    panel.append(createInviteStatusMessage("No invites yet."));
    return panel;
  }

  const listElement = document.createElement("div");
  listElement.className = "menu-invites-list";
  state.invites.forEach((invite) => {
    listElement.append(createInviteStatusRow(invite));
  });
  panel.append(listElement);
  return panel;
}

function createInviteStatusMessage(message, isError = false) {
  const text = document.createElement("p");
  text.className = `menu-invites-message${isError ? " is-error" : ""}`;
  text.textContent = message;
  return text;
}

function createInviteStatusRow(invite) {
  const row = document.createElement("div");
  row.className = "menu-invite-row";

  const details = document.createElement("div");
  details.className = "menu-invite-details";

  const email = document.createElement("span");
  email.className = "menu-invite-email";
  email.textContent = invite.email;

  const status = document.createElement("span");
  status.className = `menu-invite-status ${invite.acceptedAt ? "is-accepted" : "is-pending"}`;
  status.textContent = invite.acceptedAt ? "Accepted" : "Pending";

  details.append(email, status);

  const remove = createActionButton("Remove", "remove-list-invite", `Remove ${invite.email}`);
  remove.className = "menu-invite-remove";
  remove.dataset.inviteEmail = invite.email;

  row.append(details, remove);
  return row;
}

function isTaskRepeatPanelOpen(listId, taskId) {
  return isMenuOpen("task", listId, taskId) && Boolean(openMenu?.repeatOpen);
}

function createRepeatPanel(task) {
  const panel = document.createElement("div");
  panel.className = "menu-repeat-panel";

  const choices = document.createElement("div");
  choices.className = "menu-repeat-choices";

  const offButton = createRepeatChoice(repeatOffValue, "No repeat", !task.repeat?.enabled);
  choices.append(offButton);
  repeatOptions.forEach((option) => {
    choices.append(createRepeatChoice(option.value, option.label, task.repeat?.mode === option.value));
  });
  panel.append(choices);

  const custom = document.createElement("div");
  custom.className = "menu-repeat-custom";

  const input = document.createElement("input");
  input.className = "menu-repeat-day-input";
  input.type = "number";
  input.min = "1";
  input.max = "31";
  input.inputMode = "numeric";
  input.value = task.repeat?.mode === "monthly-date"
    ? String(task.repeat.dayOfMonth || new Date().getDate())
    : String(new Date().getDate());
  input.setAttribute("aria-label", "Repeat day of month");

  const save = createActionButton("Set day", "save-custom-repeat", "Set day of month");
  save.className = `menu-link menu-repeat-custom-save${task.repeat?.mode === "monthly-date" ? " is-active" : ""}`;

  custom.append(input, save);
  panel.append(custom);

  const patterns = document.createElement("div");
  patterns.className = "menu-repeat-patterns";
  const activePattern = getMonthlyRepeatPattern(
    task.repeat?.mode === monthlyPatternRepeatMode
      ? task.repeat.monthlyPattern
      : monthlyRepeatPatternOptions[0].value
  ) || monthlyRepeatPatternOptions[0];
  const activePatternDay = monthlyRepeatDayOptions.some((option) => option.value === activePattern.day)
    ? activePattern.day
    : monthlyRepeatDayOptions[0].value;
  const activeOrdinalOptions = getMonthlyRepeatOrdinalOptionsForDay(activePatternDay);
  const activePatternOrdinal = activeOrdinalOptions.some((option) => option.value === activePattern.ordinal)
    ? activePattern.ordinal
    : activeOrdinalOptions[0]?.value;
  const patternPicker = document.createElement("div");
  patternPicker.className = `menu-repeat-pattern-picker${task.repeat?.mode === monthlyPatternRepeatMode ? " is-active" : ""}`;
  patternPicker.append(
    createMonthlyRepeatPatternSelect("ordinal", activeOrdinalOptions, activePatternOrdinal, "Repeat monthly ordinal"),
    createMonthlyRepeatPatternSelect("day", monthlyRepeatDayOptions, activePatternDay, "Repeat monthly day")
  );
  const setPattern = createActionButton("Set", "save-monthly-pattern-repeat", "Set monthly repeat pattern");
  setPattern.className = `menu-link menu-repeat-pattern-save${task.repeat?.mode === monthlyPatternRepeatMode ? " is-active" : ""}`;
  patternPicker.append(setPattern);
  patterns.append(patternPicker);
  panel.append(patterns);

  return panel;
}

function createMonthlyRepeatPatternSelect(part, options, value, ariaLabel) {
  const select = document.createElement("select");
  select.className = "menu-repeat-pattern-select";
  select.dataset.action = "draft-monthly-pattern-repeat";
  select.dataset.repeatPatternPart = part;
  select.setAttribute("aria-label", ariaLabel);

  options.forEach((option) => {
    select.append(createMonthlyRepeatPatternOption(option, option.value === value));
  });

  return select;
}

function createMonthlyRepeatPatternOption(option, selected = false) {
  const item = document.createElement("option");
  item.value = option.value;
  item.textContent = option.label;
  item.selected = selected;
  return item;
}

function createRepeatChoice(value, label, active = false, options = {}) {
  const button = createActionButton(label, "set-task-repeat", options.ariaLabel || label);
  button.className = "menu-link menu-repeat-choice";
  button.dataset.repeatMode = value;
  if (options.repeatPattern) button.dataset.repeatPattern = options.repeatPattern;
  button.classList.toggle("is-active", active);
  return button;
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
    menu.append(createMenuButton("Repeat", "toggle-task-repeat-panel", `Repeat ${task.title}`, isTaskRepeatPanelOpen(list.id, task.id)));
    if (isTaskRepeatPanelOpen(list.id, task.id)) {
      menu.append(createRepeatPanel(task));
    }
    menu.append(createMenuButton("Bump to Tomorrow", "move-task-tomorrow", `Bump ${task.title} to Tomorrow`));
    menu.append(createMenuButton("Move to On hold", "move-task-on-hold", `Move ${task.title} to On hold`));
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

function formatRepeatLabel(repeat) {
  if (!repeat?.enabled) return "";
  if (repeat.mode === "monthly-date") return `Repeats monthly on ${formatOrdinal(repeat.dayOfMonth || 1)}`;
  if (repeat.mode === monthlyPatternRepeatMode) {
    const pattern = getMonthlyRepeatPattern(repeat.monthlyPattern);
    return pattern ? `Repeats monthly on the ${pattern.fullLabel}` : "Repeats monthly";
  }
  const option = repeatOptions.find((item) => item.value === repeat.mode);
  return option ? `Repeats ${option.label.toLowerCase()}` : "Repeats";
}

function createRepeatBadge(repeat) {
  const badge = document.createElement("span");
  badge.className = "task-repeat-badge";
  badge.textContent = formatRepeatBadgeLabel(repeat);
  badge.title = formatRepeatLabel(repeat);
  return badge;
}

function formatRepeatBadgeLabel(repeat) {
  if (!repeat?.enabled) return "";
  if (repeat.mode === "monthly-date") return `Monthly ${formatOrdinal(repeat.dayOfMonth || 1)}`;
  if (repeat.mode === monthlyPatternRepeatMode) {
    return getMonthlyRepeatPattern(repeat.monthlyPattern)?.badge || "Monthly";
  }
  const option = repeatOptions.find((item) => item.value === repeat.mode);
  return option?.label || "Repeat";
}

function getMonthlyRepeatPattern(value) {
  return supportedMonthlyRepeatPatternOptions.find((option) => option.value === value) || null;
}

function getMonthlyRepeatPatternValue(ordinal, day) {
  return `${ordinal || ""}-${day || ""}`;
}

function getMonthlyPatternValueFromPicker(picker) {
  const day = picker?.querySelector("[data-repeat-pattern-part='day']")?.value;
  const ordinal = picker?.querySelector("[data-repeat-pattern-part='ordinal']")?.value;
  const ordinalOptions = getMonthlyRepeatOrdinalOptionsForDay(day);
  const normalizedOrdinal = ordinalOptions.some((option) => option.value === ordinal)
    ? ordinal
    : ordinalOptions[0]?.value;

  return normalizeMonthlyRepeatPattern(getMonthlyRepeatPatternValue(normalizedOrdinal, day));
}

function syncMonthlyPatternOrdinalSelect(picker) {
  const ordinalSelect = picker?.querySelector("[data-repeat-pattern-part='ordinal']");
  const day = picker?.querySelector("[data-repeat-pattern-part='day']")?.value;
  if (!ordinalSelect || !day) return;

  const currentOrdinal = ordinalSelect.value;
  const ordinalOptions = getMonthlyRepeatOrdinalOptionsForDay(day);
  const nextOrdinal = ordinalOptions.some((option) => option.value === currentOrdinal)
    ? currentOrdinal
    : ordinalOptions[0]?.value;
  ordinalSelect.replaceChildren(...ordinalOptions.map((option) => createMonthlyRepeatPatternOption(option, option.value === nextOrdinal)));
}

function getMonthlyRepeatOrdinalOptionsForDay(day) {
  return day === "weekday" ? monthlyRepeatWeekdayOrdinalOptions : monthlyRepeatNamedDayOrdinalOptions;
}

function createMonthlyRepeatOrdinalOption(index) {
  const namedOrdinals = {
    1: ["first", "First", "first"],
    2: ["second", "Second", "second"],
    3: ["third", "Third", "third"],
    4: ["fourth", "Fourth", "fourth"]
  };
  const named = namedOrdinals[index];
  if (named) {
    return {
      value: named[0],
      label: named[1],
      fullLabel: named[2],
      badgeLabel: formatOrdinal(index),
      index
    };
  }

  const label = formatOrdinal(index);
  return {
    value: String(index),
    label,
    fullLabel: label.toLowerCase(),
    badgeLabel: label,
    index
  };
}

function formatOrdinal(day) {
  const value = Number(day);
  if (!Number.isInteger(value)) return "";
  const suffix = value % 100 >= 11 && value % 100 <= 13
    ? "th"
    : ["th", "st", "nd", "rd"][Math.min(value % 10, 4)] || "th";
  return `${value}${suffix}`;
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

function isListColorPanelOpen(listId) {
  return openMenu?.type === "list" && openMenu?.listId === listId && Boolean(openMenu.colorOpen);
}

function isListInvitesPanelOpen(listId) {
  return openMenu?.type === "list" && openMenu?.listId === listId && Boolean(openMenu.invitesOpen);
}

function finishListRename(form) {
  const list = findList(form?.dataset.listId);
  if (!list || isPinnedList(list) || editingListId !== list.id) return;

  const nextName = form.elements.name.value.trim();
  if (nextName) {
    list.name = nextName;
    markListUpdated(list);
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
    markTaskUpdated(task);
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

function showUndo(message, undo, options = {}) {
  window.clearTimeout(undoTimer);
  undoAction = typeof undo === "function" ? undo : null;
  undoMessage.textContent = message;
  undoButton.textContent = options.actionLabel || "Undo";
  undoToast.hidden = false;

  undoTimer = window.setTimeout(clearUndoAction, undoTimeoutMs);
}

function clearUndoAction() {
  window.clearTimeout(undoTimer);
  undoTimer = null;
  undoAction = null;
  undoToast.hidden = true;
  undoMessage.textContent = "";
  undoButton.textContent = "Undo";
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
  const updatedAt = options.updatedAt || options.updated_at || createdAt;
  const priorities = ["normal", "high", "low"];

  return {
    id: options.id || uid(),
    title,
    due: options.due || "",
    priority: priorities.includes(options.priority) ? options.priority : "normal",
    completed,
    completedAt: options.completedAt || (completed ? createdAt : ""),
    previousCompletedAt: options.previousCompletedAt || "",
    repeat: normalizeTaskRepeat(options.repeat || options.recurrence),
    createdAt,
    updatedAt
  };
}

function createList(name, collapsed = false, tasks = [], options = {}) {
  const createdAt = options.createdAt || new Date().toISOString();
  return {
    id: options.id || uid(),
    name,
    collapsed,
    tasks,
    createdAt,
    updatedAt: options.updatedAt || options.updated_at || createdAt,
    type: options.type || "standard",
    showDetails: Boolean(options.showDetails),
    ownerId: options.ownerId || "",
    shared: Boolean(options.shared),
    memberRole: options.memberRole || "",
    color: normalizeListColor(options.color) === defaultListColor ? "" : normalizeListColor(options.color),
    completedArchiveText: typeof options.completedArchiveText === "string" ? options.completedArchiveText : "",
    lastTodayDateKey: options.lastTodayDateKey || "",
    accountOptions: normalizeAccountOptions(options.accountOptions),
    sharedListOrder: normalizeSharedListOrder(options.sharedListOrder),
    sharedListOrderUpdatedAt: options.sharedListOrderUpdatedAt || "",
    deletedTaskTombstones: normalizeTaskTombstones(options.deletedTaskTombstones)
  };
}

function normalizeList(list) {
  const deletedTaskTombstones = normalizeTaskTombstones(list.deletedTaskTombstones);
  const tasks = Array.isArray(list.tasks)
    ? filterTasksDeletedByTombstones(list.tasks.map(normalizeTask), deletedTaskTombstones)
    : [];

  return {
    id: list.id || uid(),
    name: list.name || "Untitled",
    collapsed: getLocalListCollapsed(list),
    tasks,
    createdAt: list.createdAt || new Date().toISOString(),
    updatedAt: list.updatedAt || list.updated_at || list.createdAt || new Date().toISOString(),
    type: list.type || "standard",
    showDetails: Boolean(list.showDetails),
    ownerId: list.ownerId || list.owner_id || "",
    shared: Boolean(list.shared),
    memberRole: list.memberRole || list.member_role || "",
    color: normalizeListColor(list.color || list.listColor) === defaultListColor ? "" : normalizeListColor(list.color || list.listColor),
    completedArchiveText: typeof list.completedArchiveText === "string" ? list.completedArchiveText : "",
    lastTodayDateKey: list.lastTodayDateKey || "",
    accountOptions: normalizeAccountOptions(list.accountOptions),
    sharedListOrder: normalizeSharedListOrder(list.sharedListOrder),
    sharedListOrderUpdatedAt: list.sharedListOrderUpdatedAt || "",
    deletedTaskTombstones
  };
}

function normalizeSharedListOrder(order) {
  const seen = new Set();
  return Array.isArray(order)
    ? order.filter((id) => {
      if (typeof id !== "string" || !id || seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    : [];
}

function normalizeTask(task) {
  return createTask(task.title || "Untitled task", task);
}

function normalizeTaskRepeat(repeat) {
  if (!repeat || repeat.enabled === false || repeat.mode === repeatOffValue) return null;
  const mode = repeatOptionValues.has(repeat.mode) || repeat.mode === "monthly-date" || repeat.mode === monthlyPatternRepeatMode
    ? repeat.mode
    : "";
  if (!mode) return null;
  const monthlyPattern = normalizeMonthlyRepeatPattern(repeat.monthlyPattern || repeat.pattern);
  if (mode === monthlyPatternRepeatMode && !monthlyPattern) return null;

  return {
    enabled: true,
    mode,
    anchorDate: isDateKey(repeat.anchorDate) ? repeat.anchorDate : getDateKey(),
    dayOfMonth: normalizeRepeatDay(repeat.dayOfMonth || new Date().getDate()),
    monthlyPattern: mode === monthlyPatternRepeatMode ? monthlyPattern : "",
    lastRunDate: isDateKey(repeat.lastRunDate) ? repeat.lastRunDate : ""
  };
}

function normalizeRepeatDay(day) {
  const value = Number.parseInt(day, 10);
  if (!Number.isInteger(value)) return new Date().getDate();
  return Math.min(31, Math.max(1, value));
}

function normalizeMonthlyRepeatPattern(pattern) {
  return monthlyRepeatPatternValues.has(pattern) ? pattern : "";
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

function cloneScheduledQueueItem(item) {
  return item ? normalizeScheduledQueueItem({ ...item }) : null;
}

function cloneOnHoldQueueItem(item) {
  return item ? normalizeOnHoldQueueItem({ ...item }) : null;
}

function insertListAt(list, index) {
  const nextList = cloneList(list);
  const nextLists = ensureTodayList(lists).filter((item) => item.id !== nextList.id);
  const insertIndex = Math.max(1, Math.min(Number.isInteger(index) ? index : nextLists.length, nextLists.length));
  nextLists.splice(insertIndex, 0, nextList);
  lists = ensureTodayList(nextLists);
  markSharedListOrderUpdated();
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

function insertScheduledQueueItemAt(item, index) {
  const nextItem = cloneScheduledQueueItem(item);
  if (!nextItem) return;

  scheduledQueue = scheduledQueue.filter((entry) => entry.id !== nextItem.id);
  const insertIndex = Math.max(0, Math.min(Number.isInteger(index) ? index : scheduledQueue.length, scheduledQueue.length));
  scheduledQueue.splice(insertIndex, 0, nextItem);
}

function insertOnHoldQueueItemAt(item, index) {
  const nextItem = cloneOnHoldQueueItem(item);
  if (!nextItem) return;

  onHoldQueue = onHoldQueue.filter((entry) => entry.id !== nextItem.id);
  const insertIndex = Math.max(0, Math.min(Number.isInteger(index) ? index : onHoldQueue.length, onHoldQueue.length));
  onHoldQueue.splice(insertIndex, 0, nextItem);
}

function listToRow(list, position, updatedAt) {
  const listUpdatedAt = list.updatedAt || list.updated_at || list.createdAt || updatedAt;
  return {
    id: list.id,
    owner_id: list.ownerId || syncUser.id,
    name: list.name,
    collapsed: false,
    type: list.type || "standard",
    show_details: Boolean(list.showDetails),
    created_at: list.createdAt || updatedAt,
    position,
    updated_at: listUpdatedAt,
    device_id: syncDeviceId
  };
}

function listToEditableRow(list, position, updatedAt) {
  const listUpdatedAt = list.updatedAt || list.updated_at || list.createdAt || updatedAt;
  return {
    name: list.name,
    collapsed: false,
    type: list.type || "standard",
    show_details: Boolean(list.showDetails),
    created_at: list.createdAt || updatedAt,
    position,
    updated_at: listUpdatedAt,
    device_id: syncDeviceId
  };
}

function taskToRow(task, listId, position, updatedAt) {
  const taskUpdatedAt = task.updatedAt || task.updated_at || task.createdAt || updatedAt;
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
    updated_at: taskUpdatedAt,
    device_id: syncDeviceId,
    repeat: normalizeTaskRepeat(task.repeat)
  };
}

function deletedTaskToRow(tombstone, position = 0) {
  const updatedAt = tombstone.updatedAt || new Date().toISOString();
  return {
    id: tombstone.taskId,
    list_id: tombstone.listId,
    title: deletedTaskTitle,
    due: null,
    priority: "normal",
    completed: true,
    completed_at: updatedAt,
    created_at: tombstone.createdAt || updatedAt,
    position,
    updated_at: updatedAt,
    device_id: syncDeviceId
  };
}

function rowToList(row, tasks, memberRole = "", shared = false) {
  return createList(row.name || "Untitled", Boolean(row.collapsed), tasks, {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    type: row.type || "standard",
    showDetails: row.show_details,
    ownerId: row.owner_id,
    shared: shared || row.owner_id !== syncUser?.id,
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
    repeat: row.repeat || row.recurrence,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  });
}

function createTomorrowQueueItem(title, options = {}) {
  return {
    id: options.id || uid(),
    title,
    targetDate: options.targetDate || getNextQueueTargetDateKey(),
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
    targetDate: item.targetDate || getNextQueueTargetDateKey(new Date(item.createdAt || Date.now())),
    createdAt: item.createdAt
  });
}

function normalizeTomorrowQueue(queue) {
  return Array.isArray(queue) ? queue.map(normalizeTomorrowQueueItem).filter(Boolean) : [];
}

function createScheduledQueueItem(title, options = {}) {
  const createdAt = options.createdAt || new Date().toISOString();
  return {
    id: options.id || uid(),
    title,
    targetDate: isDateKey(options.targetDate) ? options.targetDate : getDateKey(),
    createdAt,
    updatedAt: options.updatedAt || options.updated_at || createdAt
  };
}

function createDeletedScheduledQueueItem(item, deletedAt = new Date().toISOString()) {
  return {
    id: item.id,
    title: item.title || "",
    targetDate: isDateKey(item.targetDate) ? item.targetDate : getDateKey(),
    createdAt: item.createdAt || deletedAt,
    updatedAt: deletedAt,
    deleted: true,
    deletedAt
  };
}

function normalizeScheduledQueueItem(item) {
  if (typeof item === "string") {
    const title = item.trim();
    return title ? createScheduledQueueItem(title) : null;
  }

  if (isDeletedScheduledQueueItem(item)) {
    const id = typeof item.id === "string" && item.id ? item.id : "";
    if (!id) return null;
    const deletedAt = item.deletedAt || item.updatedAt || item.updated_at || item.createdAt || new Date().toISOString();
    return createDeletedScheduledQueueItem({
      id,
      title: item.title || "",
      targetDate: item.targetDate,
      createdAt: item.createdAt
    }, deletedAt);
  }

  const title = item?.title?.trim();
  if (!title) return null;

  return createScheduledQueueItem(title, {
    id: item.id,
    targetDate: isDateKey(item.targetDate) ? item.targetDate : getDateKey(),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt || item.updated_at
  });
}

function normalizeScheduledQueue(queue) {
  return Array.isArray(queue) ? queue.map(normalizeScheduledQueueItem).filter(Boolean) : [];
}

function isDeletedScheduledQueueItem(item) {
  return Boolean(item?.deleted || item?.deletedAt);
}

function createOnHoldQueueItem(title, options = {}) {
  const createdAt = options.createdAt || new Date().toISOString();
  return {
    id: options.id || uid(),
    title,
    createdAt,
    updatedAt: options.updatedAt || options.updated_at || createdAt
  };
}

function createDeletedOnHoldQueueItem(item, deletedAt = new Date().toISOString()) {
  return {
    id: item.id,
    title: item.title || "",
    createdAt: item.createdAt || deletedAt,
    updatedAt: deletedAt,
    deleted: true,
    deletedAt
  };
}

function normalizeOnHoldQueueItem(item) {
  if (typeof item === "string") {
    const title = item.trim();
    return title ? createOnHoldQueueItem(title) : null;
  }

  if (isDeletedOnHoldQueueItem(item)) {
    const id = typeof item.id === "string" && item.id ? item.id : "";
    if (!id) return null;
    const deletedAt = item.deletedAt || item.updatedAt || item.updated_at || item.createdAt || new Date().toISOString();
    return createDeletedOnHoldQueueItem({
      id,
      title: item.title || "",
      createdAt: item.createdAt
    }, deletedAt);
  }

  const title = item?.title?.trim();
  if (!title) return null;

  return createOnHoldQueueItem(title, {
    id: item.id,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt || item.updated_at
  });
}

function normalizeOnHoldQueue(queue) {
  return Array.isArray(queue) ? queue.map(normalizeOnHoldQueueItem).filter(Boolean) : [];
}

function isDeletedOnHoldQueueItem(item) {
  return Boolean(item?.deleted || item?.deletedAt);
}

function loadDeletedSharedTasks() {
  try {
    return normalizeTaskTombstones(JSON.parse(localStorage.getItem(sharedTaskDeletionKey)));
  } catch {
    return [];
  }
}

function persistDeletedSharedTasks() {
  localStorage.setItem(sharedTaskDeletionKey, JSON.stringify(deletedSharedTasks));
}

function normalizeTaskTombstones(tombstones) {
  if (!Array.isArray(tombstones)) return [];
  return mergeTaskTombstones(tombstones.map(normalizeTaskTombstone).filter(Boolean));
}

function normalizeTaskTombstone(tombstone) {
  const taskId = tombstone?.taskId || tombstone?.task_id || tombstone?.id;
  const listId = tombstone?.listId || tombstone?.list_id || "";
  if (!taskId) return null;

  const updatedAt = tombstone.updatedAt || tombstone.updated_at || new Date().toISOString();
  return {
    taskId,
    listId,
    createdAt: tombstone.createdAt || tombstone.created_at || updatedAt,
    updatedAt
  };
}

function mergeTaskTombstones(...tombstoneGroups) {
  const tombstonesByKey = new Map();

  tombstoneGroups.flat().filter(Boolean).forEach((tombstone) => {
    const nextTombstone = normalizeTaskTombstone(tombstone);
    if (!nextTombstone) return;

    const key = getTaskTombstoneKey(nextTombstone.listId, nextTombstone.taskId);
    const existing = tombstonesByKey.get(key);
    if (!existing || isTimestampNewer(nextTombstone.updatedAt, existing.updatedAt)) {
      tombstonesByKey.set(key, nextTombstone);
    }
  });

  return Array.from(tombstonesByKey.values());
}

function filterTasksDeletedByTombstones(tasks = [], tombstones = []) {
  const tombstonesByTaskId = new Map(
    normalizeTaskTombstones(tombstones).map((tombstone) => [tombstone.taskId, tombstone])
  );

  return tasks.filter((task) => {
    const tombstone = tombstonesByTaskId.get(task.id);
    if (!tombstone) return true;
    return isTimestampNewer(getItemUpdatedAt(task), tombstone.updatedAt);
  });
}

function isDeletedTaskRow(row) {
  return row?.title === deletedTaskTitle;
}

function taskTombstoneFromRow(row) {
  return normalizeTaskTombstone({
    taskId: row.id,
    listId: row.list_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  });
}

function getTaskTombstoneKey(listId, taskId) {
  return `${listId || ""}:${taskId}`;
}

function rememberTaskDeletion(list, task, deletedAt = new Date().toISOString()) {
  if (!list || !task) return;

  if (isTodayList(list)) {
    rememberPrivateTaskDeletion(list, task, deletedAt);
    return;
  }

  rememberSharedTaskDeletion(list, task, deletedAt);
}

function rememberPrivateTaskDeletion(list, task, deletedAt = new Date().toISOString()) {
  const tombstone = normalizeTaskTombstone({
    taskId: task.id,
    listId: list.id,
    createdAt: task.createdAt,
    updatedAt: deletedAt
  });
  list.deletedTaskTombstones = mergeTaskTombstones(list.deletedTaskTombstones, [tombstone]);
}

function rememberSharedTaskDeletion(list, task, deletedAt = new Date().toISOString()) {
  const tombstone = normalizeTaskTombstone({
    taskId: task.id,
    listId: list.id,
    createdAt: task.createdAt,
    updatedAt: deletedAt
  });

  list.deletedTaskTombstones = mergeTaskTombstones(list.deletedTaskTombstones, [tombstone]);
  deletedSharedTasks = mergeTaskTombstones(deletedSharedTasks, [tombstone]);
  persistDeletedSharedTasks();
}

function forgetTaskDeletion(list, taskId) {
  if (!list || !taskId) return;
  const key = getTaskTombstoneKey(list.id, taskId);
  list.deletedTaskTombstones = normalizeTaskTombstones(list.deletedTaskTombstones)
    .filter((tombstone) => getTaskTombstoneKey(tombstone.listId, tombstone.taskId) !== key);

  if (!isTodayList(list)) {
    deletedSharedTasks = deletedSharedTasks
      .filter((tombstone) => getTaskTombstoneKey(tombstone.listId, tombstone.taskId) !== key);
    persistDeletedSharedTasks();
  }
}

function getSharedDeletionTombstones(list) {
  return mergeTaskTombstones(
    list.deletedTaskTombstones,
    deletedSharedTasks.filter((tombstone) => tombstone.listId === list.id)
  );
}

function clearSyncedSharedDeletionTombstones(listId) {
  const beforeCount = deletedSharedTasks.length;
  deletedSharedTasks = deletedSharedTasks.filter((tombstone) => tombstone.listId !== listId);
  if (deletedSharedTasks.length !== beforeCount) {
    persistDeletedSharedTasks();
  }
}

function mergeSharedLists(localLists = [], remoteLists = []) {
  const localListsById = new Map(localLists.map((list) => [list.id, normalizeList(list)]));
  const remoteListIds = new Set(remoteLists.map((list) => list.id));
  const mergedLists = remoteLists.map((remoteList) => {
    const localList = localListsById.get(remoteList.id);
    return localList ? mergeSharedList(localList, remoteList) : normalizeList(remoteList);
  });

  localLists.forEach((localList) => {
    if (!remoteListIds.has(localList.id)) {
      mergedLists.push(normalizeList(localList));
    }
  });

  return mergedLists;
}

function applySharedListOrder(sharedLists = [], privateLists = []) {
  const { order } = getSharedListOrderMetadataFromLists(privateLists);
  if (order.length === 0) return sharedLists;

  const orderIndexById = new Map(order.map((listId, index) => [listId, index]));
  return [...sharedLists].sort((first, second) => {
    const firstIndex = orderIndexById.has(first.id) ? orderIndexById.get(first.id) : Number.MAX_SAFE_INTEGER;
    const secondIndex = orderIndexById.has(second.id) ? orderIndexById.get(second.id) : Number.MAX_SAFE_INTEGER;
    return firstIndex - secondIndex;
  });
}

function mergeSharedList(localList, remoteList) {
  const local = normalizeList(localList);
  const remote = normalizeList(remoteList);
  const winner = isTimestampNewer(remote.updatedAt, local.updatedAt) ? remote : local;
  const merged = cloneList(winner);

  merged.ownerId = remote.ownerId || local.ownerId;
  merged.memberRole = remote.memberRole || local.memberRole;
  merged.shared = remote.shared || local.shared;
  merged.deletedTaskTombstones = mergeTaskTombstones(local.deletedTaskTombstones, remote.deletedTaskTombstones);
  merged.tasks = filterTasksDeletedByTombstones(
    mergeTasks(local.tasks, remote.tasks),
    merged.deletedTaskTombstones
  );

  return merged;
}

function getSharedListOrderMetadataFromLists(sourceLists = lists) {
  const todayList = ensureTodayList(sourceLists).find(isTodayList);
  const savedOrder = normalizeSharedListOrder(todayList?.sharedListOrder);
  const currentOrder = getStandingLists(sourceLists).map((list) => list.id);

  return {
    order: savedOrder.length > 0 ? savedOrder : currentOrder,
    updatedAt: todayList?.sharedListOrderUpdatedAt || ""
  };
}

function getLatestSharedListOrderMetadata(...sourceLists) {
  return sourceLists.reduce((latest, list) => {
    const candidate = {
      order: normalizeSharedListOrder(list?.sharedListOrder),
      updatedAt: list?.sharedListOrderUpdatedAt || ""
    };

    if (candidate.order.length === 0 && !candidate.updatedAt) return latest;
    if (!latest.updatedAt || isTimestampNewer(candidate.updatedAt, latest.updatedAt) || candidate.updatedAt === latest.updatedAt) {
      return candidate;
    }
    return latest;
  }, { order: [], updatedAt: "" });
}

function shouldPushListRow(row, existingRow) {
  if (!existingRow?.updated_at) return true;
  return isTimestampNewer(row.updated_at, existingRow.updated_at);
}

function shouldPushTaskRow(row, existingRow) {
  if (!existingRow?.updated_at) return true;
  if (isTimestampNewer(row.updated_at, existingRow.updated_at)) return true;
  if (getTimestamp(row.updated_at) === getTimestamp(existingRow.updated_at)) {
    return !areTaskRepeatsEqual(row.repeat, existingRow.repeat);
  }
  return false;
}

function hasSharedRepeatBackfill(localLists = [], remoteLists = []) {
  const remoteTasksById = new Map();
  remoteLists.forEach((list) => {
    list.tasks.forEach((task) => {
      const normalizedTask = normalizeTask(task);
      remoteTasksById.set(normalizedTask.id, normalizedTask);
    });
  });

  return localLists.some((list) =>
    list.tasks.some((task) => {
      const localTask = normalizeTask(task);
      const remoteTask = remoteTasksById.get(localTask.id);
      if (!remoteTask) return false;
      if (isTimestampNewer(remoteTask.updatedAt, localTask.updatedAt)) return false;
      return !areTaskRepeatsEqual(localTask.repeat, remoteTask.repeat);
    })
  );
}

function areTaskRepeatsEqual(firstRepeat, secondRepeat) {
  return getTaskRepeatSignature(firstRepeat) === getTaskRepeatSignature(secondRepeat);
}

function getTaskRepeatSignature(repeat) {
  const normalizedRepeat = normalizeTaskRepeat(repeat);
  return normalizedRepeat ? JSON.stringify(normalizedRepeat) : "";
}

function markListUpdated(list, updatedAt = new Date().toISOString()) {
  if (list) list.updatedAt = updatedAt;
}

function markTaskUpdated(task, updatedAt = new Date().toISOString()) {
  if (task) task.updatedAt = updatedAt;
}

function markSharedListOrderUpdated(updatedAt = new Date().toISOString()) {
  lists = ensureTodayList(lists);
  const todayList = lists.find(isTodayList);
  if (!todayList) return;

  todayList.sharedListOrder = getStandingLists(lists).map((list) => list.id);
  todayList.sharedListOrderUpdatedAt = updatedAt;
  markListUpdated(todayList, updatedAt);
}

function markTaskOrderUpdated(list) {
  const updatedAt = new Date().toISOString();
  list?.tasks.forEach((task) => markTaskUpdated(task, updatedAt));
}

async function getMergedPrivateStateForPush(privateLists, queue, scheduled, onHold) {
  const localState = rollDueQueuesIntoPrivateState(privateLists, queue, scheduled, onHold);
  const remoteResult = await fetchPrivateDocument();
  if (remoteResult.error) {
    return { ...localState, error: remoteResult.error };
  }

  if (!remoteResult.data) {
    return { ...localState, error: null };
  }

  const remoteLists = Array.isArray(remoteResult.data.lists)
    ? ensureTodayList(remoteResult.data.lists.map(normalizeList)).filter(isTodayList)
    : [];
  const remoteQueue = normalizeTomorrowQueue(remoteResult.data.tomorrow_queue);
  const remoteScheduledQueue = normalizeScheduledQueue(remoteResult.data.scheduled_queue);
  const remoteOnHoldQueue = normalizeOnHoldQueue(remoteResult.data.on_hold_queue);

  return {
    ...mergePrivateState(localState.lists, localState.tomorrowQueue, localState.scheduledQueue, localState.onHoldQueue, remoteLists, remoteQueue, remoteScheduledQueue, remoteOnHoldQueue),
    error: null
  };
}

// Multiple installed app instances can wake up with stale private state, so private sync preserves items from both sides.
function mergePrivateState(localPrivateLists = [], localQueue = [], localScheduledQueue = [], localOnHoldQueue = [], remotePrivateLists = [], remoteQueue = [], remoteScheduledQueue = [], remoteOnHoldQueue = []) {
  const localToday = ensureTodayList(localPrivateLists.map(normalizeList)).find(isTodayList);
  const remoteToday = ensureTodayList(remotePrivateLists.map(normalizeList)).find(isTodayList);
  const mergedToday = mergeTodayLists(localToday, remoteToday);
  const mergedQueue = mergeTomorrowQueues(localQueue, remoteQueue);
  const mergedScheduledQueue = mergeScheduledQueues(localScheduledQueue, remoteScheduledQueue);
  const mergedOnHoldQueue = mergeOnHoldQueues(localOnHoldQueue, remoteOnHoldQueue);

  return rollDueQueuesIntoPrivateState([mergedToday], mergedQueue, mergedScheduledQueue, mergedOnHoldQueue);
}

function mergeTodayLists(localToday, remoteToday) {
  const sources = [remoteToday, localToday].filter(Boolean);
  const localUiState = localToday || remoteToday;
  const sharedOrder = getLatestSharedListOrderMetadata(remoteToday, localToday);
  const accountOptions = getLatestAccountOptions(remoteToday, localToday);
  const todayList = createList("Today", false, [], {
    id: todayListId,
    type: todayListType,
    createdAt: getEarliestDateValue(...sources.map((list) => list.createdAt)) || undefined,
    updatedAt: getLatestDateValue(...sources.map((list) => list.updatedAt)) || undefined,
    showDetails: Boolean(localUiState?.showDetails),
    completedArchiveText: mergeArchiveText(
      completedArchiveText,
      ...sources.map((list) => list.completedArchiveText)
    ),
    lastTodayDateKey: getLatestDateKey(lastTodayDateKey, ...sources.map((list) => list.lastTodayDateKey)),
    accountOptions,
    sharedListOrder: sharedOrder.order,
    sharedListOrderUpdatedAt: sharedOrder.updatedAt
  });

  todayList.collapsed = Boolean(localUiState?.collapsed);
  todayList.deletedTaskTombstones = mergeTaskTombstones(...sources.map((list) => list.deletedTaskTombstones));
  todayList.tasks = filterTasksDeletedByTombstones(
    mergeTasks(localToday?.tasks || [], remoteToday?.tasks || []),
    todayList.deletedTaskTombstones
  );
  return todayList;
}

function mergeTasks(primaryTasks = [], secondaryTasks = []) {
  const taskOrder = [];
  const tasksById = new Map();

  [...primaryTasks, ...secondaryTasks].forEach((task) => {
    const nextTask = normalizeTask(task);
    if (!tasksById.has(nextTask.id)) {
      taskOrder.push(nextTask.id);
      tasksById.set(nextTask.id, nextTask);
      return;
    }

    tasksById.set(nextTask.id, mergeTaskState(tasksById.get(nextTask.id), nextTask));
  });

  return taskOrder.map((taskId) => tasksById.get(taskId)).filter(Boolean);
}

function mergeTaskState(existing, incoming) {
  const existingTask = normalizeTask(existing);
  const incomingTask = normalizeTask(incoming);
  const winner = isTimestampNewer(incomingTask.updatedAt, existingTask.updatedAt) ? incomingTask : existingTask;
  const fallback = winner.id === existingTask.id && winner.updatedAt === existingTask.updatedAt ? incomingTask : existingTask;

  return {
    ...winner,
    title: winner.title || fallback.title,
    due: winner.due || "",
    priority: winner.priority || "normal",
    completed: Boolean(winner.completed),
    completedAt: winner.completed ? winner.completedAt || fallback.completedAt || "" : "",
    createdAt: getEarliestDateValue(existingTask.createdAt, incomingTask.createdAt) || winner.createdAt,
    updatedAt: getLatestDateValue(existingTask.updatedAt, incomingTask.updatedAt) || winner.updatedAt
  };
}

function mergeTomorrowQueues(primaryQueue = [], secondaryQueue = []) {
  const queueOrder = [];
  const queueById = new Map();

  [...normalizeTomorrowQueue(primaryQueue), ...normalizeTomorrowQueue(secondaryQueue)].forEach((item) => {
    if (!queueById.has(item.id)) {
      queueOrder.push(item.id);
      queueById.set(item.id, item);
      return;
    }

    queueById.set(item.id, mergeTomorrowQueueItem(queueById.get(item.id), item));
  });

  return queueOrder.map((itemId) => queueById.get(itemId)).filter(Boolean);
}

function mergeTomorrowQueueItem(existing, incoming) {
  return createTomorrowQueueItem(existing.title || incoming.title, {
    id: existing.id || incoming.id,
    targetDate: getEarliestDateKey(existing.targetDate, incoming.targetDate) || existing.targetDate || incoming.targetDate,
    createdAt: getEarliestDateValue(existing.createdAt, incoming.createdAt) || existing.createdAt || incoming.createdAt
  });
}

function mergeScheduledQueues(primaryQueue = [], secondaryQueue = []) {
  const queueOrder = [];
  const queueById = new Map();

  [...normalizeScheduledQueue(primaryQueue), ...normalizeScheduledQueue(secondaryQueue)].forEach((item) => {
    if (!queueById.has(item.id)) {
      queueOrder.push(item.id);
      queueById.set(item.id, item);
      return;
    }

    queueById.set(item.id, mergeScheduledQueueItem(queueById.get(item.id), item));
  });

  return queueOrder.map((itemId) => queueById.get(itemId)).filter(Boolean);
}

function mergeScheduledQueueItem(existing, incoming) {
  if (isDeletedScheduledQueueItem(existing) || isDeletedScheduledQueueItem(incoming)) {
    return isTimestampNewer(getItemUpdatedAt(incoming), getItemUpdatedAt(existing)) ? incoming : existing;
  }

  const winner = isTimestampNewer(getItemUpdatedAt(incoming), getItemUpdatedAt(existing)) ? incoming : existing;
  const fallback = winner === incoming ? existing : incoming;

  return createScheduledQueueItem(winner.title || fallback.title, {
    id: existing.id || incoming.id,
    targetDate: winner.targetDate || fallback.targetDate,
    createdAt: getEarliestDateValue(existing.createdAt, incoming.createdAt) || existing.createdAt || incoming.createdAt,
    updatedAt: getLatestDateValue(existing.updatedAt, incoming.updatedAt) || winner.updatedAt || fallback.updatedAt
  });
}

function mergeOnHoldQueues(primaryQueue = [], secondaryQueue = []) {
  const queueOrder = [];
  const queueById = new Map();

  [...normalizeOnHoldQueue(primaryQueue), ...normalizeOnHoldQueue(secondaryQueue)].forEach((item) => {
    if (!queueById.has(item.id)) {
      queueOrder.push(item.id);
      queueById.set(item.id, item);
      return;
    }

    queueById.set(item.id, mergeOnHoldQueueItem(queueById.get(item.id), item));
  });

  return queueOrder.map((itemId) => queueById.get(itemId)).filter(Boolean);
}

function mergeOnHoldQueueItem(existing, incoming) {
  if (isDeletedOnHoldQueueItem(existing) || isDeletedOnHoldQueueItem(incoming)) {
    return isTimestampNewer(getItemUpdatedAt(incoming), getItemUpdatedAt(existing)) ? incoming : existing;
  }

  const winner = isTimestampNewer(getItemUpdatedAt(incoming), getItemUpdatedAt(existing)) ? incoming : existing;
  const fallback = winner === incoming ? existing : incoming;

  return createOnHoldQueueItem(winner.title || fallback.title, {
    id: existing.id || incoming.id,
    createdAt: getEarliestDateValue(existing.createdAt, incoming.createdAt) || existing.createdAt || incoming.createdAt,
    updatedAt: getLatestDateValue(existing.updatedAt, incoming.updatedAt) || winner.updatedAt || fallback.updatedAt
  });
}

function rollDueQueuesIntoPrivateState(privateLists = [], queue = [], scheduled = [], onHold = []) {
  const todayKey = getDateKey();
  const nextLists = ensureTodayList(privateLists.map(normalizeList)).filter(isTodayList);
  const todayList = nextLists.find(isTodayList);
  todayList.tasks = filterTasksDeletedByTombstones(todayList.tasks, todayList.deletedTaskTombstones);
  const remainingQueue = [];
  const remainingScheduledQueue = [];
  const canRollToday = shouldRollTomorrowQueueToday();

  normalizeTomorrowQueue(queue).forEach((item) => {
    if (!canRollToday || item.targetDate > todayKey) {
      remainingQueue.push(item);
      return;
    }

    const taskId = getRolledTomorrowTaskId(item);
    if (!filterTasksDeletedByTombstones([{ id: taskId, updatedAt: item.createdAt }], todayList.deletedTaskTombstones).length) {
      return;
    }
    if (!todayList.tasks.some((task) => task.id === taskId)) {
      todayList.tasks.push(createTask(item.title, {
        id: taskId,
        createdAt: item.createdAt
      }));
    }
  });

  const dueScheduledItems = [];
  getSortedScheduledQueueItems(scheduled, { includeDeleted: true }).forEach((item) => {
    if (isDeletedScheduledQueueItem(item)) {
      remainingScheduledQueue.push(item);
      return;
    }

    if (item.targetDate > todayKey) {
      remainingScheduledQueue.push(item);
      return;
    }

    dueScheduledItems.push(item);
  });

  dueScheduledItems.slice().reverse().forEach((item) => {
    const taskId = getScheduledTaskId(item);
    if (!filterTasksDeletedByTombstones([{ id: taskId, updatedAt: item.createdAt }], todayList.deletedTaskTombstones).length) {
      return;
    }
    if (!todayList.tasks.some((task) => task.id === taskId)) {
      todayList.tasks.unshift(createTask(item.title, {
        id: taskId,
        createdAt: item.createdAt
      }));
    }
  });

  return {
    lists: nextLists,
    tomorrowQueue: remainingQueue,
    scheduledQueue: remainingScheduledQueue,
    onHoldQueue: normalizeOnHoldQueue(onHold)
  };
}

function rollDueQueueIntoPrivateState(privateLists = [], queue = []) {
  return rollDueQueuesIntoPrivateState(privateLists, queue, []);
}

function getRolledTomorrowTaskId(item) {
  return `tomorrow-${item.id}`;
}

function hasPrivateStateChanged(remoteLists = [], remoteQueue = [], remoteScheduledQueue = [], remoteOnHoldQueue = [], nextLists = [], nextQueue = [], nextScheduledQueue = [], nextOnHoldQueue = []) {
  return JSON.stringify(remoteLists) !== JSON.stringify(nextLists)
    || JSON.stringify(remoteQueue) !== JSON.stringify(nextQueue)
    || JSON.stringify(remoteScheduledQueue) !== JSON.stringify(nextScheduledQueue)
    || JSON.stringify(remoteOnHoldQueue) !== JSON.stringify(nextOnHoldQueue);
}

function mergeArchiveText(...texts) {
  return serializeArchiveEntries(mergeArchiveEntries(texts.flatMap(getArchiveEntriesFromText)));
}

function mergeArchiveEntries(entries = []) {
  const buckets = new Map();

  entries.forEach((entry) => {
    const date = String(entry.date || "Archived tasks").trim() || "Archived tasks";
    const key = getArchiveDateKeyFromLabel(date);
    if (!buckets.has(key)) {
      buckets.set(key, {
        date,
        items: [],
        itemKeys: new Set(),
        order: buckets.size,
        sortTime: getArchiveSortTime(date)
      });
    }

    const bucket = buckets.get(key);
    entry.items.map(normalizeArchiveItemTitle).filter(Boolean).forEach((item) => {
      const itemKey = item.toLocaleLowerCase();
      if (bucket.itemKeys.has(itemKey)) return;
      bucket.itemKeys.add(itemKey);
      bucket.items.push(item);
    });
  });

  return [...buckets.values()]
    .filter((entry) => entry.items.length > 0)
    .sort(compareArchiveEntries)
    .map(({ date, items }) => ({ date, items }));
}

function serializeArchiveEntries(entries = []) {
  return entries
    .map((entry) => [
      entry.date,
      ...entry.items.map((item) => `- ${item}`)
    ].join("\n"))
    .join("\n\n");
}

function getArchiveEntriesFromText(text = "") {
  return String(text || "")
    .trim()
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const [date, ...taskLines] = block.split("\n").map((line) => line.trim()).filter(Boolean);
      return {
        date: date || "Archived tasks",
        items: taskLines.map(normalizeArchiveItemTitle).filter(Boolean)
      };
    })
    .filter((entry) => entry.items.length > 0);
}

function normalizeArchiveItemTitle(item) {
  return String(item || "").replace(/^-\s*/, "").trim();
}

function getArchiveDateKeyFromLabel(dateLabel) {
  const parsedDate = parseArchiveDateLabel(dateLabel);
  return parsedDate ? getDateKey(parsedDate) : String(dateLabel || "Archived tasks").trim().toLocaleLowerCase();
}

function getArchiveSortTime(dateLabel) {
  const parsedDate = parseArchiveDateLabel(dateLabel);
  return parsedDate ? parsedDate.getTime() : Number.POSITIVE_INFINITY;
}

function parseArchiveDateLabel(dateLabel) {
  const label = String(dateLabel || "").trim();
  if (!label) return null;

  const withoutWeekday = label.replace(/^[^,]+,\s*/, "");
  const timestamp = Date.parse(label);
  const fallbackTimestamp = Date.parse(withoutWeekday);
  const time = Number.isNaN(timestamp) ? fallbackTimestamp : timestamp;
  if (Number.isNaN(time)) return null;

  const date = new Date(time);
  if (Number.isNaN(date.getTime())) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function compareArchiveEntries(first, second) {
  const firstHasDate = Number.isFinite(first.sortTime);
  const secondHasDate = Number.isFinite(second.sortTime);
  if (firstHasDate && secondHasDate && first.sortTime !== second.sortTime) {
    return first.sortTime - second.sortTime;
  }
  if (firstHasDate !== secondHasDate) return firstHasDate ? -1 : 1;
  return first.order - second.order;
}

function getEarliestDateValue(...values) {
  return values
    .filter(isValidDateValue)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0] || "";
}

function getLatestDateValue(...values) {
  const sortedValues = values
    .filter(isValidDateValue)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  return sortedValues[sortedValues.length - 1] || "";
}

function getEarliestDateKey(...keys) {
  return keys.filter(isDateKey).sort()[0] || "";
}

function getLatestDateKey(...keys) {
  const sortedKeys = keys.filter(isDateKey).sort();
  return sortedKeys[sortedKeys.length - 1] || "";
}

function getItemUpdatedAt(item) {
  return item?.updatedAt || item?.updated_at || item?.completedAt || item?.createdAt || "";
}

function isTimestampNewer(candidate, reference) {
  const candidateTime = getTimestamp(candidate);
  const referenceTime = getTimestamp(reference);
  return candidateTime > referenceTime;
}

function getTimestamp(value) {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function isValidDateValue(value) {
  if (!value) return false;
  return !Number.isNaN(new Date(value).getTime());
}

function isDateKey(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
}

function findList(id) {
  return lists.find((list) => list.id === id);
}

function getActiveUserId() {
  return syncUser?.id || "";
}

function getPrivateLists(sourceLists = lists) {
  const sharedOrder = getSharedListOrderMetadataFromLists(sourceLists);
  return ensureTodayList(sourceLists).filter(isTodayList).map((list) => ({
    ...list,
    completedArchiveText,
    lastTodayDateKey,
    accountOptions: getAccountOptionsForSync(),
    sharedListOrder: sharedOrder.order,
    sharedListOrderUpdatedAt: sharedOrder.updatedAt
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
  return !isPinnedList(list) && canManageList(list);
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
  if (type === "list" && isPinnedList(list)) return;

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
  } else if (isProjectList(targetList)) {
    position = "before";
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
  if (sourceIndex < 0 || isPinnedList(lists[sourceIndex])) return;

  const [list] = lists.splice(sourceIndex, 1);
  const targetIndex = lists.findIndex((item) => item.id === targetListId);
  if (targetIndex < 0) {
    lists.push(list);
    markSharedListOrderUpdated();
    persistAndRender({ syncShared: false });
    return;
  }

  let insertIndex = targetIndex + (position === "after" ? 1 : 0);
  if (targetIndex === 0 && isTodayList(lists[targetIndex])) {
    insertIndex = 1;
  }
  insertIndex = Math.max(1, insertIndex);
  lists.splice(insertIndex, 0, list);
  markSharedListOrderUpdated();
  persistAndRender({ syncShared: false });
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
  rememberListCollapsed(targetList.id, false);
  markTaskOrderUpdated(sourceList);
  if (targetList.id !== sourceList.id) {
    markTaskOrderUpdated(targetList);
  }
  if (isEditingTask(sourceListId, taskId)) {
    editingTask = null;
  }
  persistAndRender({
    sharedListIds: [sourceList.id, targetList.id],
    syncTaskOrderListIds: [sourceList.id, targetList.id]
  });
}

function moveTaskToOpenBottom(list, taskId) {
  const sourceIndex = list.tasks.findIndex((task) => task.id === taskId);
  if (sourceIndex < 0) return;

  const [task] = list.tasks.splice(sourceIndex, 1);
  list.tasks.push(task);
}

function moveTaskToOpenTop(list, taskId) {
  const sourceIndex = list.tasks.findIndex((task) => task.id === taskId);
  if (sourceIndex < 0) return;

  const [task] = list.tasks.splice(sourceIndex, 1);
  list.tasks.unshift(task);
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

function rollRepeatingTasksIntoToday(todayList, todayKey) {
  let changed = false;
  const reopenedTaskIds = [];

  todayList.tasks.forEach((task) => {
    if (!task.repeat?.enabled) return;
    if (!isRepeatDueOnDate(task.repeat, todayKey)) return;
    if (task.repeat.lastRunDate === todayKey) return;

    if (task.completed) {
      task.completed = false;
      task.completedAt = "";
      delete task.previousCompletedAt;
      reopenedTaskIds.push(task.id);
    }

    task.repeat.lastRunDate = todayKey;
    markTaskUpdated(task);
    changed = true;
  });

  reopenedTaskIds.reverse().forEach((taskId) => moveTaskToOpenTop(todayList, taskId));
  return changed;
}

function rollScheduledQueueIntoToday(options = {}) {
  const todayKey = getDateKey();
  const dueItems = getSortedScheduledQueue().filter((item) => item.targetDate <= todayKey);
  if (dueItems.length === 0) return false;

  lists = ensureTodayList(lists);
  const todayList = lists.find(isTodayList);
  if (!todayList) return false;

  todayList.tasks = filterTasksDeletedByTombstones(todayList.tasks, todayList.deletedTaskTombstones);
  dueItems.slice().reverse().forEach((item) => {
    const taskId = getScheduledTaskId(item);
    if (!filterTasksDeletedByTombstones([{ id: taskId, updatedAt: item.createdAt }], todayList.deletedTaskTombstones).length) {
      return;
    }
    if (todayList.tasks.some((task) => task.id === taskId)) return;

    todayList.tasks.unshift(createTask(item.title, {
      id: taskId,
      createdAt: item.createdAt
    }));
  });

  const dueIds = new Set(dueItems.map((item) => item.id));
  scheduledQueue = scheduledQueue.filter((item) => !dueIds.has(item.id));
  persistLists({ syncShared: false });
  persistScheduledQueue();

  if (options.renderAfter) {
    render();
  }
  return true;
}

function getScheduledTaskId(item) {
  return `scheduled-${item.id}`;
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

  lists = ensureTodayList(lists);
  const todayList = lists.find(isTodayList);
  const repeatingChanged = todayList ? rollRepeatingTasksIntoToday(todayList, todayKey) : false;
  const scheduledChanged = rollScheduledQueueIntoToday();

  const dueItems = shouldRollTomorrowQueueToday()
    ? tomorrowQueue.filter((item) => item.targetDate <= todayKey)
    : [];
  if (dueItems.length === 0) {
    if (dayChanged || repeatingChanged || scheduledChanged) {
      persistLists({ syncShared: false });
    }
    if (options.renderAfter && (dateChanged || dayChanged || repeatingChanged || scheduledChanged)) render();
    return;
  }

  if (!todayList) return;
  todayList.tasks = filterTasksDeletedByTombstones(todayList.tasks, todayList.deletedTaskTombstones);

  dueItems.forEach((item) => {
    const taskId = getRolledTomorrowTaskId(item);
    if (!filterTasksDeletedByTombstones([{ id: taskId, updatedAt: item.createdAt }], todayList.deletedTaskTombstones).length) {
      return;
    }
    if (todayList.tasks.some((task) => task.id === taskId)) return;

    todayList.tasks.push(createTask(item.title, {
      id: taskId,
      createdAt: item.createdAt
    }));
  });
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
  const projectLists = [];

  rawLists.forEach((list) => {
    if (isTodayListCandidate(list)) {
      todayList.collapsed = Boolean(list.collapsed);
      todayList.createdAt = list.createdAt || todayList.createdAt;
      todayList.showDetails = Boolean(list.showDetails);
      todayList.completedArchiveText = typeof list.completedArchiveText === "string"
        ? list.completedArchiveText
        : todayList.completedArchiveText;
      todayList.lastTodayDateKey = list.lastTodayDateKey || todayList.lastTodayDateKey;
      todayList.accountOptions = getLatestAccountOptions(todayList, list);
      const sharedOrder = getLatestSharedListOrderMetadata(todayList, list);
      todayList.sharedListOrder = sharedOrder.order;
      todayList.sharedListOrderUpdatedAt = sharedOrder.updatedAt;
      todayList.updatedAt = getLatestDateValue(todayList.updatedAt, list.updatedAt) || todayList.updatedAt;
      todayList.deletedTaskTombstones = mergeTaskTombstones(todayList.deletedTaskTombstones, list.deletedTaskTombstones);
      todayList.tasks.push(...list.tasks);
      return;
    }

    const regularList = {
      ...list,
      type: list.type === todayListType ? "standard" : list.type
    };
    if (isProjectListCandidate(regularList)) {
      projectLists.push(normalizeProjectList(regularList));
      return;
    }

    regularLists.push(regularList);
  });

  todayList.tasks = filterTasksDeletedByTombstones(todayList.tasks, todayList.deletedTaskTombstones);
  return [todayList, ...regularLists, ...ensureProjectLists(projectLists)];
}

function ensureProjectLists(projectLists = []) {
  if (projectLists.length === 0) {
    return [createProjectList()];
  }

  const targetId = getProjectListId();
  const targetProject = projectLists.find((list) => list.id === targetId);
  if (targetProject) {
    const normalizedProject = normalizeProjectList(targetProject);
    if (targetProject.name !== projectListName || targetProject.shared || targetProject.memberRole) {
      markListUpdated(normalizedProject);
    }
    return [normalizedProject];
  }

  const migratableProject = syncUser
    ? projectLists.find((list) => canManageList(list) && String(list.id || "").startsWith("pinned-project-"))
    : null;
  if (!migratableProject) return [createProjectList()];

  const normalizedProject = normalizeProjectList(migratableProject, {
    id: targetId,
    ownerId: syncUser.id
  });
  markListUpdated(normalizedProject);
  return [normalizedProject];
}

function createProjectList() {
  return createList(projectListName, true, [], {
    id: getProjectListId(),
    type: projectListType,
    ownerId: getActiveUserId()
  });
}

function normalizeProjectList(list, overrides = {}) {
  return {
    ...list,
    ...overrides,
    name: projectListName,
    type: projectListType,
    shared: false,
    memberRole: ""
  };
}

function getProjectListId() {
  return `pinned-project-${getActiveUserId() || syncDeviceId}`;
}

function archiveCompletedTodayTasks(archiveDateKey) {
  const todayList = lists.find(isTodayList);
  if (!todayList) return false;

  const completedTasks = todayList.tasks.filter((task) => task.completed && getTaskCompletionDateKey(task) === archiveDateKey);
  if (completedTasks.length === 0) return false;
  const archivedAt = new Date().toISOString();

  const archiveBlock = [
    formatArchiveDate(archiveDateKey),
    ...completedTasks.map((task) => `- ${task.title}`),
    ""
  ].join("\n");

  completedArchiveText = appendArchiveText(completedArchiveText, archiveBlock);
  const completedTasksToRemove = completedTasks.filter((task) => !task.repeat?.enabled);
  completedTasksToRemove.forEach((task) => rememberPrivateTaskDeletion(todayList, task, archivedAt));
  todayList.tasks = todayList.tasks.filter((task) => !task.completed || task.repeat?.enabled);
  return true;
}

function appendArchiveText(existingText, nextBlock) {
  return mergeArchiveText(existingText, nextBlock);
}

function hydrateArchiveStateFromLists(sourceLists) {
  const todayList = sourceLists.find(isTodayListCandidate);
  if (!todayList) return;

  if (typeof todayList.completedArchiveText === "string" && todayList.completedArchiveText.trim()) {
    completedArchiveText = mergeArchiveText(completedArchiveText, todayList.completedArchiveText);
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
  completedArchiveText = mergeArchiveText(completedArchiveText);
  localStorage.setItem(completedArchiveKey, completedArchiveText);
  localStorage.setItem(todayDateKeyStorageKey, lastTodayDateKey);
}

function isTodayList(list) {
  return list?.id === todayListId || list?.type === todayListType;
}

function isProjectList(list) {
  return list?.type === projectListType;
}

function isProjectListCandidate(list) {
  const normalizedName = list?.name?.trim().toLowerCase();
  return isProjectList(list) || normalizedName === projectListName.toLowerCase() || normalizedName === "project";
}

function isPinnedList(list) {
  return isTodayList(list) || isProjectList(list);
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
    const footerHeight = footerTray && !footerTray.hidden ? footerTray.getBoundingClientRect().height || 0 : 0;
    const projectHeight = 0;
    document.documentElement.style.setProperty("--tomorrow-footer-space", `${footerHeight ? footerHeight + 18 : 0}px`);
    document.documentElement.style.setProperty("--project-footer-space", `${projectHeight ? projectHeight + 10 : 0}px`);
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
  return mergeArchiveText(completedArchiveText).trimEnd();
}

function getArchiveEntries() {
  return mergeArchiveEntries(getArchiveEntriesFromText(completedArchiveText));
}

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTomorrowQueueLabel() {
  if (appOptions.tomorrowMode === "weekdays") {
    const day = new Date().getDay();
    if (day === 5 || day === 6) return "Monday";
  }

  return "Tomorrow";
}

function getNextQueueTargetDateKey(date = new Date()) {
  if (appOptions.tomorrowMode !== "weekdays") {
    return getTomorrowDateKey(date);
  }

  const targetDate = new Date(date);
  do {
    targetDate.setDate(targetDate.getDate() + 1);
  } while (!isWeekday(targetDate));

  return getDateKey(targetDate);
}

function shouldRollTomorrowQueueToday() {
  return appOptions.tomorrowMode !== "weekdays" || isWeekday(new Date());
}

function isWeekendModeToday() {
  return appOptions.tomorrowMode === "weekdays" && isWeekend(new Date());
}

function isWeekday(date) {
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isRepeatDueOnDate(repeat, dateKey) {
  if (!repeat?.mode || !isDateKey(dateKey)) return false;

  const date = parseDateKey(dateKey);
  if (!date) return false;

  if (repeat.mode === "daily") return true;
  if (repeat.mode === "weekdays") return isWeekday(date);

  const anchorDate = parseDateKey(repeat.anchorDate) || date;
  const daysSinceAnchor = getWholeDaysBetween(anchorDate, date);

  if (repeat.mode === "weekly") return daysSinceAnchor >= 0 && daysSinceAnchor % 7 === 0;
  if (repeat.mode === "biweekly") return daysSinceAnchor >= 0 && daysSinceAnchor % 14 === 0;
  if (repeat.mode === "monthly") return date.getDate() === getSafeMonthDay(date, anchorDate.getDate());
  if (repeat.mode === "monthly-date") return date.getDate() === getSafeMonthDay(date, repeat.dayOfMonth || 1);
  if (repeat.mode === monthlyPatternRepeatMode) return isMonthlyPatternDueOnDate(repeat.monthlyPattern, date);
  if (repeat.mode === "yearly") {
    const targetMonth = anchorDate.getMonth();
    if (date.getMonth() !== targetMonth) return false;
    return date.getDate() === getSafeMonthDay(date, anchorDate.getDate());
  }

  return false;
}

function isMonthlyPatternDueOnDate(patternValue, date) {
  const pattern = getMonthlyRepeatPattern(patternValue);
  if (!pattern) return false;

  if (pattern.ordinal === "last") {
    return isLastMonthlyPatternMatch(date, pattern);
  }

  return getMonthlyPatternMatchOrdinal(date, pattern) === pattern.ordinalIndex;
}

function getMonthlyPatternMatchOrdinal(date, pattern) {
  if (!doesDateMatchMonthlyPatternDay(date, pattern)) return 0;

  let count = 0;
  for (let day = 1; day <= date.getDate(); day += 1) {
    const candidate = new Date(date.getFullYear(), date.getMonth(), day);
    if (doesDateMatchMonthlyPatternDay(candidate, pattern)) count += 1;
  }
  return count;
}

function isLastMonthlyPatternMatch(date, pattern) {
  if (!doesDateMatchMonthlyPatternDay(date, pattern)) return false;

  const lastDay = getLastDayOfMonth(date);
  for (let day = date.getDate() + 1; day <= lastDay; day += 1) {
    const candidate = new Date(date.getFullYear(), date.getMonth(), day);
    if (doesDateMatchMonthlyPatternDay(candidate, pattern)) return false;
  }
  return true;
}

function doesDateMatchMonthlyPatternDay(date, pattern) {
  if (pattern.match === "weekday") return isWeekday(date);
  if (pattern.match === "weekend") return isWeekend(date);
  if (Number.isInteger(pattern.dayIndex)) return date.getDay() === pattern.dayIndex;

  return false;
}

function getSafeMonthDay(date, preferredDay) {
  const day = normalizeRepeatDay(preferredDay);
  return Math.min(day, getLastDayOfMonth(date));
}

function getLastDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getWholeDaysBetween(startDate, endDate) {
  const start = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  return Math.round((end - start) / 86400000);
}

function getTomorrowDateKey(date = new Date()) {
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getDateKey(tomorrow);
}

function parseDateKey(dateKey) {
  const [year, month, day] = String(dateKey || "").split("-").map(Number);
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;

  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    ? date
    : null;
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
