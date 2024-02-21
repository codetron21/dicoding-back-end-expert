require('dotenv').config();

const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
    beforeEach(async () => {
        const userId = 'user-123';
        await UsersTableTestHelper.addUser({id:userId});
        await ThreadsTableTestHelper.addThread({owner:userId});
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    it('should success verify comment owner', async () => {
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!
        const ownerId = 'user-123'; // id dari mock users table
        const threadId = 'thread-123'; // id dari mock threads table
        const commentId = `comment-${fakeIdGenerator()}`;
        await CommentsTableTestHelper.addComment({
            commentId,
            threadId,
            owner:ownerId,
        });
        const repository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        // Act & Assert
        await expect(()=>repository.verifyCommentOwner(commentId,ownerId))
            .not.toThrow('Komentar tidak dapat diakses');
    });

    it('should success check availability comment',async()=>{
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!
        const ownerId = 'user-123'; // id dari mock users table
        const threadId = 'thread-123'; // id dari mock threads table
        const commentId = `comment-${fakeIdGenerator()}`;
        await CommentsTableTestHelper.addComment({
            commentId,
            threadId,
            owner:ownerId,
        });
        const repository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        // Act & Assert
        await expect(()=>repository.checkAvailabilityComment(commentId))
            .not.toThrow('Komentar tidak ditemukan');
    });

    it('should success add comment',async()=>{
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!
        const threadId = 'thread-123';
        const owner = 'user-123';
        const content = 'content';

        const repository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        // Act
        const result = await repository.addComment(threadId, owner, content);

        // Assert
        expect(result.id).toEqual(`comment-${fakeIdGenerator()}`);
        expect(result.content).toEqual(content);
        expect(result.owner).toEqual(owner);
    });

    it('should success remove comment',async()=>{
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!
        const ownerId = 'user-123'; // id dari mock users table
        const threadId = 'thread-123'; // id dari mock threads table
        const commentId = `comment-${fakeIdGenerator()}`;
        await CommentsTableTestHelper.addComment({
            commentId,
            threadId,
            owner:ownerId,
        });
        const repository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        // Act & Assert
        await expect(()=>repository.removeComment(threadId,commentId))
            .not.toThrow('gagal menghapus komentar');
    });

    it('should success get comments by thread id',async()=>{
        // Arrange
        const fakeIdGenerator = () => '123'; // stub!
        const ownerId = 'user-123'; // id dari mock users table
        const threadId = 'thread-123'; // id dari mock threads table
        const username = 'dicoding'; //username dari mock users table
        const commentId = `comment-${fakeIdGenerator()}`;
        const content = 'content';
        const date = new Date().toISOString();
        await CommentsTableTestHelper.addComment({
            commentId,
            threadId,
            owner:ownerId,
            content,
            date
        });
        const repository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        // Act
        const result = (await repository.getCommentsByThreadId(threadId))[0];

        // Assert
        expect(result.id).toEqual(commentId);
        expect(result.username).toEqual(username);
        expect(result.date).toEqual(date);
        expect(result.content).toEqual(content);
        expect(result.is_delete).toEqual(false);
    });

});