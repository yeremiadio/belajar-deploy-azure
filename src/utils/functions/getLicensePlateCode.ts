export const getPrefixCode = (str: string) => {
    // Matches the prefix before the first '-'
    const match = str.match(/^[A-Z]+/);
    return match ? match[0] : '';
}

export const getSuffixCode = (str: string) => {
    // Matches the suffix after the digits
    const match = str.match(/[a-zA-Z]+$/);
    return match ? match[0] : '';
}

export const getNumericCode = (str: string) => {
    // Matches the numeric code between the '-'
    const match = str.match(/\d+/);
    return match ? match[0] : '';
}