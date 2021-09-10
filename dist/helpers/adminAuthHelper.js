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
exports.disableAuthenticator = exports.validateAuthenticator = exports.verifyAuthenticator = exports.generateAuthenticator = exports.upgradeAccessToken = exports.checkAdminStatus = exports.verifyPassword = exports.resetPassword = exports.accountActivation = exports.viewUsers = exports.viewAdmins = exports.addAdmin = exports.adminLogin = void 0;
/* Installed Imported Modules */
var bcryptjs_1 = __importDefault(require("bcryptjs"));
/* Custom Imported Modules */
var connection_1 = __importDefault(require("../config/connection"));
var collections_1 = __importDefault(require("../config/collections"));
var jwt_1 = require("../functions/jwt");
var checkStatus_1 = __importDefault(require("../functions/checkStatus"));
var mongodb_1 = require("mongodb");
var default_1 = require("../functions/default");
var authenticator_1 = require("../functions/authenticator");
/**
 * @description Login for existing User
 */
var adminLogin = function (email, password) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var adminFound, admin, accountStatus, isMatch, accessToken, refreshToken, error_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!email || !password)
                        return [2 /*return*/, reject({ message: "Please Provide Email and Password" })];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 16, , 17]);
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.ADMIN).findOne({ email: email }))];
                case 2:
                    adminFound = _d.sent();
                    if (!adminFound) return [3 /*break*/, 14];
                    admin = adminFound;
                    accountStatus = admin.accountStatus;
                    if (!(admin.role === "ADMIN" && accountStatus)) return [3 /*break*/, 4];
                    return [4 /*yield*/, checkStatus_1.default(accountStatus, admin.email, collections_1.default.ADMIN, [
                            "Blocked",
                            "Inactive",
                        ])];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4:
                    if (!(admin.role === "ADMIN" || admin.role === "SUPER_ADMIN")) return [3 /*break*/, 12];
                    return [4 /*yield*/, bcryptjs_1.default.compare(password, admin.password)];
                case 5:
                    isMatch = _d.sent();
                    if (!isMatch) return [3 /*break*/, 10];
                    return [4 /*yield*/, jwt_1.generateJwtToken({ adminId: admin._id, email: admin.email, name: admin.name }, "ACCESS_TOKEN")];
                case 6:
                    accessToken = _d.sent();
                    return [4 /*yield*/, jwt_1.generateJwtToken({ adminId: admin._id, email: admin.email, name: admin.name }, "REFRESH_TOKEN")];
                case 7:
                    refreshToken = _d.sent();
                    return [4 /*yield*/, ((_b = connection_1.default
                            .get()) === null || _b === void 0 ? void 0 : _b.collection(collections_1.default.REFRESH_TOKEN).insertOne({
                            refreshToken: refreshToken,
                            adminId: new mongodb_1.ObjectId(admin._id),
                            attempt: 0,
                        }))];
                case 8:
                    _d.sent();
                    return [4 /*yield*/, ((_c = connection_1.default
                            .get()) === null || _c === void 0 ? void 0 : _c.collection(collections_1.default.ADMIN).updateOne({ email: admin.email }, { $set: { accountLogs: { lastSync: new Date() } } }))];
                case 9:
                    _d.sent();
                    return [2 /*return*/, resolve({
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            twoStepVerification: admin.twoStepVerification,
                            message: "Login Successfully",
                        })];
                case 10: return [2 /*return*/, reject({ message: "Incorrect credentials" })];
                case 11: return [3 /*break*/, 13];
                case 12: return [2 /*return*/, reject({ message: "Permission Denied" })];
                case 13: return [3 /*break*/, 15];
                case 14: return [2 /*return*/, reject({ message: "Incorrect Email" })];
                case 15: return [3 /*break*/, 17];
                case 16:
                    error_1 = _d.sent();
                    reject({
                        message: error_1.message || error_1.msg,
                        code: error_1.code || error_1.name,
                    });
                    return [3 /*break*/, 17];
                case 17: return [2 /*return*/];
            }
        });
    }); });
};
exports.adminLogin = adminLogin;
/**
 * @description
 */
var addAdmin = function (name, email, mobile) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var adminFound, password, hashedPassword, result, activationToken, error_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!name || !email || !mobile)
                        return [2 /*return*/, reject({ message: "Please Provide Name And Email" })];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.ADMIN).findOne({ $or: [{ email: email, mobile: mobile }] }))];
                case 2:
                    adminFound = _c.sent();
                    if (!adminFound) return [3 /*break*/, 3];
                    return [2 /*return*/, reject({ message: "USER Already Exist" })];
                case 3: return [4 /*yield*/, default_1.generatePassword()];
                case 4:
                    password = _c.sent();
                    return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
                case 5:
                    hashedPassword = _c.sent();
                    return [4 /*yield*/, ((_b = connection_1.default
                            .get()) === null || _b === void 0 ? void 0 : _b.collection(collections_1.default.ADMIN).insertOne({
                            name: name,
                            email: email,
                            password: hashedPassword,
                            role: "ADMIN",
                            mobile: mobile,
                            twoStepVerification: false,
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
                case 6:
                    result = _c.sent();
                    return [4 /*yield*/, jwt_1.generateJwtToken({ userId: result === null || result === void 0 ? void 0 : result.insertedId, name: name, email: email }, "ACTIVATION_TOKEN")];
                case 7:
                    activationToken = _c.sent();
                    // const URL = `https://${CLIENT_HOST}/${activationToken}`;
                    console.log(activationToken);
                    // await sendMail({ to: email, name: name, link: URL }, "Activate");
                    return [2 /*return*/, resolve({ message: "Activation token send to " + email })];
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_2 = _c.sent();
                    reject({
                        message: error_2.message || error_2.msg,
                        code: error_2.code || error_2.name,
                    });
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); });
};
exports.addAdmin = addAdmin;
/**
 * @description
 */
var viewAdmins = function () {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var adminFound, error_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.ADMIN).find().toArray())];
                case 1:
                    adminFound = _b.sent();
                    if (adminFound && adminFound.length > 0) {
                        return [2 /*return*/, resolve(adminFound)];
                    }
                    else {
                        return [2 /*return*/, reject({ message: "Admin Empty" })];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _b.sent();
                    reject({
                        message: error_3.message || error_3.msg,
                        code: error_3.code || error_3.name,
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
};
exports.viewAdmins = viewAdmins;
/**
 * @description
 */
var viewUsers = function () {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var userFound, error_4;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.USER).find({ name: 1, email: 1, accountStatus: 1 }))];
                case 1:
                    userFound = _b.sent();
                    if (userFound) {
                        return [2 /*return*/, resolve(userFound)];
                    }
                    else {
                        return [2 /*return*/, reject({ message: "User Empty" })];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _b.sent();
                    reject({
                        message: error_4.message || error_4.msg,
                        code: error_4.code || error_4.name,
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
};
exports.viewUsers = viewUsers;
/**
 * @description
 */
var accountActivation = function (token, password) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var decoded, adminFound, admin, accountStatus, hashedPassword, error_5;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!token)
                        return [2 /*return*/, reject({ message: "Please Provide Token" })];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 11, , 12]);
                    return [4 /*yield*/, jwt_1.verifyJwtToken(token, "ACTIVATION_TOKEN")];
                case 2:
                    decoded = _c.sent();
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.ADMIN).findOne({
                            $or: [
                                { _id: new mongodb_1.ObjectId(decoded.adminId) },
                                { email: decoded.email },
                            ],
                        }))];
                case 3:
                    adminFound = _c.sent();
                    if (!adminFound) return [3 /*break*/, 9];
                    admin = adminFound;
                    if (admin.role === "SUPER_ADMIN") {
                        return [2 /*return*/, reject({ message: "Only Admin route" })];
                    }
                    accountStatus = admin.accountStatus;
                    return [4 /*yield*/, checkStatus_1.default(accountStatus, admin.email, collections_1.default.ADMIN, [
                            "Blocked",
                            "Active",
                        ])];
                case 4:
                    _c.sent();
                    if (!(accountStatus.status === "Inactive")) return [3 /*break*/, 7];
                    return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
                case 5:
                    hashedPassword = _c.sent();
                    return [4 /*yield*/, ((_b = connection_1.default
                            .get()) === null || _b === void 0 ? void 0 : _b.collection(collections_1.default.ADMIN).updateOne({ email: admin.email }, {
                            $set: {
                                password: hashedPassword,
                                accountStatus: {
                                    status: "Active",
                                },
                            },
                        }))];
                case 6:
                    _c.sent();
                    return [2 /*return*/, resolve({ message: "Account Activated" })];
                case 7: return [2 /*return*/, reject({
                        message: "Account Activation has a Problem so Try Again Later",
                    })];
                case 8: return [3 /*break*/, 10];
                case 9: return [2 /*return*/, reject({ message: "Incorrect Credentials" })];
                case 10: return [3 /*break*/, 12];
                case 11:
                    error_5 = _c.sent();
                    reject({
                        message: error_5.message || error_5.msg,
                        code: error_5.code || error_5.name,
                    });
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    }); });
};
exports.accountActivation = accountActivation;
/**
 * @description
 */
var resetPassword = function (token, password) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var decoded, adminFound, admin, accountStatus, accountDetails, isMatch, hashedPassword, resetPasswdAttempt, lastResetPasswd, error_6;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!token || !password)
                        return [2 /*return*/, reject({ message: "Please Provide Token and Password" })];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 15, , 16]);
                    return [4 /*yield*/, jwt_1.verifyJwtToken(token, "RESET_TOKEN")];
                case 2:
                    decoded = _c.sent();
                    if (!decoded.aud) return [3 /*break*/, 14];
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.ADMIN).findOne({
                            $or: [{ _id: new mongodb_1.ObjectId(decoded._id) }, { email: decoded.email }],
                        }))];
                case 3:
                    adminFound = _c.sent();
                    if (!(adminFound && adminFound.length > 0)) return [3 /*break*/, 13];
                    admin = adminFound[0];
                    accountStatus = admin.accountStatus, accountDetails = admin.accountDetails;
                    if (!(admin.role === "ADMIN" && accountStatus)) return [3 /*break*/, 5];
                    return [4 /*yield*/, checkStatus_1.default(accountStatus, admin.email, collections_1.default.ADMIN, [
                            "Blocked",
                            "Inactive",
                        ])];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5:
                    if (!accountDetails.resetPasswdAccess) return [3 /*break*/, 11];
                    return [4 /*yield*/, bcryptjs_1.default.compare(password, admin.password)];
                case 6:
                    isMatch = _c.sent();
                    if (!isMatch) return [3 /*break*/, 7];
                    return [2 /*return*/, reject({
                            message: "New Pasword and Old Password is Same",
                        })];
                case 7: return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
                case 8:
                    hashedPassword = _c.sent();
                    resetPasswdAttempt = (accountDetails.resetPasswdAttempt || 0) + 1;
                    lastResetPasswd = new Date();
                    return [4 /*yield*/, ((_b = connection_1.default
                            .get()) === null || _b === void 0 ? void 0 : _b.collection(collections_1.default.ADMIN).updateOne({ email: admin.email }, {
                            $set: {
                                password: hashedPassword,
                                accountDetails: {
                                    resetPasswdAccess: false,
                                    lastPassword: admin.password,
                                    resetPasswdAttempt: resetPasswdAttempt,
                                    lastResetPasswd: lastResetPasswd,
                                },
                            },
                        }))];
                case 9:
                    _c.sent();
                    return [2 /*return*/, resolve({ message: "Password Reset Successfully" })];
                case 10: return [3 /*break*/, 12];
                case 11: return [2 /*return*/, reject({
                        message: "Reset Password Permission Denied",
                    })];
                case 12: return [3 /*break*/, 14];
                case 13: return [2 /*return*/, reject({ message: "Incorrect Credentials" })];
                case 14: return [3 /*break*/, 16];
                case 15:
                    error_6 = _c.sent();
                    reject({
                        message: error_6.message || error_6.msg,
                        code: error_6.code || error_6.name,
                    });
                    return [3 /*break*/, 16];
                case 16: return [2 /*return*/];
            }
        });
    }); });
};
exports.resetPassword = resetPassword;
/**
 * @description
 */
var verifyPassword = function (adminId, password) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var adminFound, admin, isMatch, error_7;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!adminId || !password)
                        return [2 /*return*/, reject({ message: "Please Provide AdminId and Password" })];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.ADMIN).findOne({ _id: new mongodb_1.ObjectId(adminId) }))];
                case 2:
                    adminFound = _b.sent();
                    if (!adminFound) return [3 /*break*/, 4];
                    admin = adminFound;
                    return [4 /*yield*/, bcryptjs_1.default.compare(password, admin.password)];
                case 3:
                    isMatch = _b.sent();
                    if (isMatch) {
                        return [2 /*return*/, resolve({
                                message: "Password Verified",
                                adminId: admin._id,
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
                    error_7 = _b.sent();
                    reject({
                        message: error_7.message || error_7.msg,
                        code: error_7.code || error_7.name,
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
var checkAdminStatus = function (adminId, role) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var adminFound, admin, accountStatus, error_8;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!adminId)
                        return [2 /*return*/, reject({ message: "Please Provide AdminId" })];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.ADMIN).findOne({ _id: new mongodb_1.ObjectId(adminId) }))];
                case 2:
                    adminFound = _b.sent();
                    if (!adminFound) return [3 /*break*/, 5];
                    admin = adminFound;
                    accountStatus = admin.accountStatus;
                    if (!(admin.role === "ADMIN" && accountStatus)) return [3 /*break*/, 4];
                    return [4 /*yield*/, checkStatus_1.default(accountStatus, admin.email, collections_1.default.ADMIN, [
                            "Blocked",
                            "Inactive",
                        ])];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    if (role === "ADMIN") {
                        if (admin.role === "ADMIN" || admin.role === "SUPER_ADMIN") {
                            return [2 /*return*/, resolve({
                                    message: "Access Granded",
                                    adminId: admin._id,
                                    name: admin.name,
                                    email: admin.email,
                                    role: admin.role,
                                })];
                        }
                        else {
                            return [2 /*return*/, reject({ message: "Permission Denied" })];
                        }
                    }
                    else if (role === "SUPER_ADMIN") {
                        if (admin.role === "SUPER_ADMIN") {
                            return [2 /*return*/, resolve({
                                    message: "Access Granded",
                                    adminId: admin._id,
                                    name: admin.name,
                                    email: admin.email,
                                    role: admin.role,
                                })];
                        }
                        else {
                            return [2 /*return*/, reject({ message: "Permission Denied" })];
                        }
                    }
                    else {
                        return [2 /*return*/, reject({ message: "Permission Denied" })];
                    }
                    return [3 /*break*/, 6];
                case 5: return [2 /*return*/, reject({ message: "Incorrect Cridentials" })];
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_8 = _b.sent();
                    reject({
                        message: error_8.message || error_8.msg,
                        code: error_8.code || error_8.name,
                    });
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); });
};
exports.checkAdminStatus = checkAdminStatus;
/**
 * @description
 */
var upgradeAccessToken = function (token) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var oldRefreshToken, attempt, decoded, accessToken, refreshToken, error_9;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!token)
                        return [2 /*return*/, reject({ message: "Please Provide a Token" })];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.REFRESH_TOKEN).findOne({ refreshToken: token }))];
                case 2:
                    oldRefreshToken = _d.sent();
                    if (!oldRefreshToken) return [3 /*break*/, 7];
                    attempt = ((_b = oldRefreshToken.attempt) !== null && _b !== void 0 ? _b : 0) + 1;
                    return [4 /*yield*/, jwt_1.verifyJwtToken(token, "REFRESH_TOKEN")];
                case 3:
                    decoded = _d.sent();
                    return [4 /*yield*/, jwt_1.generateJwtToken({
                            adminId: decoded.adminId,
                            email: decoded.email,
                            name: decoded.name,
                        }, "ACCESS_TOKEN")];
                case 4:
                    accessToken = _d.sent();
                    return [4 /*yield*/, jwt_1.generateJwtToken({
                            adminId: decoded.adminId,
                            email: decoded.email,
                            name: decoded.name,
                        }, "REFRESH_TOKEN")];
                case 5:
                    refreshToken = _d.sent();
                    return [4 /*yield*/, ((_c = connection_1.default
                            .get()) === null || _c === void 0 ? void 0 : _c.collection(collections_1.default.REFRESH_TOKEN).updateOne({ adminId: new mongodb_1.ObjectId(decoded.adminId) }, { $set: { refreshToken: refreshToken, attempt: attempt } }))];
                case 6:
                    _d.sent();
                    resolve({
                        message: "New Access Token Created",
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    });
                    return [3 /*break*/, 8];
                case 7:
                    reject({ message: "Unauthonticated Request" });
                    _d.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_9 = _d.sent();
                    reject({
                        message: error_9.message || error_9.msg,
                        code: error_9.code || error_9.name,
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
var generateAuthenticator = function (adminId) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var adminFound, _a, secret, QRCodeURL, error_10;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!adminId)
                        return [2 /*return*/, reject({ message: "Please Provide AdminId" })];
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, ((_b = connection_1.default
                            .get()) === null || _b === void 0 ? void 0 : _b.collection(collections_1.default.ADMIN).findOne({ _id: new mongodb_1.ObjectId(adminId) }))];
                case 2:
                    adminFound = _d.sent();
                    if (!(adminFound && adminFound.accountDetails.authenticator.enable)) return [3 /*break*/, 3];
                    return [2 /*return*/, reject({ message: "Authenticator Already Enabled" })];
                case 3:
                    if (!(adminFound && !adminFound.accountDetails.authenticator.enable)) return [3 /*break*/, 6];
                    return [4 /*yield*/, authenticator_1.generateSpeakeasy()];
                case 4:
                    _a = _d.sent(), secret = _a.secret, QRCodeURL = _a.QRCodeURL;
                    return [4 /*yield*/, ((_c = connection_1.default
                            .get()) === null || _c === void 0 ? void 0 : _c.collection(collections_1.default.ADMIN).updateOne({ _id: new mongodb_1.ObjectId(adminId) }, {
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
                    error_10 = _d.sent();
                    reject({
                        message: error_10.message || error_10.msg,
                        code: error_10.code || error_10.name,
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
var verifyAuthenticator = function (adminId, token) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var adminFound, admin, temp_secret, verified, error_11;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!adminId || !token)
                        return [2 /*return*/, reject({ message: "Please Provide AdminId and Token" })];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 10, , 11]);
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.ADMIN).findOne({ _id: new mongodb_1.ObjectId(adminId) }))];
                case 2:
                    adminFound = _c.sent();
                    if (!(adminFound && adminFound.accountDetails.authenticator.enable)) return [3 /*break*/, 3];
                    return [2 /*return*/, reject({ message: "Authenticator Already Enabled" })];
                case 3:
                    if (!(adminFound &&
                        !adminFound.accountDetails.authenticator.enable)) return [3 /*break*/, 8];
                    admin = adminFound;
                    temp_secret = admin.accountDetails.authenticator.temp_secret;
                    return [4 /*yield*/, authenticator_1.verifySpeakeasy(token, temp_secret)];
                case 4:
                    verified = _c.sent();
                    if (!verified) return [3 /*break*/, 6];
                    return [4 /*yield*/, ((_b = connection_1.default
                            .get()) === null || _b === void 0 ? void 0 : _b.collection(collections_1.default.ADMIN).updateOne({ _id: new mongodb_1.ObjectId(adminId) }, {
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
exports.verifyAuthenticator = verifyAuthenticator;
/**
 * @description
 */
var validateAuthenticator = function (adminId, token) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var adminFound, admin, verified, error_12;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!adminId || !token)
                        return [2 /*return*/, reject({ message: "Please Provide AdminId and Token" })];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.ADMIN).findOne({ _id: new mongodb_1.ObjectId(adminId) }))];
                case 2:
                    adminFound = _b.sent();
                    if (!(adminFound && !adminFound.accountDetails.authenticator.enable)) return [3 /*break*/, 3];
                    return [2 /*return*/, reject({ message: "Authenticator Already Disabled" })];
                case 3:
                    if (!(adminFound && adminFound.accountDetails.authenticator.enable)) return [3 /*break*/, 5];
                    admin = adminFound;
                    return [4 /*yield*/, authenticator_1.verifySpeakeasy(token, admin.accountDetails.authenticator.secret)];
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
                    error_12 = _b.sent();
                    reject({
                        message: error_12.message || error_12.msg,
                        code: error_12.code || error_12.name,
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
var disableAuthenticator = function (adminId) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var adminFound, error_13;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!adminId)
                        return [2 /*return*/, reject({ message: "Please Provide AdminId" })];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, ((_a = connection_1.default
                            .get()) === null || _a === void 0 ? void 0 : _a.collection(collections_1.default.ADMIN).findOne({ _id: new mongodb_1.ObjectId(adminId) }))];
                case 2:
                    adminFound = _c.sent();
                    if (!(adminFound && !adminFound.accountDetails.authenticator.enable)) return [3 /*break*/, 3];
                    return [2 /*return*/, reject({
                            message: "Authenticator Already Denied",
                        })];
                case 3:
                    if (!(adminFound && adminFound.accountDetails.authenticator.enable)) return [3 /*break*/, 5];
                    return [4 /*yield*/, ((_b = connection_1.default
                            .get()) === null || _b === void 0 ? void 0 : _b.collection(collections_1.default.ADMIN).updateOne({ _id: new mongodb_1.ObjectId(adminId) }, {
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
                    error_13 = _c.sent();
                    reject({
                        message: error_13.message || error_13.msg,
                        code: error_13.code || error_13.name,
                    });
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); });
};
exports.disableAuthenticator = disableAuthenticator;
