/* Installed Imported Modules */

/* Custom Imported Modules */
import { ApiParams } from "../types/default";
import ErrorResponse from "../classes/errorResponse";
import { IErrorResponse } from "../interfaces/default";

/**
 * Get User
 * 
 * @method "GET"
 * @access "PRIVATE"
 */
export const getUser: ApiParams = (req, res, next) => {
  res.status(200).json(req.user);
};
