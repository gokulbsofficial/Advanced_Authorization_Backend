"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var verifyFacebookOAuth = function (facebookId, accessToken) {
    return new Promise(function (resolve, reject) {
        var URI = "https://graph.facebook.com/v2.11/" + facebookId + "?fields=id,name,email,picture{URI}&access_token=" + accessToken;
        axios_1.default(URI, {
            method: "GET",
        })
            .then(function (payload) {
            resolve(payload === null || payload === void 0 ? void 0 : payload.data);
        })
            .catch(function (error) {
            reject({
                message: error.message || error.msg,
                code: error.code || error.name,
            });
        });
    });
};
exports.default = verifyFacebookOAuth;
