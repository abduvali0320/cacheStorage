import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import TestSlice from "./Features/TestSlice";

export const Store = configureStore({
    reducer: {
        TestSlice,
    },
});

export const useAppDispatch: () => typeof Store.dispatch = useDispatch;

export type RootState = ReturnType<typeof Store.getState>;
export default Store;
