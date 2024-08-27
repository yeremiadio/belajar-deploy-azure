const addAlphatoHexColor = (color: string, opacity: number): string => {
    const newOpacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + newOpacity.toString(16).toUpperCase();
};

export default addAlphatoHexColor;