const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
    it('should throw error when access token not attached', async () => {
        // Arrange
        const accessToken = null;

        const useCase = new DeleteCommentUseCase({});

        // Act & Assert
        await expect(useCase.execute(null, accessToken))
            .rejects
            .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');
    });

    it('should pass only token to a function', async () => {
        // Arrange
        const accessToken = 'Bearer token';
        const token = 'token';
        const mockTokenManager = new AuthenticationTokenManager();
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockTokenManager.verifyAccessToken = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockTokenManager.decodePayload = jest.fn()
            .mockImplementation(() => Promise.resolve({id: 1}));
        mockThreadRepository.checkAvailabilityThread = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.checkAvailabilityComment = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentOwner = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.removeComment = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const useCase = new DeleteCommentUseCase({
            authenticationTokenManager: mockTokenManager,
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository
        });

        // Act
        await useCase.execute({}, accessToken);

        // Assert
        expect(mockTokenManager.verifyAccessToken)
            .toBeCalledWith(token);
        expect(mockTokenManager.decodePayload)
            .toBeCalledWith(token);
    });

    it('success delete comment (no thrown an error)', async () => {
        // Arrange
        const accessToken = 'Bearer token';
        const token = 'token';
        const mockTokenManager = new AuthenticationTokenManager();
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const params = {threadId: '1', commentId: '1'};
        const owner = 1;

        mockTokenManager.verifyAccessToken = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockTokenManager.decodePayload = jest.fn()
            .mockImplementation(() => Promise.resolve({id: owner}));
        mockThreadRepository.checkAvailabilityThread = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.checkAvailabilityComment = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentOwner = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.removeComment = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const useCase = new DeleteCommentUseCase({
            authenticationTokenManager: mockTokenManager,
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository
        });

        // Act
        await useCase.execute(params, accessToken);

        // Assert
        expect(mockTokenManager.verifyAccessToken)
            .toBeCalledWith(token);
        expect(mockTokenManager.decodePayload)
            .toBeCalledWith(token);
        expect(mockThreadRepository.checkAvailabilityThread)
            .toBeCalledWith(params.threadId);
        expect(mockCommentRepository.checkAvailabilityComment)
            .toBeCalledWith(params.commentId);
        expect(mockCommentRepository.verifyCommentOwner)
            .toBeCalledWith(params.commentId,owner);
        expect(mockCommentRepository.removeComment)
            .toBeCalledWith(params.threadId, params.commentId);
    });
});