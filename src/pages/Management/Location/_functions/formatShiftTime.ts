const formatShiftTime = (time: string) =>
    time.replace('+07', ' ').slice(0, 5);

export default formatShiftTime;