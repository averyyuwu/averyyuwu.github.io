class AppDataManager {
  constructor(todoManager, themeSwitcher) {
    this.todoManager = todoManager;
    this.themeSwitcher = themeSwitcher;
    this.appVersion = "1.0.0";
  }

  exportData() {
    const data = {
      version: this.appVersion,
      timestamp: new Date().toISOString(),
      theme: this.themeSwitcher.getThemeFromLocalStorage(),
      todos: this.todoManager.todos,
      tags: this.todoManager.tags,
      categories: this.todoManager.categories,
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

      // Check version compatibility
      if (!this.checkVersion(data.version)) {
        throw new Error("Incompatible data version");
      }

      // Import data
      await this.applyImportedData(data);
      return true;
    } catch (error) {
      throw new Error(`Import failed: ${error.message}`);
    }
  }

  validateData(data) {
    const requiredFields = ["version", "todos", "tags", "categories"];
    return requiredFields.every((field) => field in data);
  }

  checkVersion(version) {
    return true; // im too lazy to add this rn xd
  }

  async applyImportedData(data) {
    // Update theme
    if (data.theme) {
      this.themeSwitcher.setTheme(data.theme);
      this.themeSwitcher.saveThemeToLocalStorage(data.theme);
    }

    // Update todos, tags, and categories
    this.todoManager.todos = data.todos;
    this.todoManager.tags = data.tags;
    this.todoManager.categories = data.categories;

    // Save to localStorage
    this.todoManager.saveToLocalStorage();
    this.todoManager.saveTagsToLocalStorage();
    this.todoManager.saveCategoriesToLocalStorage();
  }

  downloadJson(jsonData) {
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `todo-app-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
