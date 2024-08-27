import { AxiosResponse } from "axios";

export const convertAxiosResponseImageToString = (
    res: AxiosResponse<ArrayBuffer, object>,
): string => {
    const image = btoa(
        new Uint8Array(res.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            "",
        ),
    );
    return `data:${res.headers["content-type"].toLowerCase()};base64,${image}`;
};