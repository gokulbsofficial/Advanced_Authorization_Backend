"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var default_1 = __importDefault(require("../config/default"));
var _a = default_1.default.SERVER, SERVER_NODE_ENV = _a.SERVER_NODE_ENV, SERVER_REFRESH_TOKEN_EXPIRE = _a.SERVER_REFRESH_TOKEN_EXPIRE, SERVER_ACCESS_TOKEN_EXPIRE = _a.SERVER_ACCESS_TOKEN_EXPIRE;
var setCookies = function (name, value, res) {
    try {
        if (name === "AccessToken") {
            res.cookie(name, value, {
                httpOnly: true,
                secure: SERVER_NODE_ENV === "production" ? true : false,
                expires: new Date(new Date().getTime() + parseInt(SERVER_ACCESS_TOKEN_EXPIRE)),
                sameSite: "strict",
            });
            res.cookie("AccessSession", true, {
                httpOnly: true,
                expires: new Date(new Date().getTime() + parseInt(SERVER_ACCESS_TOKEN_EXPIRE)),
            });
            return;
        }
        else if (name === "RefreshToken") {
            res.cookie(name, value, {
                httpOnly: true,
                secure: SERVER_NODE_ENV === "production" ? true : false,
                expires: new Date(new Date().getTime() + parseInt(SERVER_REFRESH_TOKEN_EXPIRE)),
                sameSite: "strict",
            });
            res.cookie("RefreshSession", true, {
                httpOnly: true,
                expires: new Date(new Date().getTime() + parseInt(SERVER_REFRESH_TOKEN_EXPIRE)),
            });
            return;
        }
    }
    catch (error) {
        return { msg: error.message };
    }
};
exports.default = setCookies;
