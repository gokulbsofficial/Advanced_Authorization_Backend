import { ObjectId, Document } from "mongodb";
import { IAccountDetails, IAccountLogs, IAccountStatus } from "./authInterface";

export interface IUser extends Document {
  _id?: ObjectId | undefined;
  name: string;
  email: string;
  password: string;
  profile?: string | null;
  mobile?: number | null;
  googleId?: string | number;
  facebookId?: number;
  role?: "USER";
  methods: string[];
  twoStepVerification: boolean;
  accountStatus: IAccountStatus;
  accountDetails: IAccountDetails;
  accountLogs: IAccountLogs;
}
