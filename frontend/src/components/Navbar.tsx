import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useSetRecoilState } from "recoil";
import { showLoginPopup } from "../store/showLoginPopup";

export const Navbar = () => {

    const menuOptions = [
        { label: "HOME", href: "/" },
        { label: "MENU", href: "/#menu" },
        { label: "MOBILE APP", href: "/#mobile-app" },
        { label: "CONTACT US", href: "/#contact-us"}
    ]

    const setLoginPopupState = useSetRecoilState(showLoginPopup);

    return (
        <div className="flex justify-between items-center">
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
                <img className="h-8 w-8" src="/search_icon.png" alt="" />
                <img className="h-8 w-8" src="/basket_icon.png" alt="" />
                <button 
                    className="border border-red-300 rounded-4xl px-4 py-2 hover:bg-red-50"
                    onClick={() => setLoginPopupState(true)}
                    >Sign In</button>
            </div>
            
        </div>
    )
}