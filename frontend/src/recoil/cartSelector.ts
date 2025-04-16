import { selector } from "recoil";
import { cartState } from "./cartState";


export const cartArraySelector = selector({
    key: 'cartArraySelector',
    get: ({ get }) => {
        const cart = get(cartState);
        return Object.entries(cart).map(([foodItemId, quantity]) => ({
            foodItemId,
            quantity
        }))
    }
})