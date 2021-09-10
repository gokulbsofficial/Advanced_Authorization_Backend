"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverLogs = void 0;
/* Imported Modules */
require("colors");
/* Config Variable */
exports.serverLogs = [];
var info = function (namespace, message, additional) {
    var currentLog = "[" + getTimeStamp() + "] [" + namespace + "] [INFO] " + message;
    exports.serverLogs.push(currentLog);
    if (additional) {
        console.info(currentLog.green, additional);
    }
    else {
        console.info(currentLog.green);
    }
};
var error = function (namespace, message, additional) {
    var timestamp = "" + getTimeStamp();
    var currentLog = "[" + timestamp + "] [" + namespace + "] [ERROR] " + message;
    exports.serverLogs.push(currentLog);
    if (additional) {
        console.error(currentLog.red, additional);
    }
    else {
        console.error(currentLog.red);
    }
};
var debug = function (namespace, message, additional) {
    var timestamp = "" + getTimeStamp();
    var currentLog = "[" + timestamp + "] [" + namespace + "] [DEBUG] " + message;
    exports.serverLogs.push(currentLog);
    if (additional) {
        console.debug(currentLog.blue, additional);
    }
    else {
        console.debug(currentLog.blue);
    }
};
var warn = function (namespace, message, additional) {
    var timestamp = "" + getTimeStamp();
    var currentLog = "[" + timestamp + "] [" + namespace + "] [WARN] " + message;
    exports.serverLogs.push(currentLog);
    if (additional) {
        console.warn(currentLog.blue, additional);
    }
    else {
        console.warn(currentLog.blue);
    }
};
var getTimeStamp = function () {
    return new Date().toLocaleString();
};
exports.default = { info: info, error: error, debug: debug, warn: warn };
