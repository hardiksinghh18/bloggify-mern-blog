import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserInfo {
    _id: string;
    name: string;
    email: string;
    bio?: string;
    profileImage?: string;
}

interface AuthState {
    isAuthenticated: boolean;
    userInfo: UserInfo | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    userInfo: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: UserInfo; valid: boolean }>) => {
            state.userInfo = action.payload.user;
            state.isAuthenticated = action.payload.valid;
        },
        setAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        },
        setUserInfo: (state, action: PayloadAction<UserInfo | null>) => {
            state.userInfo = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.userInfo = null;
        },
    },
});

export const { setCredentials, setAuthenticated, setUserInfo, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectUserInfo = (state: { auth: AuthState }) => state.auth.userInfo;
