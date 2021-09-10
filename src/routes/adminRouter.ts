/* Imported Modules */
import express from "express";
import { verifyAdmin, verifySuperAdmin } from "../middlewares/authMiddlewares";

/* Custom Imported Modules */
import { getAdmin } from "../controllers/adminController";

/* Config Variables */
const router = express.Router();

/* ADMIN Routes starts with /api/v1/admin/* */
router.route("/get-admin").get(verifyAdmin, (req, res) => {
  res.json((req as any).admin);
});

export default router;
