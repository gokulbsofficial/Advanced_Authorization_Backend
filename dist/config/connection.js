"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
var default_1 = __importDefault(require("./default"));
var _a = default_1.default.MONGO, MONGO_DATABASE = _a.MONGO_DATABASE, MONGO_URL = _a.MONGO_URL;
var MONGO_OPTIONS = {};
var state = {
    db: null
};
var connect = function (done) {
    mongodb_1.MongoClient.connect(MONGO_URL, MONGO_OPTIONS, function (err, client) {
        if (err) {
            done(err);
        }
        else {
            state.db = client === null || client === void 0 ? void 0 : client.db(MONGO_DATABASE);
            done();
        }
    });
};
var get = function () {
    return state.db;
};
exports.default = { connect: connect, get: get };
