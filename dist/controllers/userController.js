"use strict";
/* Installed Imported Modules */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
/**
 * Get User
 *
 * @method "GET"
 * @access "PRIVATE"
 */
var getUser = function (req, res, next) {
    res.status(200).json(req.user);
};
exports.getUser = getUser;
