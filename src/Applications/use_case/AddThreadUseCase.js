const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {

    constructor({
                    authenticationTokenManager,
                    threadRepository,
                }) {
        this._authenticationTokenManager = authenticationTokenManager;
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload, accessToken) {
        accessToken = this._validateAndGetAccessToken(accessToken);
        const addThread = new AddThread(useCasePayload);

        await this._authenticationTokenManager.verifyAccessToken(accessToken);
        const {id} = await this._authenticationTokenManager.decodePayload(accessToken);

        return await this._threadRepository.addThread(
            addThread.title,
            addThread.body,
            id
        )
    }

    _validateAndGetAccessToken(token) {
        if(!token) {
            throw new Error('ADD_THREAD_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');
        }

        return token.split(" ")[1];
    }
}

module.exports = AddThreadUseCase;