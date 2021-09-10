"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Imported Modules */
var express_1 = __importDefault(require("express"));
// import { verifyUser } from "../middlewares/authMiddlewares";
/* Custom Imported Modules */
var userAuthController_1 = require("../controllers/userAuthController");
var authMiddlewares_1 = require("../middlewares/authMiddlewares");
/* Config Variables */
var router = express_1.default.Router();
/* USER Auth Routers starts with /api/v1/auth/user/* */
router.route("/signup").post(userAuthController_1.doSignup);
router.route("/login").post(userAuthController_1.doLogin);
router.route("/resent-activation-token").post(userAuthController_1.resentActivationToken);
router.route("/activation-account").post(userAuthController_1.accountActivation);
router.route("/forget-password").post(userAuthController_1.forgetPassword);
router.route("/reset-password").post(userAuthController_1.resetPassword);
router.route("/delete-account").post(authMiddlewares_1.verifyUser, userAuthController_1.deleteAccount);
router.route("/google-login").post(userAuthController_1.googleLogin);
router.route("/facebook-login").post(userAuthController_1.facebookLogin);
router.route("/link/facebook").post(authMiddlewares_1.verifyUser, userAuthController_1.linkFacebook);
router.route("/link/google").post(authMiddlewares_1.verifyUser, userAuthController_1.linkGoogle);
router.route("/link/password").post(authMiddlewares_1.verifyUser, userAuthController_1.linkPassword);
router.route("/unlink/facebook").get(authMiddlewares_1.verifyUser, userAuthController_1.unLinkFacebook);
router.route("/unlink/google").get(authMiddlewares_1.verifyUser, userAuthController_1.unLinkGoogle);
router.route("/upgrade-access-token").get(userAuthController_1.upgradeAccessToken);
router.route("/generate-authenticator").get(authMiddlewares_1.verifyUser, userAuthController_1.generateAuthenticator);
router.route("/verify-authenticator").post(authMiddlewares_1.verifyUser, userAuthController_1.verifyAuthenticator);
router.route("/validate-authenticator").post(userAuthController_1.validateAuthenticator);
router.route("/disable-authenticator").get(authMiddlewares_1.verifyUser, userAuthController_1.disableAuthenticator);
exports.default = router;
