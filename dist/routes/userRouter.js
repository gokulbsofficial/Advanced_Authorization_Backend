"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Imported Modules */
var express_1 = __importDefault(require("express"));
var authMiddlewares_1 = require("../middlewares/authMiddlewares");
/* Custom Imported Modules */
var userController_1 = require("../controllers/userController");
/* Config Variables */
var router = express_1.default.Router();
/* USER Routers starts with /api/v1/user/* */
router.route("/get-user").get(authMiddlewares_1.verifyUser, userController_1.getUser);
exports.default = router;
