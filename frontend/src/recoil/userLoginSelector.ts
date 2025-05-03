import { selector } from "recoil";
import { loginState } from "./loginState";

export const userLoginSelector = selector({
    key: 'userLoginSelector',
    get: ({ get }) => {
        const user = get(loginState);
        return user.isLoggedIn;
    }
})