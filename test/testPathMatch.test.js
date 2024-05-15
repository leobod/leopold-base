const { routePrefixMather } = require('../dist/utils/routeMatch')

describe('[routePrefixMather]:/api', () => {
    const matcher = routePrefixMather('/api/');
    test('matched', () => {
        expect(matcher('/api/index')).toStrictEqual({});
    });

    test('matched self', () => {
        expect(matcher('/api/')).toStrictEqual({});
    });

    test('not matched', () => {
        expect(matcher('/api')).toBe(false);
    });
});
