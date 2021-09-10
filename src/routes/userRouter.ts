/* Imported Modules */
import express from "express";
import { verifyUser } from "../middlewares/authMiddlewares";

/* Custom Imported Modules */
import { getUser } from "../controllers/userController";

/* Config Variables */
const router = express.Router();

/* USER Routers starts with /api/v1/user/* */
router.route("/get-user").get(verifyUser, getUser);

export default router;
