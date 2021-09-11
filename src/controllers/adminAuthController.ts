/* Installed Imported Modules */

/* Custom Imported Modules */
import { ApiParams } from "../types/default";
import * as authHelper from "../helpers/adminAuthHelper";
import ErrorResponse from "../classes/errorResponse";
import { IErrorResponse } from "../interfaces/default";
import setCookies from "../functions/cookie";
import {
  IGenerateAuthenticatorResp,
  ILoginResponse,
  IUpgradeAccessToken,
  IVerifyAuthenticatorResp,
} from "../interfaces/authInterface";
import { Admin } from "mongodb";

/**
 * @method POST
 * @access PUBLIC
 * @description Login for existing admin
 */
export const adminLogin: ApiParams = (req, res, next) => {
  const { email, password } = req.body;
  authHelper
    .adminLogin(email, password)
    .then(async (response: ILoginResponse) => {
      await setCookies("AccessToken", response.accessToken, res);
      await setCookies("RefreshToken", response.refreshToken, res);
      res.status(200).json({ success: true, message: response.message });
    })
    .catch((error: IErrorResponse) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * @method POST
 * @access PUBLIC
 * @description Add new admin account
 */
 export const addAdmin: ApiParams = (req, res, next) => {
  const { name, email } = req.body;
  // authHelper
  //   .doSignup(name, email, password)
  //   .then((response: IAuthResponse) => {
  //     res.status(200).json({ success: true, message: response.message });
  //   })
  //   .catch((error: IErrorResponse) => {
  //     return next(new ErrorResponse(error.message, 402, error.code));
  //   });
};

/**
 * @method GET
 * @access PUBLIC
 * @description Update cookie tokens
 */
export const newAccessToken: ApiParams = (req, res, next) => {
  const AccessToken: string = req.cookies.AccessToken;
  const RefreshToken: string = req.cookies.RefreshToken;

  if (!AccessToken && !RefreshToken) {
    return next(new ErrorResponse("Unauthonticated request", 402));
  }

  if (AccessToken && RefreshToken) {
    return next(
      new ErrorResponse("AccessToken and RefreshToken already exist", 402)
    );
  }

  if (!AccessToken && RefreshToken) {
    authHelper
      .upgradeAccessToken(RefreshToken)
      .then(async (response: IUpgradeAccessToken) => {
        await setCookies("AccessToken", response.accessToken, res);
        await setCookies("RefreshToken", response.refreshToken, res);
        res.status(200).json({ success: true, message: response.message });
      })
      .catch((error: IErrorResponse) => {
        return next(new ErrorResponse(error.message, 402, error.code));
      });
  }
};

/**
 * @method GET
 * @access PRIVATE
 * @description Generate Authenticator Secret and QRCodeURL
 */
export const generateAuthenticator: ApiParams = (req, res, next) => {
  const adminId = req.admin?.adminId;
  authHelper
    .generateAuthenticator(adminId)
    .then((resp: IGenerateAuthenticatorResp) => {
      res.status(200).json({
        success: true,
        QRCodeURL: resp.QRCodeURL,
        secret: resp.secret,
      });
    })
    .catch((error: IErrorResponse) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * @method POST
 * @access PRIVATE
 * @description Verify Token
 */
export const verifyAuthenticator: ApiParams = (req, res, next) => {
  const adminId = req.admin?.adminId;
  const token = req.body.token;
  authHelper
    .verifyAuthenticator(adminId, token)
    .then((resp: IVerifyAuthenticatorResp) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        verified: resp.verified,
      });
    })
    .catch((error: IErrorResponse) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * 
 * @method POST
 * @access PUBLIC
 * @description Validate Token
 */
export const validateAuthenticator: ApiParams = (req, res, next) => {
  const adminId = req.body.adminId;
  const token = req.body.token;
  authHelper
    .validateAuthenticator(adminId, token)
    .then((resp: IVerifyAuthenticatorResp) => {
      res.status(200).json({
        success: true,
        message: resp.message,
        verified: resp.verified,
      });
    })
    .catch((error: IErrorResponse) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * @method GET
 * @access PRIVATE
 * @description Disable Authenticator
 */
 export const disableAuthenticator: ApiParams = async (req, res, next) => {
  const adminId = req.admin?.adminId;
  const password:string = req.body.password;
  try {
    const { verified } = await authHelper.verifyPassword(adminId, password);
    if(verified){
      const resp = await authHelper
        .disableAuthenticator(adminId)
        res.status(200).json({
          success: true,
          message: resp.message,
        });
    } else{
      return next(new ErrorResponse("Incorrect Credentials", 402));
    }
  } catch (error) {
    return next(new ErrorResponse(error.message, 402, error.code));
  }
};

