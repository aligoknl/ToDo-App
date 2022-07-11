export const loadHTMLTable = (data) => {
    const table = document.querySelector('table tbody');

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data'>No Data</td></tr>";
        return;
    }

    let tableHtml = '';

    data.forEach(function ({ id, todo }) {
        tableHtml += '<tr>';
        tableHtml += `<td>${todo}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${id}></td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${id}></td>`;
        tableHtml += '</tr>';
    });

    table.innerHTML = tableHtml;
};

export const insertRowIntoTable = (data) => {
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHtml = '<tr>';

    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            if (key === 'todo') {
                tableHtml += `<td>${data[key]}</td>`;
            }
        }
    }

    tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}></td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}></td>`;
    tableHtml += '</tr>';

    if (isTableData) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow(0);
        newRow.innerHTML = tableHtml;
    }
};
