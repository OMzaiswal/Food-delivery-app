import { useRecoilValue } from "recoil";
import { cartSubtotal } from "../store/cartSubtotal";

export const PlaceOrder = () => {

    const subtotal = useRecoilValue(cartSubtotal);

    return <div className="flex justify-between space-x-8">
        <div className="w-full">
            <h2 className="text-2xl font-bold mt-12 mb-3">Delivery Information</h2>
            <div className="grid grid-cols-2">
                <input type="text" placeholder="First name" className="py-2 border border-gray-300 rounded-sm col-span-1"/>
                <input type="text" placeholder="Last name" className="py-2 px-2 border border-gray-300 rounded-sm col-span-1"/>
                <input type="text" placeholder="Email address" className="py-2 px-4 border border-gray-300 rounded-sm col-span-2" />
            </div>
            
        </div>
        <div className="w-full">
        <h2 className="text-2xl font-bold mt-12 mb-3">Cart Total</h2>
        <div className="flex flex-col-reverse md:grid md:grid-cols-2 md:space-x-12">
            <div className="space-y-1">
                <div className="flex justify-between text-lg text-gray-500">
                    <p>Subtotal</p>
                    <p>${subtotal}</p>
                </div>
                <div className="flex justify-between text-lg text-gray-500">
                    <p>Delivery Fee</p>
                    <p>${subtotal > 0 ? 2 : 0}</p>
                </div>
                <div className="flex justify-between text-lg text-gray-500">
                    <p>Promo Discount</p>
                    <p>$0</p>
                </div>
                <hr className="text-gray-400"/>
                <div className="flex justify-between text-lg text-gray-500">
                    <b>Total</b>
                    <b>${subtotal > 0 ? (subtotal + 2) : 0}</b>
                </div>
                <button className="px-8 py-3 bg-orange-500 rounded-md text-white mt-2 hover:scale-105"
                    onClick={() => {}}
                >PROCEED TO PAYMENT</button>
            </div>
        </div>
    </div>
    </div>
}