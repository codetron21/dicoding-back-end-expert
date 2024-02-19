const AddComment = require("../../Domains/comments/entities/AddComment");

class AddCommentUseCase {

    constructor({
                    authenticationTokenManager,
                    commentRepository,
                    threadRepository,
                }) {
        this._authenticationTokenManager = authenticationTokenManager;
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload, useCaseParams, accessToken) {
        accessToken = this._validateAndGetAccessToken(accessToken);
        const {threadId} = useCaseParams;

        const addComment = new AddComment(useCasePayload);

        await this._authenticationTokenManager.verifyAccessToken(accessToken);

        const {id} = await this._authenticationTokenManager.decodePayload(accessToken);

        await this._threadRepository.checkAvailabilityThread(threadId);
        return await this._commentRepository.addComment(
            threadId,
            id,
            addComment.content
        );
    }

    _validateAndGetAccessToken(token) {
        if (!token) {
            throw new Error('ADD_COMMENT_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');
        }

        return token.split(" ")[1];
    }

}

module.exports = AddCommentUseCase;