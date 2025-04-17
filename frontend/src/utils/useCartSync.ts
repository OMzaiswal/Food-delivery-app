import { useRecoilValue } from "recoil"
import { cartArraySelector } from "../recoil/cartSelector"
import { useEffect } from "react";
import debounce from "lodash.debounce";
import { api } from "../api/axiosInstatnce";


export const useCartSync = () => {
    const cartItems = useRecoilValue(cartArraySelector);

    useEffect(() => {
        if (cartItems.length === 0) return;

        const syncToBackend = debounce(async () => {
            try {
                await api.post('/cart/sync', { items: cartItems })
            } catch(err) {
                console.error("Failed to sync cart: ", err);
            }
        }, 1000)

        syncToBackend();
        return () => syncToBackend.cancel();
    }, [cartItems])
}