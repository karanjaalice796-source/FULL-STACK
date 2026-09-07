const tasks = [];

const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const listTasks = document.querySelector(".listTasks");

function renderTask(task) {
    const taskElement = document.createElement("div");
    taskElement.className = "task";
    taskElement.dataset.taskId = task.task_id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => doneTask(task.task_id));

    const label = document.createElement("span");
    label.className = "task-label";
    label.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-task";
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", `Delete ${task.text}`);
    deleteButton.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
    deleteButton.addEventListener("click", () => deleteTask(task.task_id));

    taskElement.append(checkbox, label, deleteButton);
    listTasks.appendChild(taskElement);

    if (task.done) {
        taskElement.classList.add("task--done");
    }
}

function addTask() {
    const text = taskInput.value.trim();

    if (!text) {
        taskInput.focus();
        return;
    }

    const task = {
        task_id: tasks.length,
        text,
        done: false
    };

    tasks.push(task);
    renderTask(task);
    taskForm.reset();
    taskInput.focus();
}

function doneTask(taskId) {
    const task = tasks.find((item) => item.task_id === taskId);
    const taskElement = listTasks.querySelector(`[data-task-id="${taskId}"]`);

    if (!task || !taskElement) {
        return;
    }

    task.done = !task.done;
    taskElement.classList.toggle("task--done", task.done);
}

function deleteTask(taskId) {
    const taskIndex = tasks.findIndex((task) => task.task_id === taskId);
    const taskElement = listTasks.querySelector(`[data-task-id="${taskId}"]`);

    if (taskIndex === -1 || !taskElement) {
        return;
    }

    tasks.splice(taskIndex, 1);
    taskElement.remove();
}

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addTask();
});