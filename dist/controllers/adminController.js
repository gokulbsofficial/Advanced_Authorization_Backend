"use strict";
/* Installed Imported Modules */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdmin = void 0;
/**
 * @method "GET"
 * @access "PRIVATE"
 * @description Get User
 */
var getAdmin = function (req, res, next) {
    res.status(200).json(req.admin);
};
exports.getAdmin = getAdmin;
