import { Outlet } from "react-router-dom"
import { AdminNavbar } from "../components/AdminNavbar"
import { AdminSidebar } from "../components/AdminSidebar"

const AdminLayout = () => {
    
    return <div>
        <AdminNavbar />
        <hr className="mt-2 bg-gray-400" />
        <div className="flex space-x-10">
            <AdminSidebar />
            <div className="w-px bg-gray-400" />
            <div className="flex-1">
                <Outlet />
            </div>
           
        </div>
    </div>
}

export default AdminLayout;