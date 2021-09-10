import speakeasy, { GeneratedSecret } from "speakeasy";
import QRCode from "qrcode";

export interface IGeneratedSpeakeasyResp {
  secret: GeneratedSecret;
  QRCodeURL: string;
}

/**
 * 
 * @returns 
 */
export const generateSpeakeasy = () => {
  return new Promise<IGeneratedSpeakeasyResp>(async (resolve, reject) => {
    try {
      const secret: GeneratedSecret = await speakeasy.generateSecret();

      // Get the data URL of the authenticator URL
      const QRCodeURL: string = await QRCode.toDataURL(
        secret?.otpauth_url ?? ""
      );

      resolve({ secret, QRCodeURL });
    } catch (error) {}
  });
};

/**
 * 
 * @returns 
 */
export const verifySpeakeasy = (token: string, secret: GeneratedSecret) => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const base32secret: string = secret.base32;

      const verified: boolean = speakeasy.totp.verify({
        secret: base32secret,
        encoding: "base32",
        token,
      });

      resolve(verified);
    } catch (error) {}
  });
};
