class ReminderTester {
  constructor() {
    this.createInputBox();
    this.initCommandListener();
  }

  createInputBox() {
    // Create a small input box in the bottom right corner
    const inputContainer = document.createElement('div');
    inputContainer.style.position = 'fixed';
    inputContainer.style.bottom = '20px';
    inputContainer.style.right = '20px';
    inputContainer.style.zIndex = '9999';
    inputContainer.style.width = '300px';
    inputContainer.style.padding = '10px';
    inputContainer.style.background = 'rgba(0, 0, 0, 0.7)';
    inputContainer.style.borderRadius = '8px';
    inputContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    
    // Add heading
    const heading = document.createElement('div');
    heading.textContent = 'Reminder Tester';
    heading.style.fontSize = '14px';
    heading.style.fontWeight = 'bold';
    heading.style.marginBottom = '10px';
    heading.style.color = '#fff';
    inputContainer.appendChild(heading);
    
    // Create input and hint
    const inputBox = document.createElement('input');
    inputBox.className = 'reminder-test-input input input-bordered input-sm w-full';
    inputBox.placeholder = 'reminder-test-5 (5 seconds)';
    
    const hint = document.createElement('div');
    hint.textContent = 'Enter "reminder-test-X" where X = seconds';
    hint.style.fontSize = '10px';
    hint.style.marginTop = '5px';
    hint.style.color = '#aaa';
    
    // Add elements to container
    inputContainer.appendChild(inputBox);
    inputContainer.appendChild(hint);
    
    // Add a toggle button to show/hide the panel
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = '▼';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.bottom = '10px';
    toggleBtn.style.right = '10px';
    toggleBtn.style.zIndex = '9999';
    toggleBtn.style.width = '30px';
    toggleBtn.style.height = '30px';
    toggleBtn.style.borderRadius = '50%';
    toggleBtn.style.background = 'hsl(var(--s))';
    toggleBtn.style.color = '#fff';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.border = 'none';
    
    let panelVisible = false;
    inputContainer.style.display = 'none';
    
    toggleBtn.addEventListener('click', () => {
      panelVisible = !panelVisible;
      inputContainer.style.display = panelVisible ? 'block' : 'none';
      toggleBtn.textContent = panelVisible ? '▲' : '▼';
    });
    
    // Append to body
    document.body.appendChild(toggleBtn);
    document.body.appendChild(inputContainer);
    
    this.inputBox = inputBox;
  }

  initCommandListener() {
    this.inputBox.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const command = this.inputBox.value.trim().toLowerCase();
        this.processCommand(command);
        this.inputBox.value = '';
      }
    });
  }

  processCommand(command) {
    // Check if the command matches the pattern reminder-test-X
    const reminderPattern = /^reminder-test-(\d+)$/;
    const match = command.match(reminderPattern);
    
    if (match) {
      const seconds = parseInt(match[1], 10);
      if (seconds > 0) {
        this.scheduleTestReminder(seconds);
        this.showMessage(`Reminder scheduled for ${seconds} seconds from now`, 'success');
      } else {
        this.showMessage('Please enter a positive number of seconds', 'error');
      }
    } else {
      this.showMessage('Invalid command. Use format: reminder-test-X (where X is seconds)', 'error');
    }
  }

  scheduleTestReminder(seconds) {
    // First, ensure notification permission is granted
    if (Notification.permission !== 'granted') {
      NotificationHandler.requestPermission();
      this.showMessage('Please enable notifications first', 'warning');
      return;
    }
    
    // Schedule the test reminder
    setTimeout(() => {
      const testItem = {
        id: 'test-' + Date.now(),
        task: 'Test Reminder',
        reminder: {
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0],
          note: `This is a test reminder triggered after ${seconds} seconds`
        }
      };
      
      // Use our own method to show the notification instead of depending on NotificationHandler
      this.showTestNotification(testItem);
      
      this.showMessage('Test reminder triggered!', 'success');
    }, seconds * 1000);
  }

  showTestNotification(reminderItem) {
    const title = `Test Reminder`;
    const options = {
      body: reminderItem.reminder.note || 'Your scheduled test reminder',
      icon: '/res/favicon.ico',
      badge: '/res/favicon.ico',
      tag: `test-${reminderItem.id}`,
      requireInteraction: true
    };
    
    const notification = new Notification(title, options);
    
    // Handle click on notification
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  showMessage(message, type) {
    if (uiManager) {
      uiManager.showAlertMessage(message, type);
    } else {
      console.log(`[${type}] ${message}`);
    }
  }
}

// Initialize the tester when the page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize after a slight delay to ensure all other scripts are loaded
  setTimeout(() => {
    window.reminderTester = new ReminderTester();
  }, 1000);
});

// Also initialize if this script is loaded after the page is already loaded
if (document.readyState === 'complete') {
  setTimeout(() => {
    window.reminderTester = new ReminderTester();
  }, 1000);
}
