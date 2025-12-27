document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');
  const TODOS_KEY = 'todos';

  // Load todos, support legacy string-based todos by converting to object shape
  let todos = JSON.parse(localStorage.getItem(TODOS_KEY)) || [];
  todos = todos.map(t => (typeof t === 'string' ? { text: t, completed: false } : t));

  function save() {
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
  }

  function render() {
    list.innerHTML = '';
    todos.forEach((todo, idx) => {
      const li = document.createElement('li');
      li.className = 'todo-item';
      if (todo.completed) li.classList.add('completed');
      li.dataset.index = idx;

      const left = document.createElement('div');
      left.className = 'left';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'toggle';
      checkbox.checked = !!todo.completed;
      checkbox.setAttribute('aria-label', todo.completed ? `Mark ${todo.text} as incomplete` : `Mark ${todo.text} as complete`);
      left.appendChild(checkbox);

      const span = document.createElement('span');
      span.className = 'todo-text';
      span.textContent = todo.text;
      span.setAttribute('tabindex', '0');
      left.appendChild(span);

      li.appendChild(left);

      const del = document.createElement('button');
      del.className = 'delete-btn';
      del.textContent = 'Delete';
      del.setAttribute('aria-label', `Delete ${todo.text}`);
      li.appendChild(del);

      list.appendChild(li);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    todos.push({ text: value, completed: false });
    input.value = '';
    save();
    render();
  });

  list.addEventListener('click', (e) => {
    if (e.target.matches('.delete-btn')) {
      const li = e.target.closest('li');
      const idx = Number(li.dataset.index);
      todos.splice(idx, 1);
      save();
      render();
      return;
    }

    // Toggle when clicking checkbox or text
    const toggle = e.target.matches('.toggle') ? e.target
                 : e.target.matches('.todo-text') ? e.target : null;

    if (toggle) {
      const li = e.target.closest('li');
      const idx = Number(li.dataset.index);
      todos[idx].completed = !todos[idx].completed;
      save();
      render();
    }
  });

  // keyboard support: Enter or Space toggles completion when focused on the text
  list.addEventListener('keydown', (e) => {
    if (e.target.matches('.todo-text') && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      const li = e.target.closest('li');
      const idx = Number(li.dataset.index);
      todos[idx].completed = !todos[idx].completed;
      save();
      render();
    }
  });

  render();
});