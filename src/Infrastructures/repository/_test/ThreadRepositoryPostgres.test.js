require('dotenv').config();

const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
    beforeEach(async () => {
        await UsersTableTestHelper.addUser({});
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    it('should success get detail thread', async () => {
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!
        const owner = 'user-123'; // id dari mock users table
        const threadId = 'thread-123';
        const date = new Date().toISOString();
        const title = 'title';
        const body = 'body';

        await ThreadsTableTestHelper.addThread({title, body, id: threadId, owner, date});
        const user = (await UsersTableTestHelper.findUsersById(owner))[0];
        const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

        // Act
        const result = await repository.getDetailThread(threadId);

        // Assert
        expect(result.id).toEqual(threadId);
        expect(result.title).toEqual(title);
        expect(result.body).toEqual(body);
        expect(result.date).toEqual(date);
        expect(result.username).toEqual(user.username);
    });

    it('should success check availability thread', async () => {
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!
        const owner = 'user-123'; // id dari mock users table
        const threadId = 'thread-123';

        await ThreadsTableTestHelper.addThread({id: threadId, owner});
        const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

        // Act & Assert
        await expect(() => repository.checkAvailabilityThread(threadId)).not.toThrow('Thread tidak ditemukan');
    });

    it('should success add thread', async () => {
        const fakeIdGenerator = () => '123'; // stub!
        const title = 'title';
        const body = 'body';
        const owner = 'user-123'; // id dari mock users table

        const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
        const result = await repository.addThread(title, body, owner);

        expect(result.id).toEqual(`thread-${fakeIdGenerator()}`);
        expect(result.title).toEqual(title);
        expect(result.owner).toEqual(owner);
    });
});