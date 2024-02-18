/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('comments', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        is_delete: {
            type: 'BOOLEAN',
            default: false,
        },
        date: {
            type: 'TEXT',
            notNull: true,
        },
        thread_id: {
            type: 'VARCHAR(50)',
            references: 'threads',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
        }
    });
    pgm.addConstraint('comments', 'fk_comments.comments_threads.id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
    pgm.addConstraint('comments', 'fk_comments.comments_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropConstraint('comments', 'fk_comments.comments_threads.id');
    pgm.dropConstraint('comments', 'fk_comments.comments_users.id');
    pgm.dropTable('comments');
};
