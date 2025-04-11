import { atom } from "recoil";

export const cartState = atom({
    key: 'cartState',
    default: {} as Record<string, number>,
})