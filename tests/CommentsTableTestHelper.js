const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
    async addComment() {
        const query = {
            text: '',
            values: [],
        };
        await pool.query(query);
    },
    async cleanTable() {
        await pool.query('DELETE FROM comments WHERE 1=1');
    },
}

module.exports = CommentsTableTestHelper;