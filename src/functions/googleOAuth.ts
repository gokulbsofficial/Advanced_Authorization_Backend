import { OAuth2Client } from "google-auth-library";
import config from "../config/default";

const { CLIENT_GOOGLE_AUTH_CLIENT_ID } = config.CLIENT;

const client = new OAuth2Client({
  clientId: CLIENT_GOOGLE_AUTH_CLIENT_ID,
});

const verifyGoogleOAth = async (token: string) => {
  return new Promise<any>(async (resolve, reject) => {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_GOOGLE_AUTH_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      resolve(payload);
    } catch (error) {
      reject({
        message: error.message || error.msg,
        code: error.code || error.name,
      });
    }
  });
};

export default verifyGoogleOAth;
