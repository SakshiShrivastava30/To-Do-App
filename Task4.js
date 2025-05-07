const form = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const themeToggle = document.getElementById('theme-toggle');
const filterCategory = document.getElementById('filter-category');
const filterPriority = document.getElementById('filter-priority');

let tasks = JSON.parse(localStorage.getItem('enhancedTasks')) || [];

form.addEventListener('submit', e => {
  e.preventDefault();
  const task = {
    id: Date.now(),
    title: document.getElementById('task-input').value,
    datetime: document.getElementById('task-datetime').value,
    category: document.getElementById('task-category').value,
    priority: document.getElementById('task-priority').value,
    completed: false
  };
  tasks.push(task);
  saveTasks();
  form.reset();
  renderTasks();
});

function saveTasks() {
  localStorage.setItem('enhancedTasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';

  const categoryFilter = filterCategory.value;
  const priorityFilter = filterPriority.value;

  const filtered = tasks.filter(task => {
    return (categoryFilter === 'All' || task.category === categoryFilter) &&
           (priorityFilter === 'All' || task.priority === priorityFilter);
  });

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task' + (task.completed ? ' completed' : '');

    const info = document.createElement('div');
    info.className = 'task-info';
    info.innerHTML = `
      <div class="task-title">${task.title}</div>
      <div class="meta">
        🕒 ${new Date(task.datetime).toLocaleString()} | 
        🏷 ${task.category} | 
        <span class="priority-${task.priority}">⚠ ${task.priority}</span>
      </div>
    `;

    const actions = document.createElement('div');

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = task.completed ? '⛔' : '✔️';
    toggleBtn.onclick = () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    };

    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.onclick = () => {
      const newTitle = prompt('Edit title', task.title);
      if (newTitle) task.title = newTitle;
      saveTasks();
      renderTasks();
    };

    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';
    delBtn.onclick = () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    };

    actions.append(toggleBtn, editBtn, delBtn);
    li.append(info, actions);
    taskList.appendChild(li);
  });
}

filterCategory.addEventListener('change', renderTasks);
filterPriority.addEventListener('change', renderTasks);

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

renderTasks();
