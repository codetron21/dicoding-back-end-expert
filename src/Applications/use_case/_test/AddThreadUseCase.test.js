const AddThreadUseCase = require('../AddThreadUseCase');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
describe('AddThreadUseCase', () => {
    it('should throw error when access token not attached', async () => {
        // Arrange
        const accessToken = null;

        const useCase = new AddThreadUseCase({});

        // Act & Assert
        await expect(useCase.execute(null, accessToken))
            .rejects
            .toThrowError('ADD_THREAD_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');
    });

    it('success add thread use case (no thrown an error)', async () => {
        // Arrange
        const payload = {title: 'title', body: 'body'};
        const accessToken = 'Bearer token';
        const token = 'token';
        const owner = "1";
        const mockThreadId = "1";

        const mockTokenManager = new AuthenticationTokenManager();
        const mockThreadRepository = new ThreadRepository();

        mockTokenManager.verifyAccessToken = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockTokenManager.decodePayload = jest.fn()
            .mockImplementation(() => Promise.resolve({id: owner}));
        mockThreadRepository.addThread = jest.fn()
            .mockImplementation(() => Promise.resolve({
                title: payload.title,
                owner: owner,
                id: mockThreadId,
            }));

        const useCase = new AddThreadUseCase({
            authenticationTokenManager: mockTokenManager,
            threadRepository: mockThreadRepository,
        });

        // Act
        const result = await useCase.execute(payload, accessToken);

        // Assert
        expect(mockTokenManager.verifyAccessToken)
            .toBeCalledWith(token);
        expect(mockTokenManager.decodePayload)
            .toBeCalledWith(token);
        expect(mockThreadRepository.addThread)
            .toBeCalledWith(payload.title, payload.body, owner);
        expect(result.title).toEqual(payload.title);
        expect(result.owner).toEqual(owner);
        expect(result.id).toEqual(mockThreadId);
    });
});