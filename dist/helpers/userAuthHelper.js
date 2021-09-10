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
exports.disableAuthenticator = exports.validateAuthenticator = exports.verifyAuthenticator = exports.generateAuthenticator = exports.upgradeAccessToken = exports.checkUserStatus = exports.verifyPassword = exports.deleteUser = exports.resetPassword = exports.forgotPassword = exports.accountActivation = exports.resentActivationToken = exports.unLinkWithFacebook = exports.linkWithfacebook = exports.facebookLogin = exports.unLinkWithGoogle = exports.linkWithGoogle = exports.googleLogin = exports.linkWithPasssword = exports.doSignup = exports.doLogin = void 0;
/* Installed Imported Modules */
var bcryptjs_1 = __importDefault(require("bcryptjs"));
/* Custom Imported Modules */
var connection_1 = __importDefault(require("../config/connection"));
var collections_1 = __importDefault(require("../config/collections"));
var default_1 = __importDefault(require("../config/default"));
var googleOAuth_1 = __importDefault(require("../functions/googleOAuth"));
var jwt_1 = require("../functions/jwt");
var mongodb_1 = require("mongodb");
var checkStatus_1 = __importDefault(require("../functions/checkStatus"));
var facebookOAuth_1 = __importDefault(require("../functions/facebookOAuth"));
var authenticator_1 = require("../functions/authenticator");
var CLIENT_HOST = default_1.default.CLIENT.CLIENT_HOST;
/**
 * @description
 */
var doLogin = function (email, password) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var userFound, user, accountStatus, isMatch, accessToken, refreshToken, error_1;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!email || !password)
                        return [2 /*return*/, reject({ message: "Please Provide Email, Password" })];
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 17, , 18]);
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.USER).findOne({ email: email }))];
                case 2:
                    userFound = _e.sent();
                    if (!userFound) return [3 /*break*/, 15];
                    user = userFound;
                    accountStatus = user.accountStatus;
                    return [4 /*yield*/, checkStatus_1.default(accountStatus, user.email, collections_1.default.USER, [
                            "Blocked",
                            "Inactive",
                        ])];
                case 3:
                    _e.sent();
                    if (!((_b = user.methods) === null || _b === void 0 ? void 0 : _b.includes("Password"))) return [3 /*break*/, 13];
                    return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
                case 4:
                    isMatch = _e.sent();
                    if (!isMatch) return [3 /*break*/, 11];
                    if (!((user === null || user === void 0 ? void 0 : user.twoStepVerification) === true)) return [3 /*break*/, 5];
                    return [2 /*return*/, resolve({
                            userId: user._id,
                            twoStepVerification: user.twoStepVerification,
                            message: "Login Successfully",
                        })];
                case 5: return [4 /*yield*/, jwt_1.generateJwtToken({ userId: user._id, email: user.email, name: user.name }, "ACCESS_TOKEN")];
                case 6:
                    accessToken = _e.sent();
                    return [4 /*yield*/, jwt_1.generateJwtToken({ userId: user._id, email: user.email, name: user.name }, "REFRESH_TOKEN")];
                case 7:
                    refreshToken = _e.sent();
                    return [4 /*yield*/, ((_c = connection_1.default
                            .get()) === null || _c === void 0 ? void 0 : _c.collection(collections_1.default.REFRESH_TOKEN).insertOne({
                            refreshToken: refreshToken,
                            userId: new mongodb_1.ObjectId(user._id),
                        }))];
                case 8:
                    _e.sent();
                    return [4 /*yield*/, ((_d = connection_1.default
                            .get()) === null || _d === void 0 ? void 0 : _d.collection(collections_1.default.USER).updateOne({ email: user.email }, { $set: { accountLogs: { lastSync: new Date() } } }))];
                case 9:
                    _e.sent();
                    return [2 /*return*/, resolve({
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            twoStepVerification: user.twoStepVerification,
                            message: "Login Successfully",
                        })];
                case 10: return [3 /*break*/, 12];
                case 11: return [2 /*return*/, reject({ message: "Incorrect Credentials" })];
                case 12: return [3 /*break*/, 14];
                case 13: return [2 /*return*/, reject({
                        message: "Your Account linked with any other method",
                    })];
                case 14: return [3 /*break*/, 16];
                case 15: return [2 /*return*/, reject({ message: "Incorrect Credentials" })];
                case 16: return [3 /*break*/, 18];
                case 17:
                    error_1 = _e.sent();
                    reject({
                        message: error_1.message || error_1.msg,
                        code: error_1.code || error_1.name,
                    });
                    return [3 /*break*/, 18];
                case 18: return [2 /*return*/];
            }
        });
    }); });
};
exports.doLogin = doLogin;
/**
 * @description
 */
var doSignup = function (name, email, password) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var userFound, hashedPassword, result, activationToken, URL_1, error_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!name || !email || !password)
                        return [2 /*return*/, reject({ message: "Please Provide Name, Email and Password" })];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.USER).findOne({ email: email }))];
                case 2:
                    userFound = _c.sent();
                    if (!userFound) return [3 /*break*/, 3];
                    return [2 /*return*/, reject({ message: "USER Already Exist" })];
                case 3: return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
                case 4:
                    hashedPassword = _c.sent();
                    return [4 /*yield*/, ((_b = connection_1.default
                            .get()) === null || _b === void 0 ? void 0 : _b.collection(collections_1.default.USER).insertOne({
                            name: name,
                            email: email,
                            password: hashedPassword,
                            twoStepVerification: false,
                            methods: ["Password"],
                            accountStatus: {
                                status: "Inactive",
                            },
                            accountDetails: {
                                resetPasswdAccess: false,
                                authenticator: {
                                    enable: false,
                                },
                            },
                            accountLogs: {
                                createdAt: new Date(),
                            },
                        }))];
                case 5:
                    result = _c.sent();
                    return [4 /*yield*/, jwt_1.generateJwtToken({ userId: result === null || result === void 0 ? void 0 : result.insertedId, name: name, email: email }, "ACTIVATION_TOKEN")];
                case 6:
                    activationToken = _c.sent();
                    URL_1 = "https://" + CLIENT_HOST + "/" + activationToken;
                    console.log(URL_1);
                    // await sendMail({ to: email, name: name, link: URL }, "Activate");
                    return [2 /*return*/, resolve({ message: "Activation token send to " + email })];
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_2 = _c.sent();
                    reject({
                        message: error_2.message || error_2.msg,
                        code: error_2.code || error_2.name,
                    });
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); });
};
exports.doSignup = doSignup;
/**
 * @description
 */
var linkWithPasssword = function (userId, password) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var userFound, user, hashedPassword, error_3;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!userId || !password)
                        return [2 /*return*/, reject({ message: "Please Provide Token and Password" })];
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.USER).findOne({ _id: new mongodb_1.ObjectId(userId) }))];
                case 2:
                    userFound = _e.sent();
                    if (!userFound) return [3 /*break*/, 7];
                    user = userFound;
                    if (!((_b = user.methods) === null || _b === void 0 ? void 0 : _b.includes("Password"))) return [3 /*break*/, 3];
                    return [2 /*return*/, reject({
                            message: "Your Account Already Linked With Password Method",
                        })];
                case 3: return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
                case 4:
                    hashedPassword = _e.sent();
                    (_c = user.methods) === null || _c === void 0 ? void 0 : _c.push("Password");
                    return [4 /*yield*/, ((_d = connection_1.default
                            .get()) === null || _d === void 0 ? void 0 : _d.collection(collections_1.default.USER).updateOne({ email: user.email }, {
                            $set: {
                                password: hashedPassword,
                                methods: user.methods,
                                twoStepVerification: false,
                                accountDetails: {
                                    resetPasswdAccess: false,
                                },
                            },
                        }))];
                case 5:
                    _e.sent();
                    return [2 /*return*/, resolve({
                            message: "Account Linked With Passsword Method Successfully",
                        })];
                case 6: return [3 /*break*/, 8];
                case 7: return [2 /*return*/, reject({ message: "Incorrect Credentials" })];
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_3 = _e.sent();
                    reject({
                        message: error_3.message || error_3.msg,
                        code: error_3.code || error_3.name,
                    });
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); });
};
exports.linkWithPasssword = linkWithPasssword;
/**
 * @description
 */
var googleLogin = function (googleId, token) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var payload, email, name_1, userFound, user, accountStatus, accessToken, refreshToken, result, accessToken, refreshToken, error_4;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    if (!googleId || !token)
                        return [2 /*return*/, reject({ message: "Please Provide GoogleId, Token" })];
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 19, , 20]);
                    return [4 /*yield*/, googleOAuth_1.default(token)];
                case 2:
                    payload = _g.sent();
                    if (!((payload === null || payload === void 0 ? void 0 : payload.email_verified) && (payload === null || payload === void 0 ? void 0 : payload.email) && payload.name)) return [3 /*break*/, 17];
                    email = payload.email, name_1 = payload.name;
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.USER).findOne({ $or: [{ googleId: parseInt(googleId) }, { email: email }] }))];
                case 3:
                    userFound = _g.sent();
                    if (!userFound) return [3 /*break*/, 11];
                    user = userFound;
                    accountStatus = user.accountStatus;
                    return [4 /*yield*/, checkStatus_1.default(accountStatus, user.email, collections_1.default.USER, [
                            "Blocked",
                            "Inactive",
                        ])];
                case 4:
                    _g.sent();
                    if (!((_b = user.methods) === null || _b === void 0 ? void 0 : _b.includes("Google"))) return [3 /*break*/, 9];
                    return [4 /*yield*/, ((_c = connection_1.default
                            .get()) === null || _c === void 0 ? void 0 : _c.collection(collections_1.default.USER).updateOne({ email: user.email }, { $set: { lastSync: new Date() } }))];
                case 5:
                    _g.sent();
                    return [4 /*yield*/, jwt_1.generateJwtToken({ userId: user._id, email: user.email, name: user.name }, "ACCESS_TOKEN")];
                case 6:
                    accessToken = _g.sent();
                    return [4 /*yield*/, jwt_1.generateJwtToken({ userId: user._id, email: user.email, name: user.name }, "REFRESH_TOKEN")];
                case 7:
                    refreshToken = _g.sent();
                    return [4 /*yield*/, ((_d = connection_1.default
                            .get()) === null || _d === void 0 ? void 0 : _d.collection(collections_1.default.REFRESH_TOKEN).insertOne({
                            refreshToken: refreshToken,
                            userId: new mongodb_1.ObjectId(user._id),
                        }))];
                case 8:
                    _g.sent();
                    return [2 /*return*/, resolve({
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            message: "Login Successfully",
                        })];
                case 9: return [2 /*return*/, reject({
                        message: "Your Account Already Linked With Password Method",
                    })];
                case 10: return [3 /*break*/, 16];
                case 11: return [4 /*yield*/, ((_e = connection_1.default
                        .get()) === null || _e === void 0 ? void 0 : _e.collection(collections_1.default.USER).insertOne({
                        name: name_1,
                        email: email,
                        googleId: parseInt(googleId),
                        accountStatus: {
                            status: "Active",
                        },
                        methods: ["Google"],
                        accountLogs: {
                            createdAt: new Date(),
                            lastSync: new Date(),
                        },
                    }))];
                case 12:
                    result = _g.sent();
                    return [4 /*yield*/, jwt_1.generateJwtToken({ userId: result === null || result === void 0 ? void 0 : result.insertedId, email: email, name: name_1 }, "ACCESS_TOKEN")];
                case 13:
                    accessToken = _g.sent();
                    return [4 /*yield*/, jwt_1.generateJwtToken({ userId: result === null || result === void 0 ? void 0 : result.insertedId, email: email, name: name_1 }, "REFRESH_TOKEN")];
                case 14:
                    refreshToken = _g.sent();
                    return [4 /*yield*/, ((_f = connection_1.default.get()) === null || _f === void 0 ? void 0 : _f.collection(collections_1.default.REFRESH_TOKEN).insertOne({
                            refreshToken: refreshToken,
                            userId: result === null || result === void 0 ? void 0 : result.insertedId,
                        }))];
                case 15:
                    _g.sent();
                    return [2 /*return*/, resolve({
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            message: "Account created successfully",
                        })];
                case 16: return [3 /*break*/, 18];
                case 17:
                    reject({ message: "Incorrect Credentials" });
                    _g.label = 18;
                case 18: return [3 /*break*/, 20];
                case 19:
                    error_4 = _g.sent();
                    reject({
                        message: error_4.message || error_4.msg,
                        code: error_4.code || error_4.name,
                    });
                    return [3 /*break*/, 20];
                case 20: return [2 /*return*/];
            }
        });
    }); });
};
exports.googleLogin = googleLogin;
/**
 * @description
 */
var linkWithGoogle = function (googleId, token) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var payload, email, userFound, user, error_5;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!googleId || !token)
                        return [2 /*return*/, reject({ message: "Please Provide GoogleId and Token" })];
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, googleOAuth_1.default(token)];
                case 2:
                    payload = _e.sent();
                    if (!((payload === null || payload === void 0 ? void 0 : payload.email_verified) && (payload === null || payload === void 0 ? void 0 : payload.email) && payload.name)) return [3 /*break*/, 7];
                    email = payload.email;
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.USER).findOne({
                            $or: [{ googleId: parseInt(googleId) }, { email: email }],
                        }))];
                case 3:
                    userFound = _e.sent();
                    if (!userFound) return [3 /*break*/, 6];
                    user = userFound;
                    if (!((_b = user.methods) === null || _b === void 0 ? void 0 : _b.includes("Google"))) return [3 /*break*/, 4];
                    return [2 /*return*/, reject({
                            message: "Your Account Already Linked With Google Method",
                        })];
                case 4:
                    (_c = user.methods) === null || _c === void 0 ? void 0 : _c.push("Google");
                    return [4 /*yield*/, ((_d = connection_1.default
                            .get()) === null || _d === void 0 ? void 0 : _d.collection(collections_1.default.USER).updateOne({ email: user.email }, {
                            $set: { googleId: parseInt(googleId), methods: user.methods },
                        }))];
                case 5:
                    _e.sent();
                    return [2 /*return*/, resolve({
                            message: "Account Linked With Google successfully",
                        })];
                case 6: return [3 /*break*/, 8];
                case 7: return [2 /*return*/, reject({ message: "Incorrect Credentials" })];
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_5 = _e.sent();
                    reject({
                        message: error_5.message || error_5.msg,
                        code: error_5.code || error_5.name,
                    });
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); });
};
exports.linkWithGoogle = linkWithGoogle;
/**
 * @description
 */
var unLinkWithGoogle = function (userId) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var userFound, user, error_6;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!userId)
                        return [2 /*return*/, reject({ message: "Please Provide UserId" })];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.USER).findOne({
                            _id: new mongodb_1.ObjectId(userId),
                        }))];
                case 2:
                    userFound = _d.sent();
                    if (!userFound) return [3 /*break*/, 6];
                    user = userFound;
                    if (!((_b = user.methods) === null || _b === void 0 ? void 0 : _b.includes("Google"))) return [3 /*break*/, 4];
                    user.methods.filter(function (method) { return method !== "Google"; });
                    return [4 /*yield*/, ((_c = connection_1.default
                            .get()) === null || _c === void 0 ? void 0 : _c.collection(collections_1.default.USER).updateOne({ email: user.email }, { $set: { googleId: null, methods: user.methods } }))];
                case 3:
                    _d.sent();
                    return [2 /*return*/, resolve({
                            message: "Account Unlinked With Google Successfully",
                        })];
                case 4: return [2 /*return*/, reject({ message: "Your Acount is Not Linked With Google" })];
                case 5: return [3 /*break*/, 7];
                case 6: return [2 /*return*/, reject({ message: "Incorrect Credentials" })];
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_6 = _d.sent();
                    reject({
                        message: error_6.message || error_6.msg,
                        code: error_6.code || error_6.name,
                    });
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); });
};
exports.unLinkWithGoogle = unLinkWithGoogle;
/**
 * @description
 */
var facebookLogin = function (facebookId, accessToken) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var payload, id, email, name_2, picture, profileURL, userFound, user, accountStatus, accessToken_1, refreshToken, result, accessToken_2, refreshToken, error_7;
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    if (!facebookId || !accessToken)
                        return [2 /*return*/, reject({ message: "Please Provide FacebookId and AccessToken" })];
                    _h.label = 1;
                case 1:
                    _h.trys.push([1, 17, , 18]);
                    return [4 /*yield*/, facebookOAuth_1.default(facebookId, accessToken)];
                case 2:
                    payload = _h.sent();
                    if (!payload) return [3 /*break*/, 16];
                    id = payload.id, email = payload.email, name_2 = payload.name, picture = payload.picture;
                    profileURL = (_a = picture === null || picture === void 0 ? void 0 : picture.payload) === null || _a === void 0 ? void 0 : _a.url;
                    return [4 /*yield*/, ((_b = connection_1.default
                            .get()) === null || _b === void 0 ? void 0 : _b.collection(collections_1.default.USER).findOne({
                            $or: [{ facebookId: parseInt(id) }, { email: email }],
                        }))];
                case 3:
                    userFound = _h.sent();
                    if (!userFound) return [3 /*break*/, 11];
                    user = userFound;
                    accountStatus = user.accountStatus;
                    return [4 /*yield*/, checkStatus_1.default(accountStatus, user.email, collections_1.default.USER, [
                            "Blocked",
                            "Inactive",
                        ])];
                case 4:
                    _h.sent();
                    if (!((_c = user.methods) === null || _c === void 0 ? void 0 : _c.includes("Facebook"))) return [3 /*break*/, 9];
                    return [4 /*yield*/, ((_d = connection_1.default
                            .get()) === null || _d === void 0 ? void 0 : _d.collection(collections_1.default.USER).updateOne({ email: user.email }, { $set: { lastSync: new Date() } }))];
                case 5:
                    _h.sent();
                    return [4 /*yield*/, jwt_1.generateJwtToken({ userId: user._id, email: user.email, name: user.name }, "ACCESS_TOKEN")];
                case 6:
                    accessToken_1 = _h.sent();
                    return [4 /*yield*/, jwt_1.generateJwtToken({ userId: user._id, email: user.email, name: user.name }, "ACCESS_TOKEN")];
                case 7:
                    refreshToken = _h.sent();
                    return [4 /*yield*/, ((_e = connection_1.default
                            .get()) === null || _e === void 0 ? void 0 : _e.collection(collections_1.default.REFRESH_TOKEN).insertOne({
                            refreshToken: refreshToken,
                            userId: new mongodb_1.ObjectId(user._id),
                        }))];
                case 8:
                    _h.sent();
                    return [2 /*return*/, resolve({
                            accessToken: accessToken_1,
                            refreshToken: refreshToken,
                            message: "Login Successfully",
                        })];
                case 9: return [2 /*return*/, reject({
                        message: "Your Account Already Linked With Password Method",
                    })];
                case 10: return [3 /*break*/, 16];
                case 11: return [4 /*yield*/, ((_f = connection_1.default
                        .get()) === null || _f === void 0 ? void 0 : _f.collection(collections_1.default.USER).insertOne({
                        name: name_2,
                        email: email,
                        facebookId: parseInt(id),
                        methods: ["Facebook"],
                        accountStatus: {
                            status: "Active",
                        },
                        accountLogs: {
                            createdAt: new Date(),
                            lastSync: new Date(),
                        },
                    }))];
                case 12:
                    result = _h.sent();
                    return [4 /*yield*/, jwt_1.generateJwtToken({ userId: result === null || result === void 0 ? void 0 : result.insertedId, email: email, name: name_2 }, "ACCESS_TOKEN")];
                case 13:
                    accessToken_2 = _h.sent();
                    return [4 /*yield*/, jwt_1.generateJwtToken({ userId: result === null || result === void 0 ? void 0 : result.insertedId, email: email, name: name_2 }, "REFRESH_TOKEN")];
                case 14:
                    refreshToken = _h.sent();
                    return [4 /*yield*/, ((_g = connection_1.default.get()) === null || _g === void 0 ? void 0 : _g.collection(collections_1.default.REFRESH_TOKEN).insertOne({
                            refreshToken: refreshToken,
                            userId: result === null || result === void 0 ? void 0 : result.insertedId,
                        }))];
                case 15:
                    _h.sent();
                    return [2 /*return*/, resolve({
                            accessToken: accessToken_2,
                            refreshToken: refreshToken,
                            message: "Account Created Successfully",
                        })];
                case 16: return [3 /*break*/, 18];
                case 17:
                    error_7 = _h.sent();
                    console.log(error_7.message, error_7.code);
                    reject({
                        msg: error_7.message || error_7.msg,
                        code: error_7.code || error_7.name,
                    });
                    return [3 /*break*/, 18];
                case 18: return [2 /*return*/];
            }
        });
    }); });
};
exports.facebookLogin = facebookLogin;
/**
 * @description
 */
var linkWithfacebook = function (facebookId, accessToken) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var payload, id, email, userFound, user, error_8;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!facebookId || !accessToken)
                        return [2 /*return*/, reject({ message: "Please Provide FacebookId and AccessToken" })];
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, facebookOAuth_1.default(facebookId, accessToken)];
                case 2:
                    payload = _e.sent();
                    if (!payload) return [3 /*break*/, 8];
                    id = payload.id, email = payload.email;
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.USER).findOne({
                            $or: [{ facebookId: parseInt(id) }, { email: email }],
                        }))];
                case 3:
                    userFound = _e.sent();
                    if (!userFound) return [3 /*break*/, 7];
                    user = userFound;
                    if (!((_b = user.methods) === null || _b === void 0 ? void 0 : _b.includes("Facebook"))) return [3 /*break*/, 4];
                    return [2 /*return*/, reject({
                            message: "Your Account Already Linked With Facebook",
                        })];
                case 4:
                    (_c = user.methods) === null || _c === void 0 ? void 0 : _c.push("Facebook");
                    return [4 /*yield*/, ((_d = connection_1.default
                            .get()) === null || _d === void 0 ? void 0 : _d.collection(collections_1.default.USER).updateOne({ email: user.email }, { $set: { facebookId: parseInt(id), methods: user.methods } }))];
                case 5:
                    _e.sent();
                    return [2 /*return*/, resolve({
                            message: "Account linked with facebook successfully",
                        })];
                case 6: return [3 /*break*/, 8];
                case 7: return [2 /*return*/, reject({ message: "Incorrect Credentials" })];
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_8 = _e.sent();
                    reject({
                        message: error_8.message || error_8.msg,
                        code: error_8.code || error_8.name,
                    });
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); });
};
exports.linkWithfacebook = linkWithfacebook;
/**
 * @description
 */
var unLinkWithFacebook = function (userId) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var userFound, user, error_9;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!userId)
                        return [2 /*return*/, reject({ message: "Please Provide UserId" })];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.USER).findOne({ _id: new mongodb_1.ObjectId(userId) }))];
                case 2:
                    userFound = _d.sent();
                    if (!userFound) return [3 /*break*/, 6];
                    user = userFound;
                    if (!((_b = user.methods) === null || _b === void 0 ? void 0 : _b.includes("Facebook"))) return [3 /*break*/, 4];
                    user.methods.filter(function (method) { return method !== "Facebook"; });
                    return [4 /*yield*/, ((_c = connection_1.default
                            .get()) === null || _c === void 0 ? void 0 : _c.collection(collections_1.default.USER).updateOne({ email: user.email }, { $set: { facebookId: null, methods: user.methods } }))];
                case 3:
                    _d.sent();
                    return [2 /*return*/, resolve({
                            message: "Account Unlinked With Facebook Successfully",
                        })];
                case 4: return [2 /*return*/, reject({ message: "Your Account Not Linked With Facebook" })];
                case 5: return [3 /*break*/, 7];
                case 6: return [2 /*return*/, reject({ message: "Incorret Credentials" })];
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_9 = _d.sent();
                    reject({
                        message: error_9.message || error_9.msg,
                        code: error_9.code || error_9.name,
                    });
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); });
};
exports.unLinkWithFacebook = unLinkWithFacebook;
/**
 * @description
 */
var resentActivationToken = function (email) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var userFound, user, accountStatus, activationToken, ULI, error_10;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!email)
                        return [2 /*return*/, reject({ message: "Please Provide Email" })];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.USER).findOne({
                            $or: [{ email: email }],
                        }))];
                case 2:
                    userFound = _b.sent();
                    if (!userFound) return [3 /*break*/, 7];
                    user = userFound;
                    accountStatus = user.accountStatus;
                    return [4 /*yield*/, checkStatus_1.default(accountStatus, user.email, collections_1.default.USER, [
                            "Blocked",
                            "Active",
                        ])];
                case 3:
                    _b.sent();
                    if (!(accountStatus.status === "Inactive")) return [3 /*break*/, 5];
                    return [4 /*yield*/, jwt_1.generateJwtToken({ userId: user._id, email: user.email, name: user.name }, "ACTIVATION_TOKEN")];
                case 4:
                    activationToken = _b.sent();
                    ULI = CLIENT_HOST + "/active-account/" + activationToken;
                    console.log(ULI);
                    // await sendMail({ to: user.email, name: user.name, link:ULI }, "Activate");
                    return [2 /*return*/, resolve({
                            message: "Activation Token Send Successfully in " + email,
                        })];
                case 5: return [2 /*return*/, reject({
                        message: "Resent Token has Problem so Try Again",
                    })];
                case 6: return [3 /*break*/, 8];
                case 7: return [2 /*return*/, reject({ message: "Incorrect Credentials" })];
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_10 = _b.sent();
                    reject({
                        message: error_10.message || error_10.msg,
                        code: error_10.code || error_10.name,
                    });
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); });
};
exports.resentActivationToken = resentActivationToken;
/**
 * @description
 */
var accountActivation = function (token) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var decoded, userFound, user, accountStatus, error_11;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!token)
                        return [2 /*return*/, reject({ message: "Please Provide Token" })];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 10, , 11]);
                    return [4 /*yield*/, jwt_1.verifyJwtToken(token, "ACTIVATION_TOKEN")];
                case 2:
                    decoded = _c.sent();
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.USER).findOne({
                            $or: [
                                { _id: new mongodb_1.ObjectId(decoded.userId) },
                                { email: decoded.email },
                            ],
                        }))];
                case 3:
                    userFound = _c.sent();
                    if (!userFound) return [3 /*break*/, 8];
                    user = userFound;
                    accountStatus = user.accountStatus;
                    return [4 /*yield*/, checkStatus_1.default(accountStatus, user.email, collections_1.default.USER, [
                            "Blocked",
                            "Active",
                        ])];
                case 4:
                    _c.sent();
                    if (!(accountStatus.status === "Inactive")) return [3 /*break*/, 6];
                    return [4 /*yield*/, ((_b = connection_1.default
                            .get()) === null || _b === void 0 ? void 0 : _b.collection(collections_1.default.USER).updateOne({ email: user.email }, {
                            $set: {
                                accountStatus: {
                                    status: "Active",
                                },
                            },
                        }))];
                case 5:
                    _c.sent();
                    return [2 /*return*/, resolve({ message: "Account Activated" })];
                case 6: return [2 /*return*/, reject({
                        message: "Account Activation has a Problem so Try Again Later",
                    })];
                case 7: return [3 /*break*/, 9];
                case 8: return [2 /*return*/, reject({ message: "Incorrect Credentials" })];
                case 9: return [3 /*break*/, 11];
                case 10:
                    error_11 = _c.sent();
                    reject({
                        message: error_11.message || error_11.msg,
                        code: error_11.code || error_11.name,
                    });
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    }); });
};
exports.accountActivation = accountActivation;
/**
 * @description
 */
var forgotPassword = function (email) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var userFound, user, accountStatus, resetToken, URI, error_12;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!email)
                        return [2 /*return*/, reject({ message: "Please Provide Email" })];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 10, , 11]);
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.USER).findOne({
                            $or: [{ email: email }],
                        }))];
                case 2:
                    userFound = _d.sent();
                    if (!userFound) return [3 /*break*/, 8];
                    user = userFound;
                    accountStatus = user.accountStatus;
                    return [4 /*yield*/, checkStatus_1.default(accountStatus, user.email, collections_1.default.USER, [
                            "Blocked",
                            "Inactive",
                        ])];
                case 3:
                    _d.sent();
                    if (!((_b = user.methods) === null || _b === void 0 ? void 0 : _b.includes("Password"))) return [3 /*break*/, 6];
                    return [4 /*yield*/, ((_c = connection_1.default
                            .get()) === null || _c === void 0 ? void 0 : _c.collection(collections_1.default.USER).updateOne({ email: user.email }, { $set: { accountDetails: { resetPasswdAccess: true } } }))];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, jwt_1.generateJwtToken({ userId: user._id, email: user.email, name: user.name }, "RESET_TOKEN")];
                case 5:
                    resetToken = _d.sent();
                    URI = CLIENT_HOST + "/" + resetToken;
                    console.log(URI);
                    // await sendMail(
                    //   { to: user.email, name: user.name, link:URI },
                    //   "Activate"
                    // );
                    return [2 /*return*/, resolve({
                            message: "Reset Password Link Was Send in " + user.email,
                        })];
                case 6: return [2 /*return*/, reject({
                        message: "Forget Token has Some issue.. Try Again Later",
                    })];
                case 7: return [3 /*break*/, 9];
                case 8: return [2 /*return*/, reject({ message: "Incorrect Credentials" })];
                case 9: return [3 /*break*/, 11];
                case 10:
                    error_12 = _d.sent();
                    reject({
                        message: error_12.message || error_12.msg,
                        code: error_12.code || error_12.name,
                    });
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    }); });
};
exports.forgotPassword = forgotPassword;
/**
 * @description
 */
var resetPassword = function (token, password) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var decoded, userFound, user, accountStatus, accountDetails, isMatch, hashedPassword, resetPasswdAttempt, lastResetPasswd, error_13;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!token || !password)
                        return [2 /*return*/, reject({ message: "Please Provide Token and Password" })];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 14, , 15]);
                    return [4 /*yield*/, jwt_1.verifyJwtToken(token, "RESET_TOKEN")];
                case 2:
                    decoded = _d.sent();
                    if (!(decoded === null || decoded === void 0 ? void 0 : decoded.email)) return [3 /*break*/, 13];
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.USER).findOne({
                            $or: [{ _id: new mongodb_1.ObjectId(decoded._id) }, { email: decoded.email }],
                        }))];
                case 3:
                    userFound = _d.sent();
                    if (!userFound) return [3 /*break*/, 12];
                    user = userFound;
                    accountStatus = user.accountStatus, accountDetails = user.accountDetails;
                    return [4 /*yield*/, checkStatus_1.default(accountStatus, user.email, collections_1.default.USER, [
                            "Blocked",
                        ])];
                case 4:
                    _d.sent();
                    if (!(accountDetails === null || accountDetails === void 0 ? void 0 : accountDetails.resetPasswdAccess)) return [3 /*break*/, 10];
                    return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
                case 5:
                    isMatch = _d.sent();
                    if (!isMatch) return [3 /*break*/, 6];
                    return [2 /*return*/, reject({
                            message: "New Pasword and Old Password is Same",
                        })];
                case 6: return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
                case 7:
                    hashedPassword = _d.sent();
                    resetPasswdAttempt = ((_b = accountDetails === null || accountDetails === void 0 ? void 0 : accountDetails.resetPasswdAttempt) !== null && _b !== void 0 ? _b : 0) + 1;
                    lastResetPasswd = new Date();
                    return [4 /*yield*/, ((_c = connection_1.default
                            .get()) === null || _c === void 0 ? void 0 : _c.collection(collections_1.default.USER).updateOne({ email: user.email }, {
                            $set: {
                                password: hashedPassword,
                                accountDetails: {
                                    lastPassword: user.password,
                                    resetPasswdAccess: false,
                                    resetPasswdAttempt: resetPasswdAttempt,
                                    lastResetPasswd: lastResetPasswd,
                                },
                            },
                        }))];
                case 8:
                    _d.sent();
                    return [2 /*return*/, resolve({ message: "Password Reset Successfully" })];
                case 9: return [3 /*break*/, 11];
                case 10: return [2 /*return*/, reject({ message: "Reset Password Permission Denied" })];
                case 11: return [3 /*break*/, 13];
                case 12: return [2 /*return*/, reject({ message: "Incorrect Credentials" })];
                case 13: return [3 /*break*/, 15];
                case 14:
                    error_13 = _d.sent();
                    reject({
                        message: error_13.message || error_13.msg,
                        code: error_13.code || error_13.name,
                    });
                    return [3 /*break*/, 15];
                case 15: return [2 /*return*/];
            }
        });
    }); });
};
exports.resetPassword = resetPassword;
/**
 * @description
 */
var deleteUser = function (userId, verified) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            if (!userId || !verified)
                return [2 /*return*/, reject({ message: "Please Provide UserId and Verified" })];
            try {
                if (verified) {
                    (_a = connection_1.default.get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.USER).deleteOne({ _id: new mongodb_1.ObjectId(userId) });
                    resolve({ message: "Your Account Was Deleted Successfully" });
                }
                else {
                    reject({ message: "Delete Account Access Declined" });
                }
            }
            catch (error) {
                reject({
                    message: error.message || error.msg,
                    code: error.code || error.name,
                });
            }
            return [2 /*return*/];
        });
    }); });
};
exports.deleteUser = deleteUser;
/**
 * @description
 */
var verifyPassword = function (userId, password) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var userFound, user, isMatch, error_14;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!userId || !password)
                        return [2 /*return*/, reject({ message: "Please Provide UserId and Password" })];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.USER).findOne({ _id: new mongodb_1.ObjectId(userId) }))];
                case 2:
                    userFound = _b.sent();
                    if (!userFound) return [3 /*break*/, 4];
                    user = userFound;
                    return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
                case 3:
                    isMatch = _b.sent();
                    if (isMatch) {
                        return [2 /*return*/, resolve({
                                message: "Password Verified",
                                userId: user._id,
                                verified: true,
                            })];
                    }
                    else {
                        return [2 /*return*/, reject({ message: "Incorrect Credentials" })];
                    }
                    return [3 /*break*/, 5];
                case 4: return [2 /*return*/, reject({ message: "Incorrect Credentials" })];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_14 = _b.sent();
                    reject({
                        message: error_14.message || error_14.msg,
                        code: error_14.code || error_14.name,
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); });
};
exports.verifyPassword = verifyPassword;
/**
 * @description
 */
var checkUserStatus = function (userId) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var userFound, user, accountStatus, error_15;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!userId)
                        return [2 /*return*/, reject({ message: "Please Provide UserId " })];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.USER).findOne({
                            $or: [{ _id: new mongodb_1.ObjectId(userId) }],
                        }))];
                case 2:
                    userFound = _b.sent();
                    if (!userFound) return [3 /*break*/, 4];
                    user = userFound;
                    accountStatus = user.accountStatus;
                    return [4 /*yield*/, checkStatus_1.default(accountStatus, user.email, collections_1.default.USER, [
                            "Blocked",
                            "Inactive",
                        ])];
                case 3:
                    _b.sent();
                    if (accountStatus.status === "Active") {
                        return [2 /*return*/, resolve({
                                message: "Active Account",
                                userId: user._id,
                                name: user.name,
                                email: user.email,
                                role: user.role,
                            })];
                    }
                    else {
                        return [2 /*return*/, reject({ message: "Permission Denied" })];
                    }
                    return [3 /*break*/, 5];
                case 4: return [2 /*return*/, reject({ message: "Incorrect Credentials" })];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_15 = _b.sent();
                    reject({
                        message: error_15.message || error_15.msg,
                        code: error_15.code || error_15.name,
                    });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); });
};
exports.checkUserStatus = checkUserStatus;
/**
 * @description
 */
var upgradeAccessToken = function (token) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var oldRefreshToken, attempt, decoded, accessToken, refreshToken, error_16;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!token)
                        return [2 /*return*/, reject({ message: "Please Provide Token" })];
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.REFRESH_TOKEN).findOne({ refreshToken: token }))];
                case 2:
                    oldRefreshToken = _f.sent();
                    if (!oldRefreshToken) return [3 /*break*/, 7];
                    attempt = ((_b = oldRefreshToken.attempt) !== null && _b !== void 0 ? _b : 0) + 1;
                    return [4 /*yield*/, jwt_1.verifyJwtToken(token, "REFRESH_TOKEN")];
                case 3:
                    decoded = _f.sent();
                    return [4 /*yield*/, jwt_1.generateJwtToken({
                            userId: decoded.userId,
                            email: decoded.email,
                            name: (_c = decoded.aud) === null || _c === void 0 ? void 0 : _c.toString(),
                        }, "ACCESS_TOKEN")];
                case 4:
                    accessToken = _f.sent();
                    return [4 /*yield*/, jwt_1.generateJwtToken({
                            userId: decoded.userId,
                            email: decoded.email,
                            name: (_d = decoded.aud) === null || _d === void 0 ? void 0 : _d.toString(),
                        }, "REFRESH_TOKEN")];
                case 5:
                    refreshToken = _f.sent();
                    return [4 /*yield*/, ((_e = connection_1.default
                            .get()) === null || _e === void 0 ? void 0 : _e.collection(collections_1.default.REFRESH_TOKEN).updateOne({ userId: new mongodb_1.ObjectId(decoded.userId) }, { $set: { refreshToken: refreshToken, attempt: attempt } }))];
                case 6:
                    _f.sent();
                    resolve({
                        message: "New Access Token Created",
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    });
                    return [3 /*break*/, 8];
                case 7:
                    reject({ message: "Unauthonticated Request" });
                    _f.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_16 = _f.sent();
                    reject({
                        message: error_16.message || error_16.msg,
                        code: error_16.code || error_16.name,
                    });
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); });
};
exports.upgradeAccessToken = upgradeAccessToken;
/**
 * @description
 */
var generateAuthenticator = function (userId) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var userFound, _a, secret, QRCodeURL, error_17;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!userId)
                        return [2 /*return*/, reject({ message: "Please Provide UserId" })];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, ((_b = connection_1.default
                            .get()) === null || _b === void 0 ? void 0 : _b.collection(collections_1.default.USER).findOne({ _id: new mongodb_1.ObjectId(userId) }))];
                case 2:
                    userFound = _d.sent();
                    if (!(userFound && userFound.accountDetails.authenticator.enable)) return [3 /*break*/, 3];
                    return [2 /*return*/, reject({ message: "Authenticator Already Enabled" })];
                case 3:
                    if (!(userFound && !userFound.accountDetails.authenticator.enable)) return [3 /*break*/, 6];
                    return [4 /*yield*/, authenticator_1.generateSpeakeasy()];
                case 4:
                    _a = _d.sent(), secret = _a.secret, QRCodeURL = _a.QRCodeURL;
                    return [4 /*yield*/, ((_c = connection_1.default
                            .get()) === null || _c === void 0 ? void 0 : _c.collection(collections_1.default.USER).updateOne({ _id: new mongodb_1.ObjectId(userId) }, {
                            $set: {
                                accountDetails: {
                                    authenticator: {
                                        temp_secret: secret,
                                    },
                                },
                            },
                        }))];
                case 5:
                    _d.sent();
                    resolve({ secret: secret.base32, QRCodeURL: QRCodeURL });
                    return [3 /*break*/, 7];
                case 6:
                    reject({ message: "Incorrect Credentials" });
                    _d.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_17 = _d.sent();
                    reject({
                        message: error_17.message || error_17.msg,
                        code: error_17.code || error_17.name,
                    });
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); });
};
exports.generateAuthenticator = generateAuthenticator;
/**
 * @description
 */
var verifyAuthenticator = function (userId, token) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var userFound, user, temp_secret, verified, error_18;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!userId || !token)
                        return [2 /*return*/, reject({ message: "Please Provide UserId and Token" })];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 10, , 11]);
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.USER).findOne({ _id: new mongodb_1.ObjectId(userId) }))];
                case 2:
                    userFound = _c.sent();
                    if (!(userFound && userFound.accountDetails.authenticator.enable)) return [3 /*break*/, 3];
                    return [2 /*return*/, reject({ message: "Authenticator Already Enabled" })];
                case 3:
                    if (!(userFound && !userFound.accountDetails.authenticator.enable)) return [3 /*break*/, 8];
                    user = userFound;
                    temp_secret = user.accountDetails.authenticator.temp_secret;
                    return [4 /*yield*/, authenticator_1.verifySpeakeasy(token, temp_secret)];
                case 4:
                    verified = _c.sent();
                    if (!verified) return [3 /*break*/, 6];
                    return [4 /*yield*/, ((_b = connection_1.default
                            .get()) === null || _b === void 0 ? void 0 : _b.collection(collections_1.default.USER).updateOne({ _id: new mongodb_1.ObjectId(userId) }, {
                            $set: {
                                accountDetails: {
                                    authenticator: {
                                        enable: true,
                                        secret: temp_secret,
                                    },
                                },
                            },
                        }))];
                case 5:
                    _c.sent();
                    return [2 /*return*/, resolve({
                            message: "Authenticator Registered Successfully",
                            verified: verified,
                        })];
                case 6: return [2 /*return*/, reject({
                        message: "Authenticator Verification Failed",
                    })];
                case 7: return [3 /*break*/, 9];
                case 8:
                    reject({
                        message: "Incorrect Credentials",
                    });
                    _c.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    error_18 = _c.sent();
                    reject({
                        message: error_18.message || error_18.msg,
                        code: error_18.code || error_18.name,
                    });
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    }); });
};
exports.verifyAuthenticator = verifyAuthenticator;
/**
 * @description
 */
var validateAuthenticator = function (userId, token) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var userFound, user, secret, verified, error_19;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!userId || !token)
                        return [2 /*return*/, reject({ message: "Please Provide UserId and Token" })];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.USER).findOne({ _id: new mongodb_1.ObjectId(userId) }))];
                case 2:
                    userFound = _b.sent();
                    if (!(userFound && !userFound.accountDetails.authenticator.enable)) return [3 /*break*/, 3];
                    return [2 /*return*/, reject({ message: "Authenticator Already Disabled" })];
                case 3:
                    if (!(userFound && userFound.accountDetails.authenticator.enable)) return [3 /*break*/, 5];
                    user = userFound;
                    secret = user.accountDetails.authenticator.secret;
                    return [4 /*yield*/, authenticator_1.verifySpeakeasy(token, secret)];
                case 4:
                    verified = _b.sent();
                    if (verified) {
                        return [2 /*return*/, resolve({
                                message: "Authenticator Access Granded",
                                verified: verified,
                            })];
                    }
                    else {
                        return [2 /*return*/, reject({
                                message: "Authenticator Access Denied",
                            })];
                    }
                    return [3 /*break*/, 6];
                case 5:
                    reject({
                        message: "Incorrect Credentials",
                    });
                    _b.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_19 = _b.sent();
                    reject({
                        message: error_19.message || error_19.msg,
                        code: error_19.code || error_19.name,
                    });
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); });
};
exports.validateAuthenticator = validateAuthenticator;
/**
 * @description
 */
var disableAuthenticator = function (userId) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var userFound, error_20;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!userId)
                        return [2 /*return*/, reject({ message: "Please Provide UserId" })];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.USER).findOne({ _id: new mongodb_1.ObjectId(userId) }))];
                case 2:
                    userFound = _c.sent();
                    if (!(userFound && !userFound.accountDetails.authenticator.enable)) return [3 /*break*/, 3];
                    return [2 /*return*/, reject({
                            message: "Authenticator Already Denied",
                        })];
                case 3:
                    if (!(userFound && userFound.accountDetails.authenticator.enable)) return [3 /*break*/, 5];
                    return [4 /*yield*/, ((_b = connection_1.default
                            .get()) === null || _b === void 0 ? void 0 : _b.collection(collections_1.default.USER).updateOne({ _id: new mongodb_1.ObjectId(userId) }, {
                            $set: {
                                accountDetails: {
                                    authenticator: {
                                        enable: false,
                                    },
                                },
                            },
                        }))];
                case 4:
                    _c.sent();
                    return [2 /*return*/, resolve({
                            message: "Authenticator Disabled",
                        })];
                case 5:
                    reject({
                        message: "Incorrect Credentials",
                    });
                    _c.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_20 = _c.sent();
                    reject({
                        message: error_20.message || error_20.msg,
                        code: error_20.code || error_20.name,
                    });
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); });
};
exports.disableAuthenticator = disableAuthenticator;
