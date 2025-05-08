class Tooltip {
  constructor() {
    this.tooltip = document.createElement("div");
    this.tooltip.className = "custom-tooltip";
    document.body.appendChild(this.tooltip);
    this.init();
    this.hideTimeout = null;
  }

  init() {
    const themeSwitcher = document.querySelector(".theme-switcher");

    // Theme switcher button (left position)
    const paletteBtn = themeSwitcher.querySelector('[tabindex="0"]');
    this.addTooltip(paletteBtn, "Change theme", "left");

    // Export/Import buttons (left position)
    const exportBtn = document.querySelector(".export-data-btn");
    const importBtn = document.querySelector(".import-data-btn");
    this.addTooltip(exportBtn, "Export tasks", "left");
    this.addTooltip(importBtn, "Import tasks", "left");

    // Add task button (center position)
    const addTaskBtn = document.querySelector(".add-task-button");
    this.addTooltip(addTaskBtn, "Add new task", "center");

    // Action buttons (center position)
    document.addEventListener("mouseover", (e) => {
      // Using event delegation for dynamically added buttons
      if (e.target.closest(".todo-actions")) {
        const button = e.target.closest("button");
        if (button) {
          if (button.classList.contains("btn-warning")) {
            this.addTooltip(button, "Edit task", "center");
          } else if (button.classList.contains("btn-success")) {
            this.addTooltip(button, "Toggle completion", "center");
          } else if (button.classList.contains("btn-info")) {
            const isArchived = button.querySelector(".bx-archive-out");
            const tooltipText = isArchived ? "Restore task" : "Archive task";
            this.addTooltip(button, tooltipText, "center");
          }
        }
      }
    });

    // Add tooltips for sub-task action buttons
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(".subtask-actions")) {
        const button = e.target.closest("button");
        if (button) {
          if (button.classList.contains("btn-sm")) {
            if (button.title.includes("Mark")) {
              this.addTooltip(button, button.title, "center");
            } else if (button.classList.contains("btn-error")) {
              this.addTooltip(button, "Delete sub-task", "center");
            }
          }
        }
      }
    });

    // Only add tooltip for tag color picker
    const tagColorPicker = document.querySelector(".tag-color-preview");
    this.addTooltip(tagColorPicker, "Choose tag color", "right");

    // Add tooltips for calendar navigation buttons
    const homeBtn = document.querySelector('[onclick*="index.html"]');
    const calendarBtn = document.querySelector('[onclick*="calendar.html"]');
    this.addTooltip(homeBtn, "Go to Home", "left");
    this.addTooltip(calendarBtn, "Go to Calendar", "left");
  }

  addTooltip(element, text, position = "left") {
    element.addEventListener("mouseenter", () => this.show(text, position));
    element.addEventListener("mouseleave", () => this.hide());
    element.addEventListener("mousemove", (e) => this.move(e, position));
  }

  show(text, position) {
    this.tooltip.textContent = text;
    this.tooltip.className = "custom-tooltip";
    this.tooltip.classList.add(`position-${position}`, "show");
  }

  hide() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.hideTimeout = setTimeout(() => {
      this.tooltip.classList.remove("show");
      this.hideTimeout = null;
    }, 50);
  }

  move(e, position) {
    requestAnimationFrame(() => {
      this.tooltip.style.left = `${e.clientX}px`;
      this.tooltip.style.top = `${e.clientY}px`;
    });
  }
}

// Initialize tooltip
new Tooltip();
