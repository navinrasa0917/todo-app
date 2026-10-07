const STORAGE_KEY = "taskflow_tasks";

let tasks = loadTasks();
let currentFilter = "all";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const taskCount = document.getElementById("taskCount");
const saveStatus = document.getElementById("saveStatus");
const clearCompletedBtn = document.getElementById("clearCompleted");
const filterButtons = document.querySelector(".filters");

function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    console.error("Could not load tasks:", error);
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  saveStatus.textContent = "Saved locally";
}

function createTask(text) {
  const newTask = {
    id: Date.now().toString(),
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
}

function updateTask(id, newText) {
  const task = tasks.find(task => task.id === id);

  if (!task) return;

  const cleanText = newText.trim();

  if (cleanText) {
    task.text = cleanText;
    saveTasks();
  }

  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  const task = tasks.find(task => task.id === id);

  if (!task) return;

  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

function getFilteredTasks() {
  if (currentFilter === "active") {
    return tasks.filter(task => !task.completed);
  }

  if (currentFilter === "completed") {
    return tasks.filter(task => task.completed);
  }

  return tasks;
}

function renderTasks() {
  const filteredTasks = getFilteredTasks();

  taskList.innerHTML = filteredTasks.map(task => `
    <li class="task-item ${task.completed ? "completed" : ""}" data-id="${task.id}">
      <input
        class="task-check"
        type="checkbox"
        ${task.completed ? "checked" : ""}
        aria-label="Mark task as ${task.completed ? "active" : "completed"}"
        data-action="toggle"
      >

      <span class="task-text">${escapeHTML(task.text)}</span>

      <div class="task-actions">
        <button type="button" class="icon-btn" data-action="edit" aria-label="Edit task">✎</button>
        <button type="button" class="icon-btn delete" data-action="delete" aria-label="Delete task">×</button>
      </div>
    </li>
  `).join("");

  emptyState.hidden = filteredTasks.length !== 0;

  const activeCount = tasks.filter(task => !task.completed).length;
  taskCount.textContent = `${activeCount} ${activeCount === 1 ? "task" : "tasks"} left`;

  filterButtons.querySelectorAll(".filter-btn").forEach(button => {
    button.classList.toggle("active", button.dataset.filter === currentFilter);
  });
}

function startEditing(taskItem) {
  const id = taskItem.dataset.id;
  const task = tasks.find(task => task.id === id);

  if (!task) return;

  taskItem.innerHTML = `
    <input class="edit-input" type="text" value="${escapeAttribute(task.text)}" maxlength="120">
    <div class="task-actions">
      <button type="button" class="icon-btn" data-action="save-edit" aria-label="Save edit">✓</button>
      <button type="button" class="icon-btn delete" data-action="cancel-edit" aria-label="Cancel edit">×</button>
    </div>
  `;

  const input = taskItem.querySelector(".edit-input");
  input.focus();
  input.select();
}

function finishEditing(taskItem) {
  const input = taskItem.querySelector(".edit-input");
  if (!input) return;

  updateTask(taskItem.dataset.id, input.value);
}

function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function escapeAttribute(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// CREATE
taskForm.addEventListener("submit", event => {
  event.preventDefault();

  const text = taskInput.value.trim();

  if (!text) return;

  createTask(text);
  taskInput.value = "";
  taskInput.focus();
});

// FILTER
filterButtons.addEventListener("click", event => {
  const button = event.target.closest(".filter-btn");

  if (!button) return;

  currentFilter = button.dataset.filter;
  renderTasks();
});

// UPDATE + DELETE + TOGGLE
// One delegated listener handles dynamically created task elements.
taskList.addEventListener("click", event => {
  const taskItem = event.target.closest(".task-item");

  if (!taskItem) return;

  const action = event.target.closest("[data-action]")?.dataset.action;

  if (action === "edit") {
    startEditing(taskItem);
  }

  if (action === "delete") {
    deleteTask(taskItem.dataset.id);
  }

  if (action === "save-edit") {
    finishEditing(taskItem);
  }

  if (action === "cancel-edit") {
    renderTasks();
  }
});

taskList.addEventListener("change", event => {
  const checkbox = event.target.closest('[data-action="toggle"]');

  if (!checkbox) return;

  const taskItem = event.target.closest(".task-item");
  toggleTask(taskItem.dataset.id);
});

// Save an edit with Enter, cancel with Escape.
taskList.addEventListener("keydown", event => {
  const input = event.target.closest(".edit-input");

  if (!input) return;

  const taskItem = input.closest(".task-item");

  if (event.key === "Enter") {
    finishEditing(taskItem);
  }

  if (event.key === "Escape") {
    renderTasks();
  }
});

// DELETE ALL COMPLETED
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

renderTasks();
