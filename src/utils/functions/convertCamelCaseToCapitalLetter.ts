const convertCamelCaseToCapitalLetter = (
    camelCaseString: string,
) => {
    // Use regular expression to split camel case string
    const words = camelCaseString.split(/(?=[A-Z])/);

    // Capitalize each word and join them with a space
    const capitalLetterString = words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return capitalLetterString;
};

export default convertCamelCaseToCapitalLetter;