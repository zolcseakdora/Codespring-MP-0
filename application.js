const toDo = document.querySelector("#todo-list");
const input = document.querySelector('#new-todo-input');

let state = [];

// Save the current state to localStorage
function saveState() {
    const savedState = JSON.stringify(state);
    localStorage.setItem('saved-state', savedState);
}

// Load state from localStorage
function loadState() {
    const saved = localStorage.getItem('saved-state');
    if (saved) {
        state = JSON.parse(saved);
    } else {
        state = [];
    }
}

// Rebuild the UI from the current state
function buildDom(state) {
    toDo.innerHTML = '';
    for (const element of state) {
        toDo.appendChild(createNew(element.text, element.checked, element.id));
    }
}

// Create a new <li> element
function createNew(text, checked, id) {
    const li = document.createElement('li');
    li.id = id;

    const label = document.createElement('label');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked;

    const span = document.createElement('span');
    span.textContent = text;

    const rmBtn = document.createElement('button');
    rmBtn.classList.add('pretty-button');
    rmBtn.textContent = 'Remove';

    // Checkbox toggle
    checkbox.addEventListener('change', () => {
        const index = state.findIndex(item => item.id === id);
        if (index !== -1) {
            state[index].checked = checkbox.checked;
            saveState();
        }
    });

    // Remove button handler
    rmBtn.addEventListener('click', () => {
        li.remove();
        state = state.filter(item => item.id !== id);
        saveState();
    });

    label.appendChild(checkbox);
    label.appendChild(span);
    li.appendChild(label);
    label.appendChild(rmBtn);

    return li;
}

// Handle adding new items
const addBtn = document.querySelector("#add-button");

function handleAdd() {
    const inputVal = input.value.trim();
    if (!inputVal) return;

    const id = Math.random();
    const newItem = { text: inputVal, checked: false, id };
    state.push(newItem);
    const newElement = createNew(newItem.text, newItem.checked, newItem.id);

    toDo.appendChild(newElement);
    input.value = '';
    saveState();
}

addBtn.addEventListener("click", handleAdd);

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleAdd();
    }
});

// On page load
loadState();
buildDom(state);
