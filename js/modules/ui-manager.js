class UIManager {
  constructor(todoManager, todoItemFormatter) {
    // Initialize core dependencies
    this.todoManager = todoManager;
    this.todoItemFormatter = todoItemFormatter;

    // Initialize DOM elements for main todo operations
    this.addBtn = document.querySelector(".add-task-button");
    this.todosListBody = document.querySelector(".todos-list-body");
    this.alertMessage = document.querySelector(".alert-message");
    this.selectedTags = [];
    this.selectedCategories = [];
    this.newTagInput = document.querySelector(".new-tag-input");
    this.addTagButton = document.querySelector(".add-tag-button");
    this.tagList = document.querySelector(".tag-list");
    this.addCategoryButton = document.querySelector(".add-category-button");
    this.categoryList = document.querySelector(".category-list");

    // Add new properties
    this.exportDataBtn = document.querySelector(".export-data-btn");
    this.importDataBtn = document.querySelector(".import-data-btn");
    this.importFileInput = document.querySelector("#import-file");
    this.searchInput = document.querySelector(".search-input");

    // Initialize filter-related properties
    this.currentFilter = ["pending", "completed"]; // Changed from "pending" to array
    this.activeFilters = {
      status: ["pending", "completed"], // Changed from [] to default filters
      difficulty: [],
      dateFrom: null,
      dateTo: null,
      tags: [],
      categories: [],
    };

    // Add new properties for filters
    this.filterContainer = document.querySelector(".filter-container");
    this.filterDateFrom = document.querySelector(".filter-date-from");
    this.filterDateTo = document.querySelector(".filter-date-to");
    this.applyFiltersBtn = document.querySelector(".apply-filters-btn");
    this.cancelFilterBtn = document.querySelector(".cancel-filter-btn");

    this.showFiltersBtn = document.querySelector(".show-filters-btn");
    this.resetFiltersBtn = document.querySelector(".reset-filters-btn");

    // Add new modal elements
    this.addCategoryModal = document.querySelector(".add-category-modal");
    this.confirmCategoryBtn = document.getElementById("confirm-cat");
    this.cancelCategoryBtn = document.getElementById("cancel-cat");
    this.categoryNameInput = document.getElementById("cat-name");
    this.categoryColorInput = document.getElementById("cat-color");
    this.categoryParentSelect = document.getElementById("cat-parent");

    // Add new task modal elements
    this.addTaskModal = document.querySelector(".add-task-modal");
    this.newTaskName = document.querySelector(".new-task-name");
    this.newTaskDescription = document.querySelector(".new-task-description");
    this.newTaskDate = document.querySelector(".new-task-date");
    this.createTaskBtn = document.querySelector(".create-task-btn");
    this.cancelTaskBtn = document.querySelector(".cancel-task-btn");

    // Add new properties for tabs
    this.tabButtons = document.querySelectorAll(".tab-btn");
    this.tabContents = document.querySelectorAll(".tab-content");

    // Add new properties for sub-task modal
    this.addSubTaskModal = document.querySelector(".add-subtask-modal");
    this.newSubTaskName = document.querySelector(".new-subtask-name");
    this.newSubTaskDescription = document.querySelector(
      ".new-subtask-description"
    );
    this.createSubTaskBtn = document.querySelector(".create-subtask-btn");
    this.cancelSubTaskBtn = document.querySelector(".cancel-subtask-btn");

    // Initialize UI components
    this.initDropdowns(); // Setup dropdown behaviors
    this.addEventListeners(); // Attach event handlers
    this.showAllTodos(); // Initial todos display
    this.initTags(); // Setup tag management
    this.initCategories(); // Setup category management
    this.initColorPickers(); // Initialize color selection UI
    this.initSortable(); // Setup drag-and-drop sorting
    this.setupSearchHandler(); // Initialize search functionality
    this.initTabs(); // Initialize tabs
  }

  initTabs() {
    this.tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tabName = button.getAttribute("data-tab");
        this.switchTab(tabName);
      });
    });
  }

  switchTab(tabName) {
    // Update tab buttons
    this.tabButtons.forEach((btn) => {
      if (btn.getAttribute("data-tab") === tabName) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Update tab content
    this.tabContents.forEach((content) => {
      if (content.id === `${tabName}-tab`) {
        content.classList.add("active");
      } else {
        content.classList.remove("active");
      }
    });
  }

  initColorPickers() {
    // Define standard color palette for consistency across the application
    const presetColors = [
      "#2ECC71",
      "#6AB04A",
      "#1ABC9C",
      "#5DADE2",
      "#3498DB",
      "#8E44AD",
      "#9B59B6",
      "#F1C40F",
      "#F39C12",
      "#E67E22",
      "#E74C3C",
      "#C0392B",
      "#D91E18",
      "#95A5A6",
      "#34495E",
    ];

    // Helper function to set up color picker components
    const setupColorPicker = (
      wrapper,
      colorInput,
      preview,
      presets,
      hexInput
    ) => {
      if (!wrapper) return; // Add this guard clause

      const popup = wrapper.querySelector(".color-picker-popup");

      // Setup color preview
      preview.style.backgroundColor = colorInput?.value || "#ff0000";
      preview.addEventListener("click", () => {
        popup.classList.toggle("show");
      });

      // Close popup when clicking outside
      document.addEventListener("click", (e) => {
        if (!wrapper.contains(e.target)) {
          popup.classList.remove("show");
        }
      });

      // Setup presets
      presetColors.forEach((color) => {
        const preset = document.createElement("div");
        preset.className = "color-preset";
        preset.style.backgroundColor = color;
        preset.addEventListener("click", () => {
          colorInput.value = color;
          preview.style.backgroundColor = color;
          hexInput.value = color;
          popup.classList.remove("show");
        });
        presets.appendChild(preset);
      });

      // Setup hex input
      hexInput.addEventListener("input", (e) => {
        const color = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(color)) {
          if (colorInput) colorInput.value = color;
          preview.style.backgroundColor = color;
        }
      });
    };

    // Initialize color pickers for both tags and categories
    // Setup tag color picker
    setupColorPicker(
      document.querySelector(".tag-input-group .color-picker-wrapper"),
      document.querySelector(".tag-color-picker"),
      document.querySelector(".tag-color-preview"),
      document.querySelector(".tag-presets"),
      document.querySelector(".tag-hex-input")
    );

    // Setup category color picker
    setupColorPicker(
      document.querySelector(".category-input-group .color-picker-wrapper"),
      document.querySelector(".category-color-picker"),
      document.querySelector(".category-color-preview"),
      document.querySelector(".category-presets"),
      document.querySelector(".category-hex-input")
    );
  }

  addEventListeners() {
    // Replace old add button listener with new modal opener
    this.addBtn.addEventListener("click", () => this.showAddTaskModal());

    // Add new task modal button listeners
    this.createTaskBtn.addEventListener("click", () => this.handleAddTodo());
    this.cancelTaskBtn.addEventListener("click", () => this.hideAddTaskModal());

    // Update filter button event listeners
    const filterButtons = document.querySelectorAll(".todos-filter li");
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const status = button.getAttribute("data-filter");
        this.handleFilterTodos(status);
      });
    });

    // Add new event listeners
    this.exportDataBtn.addEventListener("click", () => this.handleExportData());
    this.importDataBtn.addEventListener("click", () =>
      this.importFileInput.click()
    );
    this.importFileInput.addEventListener("change", (e) =>
      this.handleImportData(e)
    );

    this.applyFiltersBtn.addEventListener("click", () => this.applyFilters());
    this.cancelFilterBtn.addEventListener("click", () =>
      this.hideFilterDialog()
    );

    // Replace old filter button listeners with new ones
    this.showFiltersBtn.addEventListener("click", () =>
      this.showFilterDialog()
    );
    this.resetFiltersBtn.addEventListener("click", () => this.resetFilters());
  }

  initTags() {
    this.populateTagList();
    this.addTagButton.addEventListener("click", () => this.handleAddTag());
  }

  initDropdowns() {
    // Original dropdowns
    document.querySelectorAll(".custom-dropdown").forEach((dropdown) => {
      const selected = dropdown.querySelector(".dropdown-selected");
      const options = dropdown.querySelector(".dropdown-options");

      selected.addEventListener("click", () => {
        options.classList.toggle("show");
      });

      document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target)) {
          options.classList.remove("show");
        }
      });
    });

    // Settings dropdowns
    document.querySelectorAll(".settings-dropdown").forEach((dropdown) => {
      const selected = dropdown.querySelector(".dropdown-selected");
      const options = dropdown.querySelector(".dropdown-options");

      selected.addEventListener("click", () => {
        options.classList.toggle("show");
      });

      document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target)) {
          options.classList.remove("show");
        }
      });
    });
  }

  populateTagList() {
    this.tagList.innerHTML = "";
    // Filter out difficulty tags from sidebar display
    const userTags = this.todoManager
      .getTags()
      .filter((tag) => !["Easy", "Medium", "Hard"].includes(tag.name));

    userTags.forEach((tag) => {
      const li = document.createElement("li");
      li.textContent = tag.name;
      li.style.backgroundColor = tag.color;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("btn", "btn-sm");
      deleteButton.addEventListener("click", () =>
        this.handleDeleteTag(tag.name)
      );
      li.appendChild(deleteButton);

      this.tagList.appendChild(li);
    });
  }

  handleAddTag() {
    const newTag = this.newTagInput.value.trim();
    const tagColor = document.querySelector(".tag-color-picker").value;
    if (newTag) {
      if (["Easy", "Medium", "Hard"].includes(newTag)) {
        this.showAlertMessage("Cannot create reserved difficulty tag", "error");
        return;
      }
      if (this.todoManager.addTag(newTag, tagColor)) {
        this.populateTagList();
        this.newTagInput.value = "";
        this.showAlertMessage("Tag added successfully", "success");
      } else {
        this.showAlertMessage("Tag already exists", "error");
      }
    } else {
      this.showAlertMessage("Please enter a tag name", "error");
    }
  }

  handleDeleteTag(tag) {
    this.todoManager.tags = this.todoManager.tags.filter((t) => t.name !== tag);
    this.todoManager.saveTagsToLocalStorage();
    this.populateTagList();
    this.showAlertMessage("Tag deleted successfully", "success");
  }

  initCategories() {
    // Remove populateCategorySelector call
    this.populateCategoryList();

    // Update the event listener for add category button
    this.addCategoryButton.addEventListener("click", () =>
      this.showAddCategoryModal()
    );

    // Add event listeners for modal buttons
    this.confirmCategoryBtn.addEventListener("click", () =>
      this.handleAddCategoryFromModal()
    );
    this.cancelCategoryBtn.addEventListener("click", () =>
      this.hideAddCategoryModal()
    );
  }

  populateCategoryList() {
    this.categoryList.innerHTML = "";

    // Create a map for efficient parent-child relationship tracking
    const categoryMap = new Map();

    // Two-pass algorithm for building category hierarchy
    // First pass: Initialize root categories
    this.todoManager
      .getCategories()
      .filter((cat) => !cat.parent)
      .forEach((cat) => categoryMap.set(cat.name, []));

    // Second pass: Associate children with parents
    this.todoManager
      .getCategories()
      .filter((cat) => cat.parent)
      .forEach((cat) => {
        if (categoryMap.has(cat.parent)) {
          categoryMap.get(cat.parent).push(cat);
        }
      });

    // Recursive rendering function for category hierarchy
    const renderCategory = (category, level = 0) => {
      const li = document.createElement("li");
      li.classList.add("category-item");
      if (level > 0) {
        li.classList.add("subcategory");
        li.style.color = category.color;
      }

      const content = document.createElement("div");
      content.className = "category-content";
      content.textContent = category.name;
      content.style.borderColor = category.color;
      content.style.color = category.color;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("btn", "btn-sm");
      deleteButton.addEventListener("click", () =>
        this.handleDeleteCategory(category.name)
      );

      content.appendChild(deleteButton);
      li.appendChild(content);

      const children = categoryMap.get(category.name) || [];
      if (children.length > 0) {
        const childrenContainer = document.createElement("ul");
        childrenContainer.className = "subcategories-list";
        childrenContainer.style.color = category.color;

        children.forEach((child) => {
          childrenContainer.appendChild(renderCategory(child, level + 1));
        });

        li.appendChild(childrenContainer);
      }

      return li;
    };

    // Render only root-level categories
    categoryMap.forEach((children, parentName) => {
      const parentCategory = this.todoManager
        .getCategories()
        .find((c) => c.name === parentName);
      if (!parentCategory.parent) {
        this.categoryList.appendChild(renderCategory(parentCategory));
      }
    });
  }

  initModalColorPicker() {
    const wrapper = this.addCategoryModal.querySelector(
      ".color-picker-wrapper"
    );
    const preview = wrapper.querySelector(".modal-color-preview");
    const popup = wrapper.querySelector(".color-picker-popup");
    const presets = wrapper.querySelector(".modal-presets");
    const hexInput = wrapper.querySelector(".modal-hex-input");
    let currentColor = "#2ECC71";

    // Set initial color
    preview.style.backgroundColor = currentColor;
    hexInput.value = currentColor;

    // Setup preview click
    preview.addEventListener("click", () => {
      popup.classList.toggle("show");
    });

    // Close popup when clicking outside
    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target)) {
        popup.classList.remove("show");
      }
    });

    // Setup color presets
    const presetColors = [
      "#2ECC71",
      "#6AB04A",
      "#1ABC9C",
      "#5DADE2",
      "#3498DB",
      "#8E44AD",
      "#9B59B6",
      "#F1C40F",
      "#F39C12",
      "#E67E22",
      "#E74C3C",
      "#C0392B",
      "#D91E18",
      "#95A5A6",
      "#34495E",
    ];

    presets.innerHTML = ""; // Clear existing presets
    presetColors.forEach((color) => {
      const preset = document.createElement("div");
      preset.className = "color-preset";
      preset.style.backgroundColor = color;
      preset.addEventListener("click", () => {
        currentColor = color;
        preview.style.backgroundColor = color;
        hexInput.value = color;
        popup.classList.remove("show");
      });
      presets.appendChild(preset);
    });

    // Setup hex input
    hexInput.addEventListener("input", (e) => {
      const color = e.target.value;
      if (/^#[0-9A-F]{6}$/i.test(color)) {
        currentColor = color;
        preview.style.backgroundColor = color;
      }
    });

    return {
      getCurrentColor: () => currentColor,
      setColor: (color) => {
        currentColor = color;
        preview.style.backgroundColor = color;
        hexInput.value = color;
      },
    };
  }

  showAddCategoryModal() {
    this.addCategoryModal.classList.add("show");
    document.querySelector(".dim-overlay").classList.add("active");

    // Clear previous inputs
    this.categoryNameInput.value = "";

    // Initialize color picker if not already initialized
    if (!this.modalColorPicker) {
      this.modalColorPicker = this.initModalColorPicker();
    }

    // THE DEFAULT COLOR FOR NEW CATEGORIES
    this.modalColorPicker.setColor("#bf95f9");

    // Update parent category dropdown
    this.updateParentCategoryOptions();
  }

  handleAddCategoryFromModal() {
    const name = this.categoryNameInput.value.trim();
    const color = this.modalColorPicker.getCurrentColor();
    const parent = this.categoryParentSelect.value;

    if (name) {
      this.todoManager.addCategory(name, color, parent);
      this.populateCategoryList();
      this.hideAddCategoryModal();
      this.showAlertMessage("Category added successfully", "success");
    } else {
      this.showAlertMessage("Please enter a category name", "error");
    }
  }

  hideAddCategoryModal() {
    this.addCategoryModal.classList.remove("show");
    document.querySelector(".dim-overlay").classList.remove("active");
  }

  updateParentCategoryOptions() {
    this.categoryParentSelect.innerHTML =
      '<option value="">— No parent —</option>';

    // Only show root-level categories (categories with no parent)
    const rootCategories = this.todoManager
      .getCategories()
      .filter((cat) => !cat.parent);

    rootCategories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.name;
      option.textContent = category.name;
      this.categoryParentSelect.appendChild(option);
    });
  }

  showAddTaskModal() {
    this.addTaskModal.classList.add("show");
    document.querySelector(".dim-overlay").classList.add("active");

    // Clear previous inputs
    this.newTaskName.value = "";
    this.newTaskDescription.value = "";
    this.newTaskDate.value = "";

    // Reset tag and category selectors
    this.selectedTags = [];
    this.selectedCategories = [];
    this.initNewTaskSelectors();
  }

  hideAddTaskModal() {
    this.addTaskModal.classList.remove("show");
    document.querySelector(".dim-overlay").classList.remove("active");
  }

  initNewTaskSelectors() {
    const tagSelector = document.querySelector(".new-task-tag-selector");
    const categorySelector = document.querySelector(
      ".new-task-category-selector"
    );

    // Initialize selectors similarly to edit modal
    this.initializeFilterSelector(
      tagSelector,
      this.selectedTags,
      this.todoManager.getTags(),
      true
    );
    this.initializeFilterSelector(
      categorySelector,
      this.selectedCategories,
      this.todoManager.getCategories(),
      false
    );
  }

  handleAddTodo() {
    const task = this.newTaskName.value;
    const description = this.newTaskDescription.value;
    const dueDate = this.newTaskDate.value;
    const displayBar = document.querySelector(".new-display-bar").value;

    if (task === "") {
      this.showAlertMessage("Please enter a task", "error");
      return;
    }

    this.todoManager.addTodo(
      task,
      description,
      dueDate,
      this.selectedTags.join(", ") || "No tag",
      this.selectedCategories.join(", ") || "No category",
      displayBar // Add this parameter
    );

    // Replace showAllTodos with applyFilters to maintain current filter state
    this.applyFilters();
    this.hideAddTaskModal();
    this.showAlertMessage("Task added successfully", "success");
  }

  showAllTodos() {
    const todos = this.todoManager.filterTodos("all");
    this.displayTodos(todos);
  }

  calculateDeadlineProgress(dueDate) {
    // Skip calculation for items without due dates
    if (dueDate === "No due date") return null;

    const now = new Date();
    // Set deadline to end of day for consistent calculations
    const deadline = new Date(dueDate + "T23:59:59");
    const hoursLeft = Math.max(
      0,
      Math.round((deadline - now) / (1000 * 60 * 60))
    );

    // Dynamic text formatting based on remaining time
    let text;
    if (hoursLeft > 48) {
      const daysLeft = Math.ceil(hoursLeft / 24);
      text = `${daysLeft}d left`;
    } else {
      text = `${hoursLeft}h left`;
    }

    // Calculate progress as percentage of week elapsed
    // Uses 168 hours (1 week) as the maximum range
    const maxHours = 168;
    const progress = Math.max(
      0,
      Math.min(100, (1 - hoursLeft / maxHours) * 100)
    );

    return {
      progress,
      text: hoursLeft > 0 ? text : "Overdue",
    };
  }

  createProgressBar(todo) {
    const displayType = todo.displayBar || "deadline";
    let progress, text, type;

    if (displayType === "deadline" && todo.dueDate !== "No due date") {
      const deadlineInfo = this.calculateDeadlineProgress(todo.dueDate);
      if (deadlineInfo) {
        progress = deadlineInfo.progress;
        text = deadlineInfo.text;
        type = "deadline";
      }
    } else {
      progress = todo.progress || 0;
      text = progress + "%";
      type = "progress";
    }

    if (progress === null) return "";

    return `
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill ${type}" style="width: ${progress}%"></div>
          </div>
          <span class="progress-label">${
            displayType.charAt(0).toUpperCase() + displayType.slice(1)
          }</span>
          <span class="progress-text">${text}</span>
        </div>
      `;
  }

  displayTodos(todos) {
    this.todosListBody.innerHTML = "";

    if (todos.length === 0) {
      this.todosListBody.innerHTML = `<tr><td colspan="5" class="text-center">No task found</td></tr>`;
      return;
    }

    todos.forEach((todo) => {
      const tags = todo.tag.split(", ");
      const categories = todo.category.split(", ");

      // Add a data attribute to link parent and subtasks
      const taskHtml = `
        <tr class="todo-item" data-id="${todo.id}" data-has-subtasks="${!!todo
        .subTasks?.length}">
        <td>
              <div class="todo-item-content">
                <div class="todo-title">${todo.task}</div>
                ${
                  todo.description
                    ? `<div class="todo-description">${todo.description}</div>`
                    : ""
                }
              </div>
              ${this.createProgressBar(todo)}
            </td>
            <td>
              <div class="todo-metadata">
                <div>${this.todoItemFormatter.formatStatus(
                  todo.completed,
                  todo.archived
                )}</div>
                <div class="todo-date"><img src="images/calendar.png" alt="calendar" class="calendar-icon" /> ${
                  todo.dueDate
                }</div>
              </div>
            </td>
            <td>
              <div class="tags-grid">
                ${tags
                  .map((tagName) => {
                    const tagObj = this.todoManager.tags.find(
                      (t) => t.name === tagName
                    );
                    const style = tagObj
                      ? `background-color: ${tagObj.color}; color: white;`
                      : "";
                    return `<span class="task-tag" style="${style}">${tagName}</span>`;
                  })
                  .join("")}
              </div>
            </td>
            <td>
              <div class="categories-grid">
                ${categories
                  .map((catName) => {
                    const catObj = this.todoManager.categories.find(
                      (c) => c.name === catName
                    );
                    const style = catObj
                      ? `border-color: ${catObj.color}; color: ${catObj.color};`
                      : "";
                    return `<span class="task-category" style="${style}">${catName}</span>`;
                  })
                  .join("")}
              </div>
            </td>
            <td>
              <div class="todo-actions">
                <button class="btn btn-warning btn-sm" onclick="uiManager.handleEditTodo('${
                  todo.id
                }')">
                  <i class="bx bx-edit-alt"></i>
                </button>
                <button class="btn btn-success btn-sm" onclick="uiManager.handleToggleStatus('${
                  todo.id
                }')">
                  <i class="bx bx-check"></i>
                </button>
                <button class="btn btn-info btn-sm" onclick="uiManager.handleArchiveTodo('${
                  todo.id
                }')" title="${
        todo.archived ? "Restore from archive" : "Archive task"
      }">
                  <i class="bx ${
                    todo.archived ? "bx-archive-out" : "bx-archive"
                  }"></i>
                </button>
              </div>
            </td>
        </tr>
      `;

      this.todosListBody.insertAdjacentHTML("beforeend", taskHtml);

      if (todo.subTasks?.length) {
        const subTasksHtml = `
          <tr class="subtasks-row" data-parent-id="${todo.id}">
          <td colspan="5">
            <div class="todo-subtasks">
              ${todo.subTasks
                .map(
                  (subTask) => `
                <div class="subtask-row">
                  <div class="subtask-layout">
                    <div class="todo-item-content">
                      <div class="todo-title">${subTask.task}</div>
                      ${
                        subTask.description
                          ? `<div class="todo-description">${subTask.description}</div>`
                          : ""
                      }
                      ${this.createProgressBar(subTask)}
                    </div>
                    <div class="todo-metadata">
                      <div>${this.todoItemFormatter.formatStatus(
                        subTask.completed,
                        subTask.archived
                      )}</div>
                      <div class="todo-date">
                        <img src="images/calendar.png" alt="calendar" class="calendar-icon" />
                        ${subTask.dueDate}
                      </div>
                    </div>
                    <div class="tags-grid">
                      ${subTask.tag
                        .split(", ")
                        .map((tagName) => {
                          const tagObj = this.todoManager.tags.find(
                            (t) => t.name === tagName
                          );
                          const style = tagObj
                            ? `background-color: ${tagObj.color}; color: white;`
                            : "";
                          return `<span class="task-tag" style="${style}">${tagName}</span>`;
                        })
                        .join("")}
                    </div>
                    <div class="categories-grid">
                      ${subTask.category
                        .split(", ")
                        .map((catName) => {
                          const catObj = this.todoManager.categories.find(
                            (c) => c.name === catName
                          );
                          const style = catObj
                            ? `border-color: ${catObj.color}; color: ${catObj.color};`
                            : "";
                          return `<span class="task-category" style="${style}">${catName}</span>`;
                        })
                        .join("")}
                    </div>
                    <div class="subtask-actions">
                      <button class="btn btn-success btn-sm" onclick="uiManager.toggleSubTaskStatus('${
                        todo.id
                      }', '${subTask.id}')" 
                              title="${
                                subTask.completed
                                  ? "Mark incomplete"
                                  : "Mark complete"
                              }">
                        <i class="bx bx-check"></i>
                      </button>
                      <button class="btn btn-sm btn-error" onclick="uiManager.deleteSubTask('${
                        todo.id
                      }', '${subTask.id}')" title="Delete sub-task">
                        <i class="bx bx-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </td>
        </tr>
      `;
        this.todosListBody.insertAdjacentHTML("beforeend", subTasksHtml);
      }
    });
  }

  handleEditTodo(id) {
    const todo = this.todoManager.todos.find((t) => t.id === id);
    if (!todo) return;

    // Get DOM elements
    const settingsContainer = document.querySelector(".settings-container");
    const dimOverlay = document.querySelector(".dim-overlay");
    const cancelBtn = document.querySelector(".cancel-edit-btn");
    const saveBtn = document.querySelector(".save-changes-btn");
    const deleteBtn = document.querySelector(".delete-task-btn");

    // Populate form fields
    document.querySelector(".edit-task-name").value = todo.task;
    document.querySelector(".edit-task-description").value =
      todo.description || "";
    document.querySelector(".edit-due-date").value =
      todo.dueDate !== "No due date" ? todo.dueDate : "";
    document.querySelector(".edit-progress").value = todo.progress || 0;

    // Show the settings container and overlay
    settingsContainer.classList.add("active");
    dimOverlay.classList.add("active");

    // Initialize tag and category selectors
    this.populateEditTagSelector(todo.tag);
    this.populateEditCategorySelector(todo.category);

    // Reset to details tab when opening edit modal
    this.switchTab("details");

    // Populate sub-tasks if they exist
    if (todo.subTasks) {
      this.populateSubTasks(todo.subTasks);
    }

    // Store current task ID for sub-task operations
    settingsContainer.dataset.currentTaskId = id;

    // Add event listener for add sub-task button
    const addSubTaskBtn = document.querySelector(".add-subtask-btn");
    addSubTaskBtn.onclick = () => this.handleAddSubTask();

    // Handle cancel button
    const handleCancel = () => {
      settingsContainer.classList.remove("active");
      dimOverlay.classList.remove("active");
      cancelBtn.removeEventListener("click", handleCancel);
    };

    // Handle save button
    const handleSave = () => {
      const updatedTodo = {
        ...todo,
        task: document.querySelector(".edit-task-name").value,
        description: document.querySelector(".edit-task-description").value,
        dueDate:
          document.querySelector(".edit-due-date").value || "No due date",
        progress: document.querySelector(".edit-progress").value,
        tag:
          document
            .querySelector(".edit-tag-selector")
            .selectedTags.join(", ") || "No tag",
        category:
          document
            .querySelector(".edit-category-selector")
            .selectedCategories.join(", ") || "No category",
        displayBar: document.querySelector(".edit-display-bar").value,
      };

      // Update todo in manager
      const index = this.todoManager.todos.findIndex((t) => t.id === id);
      this.todoManager.todos[index] = updatedTodo;
      this.todoManager.saveToLocalStorage();

      // Use applyFilters instead of handleFilterTodos
      this.applyFilters();
      handleCancel();
      this.showAlertMessage("Task updated successfully", "success");
    };

    // Handle delete button
    const handleDelete = () => {
      this.handleDeleteTodo(id);
      handleCancel();
    };

    cancelBtn.addEventListener("click", handleCancel);
    saveBtn.addEventListener("click", handleSave);
    deleteBtn.addEventListener("click", handleDelete);

    // Close on overlay click
    dimOverlay.addEventListener("click", handleCancel);
  }

  populateSubTasks(subTasks = []) {
    const subTasksList = document.querySelector(".sub-tasks-list");
    subTasksList.innerHTML = "";

    subTasks.forEach((subTask) => {
      const subTaskElement = document.createElement("div");
      subTaskElement.className = "sub-task-item";
      subTaskElement.innerHTML = `
        <div class="sub-task-content">
          <div class="todo-item-content">
            <div class="sub-task-title">${subTask.task}</div>
            ${
              subTask.description
                ? `<div class="sub-task-description">${subTask.description}</div>`
                : ""
            }
          </div>
        </div>
        <div class="sub-task-actions">
          <button class="btn btn-success btn-sm" onclick="uiManager.toggleSubTaskStatus('${
            subTask.parentId
          }', '${subTask.id}')" 
                  title="${
                    subTask.completed ? "Mark incomplete" : "Mark complete"
                  }">
            <i class="bx bx-check"></i>
          </button>
          <button class="btn btn-sm btn-error" onclick="uiManager.deleteSubTask('${
            subTask.parentId
          }', '${subTask.id}')" title="Delete sub-task">
            <i class="bx bx-trash"></i>
          </button>
        </div>
      `;
      subTasksList.appendChild(subTaskElement);
    });
  }

  populateEditTagSelector(currentTags) {
    const selector = document.querySelector(".edit-tag-selector");
    const selected = selector.querySelector(".dropdown-selected");
    const options = selector.querySelector(".dropdown-options");

    const selectedTags = currentTags ? currentTags.split(", ") : [];

    const updateSelectedDisplay = () => {
      if (selectedTags.length === 0) {
        selected.innerHTML = "Select Tags";
        selected.style = "";
      } else {
        selected.innerHTML = selectedTags
          .map((tagName) => {
            const tagObj = this.todoManager.tags.find(
              (t) => t.name === tagName
            );
            if (tagObj) {
              return `
                <span class="selected-item" style="background-color: ${tagObj.color}; color: white;">
                  ${tagName}
                  <span class="remove" data-tag="${tagName}">&times;</span>
                </span>
              `;
            }
            return "";
          })
          .join("");

        // Add click handlers for remove buttons
        selected.querySelectorAll(".remove").forEach((btn) => {
          btn.onclick = (e) => {
            e.stopPropagation();
            const tagToRemove = btn.dataset.tag;
            selectedTags.splice(selectedTags.indexOf(tagToRemove), 1);
            updateSelectedDisplay();
          };
        });
      }
    };

    updateSelectedDisplay();
    options.innerHTML = "";

    this.todoManager.getTags().forEach((tag) => {
      const option = document.createElement("div");
      option.className = `dropdown-option${
        selectedTags.includes(tag.name) ? " selected" : ""
      }`;
      option.textContent = tag.name;
      option.style.backgroundColor = tag.color;
      option.style.color = "white";
      option.style.padding = "8px 30px";
      option.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!selectedTags.includes(tag.name)) {
          selectedTags.push(tag.name);
          updateSelectedDisplay();
        }
        option.classList.add("selected");
      });
      options.appendChild(option);
    });

    // Store selected tags in the dropdown for access during save
    selector.selectedTags = selectedTags;
  }

  populateEditCategorySelector(currentCategory) {
    const selector = document.querySelector(".edit-category-selector");
    const selected = selector.querySelector(".dropdown-selected");
    const options = selector.querySelector(".dropdown-options");

    const selectedCategories = currentCategory
      ? currentCategory.split(", ")
      : [];

    const updateSelectedDisplay = () => {
      if (selectedCategories.length === 0) {
        selected.innerHTML = "Select Categories";
        selected.style = "";
      } else {
        selected.innerHTML = selectedCategories
          .map((catName) => {
            const catObj = this.todoManager.categories.find(
              (c) => c.name === catName
            );
            if (catObj) {
              return `
                <span class="selected-item" style="border: 2px solid ${catObj.color}; color: ${catObj.color};">
                  ${catName}
                  <span class="remove" data-category="${catName}">&times;</span>
                </span>
              `;
            }
            return "";
          })
          .join("");

        // Add click handlers for remove buttons
        selected.querySelectorAll(".remove").forEach((btn) => {
          btn.onclick = (e) => {
            e.stopPropagation();
            const categoryToRemove = btn.dataset.category;
            selectedCategories.splice(
              selectedCategories.indexOf(categoryToRemove),
              1
            );
            updateSelectedDisplay();
          };
        });
      }
    };

    updateSelectedDisplay();
    options.innerHTML = "";

    this.todoManager.getCategories().forEach((category) => {
      const option = document.createElement("div");
      option.className = `dropdown-option${
        selectedCategories.includes(category.name) ? " selected" : ""
      }`;
      option.textContent = category.name;
      option.style.borderColor = category.color;
      option.style.color = category.color;
      option.style.padding = "8px 30px";
      option.style.border = `1px solid ${category.color}`;
      option.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!selectedCategories.includes(category.name)) {
          selectedCategories.push(category.name);
          updateSelectedDisplay();
        }
        option.classList.add("selected");
      });
      options.appendChild(option);
    });

    // Store selected categories in the dropdown for access during save
    selector.selectedCategories = selectedCategories;
  }

  handleToggleStatus(id) {
    this.todoManager.toggleTodoStatus(id);

    // Get current active filters from checkboxes
    const activeStatuses = Array.from(
      document.querySelectorAll("[data-status]:checked")
    ).map((checkbox) => checkbox.dataset.status);

    if (activeStatuses.length > 0) {
      // If there are active filters, apply them
      this.activeFilters.status = activeStatuses;
      this.applyFilters();
    } else {
      // Otherwise, maintain the current filter view
      this.handleFilterTodos(this.currentFilter);
    }
  }

  handleDeleteTodo(id) {
    this.todoManager.deleteTodo(id);
    this.showAlertMessage("Task deleted successfully", "success");
    this.showAllTodos();
  }

  handleFilterTodos(status, tag = "all") {
    this.currentFilter = status;
    const filteredTodos =
      tag === "all"
        ? this.todoManager.filterTodos(status)
        : this.todoManager.filterTodosByTag(tag);
    this.displayTodos(filteredTodos);
  }

  showAlertMessage(message, type) {
    const alertBox = `
        <div class="alert alert-${type} shadow-lg mb-5 w-full">
          <div>
            <span>${message}</span>
          </div>
        </div>
      `;
    this.alertMessage.innerHTML = alertBox;
    this.alertMessage.classList.remove("hide");
    this.alertMessage.classList.add("show");
    setTimeout(() => {
      this.alertMessage.classList.remove("show");
      this.alertMessage.classList.add("hide");
    }, 3000);
  }

  handleExportData() {
    try {
      const jsonData = appDataManager.exportData();
      appDataManager.downloadJson(jsonData);
      this.showAlertMessage("Data exported successfully", "success");
    } catch (error) {
      this.showAlertMessage(`Export failed: ${error.message}`, "error");
    }
  }

  async handleImportData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      if (confirm("Importing data will overwrite existing data. Continue?")) {
        try {
          await appDataManager.importData(e.target.result);
          this.showAlertMessage("Data imported successfully", "success");
          this.showAllTodos();
          this.populateTagList();
          this.populateCategoryList();
        } catch (error) {
          this.showAlertMessage(error.message, "error");
        }
      }
      // Reset file input
      event.target.value = "";
    };
    reader.readAsText(file);
  }

  initSortable() {
    const tbody = this.todosListBody;
    this.sortable = new Sortable(tbody, {
      animation: 150,
      draggable: "tr.todo-item", // Only allow dragging parent task rows
      handle: "td:first-child, td:not(:has(.todo-actions))",
      filter:
        ".todo-title, .todo-description, .todo-actions, .todo-actions *, .btn, .btn *, .subtasks-row",
      preventOnFilter: true,
      ghostClass: "sortable-ghost",
      dragClass: "sortable-drag",
      onStart: (evt) => {
        const parentRow = evt.item;
        const subtasksRow = parentRow.nextElementSibling;

        if (subtasksRow && subtasksRow.classList.contains("subtasks-row")) {
          // Store the subtasks row as a property of the parent row for later use
          parentRow.dataset.subtasksHtml = subtasksRow.outerHTML;
          // Remove the subtasks row while dragging
          subtasksRow.remove();
        }
      },
      onEnd: (evt) => {
        const parentRow = evt.item;
        const newIndex = evt.newIndex;
        const oldIndex = evt.oldIndex;

        // If this parent had subtasks, reinsert them after the parent
        if (parentRow.dataset.subtasksHtml) {
          parentRow.insertAdjacentHTML(
            "afterend",
            parentRow.dataset.subtasksHtml
          );
          delete parentRow.dataset.subtasksHtml;
        }

        // Calculate real indices that account for subtasks rows
        const realOldIndex = Math.floor(oldIndex / 2);
        const realNewIndex = Math.floor(newIndex / 2);

        // Update the data model
        this.todoManager.reorderTodos(realOldIndex, realNewIndex);
      },
      onMove: (evt) => {
        // Prevent dropping between a parent and its subtasks
        const related = evt.related;
        if (related && related.classList.contains("subtasks-row")) {
          return false;
        }
        return true;
      },
    });
  }

  setupSearchHandler() {
    // Implement debounced search for better performance
    let searchTimeout;
    this.searchInput.addEventListener("input", (e) => {
      // Clear existing timeout to prevent rapid searches
      clearTimeout(searchTimeout);

      // Set new timeout for search execution
      searchTimeout = setTimeout(() => {
        const query = e.target.value.trim();
        if (query) {
          const searchResults = this.todoManager.searchTodos(query);
          this.displayTodos(searchResults);
        } else {
          this.showAllTodos();
        }
      }, 300); // 300ms debounce delay
    });
  }

  handleArchiveTodo(id) {
    const todo = this.todoManager.todos.find((t) => t.id === id);
    this.todoManager.toggleArchiveStatus(id);
    const actionText = todo.archived ? "archived" : "restored";
    this.showAlertMessage(`Task ${actionText} successfully`, "success");
    document.querySelector(".custom-tooltip")?.classList.remove("show");
    // Instead of handleFilterTodos, use applyFilters to maintain current filter state
    this.applyFilters();
  }

  showFilterDialog() {
    this.filterContainer.classList.add("active");
    document.querySelector(".dim-overlay").classList.add("active");

    // Reset checkboxes to current filter state
    document.querySelectorAll("[data-status]").forEach((checkbox) => {
      checkbox.checked = this.activeFilters.status.includes(
        checkbox.dataset.status
      );
    });

    document.querySelectorAll("[data-difficulty]").forEach((checkbox) => {
      checkbox.checked = this.activeFilters.difficulty.includes(
        checkbox.dataset.difficulty
      );
    });

    // Reset date inputs
    this.filterDateFrom.value = this.activeFilters.dateFrom || "";
    this.filterDateTo.value = this.activeFilters.dateTo || "";

    // Initialize tag and category selectors
    this.populateFilterTagSelector();
    this.populateFilterCategorySelector();
  }

  hideFilterDialog() {
    this.filterContainer.classList.remove("active");
    document.querySelector(".dim-overlay").classList.remove("active");
  }

  populateFilterTagSelector() {
    const selector = document.querySelector(".filter-tag-selector");
    this.initializeFilterSelector(
      selector,
      this.activeFilters.tags,
      this.todoManager.getTags(),
      true
    );
  }

  populateFilterCategorySelector() {
    const selector = document.querySelector(".filter-category-selector");
    this.initializeFilterSelector(
      selector,
      this.activeFilters.categories,
      this.todoManager.getCategories(),
      false
    );
  }

  initializeFilterSelector(selector, selectedItems, items, isTag) {
    const selected = selector.querySelector(".dropdown-selected");
    const options = selector.querySelector(".dropdown-options");

    const updateSelectedDisplay = () => {
      if (selectedItems.length === 0) {
        selected.innerHTML = isTag ? "Select Tags" : "Select Categories";
      } else {
        selected.innerHTML = selectedItems
          .map((name) => {
            const item = items.find((i) => i.name === name);
            if (item) {
              const style = isTag
                ? `background-color: ${item.color}; color: white;`
                : `border: 2px solid ${item.color}; color: ${item.color};`;
              return `
                <span class="selected-item" style="${style}">
                  ${name}
                  <span class="remove" data-name="${name}">&times;</span>
                </span>
              `;
            }
            return "";
          })
          .join("");
      }

      // Update options to reflect selected state
      options.querySelectorAll(".dropdown-option").forEach((option) => {
        const name = option.textContent;
        if (selectedItems.includes(name)) {
          option.classList.add("selected");
          option.style.opacity = "0.5";
          option.style.cursor = "not-allowed";
        } else {
          option.classList.remove("selected");
          option.style.opacity = "1";
          option.style.cursor = "pointer";
        }
      });
    };

    updateSelectedDisplay();
    options.innerHTML = "";

    items.forEach((item) => {
      const option = document.createElement("div");
      option.className = `dropdown-option${
        selectedItems.includes(item.name) ? " selected" : ""
      }`;
      option.textContent = item.name;

      // Set initial styles
      if (selectedItems.includes(item.name)) {
        option.style.opacity = "0.5";
        option.style.cursor = "not-allowed";
      }

      if (isTag) {
        option.style.backgroundColor = item.color;
        option.style.color = "white";
      } else {
        option.style.borderColor = item.color;
        option.style.color = item.color;
      }

      option.addEventListener("click", () => {
        if (!selectedItems.includes(item.name)) {
          selectedItems.push(item.name);
          updateSelectedDisplay();
        }
      });

      options.appendChild(option);
    });

    // Add click handlers for remove buttons
    selected.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove")) {
        const name = e.target.dataset.name;
        selectedItems.splice(selectedItems.indexOf(name), 1);
        updateSelectedDisplay();
      }
    });
  }

  applyFilters() {
    // Collect filter criteria from UI elements
    this.activeFilters.status = Array.from(
      document.querySelectorAll("[data-status]:checked")
    ).map((checkbox) => checkbox.dataset.status);

    // Collect difficulty filters
    this.activeFilters.difficulty = Array.from(
      document.querySelectorAll("[data-difficulty]:checked")
    ).map((checkbox) => checkbox.dataset.difficulty);

    // Collect date range
    this.activeFilters.dateFrom = this.filterDateFrom.value;
    this.activeFilters.dateTo = this.filterDateTo.value;

    // Get tags and categories from selectors
    const tagSelector = document.querySelector(".filter-tag-selector");
    const categorySelector = document.querySelector(
      ".filter-category-selector"
    );

    this.activeFilters.tags = tagSelector.selectedTags || [];
    this.activeFilters.categories = categorySelector.selectedCategories || [];

    // Apply composite filtering using multiple criteria
    const filteredTodos = this.todoManager.todos.filter((todo) => {
      // Status-based filtering
      if (this.activeFilters.status.length > 0) {
        const todoStatus = todo.completed
          ? "completed"
          : todo.archived
          ? "archived"
          : "pending";
        if (!this.activeFilters.status.includes(todoStatus)) return false;
      }

      // Difficulty-based filtering
      if (this.activeFilters.difficulty.length > 0) {
        // Extract difficulty tags from todo's tags
        const todoDifficulties = todo.tag
          .split(", ")
          .filter((tag) => ["Easy", "Medium", "Hard"].includes(tag));
        // Check if todo has at least one of the selected difficulties
        if (
          !todoDifficulties.some((diff) =>
            this.activeFilters.difficulty.includes(diff)
          )
        )
          return false;
      }

      // Date range filtering
      if (this.activeFilters.dateFrom && todo.dueDate !== "No due date") {
        if (todo.dueDate < this.activeFilters.dateFrom) return false;
      }
      if (this.activeFilters.dateTo && todo.dueDate !== "No due date") {
        if (todo.dueDate > this.activeFilters.dateTo) return false;
      }

      // Tag-based filtering
      if (this.activeFilters.tags.length > 0) {
        const todoTags = todo.tag.split(", ");
        if (!this.activeFilters.tags.some((tag) => todoTags.includes(tag)))
          return false;
      }

      // Category-based filtering
      if (this.activeFilters.categories.length > 0) {
        const todoCategories = todo.category.split(", ");
        if (
          !this.activeFilters.categories.some((cat) =>
            todoCategories.includes(cat)
          )
        )
          return false;
      }

      return true;
    });

    this.displayTodos(filteredTodos);
    this.hideFilterDialog();
  }

  resetFilters() {
    // Reset all active filters
    this.activeFilters = {
      status: ["pending", "completed"], // Changed from [] to default filters
      difficulty: [],
      dateFrom: null,
      dateTo: null,
      tags: [],
      categories: [],
    };

    // Show default view of pending and completed
    this.currentFilter = ["pending", "completed"]; // Changed from "pending" to array

    // Pre-check the default status checkboxes
    document.querySelectorAll("[data-status]").forEach((checkbox) => {
      checkbox.checked = this.activeFilters.status.includes(
        checkbox.dataset.status
      );
    });

    this.applyFilters(); // Changed from handleFilterTodos to applyFilters
    this.showAlertMessage("Filters reset to default view", "success");
  }

  handleDeleteCategory(categoryName) {
    // Remove the category from selected categories if it's selected
    this.selectedCategories = this.selectedCategories.filter(
      (c) => c !== categoryName
    );

    // Call the todoManager method to delete the category
    this.todoManager.deleteCategory(categoryName);

    // Update the UI
    this.populateCategoryList();

    // Show success message
    this.showAlertMessage("Category deleted successfully", "success");

    // Refresh the todos display since some might have this category
    this.applyFilters();
  }

  handleAddSubTask() {
    const dimOverlay = document.querySelector(".dim-overlay");
    dimOverlay.classList.add("active");
    this.addSubTaskModal.classList.add("show");

    // Initialize selectors with empty selections
    this.selectedTags = [];
    this.selectedCategories = [];
    this.initSubTaskSelectors();

    const handleCreate = () => {
      const title = this.newSubTaskName.value.trim();
      const description = this.newSubTaskDescription.value.trim();
      const dueDate = document.querySelector(".new-subtask-date").value;
      const displayBar = document.querySelector(".new-subtask-bar").value;
      const currentTaskId = document.querySelector(".settings-container")
        .dataset.currentTaskId;

      if (!title) {
        this.showAlertMessage("Please enter a sub-task title", "error");
        return;
      }

      const subTask = this.todoManager.addSubTask(
        currentTaskId,
        title,
        description,
        dueDate,
        this.selectedTags.join(", ") || "No tag",
        this.selectedCategories.join(", ") || "No category",
        displayBar
      );

      if (subTask) {
        this.populateSubTasks(
          this.todoManager.todos.find((t) => t.id === currentTaskId).subTasks
        );
        this.hideAddSubTaskModal();
        // Keep the dim overlay active after adding the sub-task
        dimOverlay.classList.add("active");
        this.showAlertMessage("Sub-task added successfully", "success");
      }
    };

    const handleCancel = () => {
      this.hideAddSubTaskModal();
      // Keep the dim overlay active after canceling
      dimOverlay.classList.add("active");
    };

    this.createSubTaskBtn.onclick = handleCreate;
    this.cancelSubTaskBtn.onclick = handleCancel;
  }

  initSubTaskSelectors() {
    const tagSelector = document.querySelector(".new-subtask-tag-selector");
    const categorySelector = document.querySelector(
      ".new-subtask-category-selector"
    );

    this.initializeFilterSelector(
      tagSelector,
      this.selectedTags,
      this.todoManager.getTags(),
      true
    );
    this.initializeFilterSelector(
      categorySelector,
      this.selectedCategories,
      this.todoManager.getCategories(),
      false
    );
  }

  hideAddSubTaskModal() {
    this.addSubTaskModal.classList.remove("show");
    document.querySelector(".dim-overlay").classList.remove("active");
    this.newSubTaskName.value = "";
    this.newSubTaskDescription.value = "";
  }

  toggleSubTaskStatus(parentId, subTaskId) {
    this.todoManager.toggleSubTaskStatus(parentId, subTaskId);
    // Use applyFilters instead of handleFilterTodos
    this.applyFilters();
  }

  deleteSubTask(parentId, subTaskId) {
    this.todoManager.deleteSubTask(parentId, subTaskId);
    // Use applyFilters instead of handleFilterTodos to maintain current filter state
    this.applyFilters();
    this.showAlertMessage("Sub-task deleted successfully", "success");
  }
}
