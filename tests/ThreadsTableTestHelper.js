const pool = require("../src/Infrastructures/database/postgres/pool");


const ThreadsTableTestHelper = {
    async addThread({
                        id = 'thread-123', title = 'title', body = 'body', date = new Date().toISOString(), owner = 'user-123',
                    }) {
        const query = {
            text: 'INSERT INTO threads(id, title, body, date, owner) VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
            values: [id, title, body, date, owner],
        };

        await pool.query(query);
    },
    async cleanTable() {
        await pool.query('TRUNCATE threads CASCADE');
    },
}

module.exports = ThreadsTableTestHelper;