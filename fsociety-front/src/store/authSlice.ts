import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

//  Это форма данных, которые Redux будет хранить. Сейчас — только accessToken.
type AuthState = {
  accessToken: string | null;
};

// Начальное состояние. Так как мы НЕ используем storage после перезагрузки страницы accessToken = null.
const initialState: AuthState = {
  accessToken: null,
};

// createSlice: создаёт reducer создаёт actions
const authSlice = createSlice({
  name: "auth",
  initialState,

  // reducers — единственное место, где можно менять состояние Redux
  reducers: {
    //Сохраняем access-token в памяти
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },

    // Удаляем access-token (logout / refresh failed)
    clearAccessToken(state) {
      state.accessToken = null;
    },
  },
});

export const { setAccessToken, clearAccessToken } = authSlice.actions;
export default authSlice.reducer;
