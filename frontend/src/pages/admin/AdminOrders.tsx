import { useEffect, useState } from "react"
import { api } from "../../api/axiosInstatnce";
import { toast } from "react-toastify";


export const AdminOrders = () => {

    const [orders, setOrders] = useState<any>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/admin/orders');
                if (response.status === 200) {
                    setOrders(response.data);
                } else {
                    toast.warn('Unexpected data')
                }
            } catch (err) {
                toast.error('Error while fetching orders');
            }
        }
        fetchOrders();
    }, [])

    return <div className="mt-10">
        <h1 className="text-2xl text-gray-600 mb-4">Orders Page</h1>
        <div>
            <div className="grid grid-cols-5 gap-4 text-sm font-semibold border border-gray-300 rounded-sm px-3 py-3 items-center">
                <p className="text-center">Order Id</p>
                <p className="text-center">Total Price</p>
                <p className="text-center">Status</p>
                <p className="text-center">Created At</p>
                <p className="text-center">View</p>
            </div>
            <div>
                {orders.map((order: any) => (
                    <div key={order.id} 
                        className="grid grid-cols-5 gap-4 text-sm font-semibold border border-gray-300 rounded-sm px-3 py-3 items-center"
                        >
                        <p>{order.id}</p>
                        <p>{order.tota}</p>
                        <p>{order.status}</p>
                        <p>{order.createdAt}</p>
                        <button>View Details</button>
                    </div>
                ))}
            </div>
        </div>
    </div>
}