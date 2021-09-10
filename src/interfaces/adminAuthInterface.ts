import { IAdmin } from "./adminInterface";

export interface IVerifyPasswdResponse {
  message: string;
  adminId: IAdmin["_id"];
  verified: boolean;
}

export interface IAdminStatusResponse {
  message: string;
  adminId: IAdmin["_id"];
  name: IAdmin["name"];
  email: IAdmin["email"];
  role: IAdmin["role"];
}
