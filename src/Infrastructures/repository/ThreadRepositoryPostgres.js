const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const InvariantError = require("../../Commons/exceptions/InvariantError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class ThreadRepositoryPostgres extends ThreadRepository {

    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async checkAvailabilityThread(id) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [id],
        }

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Thread tidak ditemukan');
        }
    }

    async addThread(title, body, owner) {
        const id = `thread-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO threads(id, title, body, date, owner) VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
            values: [id, title, body, date, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('gagal menambahkan thread');
        }

        return result.rows[0];
    }

    async getDetailThread(id) {
        const query = {
            text: `SELECT threads.id AS id, title, body, threads.date AS date, users.username AS username FROM threads
                    INNER JOIN users ON threads.owner = users.id 
                    WHERE threads.id = $1`,
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('thread tidak ditemukan');
        }

        return result.rows[0];
    }

}

module.exports = ThreadRepositoryPostgres;