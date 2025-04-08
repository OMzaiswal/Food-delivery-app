import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom"

export const AdminSidebar = () => {

    const location = useLocation();

    const getCurrentAdminPage = (path: string): string => {
        if (path.includes("/admin/add-food")) return "add-food";
        if (path.includes("/admin/list-items")) return "list-items";
        if (path.includes("/admin/orders")) return "orders";
        return "add-food"
    }

    const currentPath = getCurrentAdminPage(location.pathname);

    return <div className="w-50 bg-gray-100 p-4 rounded-md shadow-md h-fit mt-10">
        <ul className="space-y-4 text-lg">
            <li>
                <Link to="/admin/add-food"
                className={`block px-3 py-2 rounded-md hover:bg-orange-100 text-center ${
                    currentPath === 'add-food' ? 'bg-orange-200 text-orange-600 font-semibold' : ''
                }`}
                >
                    Add Food
                </Link>
            </li>
            <li><Link to="/admin/list-items"
                className={`block px-3 py-2 rounded-md hover:bg-orange-100 text-center ${
                    currentPath === 'list-items' ? 'bg-orange-200 text-orange-600 font-semibold' : ''
                }`}
                >
                    List Items
                </Link></li>
            <li><Link to="/admin/orders"
                className={`block px-3 py-2 rounded-md hover:bg-orange-100 text-center ${
                    currentPath === 'orders' ? 'bg-orange-200 text-orange-600 font-semibold' : ''
                }`}
                >
                    Orders
                </Link></li>
        </ul>
    </div>
}