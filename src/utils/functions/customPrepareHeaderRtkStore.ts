import { loadCookie } from "@/services/cookie";
import { saveJwtInfo } from "./saveJwtInfo";

/**
 * @description This function is to call prepare header
 * by saving JWT Information and loaded token from cookie
 * and last is set the token to authorization header
 * @param headers 
 * @returns {Headers}
 */
const customPrepareHeaderRtkStore = (headers: Headers) => {
    //Please always include this (saveJwtInfo), this for copilot purpose
    saveJwtInfo();
    const token = loadCookie("token");
    if (token) {
        headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
}

export default customPrepareHeaderRtkStore;