const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const tasks = [];
let taskIdCounter = 1;

addButton.addEventListener("click", function () {
  const task = taskInput.value.trim();
  if (task.value != "") {
    const listItem = document.createElement("li");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    const completedButton = document.createElement("button");
    completedButton.textContent = "Completed";

    const newTask = {
      id: taskIdCounter,
      value: task,
      completed: false,
    };
    taskIdCounter++;

    tasks.push(newTask);

    console.log(newTask);
    listItem.textContent = newTask.value;
    taskList.appendChild(listItem);
    listItem.appendChild(deleteButton);
    listItem.appendChild(completedButton);
    taskInput.value = "";

    deleteButton.addEventListener("click", function () {
      taskList.removeChild(listItem);
      let index = tasks.findIndex(function (task) {
        return task.id === newTask.id;
      });

      tasks.splice(index, 1);
    });

    completedButton.addEventListener("click", function () {
      let taskUpdate = tasks.find((task) => task.id == newTask.id);
      if (taskUpdate) {
        taskUpdate.completed = !taskUpdate.completed;

        if (taskUpdate.completed) {
          listItem.style.textDecoration = "line-through";
        } else {
          listItem.style.textDecoration = "none";
        }
      }
    });
  }
});
