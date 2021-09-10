import { GeneratedSecret } from "speakeasy";

export interface IAccountStatus {
  status: "Inactive" | "Active" | "Blocked";
  blockedType?: "Permanently" | "Temporarily" | null;
  blockedUntil?: Date | null;
  blockedreason?: string[];
  blockedCount?: number;
}

export interface IAccountDetails {
  resetPasswdAccess?: boolean;
  lastPassword?: string;
  lastResetPasswd?: Date;
  resetPasswdAttempt?: number;
  authenticator: {
    enable: boolean;
    secret?: GeneratedSecret;
  };
}

export interface IAccountLogs {
  createdAt: Date;
  lastSync?: Date;
  currentIP?: string;
}

export interface ILoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  twoStepVerification?: boolean;
}

export interface IAuthResponse {
  message: string;
}

export interface IUpgradeAccessToken {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export interface IGenerateAuthenticatorResp {
  secret: string;
  QRCodeURL: string;
}
export interface IVerifyAuthenticatorResp {
  message: string;
  verified: boolean;
}
