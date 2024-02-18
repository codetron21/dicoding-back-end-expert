const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {

    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async getCommentsByThreadId(threadId) {
        const query = {
            text: `SELECT id, username, date, content, is_delete FROM comments 
                   INNER JOIN users ON users.id = comments.owner 
                   WHERE thread_id  $1 
                   ORDER BY date DESC`,
            values: [threadId],
        }

        const result = await this._pool.query(query);

        return result.rows;
    }

}

module.exports = CommentRepositoryPostgres;