document.addEventListener("DOMContentLoaded", () => {
  const calendar = document.getElementById("calendar");
  const taskList = document.getElementById("task-list");
  const dayDetails = document.getElementById("day-details");
  const exportBtn = document.querySelector(".export-data-btn");
  const importBtn = document.querySelector(".import-data-btn");
  const alertMessage = document.querySelector(".alert-message");

  // Get the month and year selection elements
  const monthSelect = document.getElementById("month-select");
  const yearInput = document.getElementById("year-input");
  // Remove the apply button reference since we won't need it anymore

  // Initialize theme switcher
  const themeItems = document.querySelectorAll(".theme-item");
  const htmlElement = document.querySelector("html");
  const themeSwitcher = new ThemeSwitcher(themeItems, htmlElement);

  const predefinedColors = [
    "#FF6B6B",
    "#4ECDC4",
    "#FFD93D",
    "#1A535C",
    "#FF9F1C",
  ];

  // Use localStorage to store and retrieve tasks
  let tasks = JSON.parse(localStorage.getItem("calendarTasks")) || [];

  // Initialize the modified AppDataManager for calendar
  const calendarDataManager = {
    tasks: tasks,
    saveToLocalStorage: function () {
      localStorage.setItem("calendarTasks", JSON.stringify(this.tasks));
    },
  };

  // Initialize AppDataManager with calendar data manager and theme switcher
  const appDataManager = new AppDataManager(calendarDataManager, themeSwitcher);

  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();

  // Set initial values for the month and year inputs
  monthSelect.value = currentMonth;
  yearInput.value = currentYear;

  // Add event listeners to auto-apply when the values change
  monthSelect.addEventListener("change", () => {
    const selectedMonth = parseInt(monthSelect.value);
    currentMonth = selectedMonth;
    generateCalendar(currentYear, currentMonth);
  });

  yearInput.addEventListener("change", () => {
    const selectedYear = parseInt(yearInput.value);

    // Validate year input
    if (isNaN(selectedYear) || selectedYear < 1900 || selectedYear > 2100) {
      showAlertMessage(
        "Please enter a valid year between 1900 and 2100",
        "error"
      );
      yearInput.value = currentYear; // Reset to current year
      return;
    }

    currentYear = selectedYear;
    generateCalendar(currentYear, currentMonth);
  });

  // Also add input event to handle immediate typing
  yearInput.addEventListener("input", () => {
    const selectedYear = parseInt(yearInput.value);

    // Only apply if it's a valid year
    if (!isNaN(selectedYear) && selectedYear >= 1900 && selectedYear <= 2100) {
      currentYear = selectedYear;
      generateCalendar(currentYear, currentMonth);
    }
  });

  // Add alert message function
  function showAlertMessage(message, type) {
    const alertBox = `
      <div class="alert alert-${type} shadow-lg mb-5 w-full">
        <div>
          <span>${message}</span>
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
  }

  // Set up export functionality with alert message
  exportBtn.addEventListener("click", () => {
    const jsonData = appDataManager.exportData();
    appDataManager.downloadJson(jsonData);
    showAlertMessage("Data exported successfully", "success");
  });

  // Set up import functionality with alert messages
  importBtn.addEventListener("click", () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.style.display = "none";

    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            await appDataManager.importData(e.target.result);
            // Refresh calendar data after import
            tasks = calendarDataManager.tasks;
            generateCalendar(currentYear, currentMonth);
            showAlertMessage("Data imported successfully", "success");
          } catch (error) {
            showAlertMessage(`Error importing data: ${error.message}`, "error");
          }
        };
        reader.readAsText(file);
      }
    });

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  });

  function generateCalendar(year, month) {
    calendar.innerHTML = "";
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement("div");
      calendar.appendChild(emptyCell);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const dayCell = document.createElement("div");
      dayCell.textContent = day;

      // Highlight days with tasks
      const dayTasks = tasks.filter((task) => task.dueDate === date);
      if (dayTasks.length > 0) {
        const randomColor =
          predefinedColors[Math.floor(Math.random() * predefinedColors.length)];
        dayCell.style.backgroundColor = randomColor;
        dayCell.classList.add("highlight");
        dayCell.addEventListener("click", () =>
          displayDayDetails(date, dayTasks)
        );
      }

      calendar.appendChild(dayCell);
    }
  }

  function displayDayDetails(date, dayTasks) {
    dayDetails.querySelector("h2").textContent = `Tasks for ${date}`;
    taskList.innerHTML = "";
    dayTasks.forEach((task) => {
      const taskItem = document.createElement("li");
      taskItem.textContent = task.task;
      taskList.appendChild(taskItem);
    });
  }

  generateCalendar(currentYear, currentMonth);
});
