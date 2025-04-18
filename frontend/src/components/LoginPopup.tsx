import React, { useState } from "react"
import { assets } from "../assets/assets";
import { useRecoilState, useSetRecoilState } from "recoil";
import { showLoginPopup } from "../recoil/showLoginPopup";
import { loginState } from "../recoil/loginState";
import { toast } from "react-toastify";
import { api } from "../api/axiosInstatnce";
import { cartState } from "../recoil/cartState";

export const LoginPopup = () => {

    const [currentState, setCurrentState] = useState<'Log in' | 'Sign up'>('Log in');
    const [LoginPopupState, setLoginPopupState] = useRecoilState(showLoginPopup);
    const [agree, setAgree] = useState(false);
    const setUserLogin = useSetRecoilState(loginState);
    const setCartState = useSetRecoilState(cartState);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullname] = useState('');

    interface LoginResponse {
        message: string | null
        fullName: string | null
        cart: {}
    }

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agree) return;

        if (!email || !password || (currentState === 'Sign up' && !fullName)) {
            toast.warn('All fields are required!!!');
            return;
        }

        try {
            if (currentState === 'Log in') {
                const res = await api.post<LoginResponse>('/user/login', { email, password });
                if (res.status === 200) {
                    setUserLogin({
                        isLoggedIn: true,
                        role: 'user',
                        fullName: res.data.fullName
                    })
                    setCartState(res.data.cart)
                    toast.success(`Welcome back Mr. ${res.data.fullName}`);
                    setLoginPopupState(false);
                }
            } else {
                const res = await api.post('/user/signup', { fullName, email, password });
                if (res.status === 201) {
                    setUserLogin({
                        isLoggedIn: true,
                        role: 'user',
                        fullName: fullName
                    })
                    toast.success('Signed up successfully');
                    setLoginPopupState(false);
                }
            }
        } catch(err: any) {
            if (err.response) {
                toast.error(err.response.data.message);
            } else {
                toast.error('Something went wrong, Try again!');
            }
        }
    }

    if (!LoginPopupState) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/90 backdrop-blur-xs z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm relative">
                <button
                className="absolute top-5 right-5 text-gray-400 hover:text-black hover:scale-120"
                onClick={() => setLoginPopupState(false)}
                >
                    <img src={assets.cross_icon} alt="close" className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-semibold text-center mb-4">{ currentState }</h2>
                <form className="space-y-4" onSubmit={handleAuth}>
                    { currentState === 'Sign up' && (
                        <input 
                            type="text"
                            placeholder="Full Name"
                            className="w-full p-2 border border-gray-400 rounded-md text-gray-600 font-semibold text-lg" 
                            required
                            onChange={(e) =>setFullname(e.target.value)}
                            />
                    )}
                    <input 
                        type="email" 
                        placeholder="Email"
                        className="w-full p-2 border border-gray-400 rounded-md text-gray-600 font-semibold text-lg"
                        required 
                        onChange={e => setEmail(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="Password"
                        className="w-full p-2 border border-gray-400 rounded-md text-gray-600 font-semibold text-lg" 
                        required
                        onChange={e => setPassword(e.target.value)} 
                    />
                    <div className="flex items-center space-x-2">
                        <input 
                        type="checkbox"
                        id="agree"
                        checked={agree} 
                        className="w-4 h-4 accent-red-400 cursor-pointer"
                        onChange={() => setAgree(!agree)}
                        />
                        <label 
                            htmlFor="agree" className="text-sm text-gray-600 cursor-pointer">
                                I agree to the<span className="ml-1 text-red-500">
                                    Terms & Conditions
                                </span>
                            </label>
                    </div>
                    <button
                    className={`w-full p-2 border border-gray-400 rounded-md 
                        ${agree ? 'bg-red-400 text-white hover:bg-red-600' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                        disabled={!agree}
                        type="submit"
                    >
                        {currentState}
                    </button>
                </form>
                <p className="text-sm text-center mt-3 text-gray-600">
                    {currentState === 'Log in' ? (
                        <>
                            Create a new account<span onClick={() => setCurrentState('Sign up')} className="text-red-500 cursor-pointer ml-1 hover:underline">
                            Click here
                            </span>
                        </>
                    ) : (
                        <>
                            Already have an account? 
                            <span onClick={() => setCurrentState('Log in')} className="text-red-500 cursor-pointer ml-1 hover:underline">
                            Login here
                            </span>
                        </>
                    )}
                </p>
            </div>
        </div>
    )
}