export const extractColorsFromLinearGradient = (
    linearGradient: string,
  ): [string, string] => {
    const matches = linearGradient.match(/#([a-f0-9]{6}|[a-f0-9]{3})/gi);
    if (matches && matches.length >= 2) {
      return [matches[0], matches[matches.length - 1]];
    }
    throw new Error("Invalid linear-gradient value");
  };