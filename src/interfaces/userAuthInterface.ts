import { ObjectId } from "mongodb";
import { IUser } from "./userInterfaces";

export interface IUserLoginResponse {
  message: string;
  userId?: string | ObjectId;
  accessToken?: string;
  refreshToken?: string;
  twoStepVerification?: boolean;
}

export interface IVerifyPasswdResponse {
  message: string;
  userId: IUser["_id"];
  verified: boolean;
}

export interface IUserStatusResponse {
  message: string;
  userId: IUser["_id"];
  name: IUser["name"];
  email: IUser["email"];
  role: IUser["role"];
}
