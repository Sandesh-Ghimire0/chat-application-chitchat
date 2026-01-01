import { useDispatch, useSelector } from "react-redux";
import type {TypedUseSelectorHook} from 'react-redux'
import type { RootState, AppDispatch } from "../store/store";

// Use throughout your app instead of plain hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
