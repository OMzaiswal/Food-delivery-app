import { useRecoilValue } from "recoil";
import { cartSubtotal } from "../recoil/cartSubtotal";
import { api } from "../api/axiosInstatnce";
import { toast } from "react-toastify";
import { loginState } from "../recoil/loginState";
import { useState } from "react";

export const PlaceOrder = () => {

    const userDetails = useRecoilValue(loginState);
    const subtotal = useRecoilValue(cartSubtotal);
    const amount = subtotal + ( subtotal > 0 ? 2 : 0 )

    const [street, setStreet] = useState('');
    const [city, setCity] = useState('')
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [country, setCountry] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleCheckout = async () => {
        try {
            const res = await api.post<{ url: string }>('/user/create-checkout-session', { 
                amount,
                phoneNumber,
                address: {
                    street,
                    city,
                    state,
                    zipcode,
                    country
                } 
            });

            if (res.data?.url) {
                window.location.href = res.data.url;
            } else {
                toast.warn('Failed to initiate payment session')
            }
        } catch (err) {
            console.log('Error while checkout', err);
            toast.error('Something went wrong, try again');
        }
    }

    return <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-12 p-4">
        <div className="w-full md:w-2/5">
            <h2 className="text-2xl font-bold mt-12 mb-3">Delivery Information</h2>
            <form className="grid grid-cols-2 [&>input]:p-3 [&>input]:border [&>input]:border-gray-300 [&>input]:rounded-md space-x-4 space-y-4">
                <input type="text" placeholder={userDetails.fullName ?? 'Full Name'} className="col-span-2 placeholder-black" readOnly/>
                <input type="text" placeholder={userDetails.email ?? "Email address"} className="col-span-2 placeholder-black" readOnly />
                <input 
                    type="text" 
                    placeholder="Street" 
                    className="col-span-2" 
                    onChange={(e) => setStreet(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder="City" 
                    onChange={(e) => setCity(e.target.value)}
                    />
                <input 
                    type="text" 
                    placeholder="State" 
                    onChange={(e) => setState(e.target.value)}
                    />
                <input 
                    type="text" 
                    placeholder="Zip code" 
                    onChange={(e) => setZipcode(e.target.value)}
                    />
                <input 
                    type="text" 
                    placeholder="Country" 
                    onChange={(e) => setCountry(e.target.value)}
                    />
                <input 
                    type="text" 
                    placeholder="Phone Number" 
                    className="col-span-2" 
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    />
            </form>
        </div>
        <div className="w-full md:w-2/5 p-4 mt-8">
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
                    onClick={handleCheckout}
                >PROCEED TO PAYMENT</button>
            </div>
            <div className="text-red-500 text-md mt-2">
               ( Note: please put card number 4242 4242 4242 4242 for successfull payment. 
                For other fields, you can put any fake data )
            </div>
    </div>
    </div>
}
