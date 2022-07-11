const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
});

connection.connect((error) => {
    if (error) {
        console.log(error.message);
    }
});

let instance = null;
class database {
    static getDatabaseInstance() {
        return instance ? instance : new database();
    }

    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM todos ORDER BY date_added DESC;';

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async insertNewToDo(todo) {
        try {
            const dateAdded = new Date();
            const insertId = await new Promise((resolve, reject) => {
                const query =
                    'INSERT INTO todos (todo, date_added) VALUES (?,?);';
                connection.query(query, [todo, dateAdded], (error, result) => {
                    if (error) reject(new Error(error.message));
                    resolve(result.insertId);
                });
            });
            return {
                id: insertId,
                todo: todo,
                dateAdded: dateAdded,
            };
        } catch (error) {
            console.log(error);
        }
    }

    async deleteRowById(id) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = 'DELETE FROM todos WHERE id = ?';

                connection.query(query, [id], (error, result) => {
                    if (error) reject(new Error(error.message));
                    resolve(result.affectedRows);
                });
            });

            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateToDoById(id, todo) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = 'UPDATE todos SET todo = ? WHERE id = ?';

                connection.query(query, [todo, id], (error, result) => {
                    if (error) reject(new Error(error.message));
                    resolve(result.affectedRows);
                });
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async searchByToDo(todo) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM todos WHERE todo LIKE '%${todo}%'`;
                connection.query(query, [todo], (error, results) => {
                    if (error) reject(new Error(error.message));
                    resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = database;
