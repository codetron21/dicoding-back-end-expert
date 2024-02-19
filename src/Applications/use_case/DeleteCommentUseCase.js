class DeleteCommentUseCase {

    constructor({
                    authenticationTokenManager,
                    commentRepository,
                    threadRepository,
                }) {
        this._authenticationTokenManager = authenticationTokenManager;
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(useCaseParams, accessToken) {
        accessToken = this._validateAndGetAccessToken(accessToken);

        const {threadId, commentId} = useCaseParams;

        await this._authenticationTokenManager.verifyAccessToken(accessToken);
        const {id} = await this._authenticationTokenManager.decodePayload(accessToken);

        await this._threadRepository.checkAvailabilityThread(threadId);
        await this._commentRepository.checkAvailabilityComment(commentId);
        await this._commentRepository.verifyCommentOwner(commentId, id);
        await this._commentRepository.removeComment(threadId, commentId);
    }

    _validateAndGetAccessToken(token) {
        if (!token) {
            throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');
        }

        return token.split(" ")[1];
    }

}

module.exports = DeleteCommentUseCase;