import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/default";
import { IAdmin } from "../interfaces/adminInterface";
import { IUser } from "../interfaces/userInterfaces";
import { TokenType } from "../types/default";

const {
  JWT_ACCESS_EXPIRE,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_EXPIRE,
  JWT_REFRESH_SECRET,
  JWT_ACTIVATION_EXPIRE,
  JWT_ACTIVATION_SECRET,
  JWT_RESET_EXPIRE,
  JWT_RESET_SECRET,
  JWT_ISSUER,
} = config.JWT;

interface IPayload {
  userId?: IUser["_id"];
  adminId?: IAdmin["_id"];
  name?: IAdmin["name"] | IUser["name"];
  email: IAdmin["email"] | IUser["email"];
}

export const generateJwtToken = (payload: IPayload, type: TokenType) => {
  return new Promise<string>(async (resolve, reject) => {
    switch (type) {
      case "ACCESS_TOKEN":
        jwt.sign(
          {
            userId: payload.userId,
            email: payload.email,
          },
          JWT_ACCESS_SECRET,
          {
            issuer: JWT_ISSUER,
            subject: type,
            audience: payload.name,
            expiresIn: JWT_ACCESS_EXPIRE,
          },
          (err, token) => {
            if (err) {
              return reject({
                name: err.name,
                msg: err.message,
                stack: err.stack,
              });
            }
            if (token) {
              return resolve(token);
            } else {
              reject({ msg: "Token Generation failed" });
            }
          }
        );
        break;
      case "REFRESH_TOKEN":
        jwt.sign(
          {
            userId: payload.userId,
            email: payload.email,
          },
          JWT_REFRESH_SECRET,
          {
            issuer: JWT_ISSUER,
            subject: type,
            audience: payload.name,
            expiresIn: JWT_REFRESH_EXPIRE,
          },
          (err, token) => {
            if (err) {
              return reject({
                name: err.name,
                msg: err.message,
                stack: err.stack,
              });
            }
            if (token) {
              return resolve(token);
            } else {
              reject({ msg: "Token Generation failed" });
            }
          }
        );
        break;
      case "RESET_TOKEN":
        jwt.sign(
          {
            userId: payload.userId,
            email: payload.email,
          },
          JWT_RESET_SECRET,
          {
            issuer: JWT_ISSUER,
            subject: type,
            audience: payload.name,
            expiresIn: JWT_RESET_EXPIRE,
          },
          (err, token) => {
            if (err) {
              return reject({
                name: err.name,
                msg: err.message,
                stack: err.stack,
              });
            }
            if (token) {
              return resolve(token);
            } else {
              reject({ msg: "Token Generation failed" });
            }
          }
        );
        break;
      case "ACTIVATION_TOKEN":
        jwt.sign(
          {
            userId: payload.userId,
            email: payload.email,
          },
          JWT_ACTIVATION_SECRET,
          {
            issuer: JWT_ISSUER,
            subject: type,
            audience: payload.name,
            expiresIn: JWT_ACTIVATION_EXPIRE,
          },
          (err, token) => {
            if (err) {
              return reject({
                name: err.name,
                msg: err.message,
                stack: err.stack,
              });
            }
            if (token) {
              return resolve(token);
            } else {
              reject({ msg: "Token Generation failed" });
            }
          }
        );
        break;
      default:
        return reject({ msg: "Default" });
    }
  });
};

export const verifyJwtToken = (token: string, type: TokenType) => {
  return new Promise<JwtPayload>(async (resolve, reject) => {
    switch (type) {
      case "ACCESS_TOKEN":
        jwt.verify(token, JWT_ACCESS_SECRET, (err, decoded) => {
          if (err) {
            return reject({
              name: err.name,
              msg: err.message,
              stack: err.stack,
            });
          }
          if (decoded) {
            return resolve(decoded);
          } else {
            reject({ msg: "Token verification failed" });
          }
        });
        break;
      case "REFRESH_TOKEN":
        jwt.verify(token, JWT_REFRESH_SECRET, (err, decoded) => {
          if (err) {
            return reject({
              name: err.name,
              msg: err.message,
              stack: err.stack,
            });
          }
          if (decoded) {
            return resolve(decoded);
          } else {
            reject({ msg: "Token verification failed" });
          }
        });
        break;
      case "RESET_TOKEN":
        jwt.verify(token, JWT_RESET_SECRET, (err, decoded) => {
          if (err) {
            return reject({
              name: err.name,
              msg: err.message,
              stack: err.stack,
            });
          }
          if (decoded) {
            return resolve(decoded);
          } else {
            reject({ msg: "Token verification failed" });
          }
        });
        break;
      case "ACTIVATION_TOKEN":
        jwt.verify(token, JWT_ACTIVATION_SECRET, (err, decoded) => {
          if (err) {
            return reject({
              name: err.name,
              msg: err.message,
              stack: err.stack,
            });
          }
          if (decoded) {
            return resolve(decoded);
          } else {
            reject({ msg: "Token verification failed" });
          }
        });
        break;
      default:
        return reject({ msg: "Default" });
    }
  });
};
