import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

//configureStore: включает devtools включает immer включает хорошие defaults
export const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

//Типы для TypeScript (используются в useSelector / middleware)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
