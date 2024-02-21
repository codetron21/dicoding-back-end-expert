const pool = require('../../database/postgres/pool');

describe('CommentRepositoryPostgres', () => {
    afterAll(async () => {
        await pool.end();
    });
});