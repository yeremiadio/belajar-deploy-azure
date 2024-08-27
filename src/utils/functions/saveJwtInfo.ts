import { jwtDecode } from 'jwt-decode';

import { saveTheseCookies, loadCookie } from "@/services/cookie";

// if the url containt query param "token", this case is used to access without login
export const saveJwtInfo = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const tokenJwt = urlSearchParams.get("token") || "";
  const tokenCookie = loadCookie('token')
  if (tokenJwt) {
    const tokenJwtDecode: { username: string, companyName: string, usertypeName: string, exp: number } = jwtDecode(tokenJwt);
    if (tokenJwtDecode) {
      const expirationDate = new Date(tokenJwtDecode.exp * 1000);
      const loggedUserObject = {
        token: tokenJwt,
        username: tokenJwtDecode?.username ?? "",
        companyName: tokenJwtDecode?.companyName ?? "",
        usertypeName: tokenJwtDecode?.usertypeName ?? "",
      };
      if (!tokenCookie) {
        saveTheseCookies(loggedUserObject, { expires: expirationDate });
      }
    }
  }
}