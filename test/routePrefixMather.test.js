const { routePrefixMather } = require('../dist/utils/routeMatch')

describe('[Matched:/api/]', () => {
    const matcher = routePrefixMather('/api/');
    test('/api/index with {}', () => {
        expect(matcher('/api/index')).toStrictEqual({});
    });

    test('/api/', () => {
        expect(matcher('/api/ with {}')).toStrictEqual({});
    });

    test('/api with false', () => {
        expect(matcher('/api')).toBe(false);
    });
});
