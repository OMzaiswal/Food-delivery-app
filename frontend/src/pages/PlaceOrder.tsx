import { useRecoilValue } from "recoil";
import { cartSubtotal } from "../store/cartSubtotal";

export const PlaceOrder = () => {

    const subtotal = useRecoilValue(cartSubtotal);

    return <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-12 p-4">
        <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-bold mt-12 mb-3">Delivery Information</h2>
            <form className="grid grid-cols-2 [&>input]:p-3 [&>input]:border [&>input]:border-gray-300 [&>input]:rounded-md space-x-4 space-y-4">
                <input type="text" placeholder="First name" />
                <input type="text" placeholder="Last name" />
                <input type="text" placeholder="Email address" className="col-span-2" />
                <input type="text" placeholder="Street" className="col-span-2" />
                <input type="text" placeholder="City" />
                <input type="text" placeholder="State" />
                <input type="text" placeholder="Zip code" />
                <input type="text" placeholder="Country" />
                <input type="text" placeholder="Phone Number" className="col-span-2" />
            </form>
        </div>
        <div className="w-full md:w-1/2 p-4 mt-8">
        <h2 className="text-2xl font-bold mb-4">Cart Total</h2>
            <div className="space-y-4">
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
}