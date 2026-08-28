const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const allButton = document.getElementById("allButton");
const activeButton = document.getElementById("activeButton");
const completedButton = document.getElementById("completedButton");
const sortButton = document.getElementById("sortButton");
const taskStats = document.getElementById("taskStats");

const savedTasks = localStorage.getItem("tasks");
let tasks = [];

try{
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
}
catch (error) {
  console.error("Error parsing tasks from localStorage:", error.message);
}

let currentFilter = "all";
let sortAscending = true;

renderTasks(tasks);
renderTaskStats();

let nextTaskId = getNextTaskId(tasks);

window.addEventListener("storage", function (event) {
  if (event.key === "tasks") {
    tasks.length = 0; //clears out array
    tasks.push(...JSON.parse(event.newValue)); //push because can't edit the constant
    refreshUI();
  }
});

allButton.addEventListener("click", function () {
  currentFilter = "all";
  renderCurrentFilter();
});

activeButton.addEventListener("click", function () {
  currentFilter = "active";
  renderCurrentFilter();
});

completedButton.addEventListener("click", function () {
  currentFilter = "completed";
  renderCurrentFilter();
});

sortButton.addEventListener("click", function () {
  sortAscending = !sortAscending;
  sortTaskByTitle();
});

addButton.addEventListener("click", function () {
  const taskValue = taskInput.value.trim();
  if (taskValue != "") {
    addTask(taskValue);
    refreshUI();
  }
});

taskList.addEventListener("click", function (event) {
  const eventName = event.target.dataset.action;
  const listItem = event.target.parentElement;
  const taskId = Number(listItem.dataset.id);

  if (eventName === "delete") {
    const index = getTaskIndex(taskId);

    tasks.splice(index, 1);

    saveTasks(tasks);
    refreshUI();
  }

  if (eventName === "complete") {
    const task = getTask(taskId);
    task.completed = !task.completed;

    saveTasks(tasks);
    refreshUI();
  }

  if (eventName === "edit") {
    const task = getTask(taskId);

    listItem.innerHTML = "";

    const editInput = document.createElement("input");
    editInput.value = task.title;

    const saveButton = document.createElement("button");
    const cancelButton = document.createElement("button");

    saveButton.textContent = "Save";
    cancelButton.textContent = "Cancel";

    saveButton.dataset.action = "save";
    cancelButton.dataset.action = "cancel";

    listItem.appendChild(editInput);
    listItem.appendChild(saveButton);
    listItem.appendChild(cancelButton);
  }

  if (eventName === "save") {
    const task = getTask(taskId);
    const editInput = listItem.querySelector("input");

    const newTitle = editInput.value.trim();

    if (newTitle === "") {
      alert("Task title cannot be empty");
      return;
    }

    task.title = newTitle;

    saveTasks(tasks);
    refreshUI();
  }

  if (eventName === "cancel") {
    renderCurrentFilter();
  }
});

function addTask(task) {
  const Task = {
    id: nextTaskId,
    title: task,
    completed: false,
  };
  tasks.push(Task);
  saveTasks(tasks);

  nextTaskId++;
}

function renderTask(task) {
  const listItem = document.createElement("li");
  const completedButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  const editButton = document.createElement("button");

  deleteButton.textContent = "Delete";
  completedButton.textContent = "Completed";
  editButton.textContent = "Edit";

  listItem.dataset.id = task.id;
  deleteButton.dataset.action = "delete";
  completedButton.dataset.action = "complete";
  editButton.dataset.action = "edit";

  listItem.textContent = task.title;

  if (task.completed) {
    listItem.style.textDecoration = "line-through";
  }

  listItem.appendChild(completedButton);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);
  taskList.appendChild(listItem);

  taskInput.value = "";
}

function renderTasks(taskArray) {
  taskList.innerHTML = "";
  if (taskArray.length === 0) {
    renderEmptyMessage("No tasks found.");
    return;
  }

  taskArray.forEach(function (task) {
    renderTask(task);
  });
}

function getNextTaskId(tasks) {
  if (tasks.length === 0) {
    return 1;
  } else {
    const taskIds = tasks.map(function (task) {
      return task.id;
    });
    return Math.max(...taskIds) + 1;
  }
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderEmptyMessage(message) {
  const listItem = document.createElement("li");
  listItem.textContent = message;
  taskList.appendChild(listItem);
}

function renderCurrentFilter() {
  if (currentFilter === "all") {
    renderTasks(tasks);
  } else if (currentFilter === "active") {
    renderTasks(
      tasks.filter(function (task) {
        return !task.completed;
      })
    );
  } else if (currentFilter === "completed") {
    renderTasks(
      tasks.filter(function (task) {
        return task.completed;
      })
    );
  }
}

function getTaskIndex(taskId) {
  return tasks.findIndex((item) => item.id === taskId);
}

function getTask(taskId) {
  return tasks.find((item) => item.id === taskId);
}

function sortTaskByTitle() {
  tasks.sort(function (a, b) {
    if (sortAscending) {
      sortButton.textContent = "Sort A-Z";
      return a.title.localeCompare(b.title);
    } else {
      sortButton.textContent = "Sort Z-A";
      return b.title.localeCompare(a.title);
    }
  });

  saveTasks(tasks);
  renderCurrentFilter();
}

function renderTaskStats(){
    const totalCount = tasks.length;

    const completedCount = tasks.reduce(function(count,task){
        return count + task.completed;
    }, 0);

    const activeCount = tasks.reduce(function(count, task){
        return count + !task.completed;
    }, 0);

    taskStats.textContent = `Total : ${totalCount} | Active: ${activeCount} | Completed : ${completedCount}`;
}

function refreshUI(){
    renderCurrentFilter();
    renderTaskStats();
}
