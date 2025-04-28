class TodoItemFormatter {
  formatTask(task) {
    return task.length > 14 ? task.slice(0, 14) + "..." : task;
  }

  formatDueDate(dueDate) {
    return dueDate || "No due date";
  }

  formatStatus(completed, archived) {
    if (archived) {
      return '<div class="todo-status"><i class="bx bx-archive status-icon bx-sm" style="color: #c2caf5"></i> Archived</div>';
    }
    return completed
      ? '<div class="todo-status"><i class="bx bx-check text-success bx-md status-icon"></i> Completed</div>'
      : '<div class="todo-status"><i class="bx bx-x text-error bx-md status-icon"></i> Pending</div>';
  }
}
