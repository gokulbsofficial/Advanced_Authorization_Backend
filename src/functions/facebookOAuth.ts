import axios from "axios";

const verifyFacebookOAuth = (facebookId: number, accessToken: string) => {
  return new Promise<any>((resolve, reject) => {
    const URI = `https://graph.facebook.com/v2.11/${facebookId}?fields=id,name,email,picture{URI}&access_token=${accessToken}`;
    axios(URI, {
      method: "GET",
    })
      .then((payload: any) => {
        resolve(payload?.data);
      })
      .catch((error: any) => {
        reject({
          message: error.message || error.msg,
          code: error.code || error.name,
        });
      });
  });
};

export default verifyFacebookOAuth;
