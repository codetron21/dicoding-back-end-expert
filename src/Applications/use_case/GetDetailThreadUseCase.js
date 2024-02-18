class GetDetailThreadUseCase {

    constructor({
                    threadRepository,
                    commentRepository,
                }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(id) {
        const thread = await this._threadRepository.getDetailThread(id);
        let comments = await this._commentRepository.getCommentsByThreadId(id);
        if(comments) {
            comments = comments.map( e => {
                if(e.is_delete) {
                    e.content = "**komentar telah dihapus**";
                }
                delete e.is_delete;
                return e;
            });
        }
        thread.comments = comments;
        return thread;
    }

}

module.exports = GetDetailThreadUseCase;