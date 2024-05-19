module.exports = async (ctx) => {
    if (ctx.method === 'POST') {
        ctx.body = 'This is Post Method'
    } else if (ctx.method === 'GET') {
        ctx.body = 'This is Get Method'
    }
};