import { useGetSensorTypeQuery } from '@/stores/managementStore/sensorStore/sensorStoreApi';
import { BasicSelectOpt as IBasicSelectOption } from '@/types/global';

interface ReturnVal {
    arr: IBasicSelectOption<number>[];
    isLoading: boolean;
}

interface Props { }

const useSensortypeOptions = (
    _: Props,
    opt?: { skip?: boolean },
): ReturnVal => {
    const {
        data,
        isLoading: loading,
        isFetching,
    } = useGetSensorTypeQuery({}, { skip: opt?.skip });
    const isLoading = loading || isFetching;

    if (!data || data.length < 1)
        return {
            arr: [],
            isLoading,
        };
    return {
        arr: data.map((val) => {
            return {
                label: val.name ?? '',
                value: val.id,
            };
        }),
        isLoading,
    };
};

export default useSensortypeOptions;
