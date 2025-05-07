import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useRecoilState, useSetRecoilState } from "recoil";
import { showLoginPopup } from "../recoil/showLoginPopup";
import { cartState } from "../recoil/cartState";
import { loginState } from "../recoil/loginState";
import { toast } from "react-toastify";
import { useCartSync } from "../utils/useCartSync";
import { JSX } from "react";
import { api } from "../api/axiosInstatnce";

export const Navbar = () => {

    const [userLogin, setUserLogin] = useRecoilState(loginState);
    const CartSyncWrapper = (): JSX.Element | null => {
        useCartSync();
        return null;
    }

    const menuOptions = [
        { label: "HOME", href: "/" },
        { label: "MENU", href: "/#menu" },
        { label: "MOBILE APP", href: "/#mobile-app" },
        { label: "CONTACT US", href: "/#contact-us"}
    ]

    const setLoginPopupState = useSetRecoilState(showLoginPopup);
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useRecoilState(cartState);

    const totalCartItems = Object.values(cartItems).reduce((total, quantity) => total+quantity, 0);

    return (
        <div className="flex justify-between items-center">
            {userLogin.isLoggedIn && <CartSyncWrapper />}
            <div className="text-3xl font-extrabold text-red-400">
            <Link to='/'>HungerBox</Link>
            </div>
            <div className="hidden md:flex space-x-6 align-center">
                { menuOptions.map((option) => (
                    <HashLink 
                        key={option.label}
                        to={option.href}
                        className="text-lg font-semibold text-gray-600 hover:text-red-400"
                    >
                        {option.label}
                     </HashLink>
                ))}
            </div>
            <div className="flex space-x-8">
                {/* just removed search food for now, would add it later */}
                {/* <div className="flex items-center border-b border-gray-400 px-2">
                    <img 
                        className="h-5 w-5 mr-2" 
                        src="/search_icon.png" 
                        alt="search" 
                        />
                    <input 
                        type="text" 
                        placeholder="Search food..."
                        className="focus:outline-none placeholder-gray-500 text-gray-800 w-full"
                    />
                </div> */}
                <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
                    <img 
                        className="h-8 w-8" 
                        src="/basket_icon.png" 
                        alt="cart" 
                        onClick={() => navigate('/cart')}
                        />
                        {totalCartItems > 0 && (
                            <span className="absolute -top-2 -right-2 px-2 py-0.5 text-white bg-red-600 rounded-full font-bold text-sm">
                                { totalCartItems }
                            </span>
                        )}
                </div>
                {userLogin.isLoggedIn ? ( 
                    <div className="relative group">
                        <img src="profile_icon.png" alt="profile icon" className="cursor-pointer" />
                        <div className="absolute left-1/2 -translate-x-1/2 w-48 bg-white shadow-lg rounded-md py-2 z-50 hidden group-hover:block">
                            <div className="px-4 py-2 font-semibold text-gray-700 border-b">
                                Hi, <b className="text-orange-500">{userLogin.fullName}</b>
                            </div>
                            {/* commented profile option for now, might add later */}
                            {/* <button className="w-full text-left px-4 py-1 hover:bg-gray-100">Profile</button> */}
                            <button 
                                className="w-full text-left px-4 py-1 hover:bg-gray-100"
                                onClick={() => navigate('/orders')}
                            >
                                    Orders
                            </button>
                            <button
                                className="w-full text-left px-4 py-1 hover:bg-gray-100"
                                onClick={async () => {
                                    try {
                                        const res = await api.post('/user/logout')
                                        if (res.status === 200) {
                                            setUserLogin({ isLoggedIn: false, role: null, fullName: null, email: null });
                                            setCartItems({});
                                            navigate('/');
                                            toast.success('Logged out successfully');
                                        } 
                                    } catch (err) {
                                        console.log(err);
                                    }
                                }}   
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                    ) : ( 
                    <>
                    <button 
                    className="border border-red-300 rounded-4xl px-4 py-2 hover:bg-red-50 cursor-pointer hover:scale-105"
                    onClick={() => setLoginPopupState(true)}
                    >Sign In</button></> 
                )}
                
            </div>
            
        </div>
    )
}