const AddCommentUseCase = require('../AddCommentUseCase');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
describe('AddCommentUseCase', () => {
    it('should throw error when access token not attached', async () => {
        // Arrange
        const accessToken = null;

        const useCase = new AddCommentUseCase({});

        // Act & Assert
        await expect(useCase.execute(null, accessToken))
            .rejects
            .toThrowError('ADD_COMMENT_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');
    });

    it('success add comment use case (no thrown an error)', async () => {
        // Arrange
        const payload = {content: 'content'};
        const params = {threadId: '1'};
        const accessToken = 'Bearer token';
        const token = 'token';
        const owner = "1";
        const mockCommentId = "1";

        const mockTokenManager = new AuthenticationTokenManager();
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockTokenManager.verifyAccessToken = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockTokenManager.decodePayload = jest.fn()
            .mockImplementation(() => Promise.resolve({id: owner}));
        mockThreadRepository.checkAvailabilityThread = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.addComment = jest.fn()
            .mockImplementation(() => Promise.resolve(
                {
                    threadId: params.threadId,
                    id: mockCommentId,
                    content: payload.content,
                }));

        const useCase = new AddCommentUseCase({
            authenticationTokenManager: mockTokenManager,
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });

        // Act
        const result = await useCase.execute(payload, params, accessToken);

        // Assert
        expect(mockTokenManager.verifyAccessToken)
            .toBeCalledWith(token);
        expect(mockTokenManager.decodePayload)
            .toBeCalledWith(token);
        expect(mockThreadRepository.checkAvailabilityThread)
            .toBeCalledWith(params.threadId);
        expect(mockCommentRepository.addComment)
            .toBeCalledWith(params.threadId, owner, payload.content);
        expect(result.threadId).toEqual(params.threadId);
        expect(result.id).toEqual(mockCommentId);
        expect(result.content).toEqual(payload.content);
    });
});