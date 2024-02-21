const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
    async addComment({commentId = 'comment-123', threadId = 'tread-123', owner='user-123', content = 'content', date = new Date().toISOString()}) {
        const query = {
            text: 'INSERT INTO comments(id, content, is_delete, date, thread_id, owner) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
            values: [commentId, content, false, date, threadId, owner],
        };

        await pool.query(query);
    },
    async cleanTable() {
        await pool.query('TRUNCATE comments CASCADE');
    },
}

module.exports = CommentsTableTestHelper;