"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Custom Imported Modules */
var errorResponse_1 = __importDefault(require("../classes/errorResponse"));
var logger_1 = __importDefault(require("../config/logger"));
/* Config Variables */
var NAMESPACE = "ErrorHandler";
var errorHandler = function (err, req, res, next) {
    var error = __assign({}, err);
    error.message = err.message;
    error.statusCode = err.statusCode;
    if (err.code === 11000) {
        var message = "Duplicate Field Value Enter";
        error = new errorResponse_1.default(message, 400);
    }
    if (err.code === "EAI_AGAIN") {
        var message = "Check your internet connected properly";
        error = new errorResponse_1.default(message, 400);
    }
    if (err.code === "TokenExpiredError") {
        var message = "Your link expired so resent ur link";
        error = new errorResponse_1.default(message, 400);
    }
    if (err.code === "JsonWebTokenError") {
        var message = "Plz check valid link";
        error = new errorResponse_1.default(message, 400);
    }
    if (err.name === "ValidationError") {
        var message = "ValidationError";
        error = new errorResponse_1.default(message, 400);
    }
    logger_1.default.error(NAMESPACE, error.message + " code:" + error.code, error.stack);
    res.status(error.statusCode || 500)
        .json({
        success: false,
        message: error.message || "Server Error",
    });
};
exports.default = errorHandler;
