/* Imported Modules */
import { Request, Response, NextFunction } from "express";
import { IAdmin } from "../interfaces/adminInterface";
import { IUser } from "../interfaces/userInterfaces";

interface IRequest extends Request {
  admin?: {
    adminId?: IAdmin["_id"];
    name: IAdmin["name"];
    email: IAdmin["email"];
    role: IAdmin["role"];
  };
  user?: {
    userId: IUser["_id"];
    name: IUser["name"];
    email: IUser["email"];
    role: IUser["role"];
  };
}

/* Custom Types */
export type ApiParams = (
  request: IRequest,
  response: Response,
  next: NextFunction
) => void;

export type LoggerParams = (
  namespace: string,
  message: string,
  additional?: object | string
) => void;

export type TokenType =
  | "ACCESS_TOKEN"
  | "REFRESH_TOKEN"
  | "RESET_TOKEN"
  | "ACTIVATION_TOKEN"
  | "LINKING_ACCESS_TOKEN";
