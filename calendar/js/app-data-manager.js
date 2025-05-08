class AppDataManager {
  constructor(dataManager, themeSwitcher) {
    this.dataManager = dataManager; // Use todos directly
    this.themeSwitcher = themeSwitcher;
    this.appVersion = "1.0.0";
  }

  exportData() {
    const data = {
      version: this.appVersion,
      timestamp: new Date().toISOString(),
      theme: this.themeSwitcher.getThemeFromLocalStorage(),
      todos: this.dataManager.todos, // Export todos
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
    return data && Array.isArray(data.todos); // Ensure todos exist
  }

  async applyImportedData(data) {
    // Update theme
    if (data.theme) {
      this.themeSwitcher.setTheme(data.theme);
      this.themeSwitcher.saveThemeToLocalStorage(data.theme);
    }

    // Update todos
    if (Array.isArray(data.todos)) {
      this.dataManager.todos = data.todos;
      localStorage.setItem("todos", JSON.stringify(data.todos));
    }
  }

  deleteTaskById(taskId) {
    this.dataManager.todos = this.dataManager.todos.filter(
      (task) => task.id !== taskId
    );
    localStorage.setItem("todos", JSON.stringify(this.dataManager.todos));
  }

  downloadJson(jsonData) {
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `todos-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
