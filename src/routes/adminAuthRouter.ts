/* Imported Modules */
import express from "express";
import { verifyAdmin, verifySuperAdmin } from "../middlewares/authMiddlewares";

/* Custom Imported Modules */
import { adminLogin, newAccessToken } from "../controllers/adminAuthController";
import { disableAuthenticator, generateAuthenticator, validateAuthenticator, verifyAuthenticator } from "../controllers/adminAuthController";

/* Config Variables */
const router = express.Router();

/* ADMIN Auth Routes starts with /api/v1/auth/admin/* */
router.route("/login").post(adminLogin);
router.route("/new-access-token").get(newAccessToken);

router.route("/generate-authenticator").get(verifyAdmin, generateAuthenticator);
router.route("/verify-authenticator").post(verifyAdmin, verifyAuthenticator);
router.route("/validate-authenticator").post(validateAuthenticator);
router.route("/disable-authenticator").get(verifyAdmin, disableAuthenticator);


export default router;
