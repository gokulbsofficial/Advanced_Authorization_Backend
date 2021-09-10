import { Response } from "express";
import config from "../config/default";

const {
  SERVER_NODE_ENV,
  SERVER_REFRESH_TOKEN_EXPIRE,
  SERVER_ACCESS_TOKEN_EXPIRE,
} = config.SERVER;

type cookieParams = (
  name: "AccessToken" | "RefreshToken" | "T",
  value: string,
  res: Response
) => void;

const setCookies: cookieParams = (name, value, res) => {
  try {
    if (name === "AccessToken") {
      res.cookie(name, value, {
        httpOnly: true,
        secure: SERVER_NODE_ENV === "production" ? true : false,
        expires: new Date(
          new Date().getTime() + parseInt(SERVER_ACCESS_TOKEN_EXPIRE)
        ),
        sameSite: "strict",
      });
      res.cookie("AccessSession", true, {
        httpOnly: true,
        expires: new Date(
          new Date().getTime() + parseInt(SERVER_ACCESS_TOKEN_EXPIRE)
        ),
      });
      return;
    } else if (name === "RefreshToken") {
      res.cookie(name, value, {
        httpOnly: true,
        secure: SERVER_NODE_ENV === "production" ? true : false,
        expires: new Date(
          new Date().getTime() + parseInt(SERVER_REFRESH_TOKEN_EXPIRE)
        ),
        sameSite: "strict",
      });
      res.cookie("RefreshSession", true, {
        httpOnly: true,
        expires: new Date(
          new Date().getTime() + parseInt(SERVER_REFRESH_TOKEN_EXPIRE)
        ),
      });
      return;
    }
  } catch (error: any) {
    return { msg: error.message };
  }
};

export default setCookies;
