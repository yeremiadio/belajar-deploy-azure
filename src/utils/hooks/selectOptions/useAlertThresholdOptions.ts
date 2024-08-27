import { BasicSelectOpt } from "@/types/global";
import generateThresholdAlertLabel from "@/utils/functions/generateThresholdAlertLabel";

type Props = {
    thresholdNumber: number;
}

type TAlertThresholdOptions = BasicSelectOpt<number>[]

const useAlertThresholdOptions = ({ thresholdNumber }: Props): { arr: TAlertThresholdOptions } => {
    const generateThresholdArray = (): TAlertThresholdOptions => {
        const val: TAlertThresholdOptions = [];
        for (let i = -2; i <= thresholdNumber; i++) {
            if ([0, 3].indexOf(i) === -1) {
                val.push({
                    value: i,
                    label: generateThresholdAlertLabel(i),
                });
            }
        }
        return val;
    };

    return { arr: generateThresholdArray() }
}

export default useAlertThresholdOptions;