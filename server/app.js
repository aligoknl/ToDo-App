const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const database = require('./database.js');
const db = database.getDatabaseInstance();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/insert', (request, response) => {
    const { todo } = request.body;
    const result = db.insertNewToDo(todo);
    result
        .then((data) => response.json({ data: data }))
        .catch((error) => console.log(error));
});

app.get('/getAll', (request, response) => {
    const result = db.getAllData();
    result
        .then((data) => response.json({ data: data }))
        .catch((error) => console.log(error));
});

app.patch('/update', (request, response) => {
    const { id, todo } = request.body;
    const result = db.updateToDoById(id, todo);
    result
        .then((data) => response.json({ success: data }))
        .catch((error) => console.log(error));
});

app.delete('/delete/:id', (request, response) => {
    const { id } = request.params;
    const result = db.deleteRowById(id);
    result
        .then((data) => response.json({ success: data }))
        .catch((error) => console.log(error));
});

app.get('/search/:todo', (request, response) => {
    const { todo } = request.params;
    const result = db.searchByToDo(todo);
    result
        .then((data) => response.json({ data: data }))
        .catch((error) => console.log(error));
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log('App is running'));
