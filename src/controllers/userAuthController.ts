/* Installed Imported Modules */

/* Custom Imported Modules */
import { ApiParams } from "../types/default";
import * as authHelper from "../helpers/userAuthHelper";
import ErrorResponse from "../classes/errorResponse";
import { IErrorResponse } from "../interfaces/default";
import setCookies from "../functions/cookie";
import {
  IUserLoginResponse,
  IVerifyPasswdResponse,
} from "../interfaces/userAuthInterface";
import {
  IAuthResponse,
  IGenerateAuthenticatorResp,
  ILoginResponse,
  IUpgradeAccessToken,
  IVerifyAuthenticatorResp,
} from "../interfaces/authInterface";
import { IUser } from "../interfaces/userInterfaces";

type UserId = IUser["_id"];

/**
 * @method POST
 * @access PUBLIC
 * @description Signup for new users
 */
export const doSignup: ApiParams = (req, res, next) => {
  const { name, email, password } = req.body;
  authHelper
    .doSignup(name, email, password)
    .then((response: IAuthResponse) => {
      res.status(200).json({ success: true, message: response.message });
    })
    .catch((error: IErrorResponse) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * @method POST
 * @access PUBLIC
 * @description Login for existing users
 */
export const doLogin: ApiParams = (req, res, next) => {
  const { email, password } = req.body;
  authHelper
    .doLogin(email, password)
    .then(async (response: IUserLoginResponse) => {
      if (response?.accessToken && response?.refreshToken) {
        await setCookies("AccessToken", response.accessToken, res);
        await setCookies("RefreshToken", response.refreshToken, res);
      }
      res.status(200).json({
        success: true,
        message: response.message,
        twoStepVerification: response.twoStepVerification,
        userId: response?.userId,
      });
    })
    .catch((error: IErrorResponse) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * @method POST
 * @access PUBLIC
 * @description Activate new users account
 */
export const accountActivation: ApiParams = (req, res, next) => {
  const token = req.body.token;
  authHelper
    .accountActivation(token)
    .then((response: IAuthResponse) => {
      res.status(200).json({ success: true, message: response.message });
    })
    .catch((error: IErrorResponse) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * @method GET
 * @access PUBLIC
 * @description Resent Activation Token
 */
export const resentActivationToken: ApiParams = (req, res, next) => {
  const email: string = req.body.email;
  authHelper
    .resentActivationToken(email)
    .then((response: IAuthResponse) => {
      res.status(200).json({ success: true, message: response.message });
    })
    .catch((error: IErrorResponse) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * @method POST
 * @access PRIVATE
 * @description Linking with password account
 */
export const linkPassword: ApiParams = (req, res, next) => {
  const userId = req.user?.userId;
  const password: string = req.body.password;
  authHelper
    .linkWithPasssword(userId, password)
    .then((response: IAuthResponse) => {
      res.status(200).json({ success: true, message: response.message });
    })
    .catch((error: IErrorResponse) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * @method POST
 * @access PUBLIC
 * @description Login for existing users or create new account
 */
export const googleLogin: ApiParams = (req, res, next) => {
  const token: string = req.body.token;
  const googleId: string = req.body.googleId;
  authHelper
    .googleLogin(googleId, token)
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
 * @access PRIVATE
 * @description Linking with google account
 */
export const linkGoogle: ApiParams = (req, res, next) => {
  const token: string = req.body.token;
  const googleId: string = req.body.googleId;
  authHelper
    .linkWithGoogle(googleId, token)
    .then((response: IAuthResponse) => {
      res.status(200).json({ success: true, message: response.message });
    })
    .catch((error: IErrorResponse) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * @method GET
 * @access PRIVATE
 * @description Unlinking with Google account
 */
export const unLinkGoogle: ApiParams = (req, res, next) => {
  const userId = req.user?.userId;
  authHelper
    .unLinkWithGoogle(userId)
    .then((response: IAuthResponse) => {
      res.status(200).json({ success: true, message: response.message });
    })
    .catch((error: IErrorResponse) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * @method POST
 * @access PUBLIC
 * @description Login for existing users and new users
 */
export const facebookLogin: ApiParams = (req, res, next) => {
  const facebookId: number = req.body.facebookId;
  const accessToken: string = req.body.accessToken;
  authHelper
    .facebookLogin(facebookId, accessToken)
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
 * @access PRIVATE
 * @description Linking with facebook account
 */
export const linkFacebook: ApiParams = (req, res, next) => {
  const facebookId: number = req.body.facebookId;
  const accessToken: string = req.body.accessToken;
  authHelper
    .linkWithfacebook(facebookId, accessToken)
    .then((response: IAuthResponse) => {
      res.status(200).json({ success: true, message: response.message });
    })
    .catch((error: IErrorResponse) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * @method GET
 * @access PRIVATE
 * @description Unlink facebook account
 */
export const unLinkFacebook: ApiParams = (req, res, next) => {
  const userId = req.user?.userId;
  authHelper
    .unLinkWithFacebook(userId)
    .then((response: IAuthResponse) => {
      res.status(200).json({ success: true, message: response.message });
    })
    .catch((error: IErrorResponse) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * @method POST
 * @access PUBLIC
 * @description Find a user and sent reset token in mail
 */
export const fogetassword: ApiParams = (req, res, next) => {
  const email: string = req.body.email;
  authHelper
    .forgotPassword(email)
    .then((response: IAuthResponse) => {
      res.status(200).json({
        success: true,
        message: response.message,
      });
    })
    .catch((error: IErrorResponse) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * @method POST
 * @access PUBLIC
 * @description To reset new passowrd with token
 */
export const resetPassword: ApiParams = (req, res, next) => {
  const token: string = req.body.token;
  const password: string = req.body.password;
  authHelper
    .resetPassword(token, password)
    .then((response: IAuthResponse) => {
      res.status(200).json({
        success: true,
        message: response.message,
      });
    })
    .catch((error: IErrorResponse) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * @method POST
 * @access PRIVATE
 * @description Delete account by password veification
 */
export const deleteAccount: ApiParams = (req, res, next) => {
  const userId = req.user?.userId;
  const password: string = req.body.password;
  authHelper
    .verifyPassword(userId, password)
    .then((resp: IVerifyPasswdResponse) => {
      authHelper
        .deleteUser(resp.userId, resp.verified)
        .then((response: IAuthResponse) => {
          res.status(200).json({
            success: true,
            message: response.message,
          });
        })
        .catch((error: IErrorResponse) => {
          return next(new ErrorResponse(error.message, 402, error.code));
        });
    })
    .catch((error: IErrorResponse) => {
      return next(new ErrorResponse(error.message, 402, error.code));
    });
};

/**
 * @method GET
 * @access PUBLIC
 * @description Updating Old refreshToken into new accessToken
 * @desc   "Updating Old refreshToken into new accessToken"
 */
export const upgradeAccessToken: ApiParams = (req, res, next) => {
  const AccessToken: string = req.cookies.AccessToken;
  const RefreshToken: string = req.cookies.RefreshToken;

  if (!AccessToken && !RefreshToken) {
    return next(new ErrorResponse("Unauthonticated Request", 402));
  }

  if (AccessToken && RefreshToken) {
    return next(
      new ErrorResponse("AccessToken and RefreshToken Already Exist", 402)
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
        console.log(error);
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
  const userId = req.user?.userId;
  authHelper
    .generateAuthenticator(userId)
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
  const userId = req.user?.userId;
  const token = req.body.token;
  authHelper
    .verifyAuthenticator(userId, token)
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
 * @method POST
 * @access PUBLIC
 * @description Validate Token
 */
export const validateAuthenticator: ApiParams = (req, res, next) => {
  const userId: UserId = req.body.userId;
  const token: string = req.body.token;
  authHelper
    .validateAuthenticator(userId, token)
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
  const userId: UserId = req.user?.userId;
  const password = req.body.password;
  try {
    const { verified } = await authHelper.verifyPassword(userId, password);
    if(verified){
      const resp = await authHelper
        .disableAuthenticator(userId)
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
