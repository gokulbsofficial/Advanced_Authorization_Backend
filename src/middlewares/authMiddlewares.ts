import { verifyJwtToken } from "../functions/jwt";
import { ApiParams } from "../types/default";
import ErrorResponse from "../classes/errorResponse";
import * as userAuthHelper from "../helpers/userAuthHelper";
import * as adminAuthHelper from "../helpers/adminAuthHelper";
import { IErrorResponse } from "../interfaces/default";
import { IAdminStatusResponse } from "../interfaces/adminAuthInterface";
import { IUserStatusResponse } from "../interfaces/userAuthInterface";

export const verifyLogin: ApiParams = async (req, res, next) => {
  try {
    const AccessToken = req.cookies.AccessToken;

    if (AccessToken) {
      const token = req.headers.authorization?.split(" ")[1];

      if (token) {
        const decoded = await verifyJwtToken(token, "ACCESS_TOKEN");
        userAuthHelper
          .checkUserStatus(decoded.userId)
          .then((res: IUserStatusResponse) => {
            req.user = {
              userId: res.userId,
              email: res.email,
              name: res.name,
              role: res.role,
            };
            next();
          })
          .catch((error: IErrorResponse) => {
            return next(new ErrorResponse(error.message, 401, error.code));
          });
      } else {
        return next(new ErrorResponse("Unauthonticated Request", 401));
      }
    } else {
      return next(new ErrorResponse("Access Token Not Found", 401));
    }
  } catch (error) {
    return next(new ErrorResponse("Unauthonticated Request", 401));
  }
};

export const verifyUser: ApiParams = async (req, res, next) => {
  try {
    const AccessToken = req.cookies.AccessToken;

    if (AccessToken) {
      const token = req.headers.authorization?.split(" ")[1];

      if (token) {
        const decoded = await verifyJwtToken(token, "ACCESS_TOKEN");
        console.log(decoded);

        userAuthHelper
          .checkUserStatus(decoded.userId)
          .then((res: IUserStatusResponse) => {
            req.user = {
              userId: res.userId,
              email: res.email,
              name: res.name,
              role: res.role,
            };
            next();
          })
          .catch((error: IErrorResponse) => {
            return next(new ErrorResponse(error.message, 401, error.code));
          });
      } else {
        return next(new ErrorResponse("Unauthonticated request", 401));
      }
    } else {
      return next(new ErrorResponse("Access Token Not Found", 401));
    }
  } catch (error) {
    return next(new ErrorResponse("Unauthonticated request", 401));
  }
};

export const verifyAdmin: ApiParams = async (req, res, next) => {
  try {
    const AccessToken = req.cookies.AccessToken;

    if (AccessToken) {
      const token = req.headers.authorization?.split(" ")[1];

      if (token) {
        const decoded = await verifyJwtToken(token, "ACCESS_TOKEN");
        console.log(decoded);

        adminAuthHelper
          .checkAdminStatus(decoded.adminId, "ADMIN")
          .then((res: IAdminStatusResponse) => {
            req.admin = {
              adminId: res.adminId,
              name: res.name,
              email: res.email,
              role: res.role,
            };
            next();
          })
          .catch((error: IErrorResponse) => {
            return next(new ErrorResponse(error.message, 401, error.code));
          });
      } else {
        return next(new ErrorResponse("Unauthonticated Request", 401));
      }
    } else {
      return next(new ErrorResponse("Access Token Not Found", 401));
    }
  } catch (error: any) {
    return next(
      new ErrorResponse(
        error.message || error.msg || "Unauthonticated Request",
        401,
        error.code || error.name
      )
    );
  }
};

export const verifySuperAdmin: ApiParams = async (req, res, next) => {
  try {
    const AccessToken = req.cookies.AccessToken;

    if (AccessToken) {
      const token = req.headers.authorization?.split(" ")[1];
      if (token) {
        const decoded = await verifyJwtToken(token, "ACCESS_TOKEN");
        adminAuthHelper
          .checkAdminStatus(decoded.adminId, "SUPER_ADMIN")
          .then((res: IAdminStatusResponse) => {
            req.admin = {
              adminId: res.adminId,
              name: res.name,
              email: res.email,
              role: res.role,
            };
            next();
          })
          .catch((error: IErrorResponse) => {
            return next(new ErrorResponse(error.message, 401, error.code));
          });
      } else {
        return next(new ErrorResponse("Unauthonticated Request", 401));
      }
    } else {
      return next(new ErrorResponse("Access Token Not Found", 401));
    }
  } catch (error: any) {
    return next(
      new ErrorResponse(
        error.message || error.msg || "Unauthonticated Request",
        error.code || 401
      )
    );
  }
};
