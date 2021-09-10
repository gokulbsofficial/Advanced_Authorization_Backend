"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Imported Modules */
var express_1 = __importDefault(require("express"));
var authMiddlewares_1 = require("../middlewares/authMiddlewares");
/* Config Variables */
var router = express_1.default.Router();
/* ADMIN Routes starts with /api/v1/admin/* */
router.route("/get-admin").get(authMiddlewares_1.verifyAdmin, function (req, res) {
    res.json(req.admin);
});
exports.default = router;
