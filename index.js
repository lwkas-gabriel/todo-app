// Seleção de elementos
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const themeToggleBtn = document.getElementById('themeToggleBtn');

// Carregar tarefas do localStorage ao iniciar
document.addEventListener('DOMContentLoaded', loadTasks);

// Alternar entre tema claro e escuro
themeToggleBtn.addEventListener('click', toggleTheme);

function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    if (currentTheme === 'light') {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    }
}

// Adicionar tarefa
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

function addTask() {
    const taskText = taskInput.value.trim();

    // Se texto vazio, nada faz
    if (taskText === '') return;

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    saveTask(task);
    renderTask(task);
    taskInput.value = '';
}

// Salvar tarefa no localStorage
function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Carregar tarefas do localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => renderTask(task));
}

// Renderizar tarefa na interface
function renderTask(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.setAttribute('data-id', task.id);

    const taskSpan = document.createElement('span');
    taskSpan.textContent = task.text;
    taskSpan.className = 'task-text';
    if (task.completed) {
        taskSpan.classList.add('completed');
    }

    // Botão Marcar como concluída
    const completeBtn = document.createElement('button');
    completeBtn.className = 'btn btn-success';
    completeBtn.textContent = task.completed ? 'Desmarcar' : 'Concluir';
    completeBtn.addEventListener('click', () => toggleTaskCompletion(task.id));

    // Botão Editar
    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-warning';
    editBtn.textContent = 'Editar';
    editBtn.addEventListener('click', () => editTask(task.id));

    // Botão Excluir
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger';
    deleteBtn.textContent = 'Excluir';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(taskSpan);
    li.appendChild(completeBtn);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
}

// Marcar tarefa como concluída
function toggleTaskCompletion(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const task = tasks.find(task => task.id === id);
    task.completed = !task.completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    refreshTasks();
}

// Editar tarefa
function editTask(id) {
    const taskSpan = document.querySelector(`[data-id="${id}"] .task-text`);
    const newText = prompt('Edite a tarefa:', taskSpan.textContent);
    if (newText === null || newText.trim() === '') return;

    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const task = tasks.find(task => task.id === id);
    task.text = newText.trim();
    localStorage.setItem('tasks', JSON.stringify(tasks));
    refreshTasks();
}

// Excluir tarefa
function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    refreshTasks();
}

// Atualizar a lista de tarefas na interface
function refreshTasks() {
    taskList.innerHTML = '';
    loadTasks();
}
