"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwtToken = exports.generateJwtToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var default_1 = __importDefault(require("../config/default"));
var _a = default_1.default.JWT, JWT_ACCESS_EXPIRE = _a.JWT_ACCESS_EXPIRE, JWT_ACCESS_SECRET = _a.JWT_ACCESS_SECRET, JWT_REFRESH_EXPIRE = _a.JWT_REFRESH_EXPIRE, JWT_REFRESH_SECRET = _a.JWT_REFRESH_SECRET, JWT_ACTIVATION_EXPIRE = _a.JWT_ACTIVATION_EXPIRE, JWT_ACTIVATION_SECRET = _a.JWT_ACTIVATION_SECRET, JWT_RESET_EXPIRE = _a.JWT_RESET_EXPIRE, JWT_RESET_SECRET = _a.JWT_RESET_SECRET, JWT_ISSUER = _a.JWT_ISSUER;
var generateJwtToken = function (payload, type) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (type) {
                case "ACCESS_TOKEN":
                    jsonwebtoken_1.default.sign({
                        userId: payload.userId,
                        email: payload.email,
                    }, JWT_ACCESS_SECRET, {
                        issuer: JWT_ISSUER,
                        subject: type,
                        audience: payload.name,
                        expiresIn: JWT_ACCESS_EXPIRE,
                    }, function (err, token) {
                        if (err) {
                            return reject({
                                name: err.name,
                                msg: err.message,
                                stack: err.stack,
                            });
                        }
                        if (token) {
                            return resolve(token);
                        }
                        else {
                            reject({ msg: "Token Generation failed" });
                        }
                    });
                    break;
                case "REFRESH_TOKEN":
                    jsonwebtoken_1.default.sign({
                        userId: payload.userId,
                        email: payload.email,
                    }, JWT_REFRESH_SECRET, {
                        issuer: JWT_ISSUER,
                        subject: type,
                        audience: payload.name,
                        expiresIn: JWT_REFRESH_EXPIRE,
                    }, function (err, token) {
                        if (err) {
                            return reject({
                                name: err.name,
                                msg: err.message,
                                stack: err.stack,
                            });
                        }
                        if (token) {
                            return resolve(token);
                        }
                        else {
                            reject({ msg: "Token Generation failed" });
                        }
                    });
                    break;
                case "RESET_TOKEN":
                    jsonwebtoken_1.default.sign({
                        userId: payload.userId,
                        email: payload.email,
                    }, JWT_RESET_SECRET, {
                        issuer: JWT_ISSUER,
                        subject: type,
                        audience: payload.name,
                        expiresIn: JWT_RESET_EXPIRE,
                    }, function (err, token) {
                        if (err) {
                            return reject({
                                name: err.name,
                                msg: err.message,
                                stack: err.stack,
                            });
                        }
                        if (token) {
                            return resolve(token);
                        }
                        else {
                            reject({ msg: "Token Generation failed" });
                        }
                    });
                    break;
                case "ACTIVATION_TOKEN":
                    jsonwebtoken_1.default.sign({
                        userId: payload.userId,
                        email: payload.email,
                    }, JWT_ACTIVATION_SECRET, {
                        issuer: JWT_ISSUER,
                        subject: type,
                        audience: payload.name,
                        expiresIn: JWT_ACTIVATION_EXPIRE,
                    }, function (err, token) {
                        if (err) {
                            return reject({
                                name: err.name,
                                msg: err.message,
                                stack: err.stack,
                            });
                        }
                        if (token) {
                            return resolve(token);
                        }
                        else {
                            reject({ msg: "Token Generation failed" });
                        }
                    });
                    break;
                default:
                    return [2 /*return*/, reject({ msg: "Default" })];
            }
            return [2 /*return*/];
        });
    }); });
};
exports.generateJwtToken = generateJwtToken;
var verifyJwtToken = function (token, type) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (type) {
                case "ACCESS_TOKEN":
                    jsonwebtoken_1.default.verify(token, JWT_ACCESS_SECRET, function (err, decoded) {
                        if (err) {
                            return reject({
                                name: err.name,
                                msg: err.message,
                                stack: err.stack,
                            });
                        }
                        if (decoded) {
                            return resolve(decoded);
                        }
                        else {
                            reject({ msg: "Token verification failed" });
                        }
                    });
                    break;
                case "REFRESH_TOKEN":
                    jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET, function (err, decoded) {
                        if (err) {
                            return reject({
                                name: err.name,
                                msg: err.message,
                                stack: err.stack,
                            });
                        }
                        if (decoded) {
                            return resolve(decoded);
                        }
                        else {
                            reject({ msg: "Token verification failed" });
                        }
                    });
                    break;
                case "RESET_TOKEN":
                    jsonwebtoken_1.default.verify(token, JWT_RESET_SECRET, function (err, decoded) {
                        if (err) {
                            return reject({
                                name: err.name,
                                msg: err.message,
                                stack: err.stack,
                            });
                        }
                        if (decoded) {
                            return resolve(decoded);
                        }
                        else {
                            reject({ msg: "Token verification failed" });
                        }
                    });
                    break;
                case "ACTIVATION_TOKEN":
                    jsonwebtoken_1.default.verify(token, JWT_ACTIVATION_SECRET, function (err, decoded) {
                        if (err) {
                            return reject({
                                name: err.name,
                                msg: err.message,
                                stack: err.stack,
                            });
                        }
                        if (decoded) {
                            return resolve(decoded);
                        }
                        else {
                            reject({ msg: "Token verification failed" });
                        }
                    });
                    break;
                default:
                    return [2 /*return*/, reject({ msg: "Default" })];
            }
            return [2 /*return*/];
        });
    }); });
};
exports.verifyJwtToken = verifyJwtToken;
