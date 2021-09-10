import { Document, ObjectId } from "mongodb";
import { IAccountDetails, IAccountLogs, IAccountStatus } from "./authInterface";

export interface IAdmin extends Document {
  _id: ObjectId | undefined;
  name: string;
  email: string;
  profile?: string | null;
  password: string;
  mobile: number;
  role: "ADMIN" | "SUPER_ADMIN";
  twoStepVerification: boolean;
  accountStatus?: IAccountStatus;
  accountDetails: IAccountDetails;
  accountLogs: IAccountLogs;
}
