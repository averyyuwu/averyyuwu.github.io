// ===== Initialization =====
let todoItemFormatter;
let todoManager;
let uiManager;
let themeSwitcher;
let appDataManager;

document.addEventListener("DOMContentLoaded", () => {
  todoItemFormatter = new TodoItemFormatter();
  todoManager = new TodoManager(todoItemFormatter);
  const themes = document.querySelectorAll(".theme-item");
  const html = document.querySelector("html");
  themeSwitcher = new ThemeSwitcher(themes, html);
  appDataManager = new AppDataManager(todoManager, themeSwitcher);
  uiManager = new UIManager(todoManager, todoItemFormatter);

  // Pre-check the default status checkboxes
  document.querySelectorAll("[data-status]").forEach((checkbox) => {
    if (["pending", "completed"].includes(checkbox.dataset.status)) {
      checkbox.checked = true;
    }
  });

  uiManager.applyFilters(); // Changed from handleFilterTodos to show both pending and completed

  // Initialize notification handler
  NotificationHandler.initialize();
});
