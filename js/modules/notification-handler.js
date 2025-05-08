class NotificationHandler {
  static initialized = false;
  static checkInterval = null;

  static initialize() {
    if (this.initialized) return;

    this.initialized = true;

    // Check for notifications permission
    if (Notification.permission === "default") {
      // Add a notification button to the top right controls
      const themeSwitcher = document.querySelector(".theme-switcher");
      const notifyBtn = document.createElement("button");
      notifyBtn.className = "btn btn-ghost m-1 enable-notifications-btn";
      notifyBtn.title = "Enable Notifications";
      notifyBtn.innerHTML = '<i class="bx bx-bell bx-sm"></i>';
      notifyBtn.addEventListener("click", () => this.requestPermission());
      themeSwitcher.appendChild(notifyBtn);
    }

    // Start checking for reminders
    this.startReminderChecks();

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        this.checkReminders();
      }
    });
  }

  static requestPermission() {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        // Show success message
        const alertMessage = document.querySelector(".alert-message");
        const alertBox = `
          <div class="alert alert-success shadow-lg mb-5 w-full">
            <div>
              <span>Notifications enabled!</span>
            </div>
          </div>
        `;
        alertMessage.innerHTML = alertBox;
        alertMessage.classList.remove("hide");
        alertMessage.classList.add("show");
        setTimeout(() => {
          alertMessage.classList.remove("show");
          alertMessage.classList.add("hide");
        }, 3000);

        // Remove the notification button
        document.querySelector(".enable-notifications-btn")?.remove();

        // Check for reminders immediately
        this.checkReminders();
      }
    });
  }

  static startReminderChecks() {
    // Check reminders immediately
    this.checkReminders();

    // Clear any existing interval
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // Set up interval to check reminders every minute
    this.checkInterval = setInterval(() => {
      this.checkReminders();
    }, 60000); // Check every minute
  }

  static checkReminders() {
    // Skip if notifications aren't granted
    if (Notification.permission !== "granted") return;

    // Get due reminders
    const dueReminders = todoManager.getDueReminders();

    dueReminders.forEach((item) => {
      this.showNotification(item);
      todoManager.markReminderAsNotified(item.id);
    });
  }

  static showNotification(reminderItem) {
    const title = `Task Reminder: ${reminderItem.task}`;
    const options = {
      body: reminderItem.reminder.note || "Your scheduled task reminder",
      icon: "/res/favicon.ico",
      badge: "/res/favicon.ico",
      tag: `task-${reminderItem.id}`,
      requireInteraction: true,
    };

    const notification = new Notification(title, options);

    // Handle click on notification
    notification.onclick = () => {
      window.focus();
      // Open the task editing modal
      uiManager.handleEditTodo(reminderItem.id);
      notification.close();
    };
  }
}
