const generateThresholdAlertLabel = (value: number): string => {
    let op = "";
    let word = "";
    switch (value) {
        case -2:
            // less than or equal
            op = "\u2264";
            word = "less than equal";
            break;
        case -1:
            op = "\u003C";
            word = "less than";
            break;
        case 1:
            op = "\u003E";
            word = "more than";
            break;
        case 2:
            op = "\u2265";
            word = "more than equal";
            break;
        case 3:
            op = "{}";
            word = "range";
            break;
        default:
            break;
    }
    return `${op} ${word}`;
}

export default generateThresholdAlertLabel;