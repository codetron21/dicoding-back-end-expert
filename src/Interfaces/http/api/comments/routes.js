const routes = (handler) => ([
    {
        method: 'POST',
        path: '/threads/{threadId}/comments',
    },
    {
        method: 'DELETE',
        path: '/threads/{threadId}/comments/{commentId}',
    }
]);

module.exports = routes;