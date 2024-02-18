const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const InvariantError = require("../../Commons/exceptions/InvariantError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class ThreadRepositoryPostgres extends ThreadRepository {

    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(title, body, owner) {
        const id = `thread-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO threads(id, title, body, owner) VALUES($1, $2, $3, $4) RETURNING id, title, owner',
            values: [id, title, body, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('gagal menambahkan thread');
        }

        return result.rows[0];
    }

    async getDetailThread(id) {
        const query = {
            text: `SELECT id, title, body, date, username FROM threads
                    INNER JOIN users ON threads.owner = users.id 
                    WHERE threads.id = $1`,
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Thread tidak ditemukan');
        }

        return result.rows[0];
    }

}

module.exports = ThreadRepositoryPostgres;