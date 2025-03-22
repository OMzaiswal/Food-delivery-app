import { atom } from "recoil";

export const cartState = atom({
    key: 'cardState',
    default: {} as Record<string, number>,
})