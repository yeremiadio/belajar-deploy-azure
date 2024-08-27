import { TAlertSignType } from "@/types/api/management/alert";

const transformThresholdAlertValue = (sign: TAlertSignType, value: number): string => {
    let op = "";
    switch (sign) {
        case -2:
            // less than or equal
            op = "\u2264";
            break;
        case -1:
            op = "\u003C";
            break;
        case 1:
            op = "\u003E";
            break;
        case 2:
            op = "\u2265";
            break;
        default:
            break;
    }
    return `${op} ${value}`;
}

export default transformThresholdAlertValue;