import db from "../config/connection";
import { IAccountStatus } from "../interfaces/authInterface";

type checkStatusParams = (
  accountStatus: IAccountStatus,
  email: string,
  collection: string,
  check: string[]
) => Promise<boolean>;

const checkStatus: checkStatusParams = (
  accountStatus,
  email,
  collection,
  check
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { status, blockedUntil, blockedType } = accountStatus;
      if (check) {
        if (check.includes("Blocked") && status === "Blocked") {
          if (blockedType === "Permanently") {
            return reject({
              message: "Your account is Permanently blocked",
            });
          } else if (blockedType === "Temporarily" && blockedUntil) {
            if (blockedUntil.getTime() <= new Date().getTime()) {
              await db
                .get()
                ?.collection(collection)
                .updateOne(
                  { email },
                  {
                    $set: {
                      accountStatus: {
                        status: "Active",
                        blockedUntil: null,
                        blockedType: null,
                      },
                    },
                  }
                );
            } else {
              return reject({
                message: `Your account is Temporarily blocked upto ${blockedUntil.toLocaleString()}`,
              });
            }
          } else {
            return reject({
              message: "Your account is blocked",
            });
          }
        }

        if (check.includes("Inactive") && status === "Inactive") {
          return reject({
            message: "Your account is inactive, active your account and login",
          });
        }

        if (check.includes("Active") && status === "Active") {
          return reject({
            message: "Your account already active, do login",
          });
        }
      }
      return resolve(true);
    } catch (error: any) {
      reject({ message: error.message || error.msg, code: error.code });
    }
  });
};

export default checkStatus;
