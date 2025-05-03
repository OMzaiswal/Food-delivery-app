import { useEffect } from "react"
import { Link } from "react-router-dom"
import { api } from "../api/axiosInstatnce"
import { useSetRecoilState } from "recoil"
import { cartState } from "../recoil/cartState"

export const PaymentSuccess = () => {

    const setCartState = useSetRecoilState(cartState);

    useEffect(() => {
        const finalizeOrder = async () => {
            try {
                await api.post('/user/finalize-order');
                await api.delete('/cart/removeCart');

                setCartState({});
                
            } catch(err) {
                console.log('Your error: ',err)
            }
        }
        finalizeOrder();
    }, [])

    return (
        <div className="flex flex-col items-center mt-30 h-screen space-y-6">
            <h1 className="text-5xl font-bold text-green-600">Payment Successful</h1>
            <p className="text-xl text-gray-700">Your order has been placed successfully!</p>
            <div className="flex space-x-4 mt-4">
                <Link to='/orders' className="px-6 py-3 bg-blue-500 text-white rounded-md hover:scale-105">
                    Track Your Order
                </Link>
                <Link to='/' className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:scale-105">
                    Back to Home
                </Link>
            </div>
        </div>
    )
}