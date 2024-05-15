
module.exports = async (ctx) => {
    ctx.body = {
        code: 0,
        msg: '',
        data: [
            { type: 'title', value: 'Hello, Leopold' },
            { type: 'content', value: 'use as api server' }
        ]
    }
};


