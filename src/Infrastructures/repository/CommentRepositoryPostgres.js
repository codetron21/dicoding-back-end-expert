const CommentRepository = require('../../Domains/comments/CommentRepository');
const InvariantError = require("../../Commons/exceptions/InvariantError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class CommentRepositoryPostgres extends CommentRepository {

    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async verifyCommentOwner(commentId, owner) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
            values: [commentId, owner],
        }

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new AuthorizationError('Komentar tidak dapat diakses');
        }
    }

    async checkAvailabilityComment(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        }

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Komentar tidak ditemukan');
        }
    }

    async addComment(threadId, owner, content) {
        const id = `comment-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO comments(id, content, is_delete, date, thread_id, owner) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
            values: [id, content, false, date, threadId, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('gagal menambahkan komentar');
        }

        return result.rows[0];
    }

    async removeComment(threadId, commentId) {
        const query = {
            text: 'UPDATE comments SET is_delete = true WHERE id = $1 AND thread_id = $2 RETURNING id',
            values: [commentId, threadId]
        }

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('gagal menghapus komentar');
        }
    }

    async getCommentsByThreadId(threadId) {
        const query = {
            text: `SELECT comments.id AS id, username, comments.date AS date, content, is_delete FROM comments 
                   INNER JOIN users ON users.id = comments.owner 
                   WHERE comments.thread_id = $1 
                   ORDER BY comments.date ASC`,
            values: [threadId],
        }

        const result = await this._pool.query(query);

        return result.rows;
    }

}

module.exports = CommentRepositoryPostgres;