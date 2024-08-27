import { AppDispatch } from "@/stores";
import { useDispatch } from "react-redux";

const useAppDispatch = () => {
    return useDispatch<AppDispatch>();
};

export default useAppDispatch;

