import { loadHTMLTable, insertRowIntoTable } from './view.js';

const updateBtn = document.querySelector('#update-row-btn');
const refreshBtn = document.querySelector('#refresh-btn');
const addBtn = document.querySelector('#add-todo-btn');

document.querySelector('table tbody').addEventListener('click', (e) => {
    if (e.target.className === 'delete-row-btn') {
        deleteRowById(e.target.dataset.id);
    }
    if (e.target.className === 'edit-row-btn') {
        handleEditRow(e.target.dataset.id);
    }
});

let timeoutToken = null;
const search = document.querySelector('#search-input');
search.addEventListener('input', () => {
    const searchValue = search.value;
    if (searchValue !== '') {
        clearTimeout(timeoutToken);
        timeoutToken = setTimeout(async () => {
            try {
                await fetch('http://localhost:2000/search/' + searchValue)
                    .then((response) => response.json())
                    .then((data) => loadHTMLTable(data['data']));
            } catch {
                console.error('There is no match');
            }
        }, 500);
    }
});

search.addEventListener('focus', () => {
    search.value = '';
});

refreshBtn.addEventListener('click', () => {
    fetch('http://localhost:2000/getAll')
        .then((response) => response.json())
        .then((data) => loadHTMLTable(data['data']));
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = true;
});

const deleteRowById = (id) => {
    fetch('http://localhost:2000/delete/' + id, {
        method: 'DELETE',
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                location.reload();
            }
        });
};

const handleEditRow = (id) => {
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;
    document.querySelector('#update-todo-input').dataset.id = id;
};

updateBtn.addEventListener('click', () => {
    const updateToDoInput = document.querySelector('#update-todo-input');
    const updateValue = updateToDoInput.value;
    if (updateValue !== '') {
        fetch('http://localhost:2000/update', {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                id: updateToDoInput.dataset.id,
                todo: updateToDoInput.value,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    location.reload();
                }
            });
    }
});

addBtn.addEventListener('click', () => {
    const toDoInput = document.querySelector('#todo-input');
    const todo = toDoInput.value;
    if (todo !== '') {
        toDoInput.value = '';

        fetch('http://localhost:2000/insert', {
            headers: {
                'Content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ todo: todo }),
        })
            .then((response) => response.json())
            .then((data) => insertRowIntoTable(data['data']));
    }
});

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:2000/getAll')
        .then((response) => response.json())
        .then((data) => loadHTMLTable(data['data']));
});
