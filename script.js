// Select elements
const addTaskBtn = document.getElementById('add-task-btn');
const newTaskInput = document.getElementById('new-task');
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

let isEditing = false;
let currentTask = null;

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Form submission to add or update a task
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskText = newTaskInput.value.trim();
    if (taskText === "") return;

    if (isEditing && currentTask) {
        // Update the task in the UI and localStorage
        currentTask.querySelector('.task-text').textContent = taskText;
        updateLocalStorage();
        resetForm();
    } else {
        // Add a new task
        createTaskElement(taskText);
        saveTasksToLocalStorage();
    }

    newTaskInput.value = '';
});

// Function to create a new task element
function createTaskElement(taskText, isCompleted = false) {
    const li = document.createElement('li');

    // Task text
    const taskTextSpan = document.createElement('span');
    taskTextSpan.className = 'task-text';
    taskTextSpan.textContent = taskText;
    li.appendChild(taskTextSpan);

    // Mark task as completed
    li.classList.toggle('completed', isCompleted);
    taskTextSpan.addEventListener('click', () => {
        li.classList.toggle('completed');
        saveTasksToLocalStorage();
    });

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = '✎';
    editBtn.addEventListener('click', () => {
        startEditingTask(li);
    });
    li.appendChild(editBtn);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '✖';
    deleteBtn.addEventListener('click', () => {
        li.remove();
        saveTasksToLocalStorage();
        if (li === currentTask) resetForm();
    });
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
}

// Start editing a task
function startEditingTask(taskItem) {
    isEditing = true;
    currentTask = taskItem;
    newTaskInput.value = taskItem.querySelector('.task-text').textContent;
    addTaskBtn.textContent = 'Update Task';
    newTaskInput.focus();
}

// Reset the form to add mode
function resetForm() {
    isEditing = false;
    currentTask = null;
    newTaskInput.value = '';
    addTaskBtn.textContent = 'Add Task';
}

// Save tasks to localStorage
function saveTasksToLocalStorage() {
    const tasks = [];
    document.querySelectorAll('#task-list li').forEach((li) => {
        tasks.push({
            text: li.querySelector('.task-text').textContent,
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        createTaskElement(task.text, task.completed);
    });
}

// Update tasks in localStorage
function updateLocalStorage() {
    saveTasksToLocalStorage();
}
