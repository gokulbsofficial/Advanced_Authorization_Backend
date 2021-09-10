/* Imported Modules */
import express from "express";
// import { verifyUser } from "../middlewares/authMiddlewares";

/* Custom Imported Modules */
import {
  doLogin,
  doSignup,
  deleteAccount,
  resentActivationToken,
  accountActivation,
  forgetPassword,
  resetPassword,
  googleLogin,
  facebookLogin,
  linkGoogle,
  linkFacebook,
  linkPassword,
  unLinkFacebook,
  unLinkGoogle,
  upgradeAccessToken,
  generateAuthenticator,
  verifyAuthenticator,
  validateAuthenticator,
  disableAuthenticator,
} from "../controllers/userAuthController";
import { verifyLogin, verifyUser } from "../middlewares/authMiddlewares";

/* Config Variables */
const router = express.Router();

/* USER Auth Routers starts with /api/v1/auth/user/* */

router.route("/signup").post(doSignup);
router.route("/login").post(doLogin);

router.route("/resent-activation-token").post(resentActivationToken);
router.route("/activation-account").post(accountActivation);

router.route("/forget-password").post(forgetPassword);
router.route("/reset-password").post(resetPassword);

router.route("/delete-account").post(verifyUser, deleteAccount);

router.route("/google-login").post(googleLogin);
router.route("/facebook-login").post(facebookLogin);

router.route("/link/facebook").post(verifyUser, linkFacebook);
router.route("/link/google").post(verifyUser, linkGoogle);
router.route("/link/password").post(verifyUser, linkPassword);

router.route("/unlink/facebook").get(verifyUser, unLinkFacebook);
router.route("/unlink/google").get(verifyUser, unLinkGoogle);

router.route("/upgrade-access-token").get(upgradeAccessToken);

router.route("/generate-authenticator").get(verifyUser, generateAuthenticator);
router.route("/verify-authenticator").post(verifyUser, verifyAuthenticator);
router.route("/validate-authenticator").post(validateAuthenticator);
router.route("/disable-authenticator").get(verifyUser, disableAuthenticator);

export default router;
