"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuidV4 = exports.uuidV1 = void 0;
const uuid = require('uuid');
const uuidV1 = function () {
    return uuid.v1();
};
exports.uuidV1 = uuidV1;
const uuidV4 = function () {
    return uuid.v4();
};
exports.uuidV4 = uuidV4;
