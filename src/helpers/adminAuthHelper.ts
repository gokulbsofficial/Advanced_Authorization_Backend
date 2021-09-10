/* Installed Imported Modules */
import bcrypt from "bcryptjs";

/* Custom Imported Modules */
import db from "../config/connection";
import collections from "../config/collections";
import { generateJwtToken, verifyJwtToken } from "../functions/jwt";
import { IAdmin } from "../interfaces/adminInterface";
import checkStatus from "../functions/checkStatus";
import { ObjectId } from "mongodb";
import {
  IAuthResponse,
  IGenerateAuthenticatorResp,
  ILoginResponse,
  IUpgradeAccessToken,
  IVerifyAuthenticatorResp,
} from "../interfaces/authInterface";
import {
  IAdminStatusResponse,
  IVerifyPasswdResponse,
} from "../interfaces/adminAuthInterface";
import { generatePassword } from "../functions/default";
import { generateSpeakeasy, verifySpeakeasy } from "../functions/authenticator";
import { GeneratedSecret } from "speakeasy";

type AdminId = IAdmin["_id"];

/**
 * @description Login for existing User
 */
export const adminLogin = (email: string, password: string) => {
  return new Promise<ILoginResponse>(async (resolve, reject) => {
    if (!email || !password)
      return reject({ message: "Please Provide Email and Password" });
    try {
      const adminFound = await db
        .get()
        ?.collection(collections.ADMIN)
        .findOne({ email: email });

      if (adminFound) {
        const admin = adminFound;
        const { accountStatus } = admin;

        if (admin.role === "ADMIN" && accountStatus) {
          await checkStatus(accountStatus, admin.email, collections.ADMIN, [
            "Blocked",
            "Inactive",
          ]);
        }

        if (admin.role === "ADMIN" || admin.role === "SUPER_ADMIN") {
          const isMatch = await bcrypt.compare(password, admin.password);
          if (isMatch) {
            const accessToken = await generateJwtToken(
              { adminId: admin._id, email: admin.email, name: admin.name },
              "ACCESS_TOKEN"
            );
            const refreshToken = await generateJwtToken(
              { adminId: admin._id, email: admin.email, name: admin.name },
              "REFRESH_TOKEN"
            );
            await db
              .get()
              ?.collection(collections.REFRESH_TOKEN)
              .insertOne({
                refreshToken,
                adminId: new ObjectId(admin._id),
                attempt: 0,
              });
            await db
              .get()
              ?.collection(collections.ADMIN)
              .updateOne(
                { email: admin.email },
                { $set: { accountLogs: { lastSync: new Date() } } }
              );
            return resolve({
              accessToken,
              refreshToken,
              twoStepVerification: admin.twoStepVerification,
              message: "Login Successfully",
            });
          } else {
            return reject({ message: "Incorrect credentials" });
          }
        } else {
          return reject({ message: "Permission Denied" });
        }
      } else {
        return reject({ message: "Incorrect Email" });
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
export const addAdmin = (name: string, email: string, mobile: number) => {
  return new Promise<IAuthResponse>(async (resolve, reject) => {
    if (!name || !email || !mobile)
      return reject({ message: "Please Provide Name And Email" });
    try {
      const adminFound = await db
        .get()
        ?.collection(collections.ADMIN)
        .findOne({ $or: [{ email, mobile }] });

      if (adminFound) {
        return reject({ message: "USER Already Exist" });
      } else {
        const password: string = await generatePassword();
        const hashedPassword: string = await bcrypt.hash(password, 10);

        const result = await db
          .get()
          ?.collection(collections.ADMIN)
          .insertOne({
            name,
            email,
            password: hashedPassword,
            role: "ADMIN",
            mobile,
            twoStepVerification: false,
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
        // const URL = `https://${CLIENT_HOST}/${activationToken}`;
        console.log(activationToken);

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
export const viewAdmins = () => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const adminFound = await db
        .get()
        ?.collection(collections.ADMIN)
        .find()
        .toArray();

      if (adminFound && adminFound.length > 0) {
        return resolve(adminFound);
      } else {
        return reject({ message: "Admin Empty" });
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
export const viewUsers = () => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const userFound = await db
        .get()
        ?.collection(collections.USER)
        .find({ name: 1, email: 1, accountStatus: 1 });

      if (userFound) {
        return resolve(userFound);
      } else {
        return reject({ message: "User Empty" });
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
export const accountActivation = (token: string, password: string) => {
  return new Promise<IAuthResponse>(async (resolve, reject) => {
    if (!token) return reject({ message: "Please Provide Token" });
    try {
      const decoded = await verifyJwtToken(token, "ACTIVATION_TOKEN");

      const adminFound = await db
        .get()
        ?.collection(collections.ADMIN)
        .findOne({
          $or: [
            { _id: new ObjectId(decoded.adminId) },
            { email: decoded.email },
          ],
        });

      if (adminFound) {
        const admin = adminFound;

        if (admin.role === "SUPER_ADMIN") {
          return reject({ message: "Only Admin route" });
        }

        const { accountStatus } = admin;

        await checkStatus(accountStatus, admin.email, collections.ADMIN, [
          "Blocked",
          "Active",
        ]);

        if (accountStatus.status === "Inactive") {
          const hashedPassword: string = await bcrypt.hash(password, 10);

          await db
            .get()
            ?.collection(collections.ADMIN)
            .updateOne(
              { email: admin.email },
              {
                $set: {
                  password: hashedPassword,
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
export const resetPassword = (token: string, password: string) => {
  return new Promise<IAuthResponse>(async (resolve, reject) => {
    if (!token || !password)
      return reject({ message: "Please Provide Token and Password" });
    try {
      const decoded = await verifyJwtToken(token, "RESET_TOKEN");

      if (decoded.aud) {
        const adminFound = await db
          .get()
          ?.collection(collections.ADMIN)
          .findOne({
            $or: [{ _id: new ObjectId(decoded._id) }, { email: decoded.email }],
          });
        if (adminFound && adminFound.length > 0) {
          let admin: IAdmin = adminFound[0];
          const { accountStatus, accountDetails } = admin;

          if (admin.role === "ADMIN" && accountStatus) {
            await checkStatus(accountStatus, admin.email, collections.ADMIN, [
              "Blocked",
              "Inactive",
            ]);
          }

          if (accountDetails.resetPasswdAccess) {
            const isMatch = await bcrypt.compare(password, admin.password);
            if (isMatch) {
              return reject({
                message: "New Pasword and Old Password is Same",
              });
            } else {
              const hashedPassword = await bcrypt.hash(password, 10);
              const resetPasswdAttempt =
                (accountDetails.resetPasswdAttempt || 0) + 1;
              const lastResetPasswd: Date = new Date();

              await db
                .get()
                ?.collection(collections.ADMIN)
                .updateOne(
                  { email: admin.email },
                  {
                    $set: {
                      password: hashedPassword,
                      accountDetails: {
                        resetPasswdAccess: false,
                        lastPassword: admin.password,
                        resetPasswdAttempt,
                        lastResetPasswd,
                      },
                    },
                  }
                );

              return resolve({ message: "Password Reset Successfully" });
            }
          } else {
            return reject({
              message: "Reset Password Permission Denied",
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
export const verifyPassword = (adminId: AdminId, password: string) => {
  return new Promise<IVerifyPasswdResponse>(async (resolve, reject) => {
    if (!adminId || !password)
      return reject({ message: "Please Provide AdminId and Password" });
    try {
      const adminFound = await db
        .get()
        ?.collection(collections.ADMIN)
        .findOne({ _id: new ObjectId(adminId) });

      if (adminFound) {
        const admin = adminFound;
        const isMatch = await bcrypt.compare(password, admin.password);

        if (isMatch) {
          return resolve({
            message: "Password Verified",
            adminId: admin._id,
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
export const checkAdminStatus = (adminId: AdminId, role: IAdmin["role"]) => {
  return new Promise<IAdminStatusResponse>(async (resolve, reject) => {
    if (!adminId) return reject({ message: "Please Provide AdminId" });
    try {
      const adminFound = await db
        .get()
        ?.collection(collections.ADMIN)
        .findOne({ _id: new ObjectId(adminId) });

      if (adminFound) {
        const admin = adminFound;
        const { accountStatus } = admin;

        if (admin.role === "ADMIN" && accountStatus) {
          await checkStatus(accountStatus, admin.email, collections.ADMIN, [
            "Blocked",
            "Inactive",
          ]);
        }

        if (role === "ADMIN") {
          if (admin.role === "ADMIN" || admin.role === "SUPER_ADMIN") {
            return resolve({
              message: "Access Granded",
              adminId: admin._id,
              name: admin.name,
              email: admin.email,
              role: admin.role,
            });
          } else {
            return reject({ message: "Permission Denied" });
          }
        } else if (role === "SUPER_ADMIN") {
          if (admin.role === "SUPER_ADMIN") {
            return resolve({
              message: "Access Granded",
              adminId: admin._id,
              name: admin.name,
              email: admin.email,
              role: admin.role,
            });
          } else {
            return reject({ message: "Permission Denied" });
          }
        } else {
          return reject({ message: "Permission Denied" });
        }
      } else {
        return reject({ message: "Incorrect Cridentials" });
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
    if (!token) return reject({ message: "Please Provide a Token" });
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
            adminId: decoded.adminId,
            email: decoded.email,
            name: decoded.name,
          },
          "ACCESS_TOKEN"
        );
        const refreshToken = await generateJwtToken(
          {
            adminId: decoded.adminId,
            email: decoded.email,
            name: decoded.name,
          },
          "REFRESH_TOKEN"
        );
        await db
          .get()
          ?.collection(collections.REFRESH_TOKEN)
          .updateOne(
            { adminId: new ObjectId(decoded.adminId) },
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
export const generateAuthenticator = (adminId: AdminId) => {
  return new Promise<IGenerateAuthenticatorResp>(async (resolve, reject) => {
    if (!adminId) return reject({ message: "Please Provide AdminId" });
    try {
      const adminFound = await db
        .get()
        ?.collection(collections.ADMIN)
        .findOne({ _id: new ObjectId(adminId) });

      if (adminFound && adminFound.accountDetails.authenticator.enable) {
        return reject({ message: "Authenticator Already Enabled" });
      } else if (adminFound && !adminFound.accountDetails.authenticator.enable){
      const { secret, QRCodeURL } = await generateSpeakeasy();

      await db
        .get()
        ?.collection(collections.ADMIN)
        .updateOne(
          { _id: new ObjectId(adminId) },
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
export const verifyAuthenticator = (adminId: AdminId, token: string) => {
  return new Promise<IVerifyAuthenticatorResp>(async (resolve, reject) => {
    if (!adminId || !token)
      return reject({ message: "Please Provide AdminId and Token" });
    try {
      const adminFound = await db
        .get()
        ?.collection(collections.ADMIN)
        .findOne({ _id: new ObjectId(adminId) });

      if (adminFound && adminFound.accountDetails.authenticator.enable) {
        return reject({ message: "Authenticator Already Enabled" });
      } else if (
        adminFound &&
        !adminFound.accountDetails.authenticator.enable
      ) {
        const admin = adminFound;
        const temp_secret: GeneratedSecret =
          admin.accountDetails.authenticator.temp_secret;

        const verified = await verifySpeakeasy(token, temp_secret);

        if (verified) {
          await db
            .get()
            ?.collection(collections.ADMIN)
            .updateOne(
              { _id: new ObjectId(adminId) },
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
export const validateAuthenticator = (adminId: AdminId, token: string) => {
  return new Promise<IVerifyAuthenticatorResp>(async (resolve, reject) => {
    if (!adminId || !token)
      return reject({ message: "Please Provide AdminId and Token" });
    try {
      const adminFound = await db
        .get()
        ?.collection(collections.ADMIN)
        .findOne({ _id: new ObjectId(adminId) });

      if (adminFound && !adminFound.accountDetails.authenticator.enable) {
        return reject({ message: "Authenticator Already Disabled" });
      } else if (adminFound && adminFound.accountDetails.authenticator.enable) {
        const admin = adminFound;
        const verified = await verifySpeakeasy(
          token,
          admin.accountDetails.authenticator.secret
        );

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
 export const disableAuthenticator = (adminId: AdminId) => {
  return new Promise<IAuthResponse>(async (resolve, reject) => {
    if (!adminId) return reject({ message: "Please Provide AdminId" });
    try {
      const adminFound = await db
        .get()
        ?.collection(collections.ADMIN)
        .findOne({ _id: new ObjectId(adminId) });

      if (adminFound && !adminFound.accountDetails.authenticator.enable) {
        return reject({
          message: "Authenticator Already Denied",
        });
      } else if (adminFound && adminFound.accountDetails.authenticator.enable) {
        await db
          .get()
          ?.collection(collections.ADMIN)
          .updateOne(
            { _id: new ObjectId(adminId) },
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

