const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");
const GetDetailThreadUseCase = require("../../../../Applications/use_case/GetDetailThreadUseCase");

class ThreadsHandler {

    constructor(container) {
        this._container = container;

        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.getThreadHandler = this.getThreadHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
        const accessToken =  request.headers.authorization ?? null;
        const addedThread = await addThreadUseCase.execute(request.payload, accessToken);

        const response = h.response({
            status: 'success',
            data: {
                addedThread,
            },
        });
        response.code(201);
        return response;
    }

    async getThreadHandler(request, h) {
        const {threadId} = request.params;
        const getDetailThreadUseCase = this._container.getInstance(GetDetailThreadUseCase.name);
        const thread = await getDetailThreadUseCase.execute(threadId);
        return h.response({
            status: 'success',
            data: {
                thread,
            },
        });
    }

}

module.exports = ThreadsHandler;