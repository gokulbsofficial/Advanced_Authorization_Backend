"use strict";
/* Installed Imported Modules */
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
exports.disableAuthenticator = exports.validateAuthenticator = exports.verifyAuthenticator = exports.generateAuthenticator = exports.upgradeAccessToken = exports.deleteAccount = exports.resetPassword = exports.forgetPassword = exports.unLinkFacebook = exports.linkFacebook = exports.facebookLogin = exports.unLinkGoogle = exports.linkGoogle = exports.googleLogin = exports.linkPassword = exports.resentActivationToken = exports.accountActivation = exports.doLogin = exports.doSignup = void 0;
var authHelper = __importStar(require("../helpers/userAuthHelper"));
var errorResponse_1 = __importDefault(require("../classes/errorResponse"));
var cookie_1 = __importDefault(require("../functions/cookie"));
/**
 * Signup for new users
 *
 * @method "POST"
 * @access "PUBLIC"
 */
var doSignup = function (req, res, next) {
    var _a = req.body, name = _a.name, email = _a.email, password = _a.password;
    authHelper
        .doSignup(name, email, password)
        .then(function (response) {
        res.status(200).json({ success: true, message: response.message });
    })
        .catch(function (error) {
        return next(new errorResponse_1.default(error.message, 402, error.code));
    });
};
exports.doSignup = doSignup;
/**
 * Login for existing users
 *
 * @method "POST"
 * @access "PUBLIC"
 */
var doLogin = function (req, res, next) {
    var _a = req.body, email = _a.email, password = _a.password;
    authHelper
        .doLogin(email, password)
        .then(function (response) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!((response === null || response === void 0 ? void 0 : response.accessToken) && (response === null || response === void 0 ? void 0 : response.refreshToken))) return [3 /*break*/, 3];
                    return [4 /*yield*/, cookie_1.default("AccessToken", response.accessToken, res)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, cookie_1.default("RefreshToken", response.refreshToken, res)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    console.log(res.setHeader);
                    res.status(200).json({
                        success: true,
                        message: response.message,
                        twoStepVerification: response.twoStepVerification,
                        userId: response === null || response === void 0 ? void 0 : response.userId,
                    });
                    return [2 /*return*/];
            }
        });
    }); })
        .catch(function (error) {
        return next(new errorResponse_1.default(error.message, 402, error.code));
    });
};
exports.doLogin = doLogin;
/**
 * Activate new users account
 *
 * @method "POST"
 * @access "PUBLIC"
 */
var accountActivation = function (req, res, next) {
    var token = req.body.token;
    authHelper
        .accountActivation(token)
        .then(function (response) {
        res.status(200).json({ success: true, message: response.message });
    })
        .catch(function (error) {
        return next(new errorResponse_1.default(error.message, 402, error.code));
    });
};
exports.accountActivation = accountActivation;
/**
 * Resent Activation Token
 *
 * @method "GET"
 * @access "PUBLIC"
 */
var resentActivationToken = function (req, res, next) {
    var email = req.body.email;
    authHelper
        .resentActivationToken(email)
        .then(function (response) {
        res.status(200).json({ success: true, message: response.message });
    })
        .catch(function (error) {
        return next(new errorResponse_1.default(error.message, 402, error.code));
    });
};
exports.resentActivationToken = resentActivationToken;
/**
 * Linking with password account
 *
 * @method "POST"
 * @access "PRIVATE"
 */
var linkPassword = function (req, res, next) {
    var _a;
    var userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    var password = req.body.password;
    authHelper
        .linkWithPasssword(userId, password)
        .then(function (response) {
        res.status(200).json({ success: true, message: response.message });
    })
        .catch(function (error) {
        return next(new errorResponse_1.default(error.message, 402, error.code));
    });
};
exports.linkPassword = linkPassword;
/**
 * Login for existing users or create new account
 *
 * @method "POST"
 * @access "PUBLIC"
 */
var googleLogin = function (req, res, next) {
    var token = req.body.token;
    var googleId = req.body.googleId;
    authHelper
        .googleLogin(googleId, token)
        .then(function (response) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cookie_1.default("AccessToken", response.accessToken, res)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, cookie_1.default("RefreshToken", response.refreshToken, res)];
                case 2:
                    _a.sent();
                    res.status(200).json({ success: true, message: response.message });
                    return [2 /*return*/];
            }
        });
    }); })
        .catch(function (error) {
        return next(new errorResponse_1.default(error.message, 402, error.code));
    });
};
exports.googleLogin = googleLogin;
/**
 * Linking with google account
 *
 * @method "POST"
 * @access "PRIVATE"
 */
var linkGoogle = function (req, res, next) {
    var token = req.body.token;
    var googleId = req.body.googleId;
    authHelper
        .linkWithGoogle(googleId, token)
        .then(function (response) {
        res.status(200).json({ success: true, message: response.message });
    })
        .catch(function (error) {
        return next(new errorResponse_1.default(error.message, 402, error.code));
    });
};
exports.linkGoogle = linkGoogle;
/**
 * Unlinking with Google account
 *
 * @method "GET"
 * @access "PRIVATE"
 * @desc   ""
 */
var unLinkGoogle = function (req, res, next) {
    var _a;
    var userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    authHelper
        .unLinkWithGoogle(userId)
        .then(function (response) {
        res.status(200).json({ success: true, message: response.message });
    })
        .catch(function (error) {
        return next(new errorResponse_1.default(error.message, 402, error.code));
    });
};
exports.unLinkGoogle = unLinkGoogle;
/**
 * Login for existing users and new users
 *
 * @method "POST"
 * @access "PUBLIC"
 */
var facebookLogin = function (req, res, next) {
    var facebookId = req.body.facebookId;
    var accessToken = req.body.accessToken;
    authHelper
        .facebookLogin(facebookId, accessToken)
        .then(function (response) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cookie_1.default("AccessToken", response.accessToken, res)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, cookie_1.default("RefreshToken", response.refreshToken, res)];
                case 2:
                    _a.sent();
                    res.status(200).json({ success: true, message: response.message });
                    return [2 /*return*/];
            }
        });
    }); })
        .catch(function (error) {
        return next(new errorResponse_1.default(error.message, 402, error.code));
    });
};
exports.facebookLogin = facebookLogin;
/**
 * Linking with facebook account
 *
 * @method "POST"
 * @access "PRIVATE"
 */
var linkFacebook = function (req, res, next) {
    var facebookId = req.body.facebookId;
    var accessToken = req.body.accessToken;
    authHelper
        .linkWithfacebook(facebookId, accessToken)
        .then(function (response) {
        res.status(200).json({ success: true, message: response.message });
    })
        .catch(function (error) {
        return next(new errorResponse_1.default(error.message, 402, error.code));
    });
};
exports.linkFacebook = linkFacebook;
/**
 * Unlink facebook account
 *
 * @method "GET"
 * @access "PRIVATE"
 */
var unLinkFacebook = function (req, res, next) {
    var _a;
    var userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    authHelper
        .unLinkWithFacebook(userId)
        .then(function (response) {
        res.status(200).json({ success: true, message: response.message });
    })
        .catch(function (error) {
        return next(new errorResponse_1.default(error.message, 402, error.code));
    });
};
exports.unLinkFacebook = unLinkFacebook;
/**
 * Find a user and sent reset token in mail
 *
 * @method "POST"
 * @access "PUBLIC"
 */
var forgetPassword = function (req, res, next) {
    var email = req.body.email;
    authHelper
        .forgotPassword(email)
        .then(function (response) {
        res.status(200).json({
            success: true,
            message: response.message,
        });
    })
        .catch(function (error) {
        return next(new errorResponse_1.default(error.message, 402, error.code));
    });
};
exports.forgetPassword = forgetPassword;
/**
 * To reset new passowrd with token
 *
 * @method "POST"
 * @access "PUBLIC"
 */
var resetPassword = function (req, res, next) {
    var token = req.body.token;
    var password = req.body.password;
    authHelper
        .resetPassword(token, password)
        .then(function (response) {
        res.status(200).json({
            success: true,
            message: response.message,
        });
    })
        .catch(function (error) {
        return next(new errorResponse_1.default(error.message, 402, error.code));
    });
};
exports.resetPassword = resetPassword;
/**
 * Delete account by password veification
 *
 * @method "POST"
 * @access "PRIVATE"
 */
var deleteAccount = function (req, res, next) {
    var _a;
    var userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    var password = req.body.password;
    authHelper
        .verifyPassword(userId, password)
        .then(function (resp) {
        authHelper
            .deleteUser(resp.userId, resp.verified)
            .then(function (response) {
            res.status(200).json({
                success: true,
                message: response.message,
            });
        })
            .catch(function (error) {
            return next(new errorResponse_1.default(error.message, 402, error.code));
        });
    })
        .catch(function (error) {
        return next(new errorResponse_1.default(error.message, 402, error.code));
    });
};
exports.deleteAccount = deleteAccount;
/**
 * Updating Old refreshToken into new accessToken
 *
 * @method "GET"
 * @access "PUBLIC"
 * @desc   "Updating Old refreshToken into new accessToken"
 */
var upgradeAccessToken = function (req, res, next) {
    var AccessToken = req.cookies.AccessToken;
    var RefreshToken = req.cookies.RefreshToken;
    if (!AccessToken && !RefreshToken) {
        return next(new errorResponse_1.default("Unauthonticated Request", 402));
    }
    if (AccessToken && RefreshToken) {
        return next(new errorResponse_1.default("AccessToken and RefreshToken Already Exist", 402));
    }
    if (!AccessToken && RefreshToken) {
        authHelper
            .upgradeAccessToken(RefreshToken)
            .then(function (response) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, cookie_1.default("AccessToken", response.accessToken, res)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, cookie_1.default("RefreshToken", response.refreshToken, res)];
                    case 2:
                        _a.sent();
                        res.status(200).json({ success: true, message: response.message });
                        return [2 /*return*/];
                }
            });
        }); })
            .catch(function (error) {
            console.log(error);
            return next(new errorResponse_1.default(error.message, 402, error.code));
        });
    }
};
exports.upgradeAccessToken = upgradeAccessToken;
/**
 * Generate Authenticator Secret and QRCodeURL
 *
 * @method "GET"
 * @access "PRIVATE"
 */
var generateAuthenticator = function (req, res, next) {
    var _a;
    var userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    authHelper
        .generateAuthenticator(userId)
        .then(function (resp) {
        res.status(200).json({
            success: true,
            QRCodeURL: resp.QRCodeURL,
            secret: resp.secret,
        });
    })
        .catch(function (error) {
        return next(new errorResponse_1.default(error.message, 402, error.code));
    });
};
exports.generateAuthenticator = generateAuthenticator;
/**
 * Verify Token
 *
 * @method "POST"
 * @access "PRIVATE"
 */
var verifyAuthenticator = function (req, res, next) {
    var _a;
    var userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    var token = req.body.token;
    authHelper
        .verifyAuthenticator(userId, token)
        .then(function (resp) {
        res.status(200).json({
            success: true,
            message: resp.message,
            verified: resp.verified,
        });
    })
        .catch(function (error) {
        return next(new errorResponse_1.default(error.message, 402, error.code));
    });
};
exports.verifyAuthenticator = verifyAuthenticator;
/**
 * Validate Token
 *
 * @method "POST"
 * @access "PUBLIC"
 */
var validateAuthenticator = function (req, res, next) {
    var userId = req.body.userId;
    var token = req.body.token;
    authHelper
        .validateAuthenticator(userId, token)
        .then(function (resp) {
        res.status(200).json({
            success: true,
            message: resp.message,
            verified: resp.verified,
        });
    })
        .catch(function (error) {
        return next(new errorResponse_1.default(error.message, 402, error.code));
    });
};
exports.validateAuthenticator = validateAuthenticator;
/**
 * Disable Authenticator
 *
 * @method "GET"
 * @access "PRIVATE"
 */
var disableAuthenticator = function (req, res, next) {
    var _a;
    var userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    authHelper
        .disableAuthenticator(userId)
        .then(function (resp) {
        res.status(200).json({
            success: true,
            message: resp.message,
        });
    })
        .catch(function (error) {
        return next(new errorResponse_1.default(error.message, 402, error.code));
    });
};
exports.disableAuthenticator = disableAuthenticator;
