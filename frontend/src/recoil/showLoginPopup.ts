import { atom } from "recoil";

export const showLoginPopup = atom<boolean>({
    key: 'showLoginPopup',
    default: false
})