"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.verifySuperAdmin = exports.verifyAdmin = exports.verifyUser = exports.verifyLogin = void 0;
var jwt_1 = require("../functions/jwt");
var errorResponse_1 = __importDefault(require("../classes/errorResponse"));
var userAuthHelper = __importStar(require("../helpers/userAuthHelper"));
var adminAuthHelper = __importStar(require("../helpers/adminAuthHelper"));
var verifyLogin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var AccessToken, token, decoded, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                AccessToken = req.cookies.AccessToken;
                if (!AccessToken) return [3 /*break*/, 4];
                token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                if (!token) return [3 /*break*/, 2];
                return [4 /*yield*/, jwt_1.verifyJwtToken(token, "ACCESS_TOKEN")];
            case 1:
                decoded = _b.sent();
                userAuthHelper
                    .checkUserStatus(decoded.userId)
                    .then(function (res) {
                    req.user = {
                        userId: res.userId,
                        email: res.email,
                        name: res.name,
                        role: res.role,
                    };
                    next();
                })
                    .catch(function (error) {
                    return next(new errorResponse_1.default(error.message, 401, error.code));
                });
                return [3 /*break*/, 3];
            case 2: return [2 /*return*/, next(new errorResponse_1.default("Unauthonticated Request", 401))];
            case 3: return [3 /*break*/, 5];
            case 4: return [2 /*return*/, next(new errorResponse_1.default("Access Token Not Found", 401))];
            case 5: return [3 /*break*/, 7];
            case 6:
                error_1 = _b.sent();
                return [2 /*return*/, next(new errorResponse_1.default("Unauthonticated Request", 401))];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.verifyLogin = verifyLogin;
var verifyUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var AccessToken, token, decoded, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                AccessToken = req.cookies.AccessToken;
                if (!AccessToken) return [3 /*break*/, 4];
                token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                if (!token) return [3 /*break*/, 2];
                return [4 /*yield*/, jwt_1.verifyJwtToken(token, "ACCESS_TOKEN")];
            case 1:
                decoded = _b.sent();
                console.log(decoded);
                userAuthHelper
                    .checkUserStatus(decoded.userId)
                    .then(function (res) {
                    req.user = {
                        userId: res.userId,
                        email: res.email,
                        name: res.name,
                        role: res.role,
                    };
                    next();
                })
                    .catch(function (error) {
                    return next(new errorResponse_1.default(error.message, 401, error.code));
                });
                return [3 /*break*/, 3];
            case 2: return [2 /*return*/, next(new errorResponse_1.default("Unauthonticated request", 401))];
            case 3: return [3 /*break*/, 5];
            case 4: return [2 /*return*/, next(new errorResponse_1.default("Access Token Not Found", 401))];
            case 5: return [3 /*break*/, 7];
            case 6:
                error_2 = _b.sent();
                return [2 /*return*/, next(new errorResponse_1.default("Unauthonticated request", 401))];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.verifyUser = verifyUser;
var verifyAdmin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var AccessToken, token, decoded, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                AccessToken = req.cookies.AccessToken;
                if (!AccessToken) return [3 /*break*/, 4];
                token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                if (!token) return [3 /*break*/, 2];
                return [4 /*yield*/, jwt_1.verifyJwtToken(token, "ACCESS_TOKEN")];
            case 1:
                decoded = _b.sent();
                console.log(decoded);
                adminAuthHelper
                    .checkAdminStatus(decoded.adminId, "ADMIN")
                    .then(function (res) {
                    req.admin = {
                        adminId: res.adminId,
                        name: res.name,
                        email: res.email,
                        role: res.role,
                    };
                    next();
                })
                    .catch(function (error) {
                    return next(new errorResponse_1.default(error.message, 401, error.code));
                });
                return [3 /*break*/, 3];
            case 2: return [2 /*return*/, next(new errorResponse_1.default("Unauthonticated Request", 401))];
            case 3: return [3 /*break*/, 5];
            case 4: return [2 /*return*/, next(new errorResponse_1.default("Access Token Not Found", 401))];
            case 5: return [3 /*break*/, 7];
            case 6:
                error_3 = _b.sent();
                return [2 /*return*/, next(new errorResponse_1.default(error_3.message || error_3.msg || "Unauthonticated Request", 401, error_3.code || error_3.name))];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.verifyAdmin = verifyAdmin;
var verifySuperAdmin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var AccessToken, token, decoded, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                AccessToken = req.cookies.AccessToken;
                if (!AccessToken) return [3 /*break*/, 4];
                token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                if (!token) return [3 /*break*/, 2];
                return [4 /*yield*/, jwt_1.verifyJwtToken(token, "ACCESS_TOKEN")];
            case 1:
                decoded = _b.sent();
                adminAuthHelper
                    .checkAdminStatus(decoded.adminId, "SUPER_ADMIN")
                    .then(function (res) {
                    req.admin = {
                        adminId: res.adminId,
                        name: res.name,
                        email: res.email,
                        role: res.role,
                    };
                    next();
                })
                    .catch(function (error) {
                    return next(new errorResponse_1.default(error.message, 401, error.code));
                });
                return [3 /*break*/, 3];
            case 2: return [2 /*return*/, next(new errorResponse_1.default("Unauthonticated Request", 401))];
            case 3: return [3 /*break*/, 5];
            case 4: return [2 /*return*/, next(new errorResponse_1.default("Access Token Not Found", 401))];
            case 5: return [3 /*break*/, 7];
            case 6:
                error_4 = _b.sent();
                return [2 /*return*/, next(new errorResponse_1.default(error_4.message || error_4.msg || "Unauthonticated Request", error_4.code || 401))];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.verifySuperAdmin = verifySuperAdmin;
