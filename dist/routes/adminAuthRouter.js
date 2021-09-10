"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Imported Modules */
var express_1 = __importDefault(require("express"));
/* Custom Imported Modules */
var adminAuthController_1 = require("../controllers/adminAuthController");
/* Config Variables */
var router = express_1.default.Router();
/* ADMIN Auth Routes starts with /api/v1/auth/admin/* */
router.route("/login").post(adminAuthController_1.adminLogin);
router.route("/new-access-token").get(adminAuthController_1.newAccessToken);
exports.default = router;
