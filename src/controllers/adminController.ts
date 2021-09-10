/* Installed Imported Modules */

/* Custom Imported Modules */
import { ApiParams } from "../types/default";

/**
 * @method "GET"
 * @access "PRIVATE"
 * @description Get User
 */
export const getAdmin: ApiParams = (req, res, next) => {
  res.status(200).json(req.admin);
};
