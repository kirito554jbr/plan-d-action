// Task management
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let draggingElement = null;

function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-card';
    taskElement.draggable = true;
    taskElement.dataset.taskId = task.id;
    
    taskElement.innerHTML = `
        <h5>${task.title}</h5>
        <p class="mb-2">${task.description}</p>
        <div class="task-actions">
            <button class="btn btn-sm btn-warning edit-task" onclick="editTask('${task.id}')">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger delete-task" onclick="deleteTask('${task.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    // Add drag event listeners to the new task element
    taskElement.addEventListener('dragstart', handleDragStart);
    taskElement.addEventListener('dragend', handleDragEnd);
    
    return taskElement;
}

function renderTasks() {
    document.querySelectorAll('.tasks-container').forEach(container => {
        container.innerHTML = '';
    });

    tasks.forEach(task => {
        const column = document.querySelector(`[data-column="${task.column}"] .tasks-container`);
        if (column) {
            column.appendChild(createTaskElement(task));
        }
    });
    
    saveTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add new task
document.getElementById('saveTaskBtn').addEventListener('click', () => {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const column = document.getElementById('taskColumn').value;
    
    if (title) {
        const newTask = {
            id: Date.now().toString(),
            title,
            description,
            column
        };
        
        tasks.push(newTask);
        renderTasks();
        
        // Reset and close modal
        document.getElementById('addTaskForm').reset();
        bootstrap.Modal.getInstance(document.getElementById('addTaskModal')).hide();
    }
});

// Edit task
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        document.getElementById('editTaskId').value = task.id;
        document.getElementById('editTaskTitle').value = task.title;
        document.getElementById('editTaskDescription').value = task.description;
        
        new bootstrap.Modal(document.getElementById('editTaskModal')).show();
    }
}

document.getElementById('updateTaskBtn').addEventListener('click', () => {
    const taskId = document.getElementById('editTaskId').value;
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        task.title = document.getElementById('editTaskTitle').value;
        task.description = document.getElementById('editTaskDescription').value;
        
        renderTasks();
        bootstrap.Modal.getInstance(document.getElementById('editTaskModal')).hide();
    }
});

// Delete task
function deleteTask(taskId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
        tasks = tasks.filter(task => task.id !== taskId);
        renderTasks();
    }
}

// Drag and drop functionality
function handleDragStart(e) {
    draggingElement = this;
    this.classList.add('dragging');
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    document.querySelectorAll('.board-column').forEach(column => {
        column.classList.remove('drop-zone');
    });
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    this.classList.add('drop-zone');
}

function handleDragLeave(e) {
    this.classList.remove('drop-zone');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drop-zone');
    
    if (draggingElement) {
        const taskId = draggingElement.dataset.taskId;
        const newColumn = this.dataset.column;
        
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.column = newColumn;
            renderTasks();
        }
    }
}

// Add drag and drop event listeners to columns
document.querySelectorAll('.board-column').forEach(column => {
    column.addEventListener('dragover', handleDragOver);
    column.addEventListener('drop', handleDrop);
    column.addEventListener('dragenter', handleDragEnter);
    column.addEventListener('dragleave', handleDragLeave);
});

// Initial render
renderTasks();