"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLinux = exports.isMac = exports.isWin = void 0;
const os = require('os');
const isWin = () => {
    return os.type() === 'Windows_NT';
};
exports.isWin = isWin;
const isMac = () => {
    return os.type() === 'Windows_NT';
};
exports.isMac = isMac;
const isLinux = () => {
    return os.type() === 'Linux';
};
exports.isLinux = isLinux;
