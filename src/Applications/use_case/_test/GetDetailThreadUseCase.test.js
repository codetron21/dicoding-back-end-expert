const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");

describe('GetDetailThreadUseCase', () => {
    it('should return data with valid data', async () => {
        // Arrange
        const mockedThreadData = {
            "status": "success",
            "data": {
                "thread": {
                    "id": "thread-h_2FkLZhtgBKY2kh4CC02",
                    "title": "sebuah thread",
                    "body": "sebuah body thread",
                    "date": "2021-08-08T07:19:09.775Z",
                    "username": "dicoding",
                }
            }
        };

        const mockedComment = [
            {
                "id": "comment-yksuCoxM2s4MMrZJO-qVD",
                "username": "dicoding",
                "date": "2021-08-08T07:26:21.338Z",
                "content": "**komentar telah dihapus**"
            }
        ];

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockThreadRepository.getDetailThread = jest.fn()
            .mockImplementation(() => Promise.resolve(mockedThreadData));

        mockCommentRepository.getCommentsByThreadId = jest.fn()
            .mockImplementation(() => Promise.resolve(mockedComment));

        const useCase = new GetDetailThreadUseCase({threadRepository:mockThreadRepository,commentRepository: mockCommentRepository});

        const id = '1';

        // Act
        const result = await useCase.execute(id);

        // assert
        expect(mockThreadRepository.getDetailThread)
            .toBeCalledWith(id);
        expect(mockCommentRepository.getCommentsByThreadId)
            .toBeCalledWith(id);
        expect(result.comments[0].content).toEqual("**komentar telah dihapus**");
    });
});