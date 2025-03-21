import { Link, NavLink } from "react-router-dom"

export const Navbar = () => {

    const menuOptions = [
        { label: "HOME", href: "/" },
        { label: "MENU", href: "/menu" },
        { label: "MOBILE APP", href: "mobileApp" },
        { label: "CONTACT US", href: "contactUs"}
    ]

    return (
        <div className="flex justify-between items-center">
            <div className="text-3xl font-extrabold text-red-400">
            <Link to='/'>HungerBox</Link>
            </div>
            <div className="flex space-x-6 align-center">
                { menuOptions.map((option) => (
                    <NavLink
                    key={option.label}
                    to={option.href}
                    className={({ isActive }) => 
                        `text-lg font-semibold ${
                            isActive ? "text-red-500 underline underline-offset-4 decoration-2" : "text-gray-600"
                        } hover:text-red-400` 
                    }
                    >
                        {option.label}
                     </NavLink>
                ))}
            </div>
            <div className="flex space-x-8">
                <img className="h-8 w-8" src="/search_icon.png" alt="" />
                <img className="h-8 w-8" src="/basket_icon.png" alt="" />
                <button className="border border-red-300 rounded-4xl px-4 py-2 hover:bg-red-50">Sign In</button>
            </div>
            
        </div>
    )
}