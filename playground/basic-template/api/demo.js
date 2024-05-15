module.exports = async (ctx) => {
    ctx.state.name = 'LEOPOLD';
    const content = '<p>This is a demo to use EJS</p>';
    const list = ['1','2','3',' 4', '5'];
    const count = 60;
    await ctx.render('demo', {
        title: 'EJS',
        content: content,
        list: list,
        count: count,
    });
};