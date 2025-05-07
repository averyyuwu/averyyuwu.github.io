class AppDataManager {
  constructor(calendarDataManager, themeSwitcher) {
    this.calendarDataManager = calendarDataManager;
    this.themeSwitcher = themeSwitcher;
    this.appVersion = "1.0.0";
  }

  exportData() {
    const data = {
      version: this.appVersion,
      timestamp: new Date().toISOString(),
      theme: this.themeSwitcher.getThemeFromLocalStorage(),
      calendarTasks: this.calendarDataManager.tasks,
    };

    return JSON.stringify(data, null, 2);
  }

  async importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);

      // Validate data structure
      if (!this.validateData(data)) {
        throw new Error("Invalid data format");
      }

      // Import data
      await this.applyImportedData(data);
      return true;
    } catch (error) {
      throw new Error(`Import failed: ${error.message}`);
    }
  }

  validateData(data) {
    // Check for required version field
    if (!data || !data.version) {
      return false;
    }
    
    // Allow two possible formats:
    // 1. Calendar format with calendarTasks
    // 2. Main app format with todos (which can be used as calendar tasks)
    return data.calendarTasks || data.todos;
  }

  async applyImportedData(data) {
    // Update theme
    if (data.theme) {
      this.themeSwitcher.setTheme(data.theme);
      this.themeSwitcher.saveThemeToLocalStorage(data.theme);
    }

    // Update calendar tasks - handle both data formats
    if (Array.isArray(data.calendarTasks)) {
      this.calendarDataManager.tasks = data.calendarTasks;
      this.calendarDataManager.saveToLocalStorage();
    } 
    // If importing from main app, extract date-based todos
    else if (Array.isArray(data.todos)) {
      // Extract todos with due dates to use as calendar tasks
      const calendarCompatibleTasks = data.todos
        .filter(todo => todo.dueDate && todo.dueDate !== "No due date")
        .map(todo => ({
          id: todo.id,
          task: todo.task,
          dueDate: todo.dueDate,
          description: todo.description || ""
        }));
        
      this.calendarDataManager.tasks = calendarCompatibleTasks;
      this.calendarDataManager.saveToLocalStorage();
    }
  }

  downloadJson(jsonData) {
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `calendar-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
