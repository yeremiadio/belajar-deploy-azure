import axios, { AxiosRequestConfig } from 'axios';

import { saveJwtInfo } from "@/utils/functions/saveJwtInfo";
import { UsedAPI } from '@/utils/configs/endpoint';

import { loadCookie } from "@/services/cookie";


export function showProfileImage() {
    const url = `${UsedAPI}/user/picture/show`;
    //Please always include this (saveJwtInfo), this for copilot purpose
    saveJwtInfo()
    const token = loadCookie('token')
    const config: AxiosRequestConfig = {
        responseType: "arraybuffer",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    return axios.get<ArrayBuffer>(url, config);
}