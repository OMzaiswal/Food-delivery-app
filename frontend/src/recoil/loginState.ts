import { atom } from "recoil";

export interface LoginState {
    isLoggedIn: boolean;
    role: 'user' | 'admin' | null;
    fullName: string | null;
}

export const loginState = atom<LoginState>({
    key: 'loginState',
    default: {
        isLoggedIn: false,
        role: null,
        fullName: null
    }
})