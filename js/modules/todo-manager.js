class TodoManager {
  constructor(todoItemFormatter) {
    this.todos = JSON.parse(localStorage.getItem("todos")) || [];
    this.todoItemFormatter = todoItemFormatter;
    this.tags = JSON.parse(localStorage.getItem("tags")) || [];
    this.categories = JSON.parse(localStorage.getItem("categories")) || [];
    this.initializeDifficultyTags();
  }

  initializeDifficultyTags() {
    const difficultyTags = [
      { name: "Easy", color: "#2ECC71" },
      { name: "Medium", color: "#F1C40F" },
      { name: "Hard", color: "#E74C3C" },
    ];

    // Add difficulty tags if they don't exist
    difficultyTags.forEach((tag) => {
      if (!this.tags.some((t) => t.name === tag.name)) {
        this.tags.push(tag);
      }
    });
    this.saveTagsToLocalStorage();
  }

  // Modify addTag method to prevent duplicate difficulty tags
  addTag(tag, color) {
    const isDifficultyTag = ["Easy", "Medium", "Hard"].includes(tag);
    if (isDifficultyTag) {
      return false;
    }
    if (!this.tags.find((t) => t.name === tag)) {
      this.tags.push({ name: tag, color: color });
      this.saveTagsToLocalStorage();
      return true;
    }
    return false;
  }

  getTags() {
    return this.tags;
  }

  saveTagsToLocalStorage() {
    localStorage.setItem("tags", JSON.stringify(this.tags));
  }

  addCategory(category, color, parent) {
    if (!this.categories.find((c) => c.name === category)) {
      this.categories.push({
        name: category,
        color: color,
        parent: parent || null,
      });
      this.saveCategoriesToLocalStorage();
    }
  }

  getCategories() {
    return this.categories;
  }

  saveCategoriesToLocalStorage() {
    localStorage.setItem("categories", JSON.stringify(this.categories));
  }

  deleteCategory(categoryName) {
    // Get all child categories recursively
    const getAllChildren = (parentName) => {
      const children = this.categories
        .filter((c) => c.parent === parentName)
        .map((c) => c.name);

      const allChildren = [...children];
      children.forEach((child) => {
        allChildren.push(...getAllChildren(child));
      });

      return allChildren;
    };

    // Get all children of the category being deleted
    const childrenToDelete = getAllChildren(categoryName);

    // Add the parent category name to the list of categories to delete
    const categoriesToDelete = [categoryName, ...childrenToDelete];

    // Filter out all the categories that need to be deleted
    this.categories = this.categories.filter(
      (c) => !categoriesToDelete.includes(c.name)
    );

    this.saveCategoriesToLocalStorage();
  }

  addTodo(task, description, dueDate, tag, category, displayBar) {
    const newTodo = {
      id: this.getRandomId(),
      task: task,
      description: description || "",
      dueDate: this.todoItemFormatter.formatDueDate(dueDate),
      completed: false,
      archived: false,
      status: "pending",
      tag: tag || "No tag",
      category: category || "No category",
      displayBar: displayBar || "deadline",
      reminder: null, // Add default reminder value
    };
    this.todos.push(newTodo);
    this.saveToLocalStorage();
    return newTodo;
  }

  editTodo(id, updatedTask) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.task = updatedTask;
      this.saveToLocalStorage();
    }
    return todo;
  }

  deleteTodo(id) {
    // Find the exact task by ID and only remove that one
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      this.saveToLocalStorage();
    }
  }

  toggleTodoStatus(id) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveToLocalStorage();
    }
  }

  filterTodos(status) {
    switch (status) {
      case "all":
        return this.todos.filter((todo) => !todo.archived);
      case "pending":
        return this.todos.filter((todo) => !todo.completed && !todo.archived);
      case "completed":
        return this.todos.filter((todo) => todo.completed && !todo.archived);
      case "archived":
        return this.todos.filter((todo) => todo.archived);
      default:
        return [];
    }
  }

  filterTodosByTag(tag) {
    return tag === "all"
      ? this.todos
      : this.todos.filter((todo) => todo.tag === tag);
  }

  getRandomId() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  saveToLocalStorage() {
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }

  reorderTodos(oldIndex, newIndex) {
    const todos = this.todos;
    const [movedItem] = todos.splice(oldIndex, 1);
    todos.splice(newIndex, 0, movedItem);
    this.saveToLocalStorage();
  }

  searchTodos(query) {
    query = query.toLowerCase();
    return this.todos.filter(
      (todo) =>
        todo.task.toLowerCase().includes(query) ||
        (todo.description && todo.description.toLowerCase().includes(query))
    );
  }

  archiveTodo(id) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.archived = true;
      this.saveToLocalStorage();
    }
  }

  toggleArchiveStatus(id) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.archived = !todo.archived;
      this.saveToLocalStorage();
    }
  }

  addSubTask(
    parentId,
    title,
    description,
    dueDate,
    tag,
    category,
    displayBar,
    progress
  ) {
    const parent = this.todos.find((t) => t.id === parentId);
    if (!parent) return null;

    const subTask = {
      id: this.getRandomId(),
      task: title,
      description: description || "",
      completed: false,
      archived: false,
      parentId: parentId,
      dueDate: this.todoItemFormatter.formatDueDate(dueDate),
      tag: tag || "No tag",
      category: category || "No category",
      displayBar: displayBar || "deadline",
      progress: typeof progress === "number" ? progress : 0,
    };

    if (!parent.subTasks) {
      parent.subTasks = [];
    }
    parent.subTasks.push(subTask);
    this.saveToLocalStorage();
    return subTask;
  }

  deleteSubTask(parentId, subTaskId) {
    const parent = this.todos.find((t) => t.id === parentId);
    if (!parent || !parent.subTasks) return;

    parent.subTasks = parent.subTasks.filter((st) => st.id !== subTaskId);
    this.saveToLocalStorage();
  }

  toggleSubTaskStatus(parentId, subTaskId) {
    const parent = this.todos.find((t) => t.id === parentId);
    if (!parent || !parent.subTasks) return;

    const subTask = parent.subTasks.find((st) => st.id === subTaskId);
    if (subTask) {
      subTask.completed = !subTask.completed;
      this.saveToLocalStorage();
    }
  }

  // Add new method to set a reminder for a task
  setReminder(taskId, reminderDate, reminderTime, reminderNote) {
    const todo = this.todos.find((t) => t.id === taskId);
    if (todo) {
      todo.reminder = {
        date: reminderDate,
        time: reminderTime,
        note: reminderNote || "",
        notified: false,
      };
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  // Add new method to clear a reminder for a task
  clearReminder(taskId) {
    const todo = this.todos.find((t) => t.id === taskId);
    if (todo) {
      todo.reminder = null;
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  // Add new method to mark a reminder as notified
  markReminderAsNotified(taskId) {
    const todo = this.todos.find((t) => t.id === taskId);
    if (todo && todo.reminder) {
      todo.reminder.notified = true;
      this.saveToLocalStorage();
      return true;
    }
    return false;
  }

  // Add new method to get all due reminders
  getDueReminders() {
    const now = new Date();
    return this.todos
      .filter((todo) => {
        if (!todo.reminder || todo.reminder.notified || todo.archived)
          return false;

        const reminderDateTime = new Date(
          `${todo.reminder.date}T${todo.reminder.time}`
        );
        return reminderDateTime <= now;
      })
      .map((todo) => ({
        id: todo.id,
        task: todo.task,
        reminder: todo.reminder,
      }));
  }
}
