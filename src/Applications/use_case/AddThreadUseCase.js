const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {

    constructor({
                    authenticationRepository,
                    authenticationTokenManager,
                    threadRepository,
                }) {
        this._authenticationRepository = authenticationRepository;
        this._authenticationTokenManager = authenticationTokenManager;
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        this._verifyPayload(useCasePayload);
        const {refreshToken} = useCasePayload;

        const addThread = new AddThread(useCasePayload);

        await this._authenticationTokenManager.verifyRefreshToken(refreshToken);
        await this._authenticationRepository.checkAvailabilityToken(refreshToken);

        const {id} = await this._authenticationTokenManager.decodePayload(refreshToken);

        return await this._threadRepository.addThread(
            addThread.title,
            addThread.body,
            id
        )
    }

    _verifyPayload(payload) {
        const {refreshToken} = payload;

        if (!refreshToken) {
            throw new Error('ADD_THREAD_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
        }

        if (typeof refreshToken !== 'string') {
            throw new Error('ADD_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }

}

module.exports = AddThreadUseCase;