/* Installed Imported Modules */
import bcrypt from "bcryptjs";

/* Custom Imported Modules */
import db from "../config/connection";
import collections from "../config/collections";
import config from "../config/default";
import verifyGoogleOAth from "../functions/googleOAuth";
import { generateJwtToken, verifyJwtToken } from "../functions/jwt";
import { IUser } from "../interfaces/userInterfaces";
import { ObjectId } from "mongodb";
import checkStatus from "../functions/checkStatus";
import {
  IUserLoginResponse,
  IVerifyPasswdResponse,
  IUserStatusResponse,
} from "../interfaces/userAuthInterface";
import {
  IAuthResponse,
  IGenerateAuthenticatorResp,
  ILoginResponse,
  IUpgradeAccessToken,
  IVerifyAuthenticatorResp,
} from "../interfaces/authInterface";
import verifyFacebookOAuth from "../functions/facebookOAuth";
import { generateSpeakeasy, verifySpeakeasy } from "../functions/authenticator";
import { GeneratedSecret } from "speakeasy";

const { CLIENT_HOST } = config.CLIENT;
type UserId = IUser["_id"];

/**
 * @description
 */
export const doLogin = (email: string, password: string) => {
  return new Promise<IUserLoginResponse>(async (resolve, reject) => {
    if (!email || !password)
      return reject({ message: "Please Provide Email, Password" });
    try {
      const userFound = await db
        .get()
        ?.collection(collections.USER)
        .findOne({ email });

      if (userFound) {
        const user = userFound;
        const { accountStatus } = user;

        await checkStatus(accountStatus, user.email, collections.USER, [
          "Blocked",
          "Inactive",
        ]);

        if (user.methods?.includes("Password")) {
          const isMatch = await bcrypt.compare(password, user.password);

          if (isMatch) {
            if (user?.twoStepVerification === true) {
              return resolve({
                userId: user._id,
                twoStepVerification: user.twoStepVerification,
                message: "Login Successfully",
              });
            } else {
              const accessToken = await generateJwtToken(
                { userId: user._id, email: user.email, name: user.name },
                "ACCESS_TOKEN"
              );
              const refreshToken = await generateJwtToken(
                { userId: user._id, email: user.email, name: user.name },
                "REFRESH_TOKEN"
              );
              await db
                .get()
                ?.collection(collections.REFRESH_TOKEN)
                .insertOne({
                  refreshToken,
                  userId: new ObjectId(user._id),
                });
              await db
                .get()
                ?.collection(collections.USER)
                .updateOne(
                  { email: user.email },
                  { $set: { accountLogs: { lastSync: new Date() } } }
                );
              return resolve({
                accessToken,
                refreshToken,
                twoStepVerification: user.twoStepVerification,
                message: "Login Successfully",
              });
            }
          } else {
            return reject({ message: "Incorrect Credentials" });
          }
        } else {
          return reject({
            message: `Your Account linked with any other method`,
          });
        }
      } else {
        return reject({ message: "Incorrect Credentials" });
      }
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * @description
 */
export const doSignup = (name: string, email: string, password: string) => {
  return new Promise<IAuthResponse>(async (resolve, reject) => {
    if (!name || !email || !password)
      return reject({ message: "Please Provide Name, Email and Password" });
    try {
      const userFound = await db
        .get()
        ?.collection(collections.USER)
        .findOne({ email });

      if (userFound) {
        return reject({ message: "USER Already Exist" });
      } else {
        const hashedPassword: string = await bcrypt.hash(password, 10);

        const result = await db
          .get()
          ?.collection(collections.USER)
          .insertOne({
            name,
            email,
            password: hashedPassword,
            twoStepVerification: false,
            methods: ["Password"],
            accountStatus: {
              status: "Inactive",
            },
            accountDetails: {
              resetPasswdAccess: false,
              authenticator: {
                enable: false,
              },
            },
            accountLogs: {
              createdAt: new Date(),
            },
          });

        const activationToken = await generateJwtToken(
          { userId: result?.insertedId, name, email },
          "ACTIVATION_TOKEN"
        );
        const URL = `https://${CLIENT_HOST}/${activationToken}`;
        console.log(URL);

        // await sendMail({ to: email, name: name, link: URL }, "Activate");
        return resolve({ message: `Activation token send to ${email}` });
      }
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * @description
 */
export const linkWithPasssword = (userId: UserId, password: string) => {
  return new Promise<IAuthResponse>(async (resolve, reject) => {
    if (!userId || !password)
      return reject({ message: "Please Provide Token and Password" });
    try {
      const userFound = await db
        .get()
        ?.collection(collections.USER)
        .findOne({ _id: new ObjectId(userId) });

      if (userFound) {
        const user = userFound;

        if (user.methods?.includes("Password")) {
          return reject({
            message: `Your Account Already Linked With Password Method`,
          });
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          user.methods?.push("Password");
          await db
            .get()
            ?.collection(collections.USER)
            .updateOne(
              { email: user.email },
              {
                $set: {
                  password: hashedPassword,
                  methods: user.methods,
                  twoStepVerification: false,
                  accountDetails: {
                    resetPasswdAccess: false,
                  },
                },
              }
            );
          return resolve({
            message: "Account Linked With Passsword Method Successfully",
          });
        }
      } else {
        return reject({ message: "Incorrect Credentials" });
      }
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * @description
 */
export const googleLogin = (googleId: string, token: string) => {
  return new Promise<ILoginResponse>(async (resolve, reject) => {
    if (!googleId || !token)
      return reject({ message: "Please Provide GoogleId, Token" });

    try {
      const payload = await verifyGoogleOAth(token);

      if (payload?.email_verified && payload?.email && payload.name) {
        const { email, name } = payload;

        const userFound = await db
          .get()
          ?.collection(collections.USER)
          .findOne({ $or: [{ googleId: parseInt(googleId) }, { email }] });

        if (userFound) {
          const user = userFound;
          const { accountStatus } = user;

          await checkStatus(accountStatus, user.email, collections.USER, [
            "Blocked",
            "Inactive",
          ]);

          if (user.methods?.includes("Google")) {
            await db
              .get()
              ?.collection(collections.USER)
              .updateOne(
                { email: user.email },
                { $set: { lastSync: new Date() } }
              );
            const accessToken = await generateJwtToken(
              { userId: user._id, email: user.email, name: user.name },
              "ACCESS_TOKEN"
            );
            const refreshToken = await generateJwtToken(
              { userId: user._id, email: user.email, name: user.name },
              "REFRESH_TOKEN"
            );
            await db
              .get()
              ?.collection(collections.REFRESH_TOKEN)
              .insertOne({
                refreshToken,
                userId: new ObjectId(user._id),
              });
            return resolve({
              accessToken,
              refreshToken,
              message: "Login Successfully",
            });
          } else {
            return reject({
              message: `Your Account Already Linked With Password Method`,
            });
          }
        } else {
          const result = await db
            .get()
            ?.collection(collections.USER)
            .insertOne({
              name,
              email,
              googleId: parseInt(googleId),
              accountStatus: {
                status: "Active",
              },
              methods: ["Google"],
              accountLogs: {
                createdAt: new Date(),
                lastSync: new Date(),
              },
            });
          const accessToken = await generateJwtToken(
            { userId: result?.insertedId, email, name },
            "ACCESS_TOKEN"
          );
          const refreshToken = await generateJwtToken(
            { userId: result?.insertedId, email, name },
            "REFRESH_TOKEN"
          );
          await db.get()?.collection(collections.REFRESH_TOKEN).insertOne({
            refreshToken,
            userId: result?.insertedId,
          });
          return resolve({
            accessToken,
            refreshToken,
            message: "Account created successfully",
          });
        }
      } else {
        reject({ message: "Incorrect Credentials" });
      }
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * @description
 */
export const linkWithGoogle = (googleId: string, token: string) => {
  return new Promise<IAuthResponse>(async (resolve, reject) => {
    if (!googleId || !token)
      return reject({ message: "Please Provide GoogleId and Token" });

    try {
      const payload = await verifyGoogleOAth(token);

      if (payload?.email_verified && payload?.email && payload.name) {
        const { email } = payload;

        const userFound = await db
          .get()
          ?.collection(collections.USER)
          .findOne({
            $or: [{ googleId: parseInt(googleId) }, { email }],
          });

        if (userFound) {
          const user = userFound;

          if (user.methods?.includes("Google")) {
            return reject({
              message: `Your Account Already Linked With Google Method`,
            });
          } else {
            user.methods?.push("Google");
            await db
              .get()
              ?.collection(collections.USER)
              .updateOne(
                { email: user.email },
                {
                  $set: { googleId: parseInt(googleId), methods: user.methods },
                }
              );
            return resolve({
              message: "Account Linked With Google successfully",
            });
          }
        }
      } else {
        return reject({ message: "Incorrect Credentials" });
      }
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * @description
 */
export const unLinkWithGoogle = (userId: UserId) => {
  return new Promise<IAuthResponse>(async (resolve, reject) => {
    if (!userId) return reject({ message: "Please Provide UserId" });

    try {
      const userFound = await db
        .get()
        ?.collection(collections.USER)
        .findOne({
          _id: new ObjectId(userId),
        });

      if (userFound) {
        const user = userFound;

        if (user.methods?.includes("Google")) {
          user.methods.filter((method: string) => method !== "Google");
          await db
            .get()
            ?.collection(collections.USER)
            .updateOne(
              { email: user.email },
              { $set: { googleId: null, methods: user.methods } }
            );

          return resolve({
            message: "Account Unlinked With Google Successfully",
          });
        } else {
          return reject({ message: `Your Acount is Not Linked With Google` });
        }
      } else {
        return reject({ message: "Incorrect Credentials" });
      }
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * @description
 */
export const facebookLogin = (facebookId: number, accessToken: string) => {
  return new Promise<ILoginResponse>(async (resolve, reject) => {
    if (!facebookId || !accessToken)
      return reject({ message: "Please Provide FacebookId and AccessToken" });
    try {
      const payload = await verifyFacebookOAuth(facebookId, accessToken);

      if (payload) {
        const { id, email, name, picture } = payload;
        const profileURL: string = picture?.payload?.url;

        const userFound = await db
          .get()
          ?.collection(collections.USER)
          .findOne({
            $or: [{ facebookId: parseInt(id) }, { email }],
          });

        if (userFound) {
          const user = userFound;
          const { accountStatus } = user;

          await checkStatus(accountStatus, user.email, collections.USER, [
            "Blocked",
            "Inactive",
          ]);

          if (user.methods?.includes("Facebook")) {
            await db
              .get()
              ?.collection(collections.USER)
              .updateOne(
                { email: user.email },
                { $set: { lastSync: new Date() } }
              );
            const accessToken = await generateJwtToken(
              { userId: user._id, email: user.email, name: user.name },
              "ACCESS_TOKEN"
            );
            const refreshToken = await generateJwtToken(
              { userId: user._id, email: user.email, name: user.name },
              "ACCESS_TOKEN"
            );
            await db
              .get()
              ?.collection(collections.REFRESH_TOKEN)
              .insertOne({
                refreshToken,
                userId: new ObjectId(user._id),
              });
            return resolve({
              accessToken,
              refreshToken,
              message: "Login Successfully",
            });
          } else {
            return reject({
              message: `Your Account Already Linked With Password Method`,
            });
          }
        } else {
          const result = await db
            .get()
            ?.collection(collections.USER)
            .insertOne({
              name,
              email,
              facebookId: parseInt(id),
              methods: ["Facebook"],
              accountStatus: {
                status: "Active",
              },
              accountLogs: {
                createdAt: new Date(),
                lastSync: new Date(),
              },
            });

          const accessToken = await generateJwtToken(
            { userId: result?.insertedId, email, name },
            "ACCESS_TOKEN"
          );
          const refreshToken = await generateJwtToken(
            { userId: result?.insertedId, email, name },
            "REFRESH_TOKEN"
          );
          await db.get()?.collection(collections.REFRESH_TOKEN).insertOne({
            refreshToken,
            userId: result?.insertedId,
          });
          return resolve({
            accessToken,
            refreshToken,
            message: "Account Created Successfully",
          });
        }
      }
    } catch (error: any) {
      console.log(error.message, error.code);

      reject({
        msg: error.message || error.msg,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * @description
 */
export const linkWithfacebook = (facebookId: number, accessToken: string) => {
  return new Promise<IAuthResponse>(async (resolve, reject) => {
    if (!facebookId || !accessToken)
      return reject({ message: "Please Provide FacebookId and AccessToken" });
    try {
      const payload = await verifyFacebookOAuth(facebookId, accessToken);

      if (payload) {
        const { id, email } = payload;

        const userFound = await db
          .get()
          ?.collection(collections.USER)
          .findOne({
            $or: [{ facebookId: parseInt(id) }, { email }],
          });

        if (userFound) {
          const user = userFound;

          if (user.methods?.includes("Facebook")) {
            return reject({
              message: `Your Account Already Linked With Facebook`,
            });
          } else {
            user.methods?.push("Facebook");
            await db
              .get()
              ?.collection(collections.USER)
              .updateOne(
                { email: user.email },
                { $set: { facebookId: parseInt(id), methods: user.methods } }
              );
            return resolve({
              message: "Account linked with facebook successfully",
            });
          }
        } else {
          return reject({ message: "Incorrect Credentials" });
        }
      }
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * @description
 */
export const unLinkWithFacebook = (userId: UserId) => {
  return new Promise<IAuthResponse>(async (resolve, reject) => {
    if (!userId) return reject({ message: "Please Provide UserId" });

    try {
      const userFound = await db
        .get()
        ?.collection(collections.USER)
        .findOne({ _id: new ObjectId(userId) });

      if (userFound) {
        const user = userFound;

        if (user.methods?.includes("Facebook")) {
          user.methods.filter((method: string) => method !== "Facebook");
          await db
            .get()
            ?.collection(collections.USER)
            .updateOne(
              { email: user.email },
              { $set: { facebookId: null, methods: user.methods } }
            );

          return resolve({
            message: "Account Unlinked With Facebook Successfully",
          });
        } else {
          return reject({ message: `Your Account Not Linked With Facebook` });
        }
      } else {
        return reject({ message: "Incorret Credentials" });
      }
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * @description
 */
export const resentActivationToken = (email: string) => {
  return new Promise<IAuthResponse>(async (resolve, reject) => {
    if (!email) return reject({ message: "Please Provide Email" });
    try {
      const userFound = await db
        .get()
        ?.collection(collections.USER)
        .findOne({
          $or: [{ email: email }],
        });

      if (userFound) {
        const user = userFound;

        const { accountStatus } = user;

        await checkStatus(accountStatus, user.email, collections.USER, [
          "Blocked",
          "Active",
        ]);

        if (accountStatus.status === "Inactive") {
          const activationToken = await generateJwtToken(
            { userId: user._id, email: user.email, name: user.name },
            "ACTIVATION_TOKEN"
          );

          const ULI = `${CLIENT_HOST}/active-account/${activationToken}`;
          console.log(ULI);
          // await sendMail({ to: user.email, name: user.name, link:ULI }, "Activate");
          return resolve({
            message: `Activation Token Send Successfully in ${email}`,
          });
        } else {
          return reject({
            message: "Resent Token has Problem so Try Again",
          });
        }
      } else {
        return reject({ message: "Incorrect Credentials" });
      }
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * @description
 */
export const accountActivation = (token: string) => {
  return new Promise<IAuthResponse>(async (resolve, reject) => {
    if (!token) return reject({ message: "Please Provide Token" });
    try {
      const decoded = await verifyJwtToken(token, "ACTIVATION_TOKEN");

      const userFound = await db
        .get()
        ?.collection(collections.USER)
        .findOne({
          $or: [
            { _id: new ObjectId(decoded.userId) },
            { email: decoded.email },
          ],
        });

      if (userFound) {
        const user = userFound;
        const { accountStatus } = user;

        await checkStatus(accountStatus, user.email, collections.USER, [
          "Blocked",
          "Active",
        ]);
        if (accountStatus.status === "Inactive") {
          await db
            .get()
            ?.collection(collections.USER)
            .updateOne(
              { email: user.email },
              {
                $set: {
                  accountStatus: {
                    status: "Active",
                  },
                },
              }
            );
          return resolve({ message: "Account Activated" });
        } else {
          return reject({
            message: "Account Activation has a Problem so Try Again Later",
          });
        }
      } else {
        return reject({ message: "Incorrect Credentials" });
      }
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * @description
 */
export const forgotPassword = (email: string) => {
  return new Promise<IAuthResponse>(async (resolve, reject) => {
    if (!email) return reject({ message: "Please Provide Email" });
    try {
      const userFound = await db
        .get()
        ?.collection(collections.USER)
        .findOne({
          $or: [{ email }],
        });

      if (userFound) {
        const user = userFound;
        const { accountStatus } = user;

        await checkStatus(accountStatus, user.email, collections.USER, [
          "Blocked",
          "Inactive",
        ]);

        if (user.methods?.includes("Password")) {
          await db
            .get()
            ?.collection(collections.USER)
            .updateOne(
              { email: user.email },
              { $set: { accountDetails: { resetPasswdAccess: true } } }
            );

          const resetToken = await generateJwtToken(
            { userId: user._id, email: user.email, name: user.name },
            "RESET_TOKEN"
          );
          let URI = `${CLIENT_HOST}/${resetToken}`;
          console.log(URI);

          // await sendMail(
          //   { to: user.email, name: user.name, link:URI },
          //   "Activate"
          // );
          return resolve({
            message: `Reset Password Link Was Send in ${user.email}`,
          });
        } else {
          return reject({
            message: "Forget Token has Some issue.. Try Again Later",
          });
        }
      } else {
        return reject({ message: "Incorrect Credentials" });
      }
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * @description
 */
export const resetPassword = (token: string, password: string) => {
  return new Promise<IAuthResponse>(async (resolve, reject) => {
    if (!token || !password)
      return reject({ message: "Please Provide Token and Password" });
    try {
      let decoded = await verifyJwtToken(token, "RESET_TOKEN");

      if (decoded?.email) {
        const userFound = await db
          .get()
          ?.collection(collections.USER)
          .findOne({
            $or: [{ _id: new ObjectId(decoded._id) }, { email: decoded.email }],
          });

        if (userFound) {
          const user = userFound;
          const { accountStatus, accountDetails } = user;

          await checkStatus(accountStatus, user.email, collections.USER, [
            "Blocked",
          ]);

          if (accountDetails?.resetPasswdAccess) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
              return reject({
                message: "New Pasword and Old Password is Same",
              });
            } else {
              const hashedPassword = await bcrypt.hash(password, 10);
              const resetPasswdAttempt =
                (accountDetails?.resetPasswdAttempt ?? 0) + 1;
              const lastResetPasswd: Date = new Date();

              await db
                .get()
                ?.collection(collections.USER)
                .updateOne(
                  { email: user.email },
                  {
                    $set: {
                      password: hashedPassword,
                      accountDetails: {
                        lastPassword: user.password,
                        resetPasswdAccess: false,
                        resetPasswdAttempt,
                        lastResetPasswd,
                      },
                    },
                  }
                );

              return resolve({ message: "Password Reset Successfully" });
            }
          } else {
            return reject({ message: "Reset Password Permission Denied" });
          }
        } else {
          return reject({ message: "Incorrect Credentials" });
        }
      }
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * @description
 */
export const deleteUser = (userId: UserId, verified: boolean) => {
  return new Promise<IAuthResponse>(async (resolve, reject) => {
    if (!userId || !verified)
      return reject({ message: "Please Provide UserId and Verified" });
    try {
      if (verified) {
        db.get()
          ?.collection(collections.USER)
          .deleteOne({ _id: new ObjectId(userId) });

        resolve({ message: "Your Account Was Deleted Successfully" });
      } else {
        reject({ message: "Delete Account Access Declined" });
      }
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * @description
 */
export const verifyPassword = (userId: UserId, password: string) => {
  return new Promise<IVerifyPasswdResponse>(async (resolve, reject) => {
    if (!userId || !password)
      return reject({ message: "Please Provide UserId and Password" });
    try {
      const userFound = await db
        .get()
        ?.collection(collections.USER)
        .findOne({ _id: new ObjectId(userId) });

      if (userFound) {
        const user = userFound;

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          return resolve({
            message: "Password Verified",
            userId: user._id,
            verified: true,
          });
        } else {
          return reject({ message: "Incorrect Credentials" });
        }
      } else {
        return reject({ message: "Incorrect Credentials" });
      }
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * @description
 */
export const checkUserStatus = (userId: UserId) => {
  return new Promise<IUserStatusResponse>(async (resolve, reject) => {
    if (!userId) return reject({ message: "Please Provide UserId " });
    try {
      const userFound = await db
        .get()
        ?.collection(collections.USER)
        .findOne({
          $or: [{ _id: new ObjectId(userId) }],
        });

      if (userFound) {
        const user = userFound;
        const { accountStatus } = user;

        await checkStatus(accountStatus, user.email, collections.USER, [
          "Blocked",
          "Inactive",
        ]);

        if (accountStatus.status === "Active") {
          return resolve({
            message: "Active Account",
            userId: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          });
        } else {
          return reject({ message: "Permission Denied" });
        }
      } else {
        return reject({ message: "Incorrect Credentials" });
      }
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * @description
 */
export const upgradeAccessToken = (token: string) => {
  return new Promise<IUpgradeAccessToken>(async (resolve, reject) => {
    if (!token) return reject({ message: "Please Provide Token" });
    try {
      const oldRefreshToken = await db
        .get()
        ?.collection(collections.REFRESH_TOKEN)
        .findOne({ refreshToken: token });
      if (oldRefreshToken) {
        const attempt: number = (oldRefreshToken.attempt ?? 0) + 1;
        const decoded = await verifyJwtToken(token, "REFRESH_TOKEN");
        const accessToken = await generateJwtToken(
          {
            userId: decoded.userId,
            email: decoded.email,
            name: decoded.aud?.toString(),
          },
          "ACCESS_TOKEN"
        );
        const refreshToken = await generateJwtToken(
          {
            userId: decoded.userId,
            email: decoded.email,
            name: decoded.aud?.toString(),
          },
          "REFRESH_TOKEN"
        );
        await db
          .get()
          ?.collection(collections.REFRESH_TOKEN)
          .updateOne(
            { userId: new ObjectId(decoded.userId) },
            { $set: { refreshToken, attempt } }
          );
        resolve({
          message: "New Access Token Created",
          accessToken,
          refreshToken,
        });
      } else {
        reject({ message: "Unauthonticated Request" });
      }
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * @description
 */
export const generateAuthenticator = (userId: UserId) => {
  return new Promise<IGenerateAuthenticatorResp>(async (resolve, reject) => {
    if (!userId) return reject({ message: "Please Provide UserId" });
    try {
      const userFound = await db
        .get()
        ?.collection(collections.USER)
        .findOne({ _id: new ObjectId(userId) });

      if (userFound && userFound.accountDetails.authenticator.enable) {
        return reject({ message: "Authenticator Already Enabled" });
      } else if (userFound && !userFound.accountDetails.authenticator.enable) {
        const { secret, QRCodeURL } = await generateSpeakeasy();
        await db
          .get()
          ?.collection(collections.USER)
          .updateOne(
            { _id: new ObjectId(userId) },
            {
              $set: {
                accountDetails: {
                  authenticator: {
                    temp_secret: secret,
                  },
                },
              },
            }
          );
        resolve({ secret: secret.base32, QRCodeURL });
      } else {
        reject({ message: "Incorrect Credentials" });
      }
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * @description
 */
export const verifyAuthenticator = (userId: UserId, token: string) => {
  return new Promise<IVerifyAuthenticatorResp>(async (resolve, reject) => {
    if (!userId || !token)
      return reject({ message: "Please Provide UserId and Token" });
    try {
      const userFound = await db
        .get()
        ?.collection(collections.USER)
        .findOne({ _id: new ObjectId(userId) });

      if (userFound && userFound.accountDetails.authenticator.enable) {
        return reject({ message: "Authenticator Already Enabled" });
      } else if (userFound && !userFound.accountDetails.authenticator.enable) {
        const user = userFound;
        const temp_secret: GeneratedSecret =
          user.accountDetails.authenticator.temp_secret;

        const verified = await verifySpeakeasy(token, temp_secret);

        if (verified) {
          await db
            .get()
            ?.collection(collections.USER)
            .updateOne(
              { _id: new ObjectId(userId) },
              {
                $set: {
                  accountDetails: {
                    authenticator: {
                      enable: true,
                      secret: temp_secret,
                    },
                  },
                },
              }
            );
          return resolve({
            message: "Authenticator Registered Successfully",
            verified,
          });
        } else {
          return reject({
            message: "Authenticator Verification Failed",
          });
        }
      } else {
        reject({
          message: "Incorrect Credentials",
        });
      }
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * @description
 */
export const validateAuthenticator = (userId: UserId, token: string) => {
  return new Promise<IVerifyAuthenticatorResp>(async (resolve, reject) => {
    if (!userId || !token)
      return reject({ message: "Please Provide UserId and Token" });
    try {
      const userFound = await db
        .get()
        ?.collection(collections.USER)
        .findOne({ _id: new ObjectId(userId) });

      if (userFound && !userFound.accountDetails.authenticator.enable) {
        return reject({ message: "Authenticator Already Disabled" });
      } else if (userFound && userFound.accountDetails.authenticator.enable) {
        const user = userFound;
        const secret: GeneratedSecret =
          user.accountDetails.authenticator.secret;

        const verified = await verifySpeakeasy(token, secret);

        if (verified) {
          return resolve({
            message: "Authenticator Access Granded",
            verified,
          });
        } else {
          return reject({
            message: "Authenticator Access Denied",
          });
        }
      } else {
        reject({
          message: "Incorrect Credentials",
        });
      }
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * @description
 */
export const disableAuthenticator = (userId: UserId) => {
  return new Promise<IAuthResponse>(async (resolve, reject) => {
    if (!userId) return reject({ message: "Please Provide UserId" });
    try {
      const userFound = await db
        .get()
        ?.collection(collections.USER)
        .findOne({ _id: new ObjectId(userId) });

      if (userFound && !userFound.accountDetails.authenticator.enable) {
        return reject({
          message: "Authenticator Already Denied",
        });
      } else if (userFound && userFound.accountDetails.authenticator.enable) {
        await db
          .get()
          ?.collection(collections.USER)
          .updateOne(
            { _id: new ObjectId(userId) },
            {
              $set: {
                accountDetails: {
                  authenticator: {
                    enable: false,
                  },
                },
              },
            }
          );
        return resolve({
          message: "Authenticator Disabled",
        });
      } else {
        reject({
          message: "Incorrect Credentials",
        });
      }
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        code: error.code || error.name,
      });
    }
  });
};
