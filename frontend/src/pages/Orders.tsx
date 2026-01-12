import { useEffect, useState } from "react"
import { api } from "../api/axiosInstatnce"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const Orders = () => {

    type Order = {
        id: string,
        createdAt: string,
        totalPrice: string,
        status: string,
        itemCount: string
    }

    const [orders, setOrders] = useState<Order[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get<Order[]>('/user/orders');
                if (res.status === 200) {
                    setOrders(res.data)
                }
            } catch(err) {
                toast.error('Failed to fetch orders');
            }
        }
        fetchOrders();
    }, [])

    return <div className="min-h-screen mt-4">
        <h1 className="text-2xl mb-3 pl-5">Your Orders</h1>
        <div>
        <div className="grid grid-cols-6 gap-4 text-md font-semibold border-b border-gray-300 items-center text-orange-400 pb-1">
                <p className="text-center">Order Id</p>
                <p className="text-center">Order Date</p>
                <p className="text-center">Item count</p>
                <p className="text-center">Total Price</p>
                <p className="text-center">Status</p>
                <p className="text-center">View</p>
            </div>
        </div>
        <div>
            {orders.map((order: Order) => (
                <div className="grid grid-cols-6 gap-5 text-lg border-b border-gray-300 py-2 items-center" key={order.id}>
                    <span className="flex flex-col items-center">
                        <img src="parcel_icon.png" alt="icon" />
                        <p className="truncate text-sm w-40">{order.id}</p>
                    </span>
                    <p className="text-center">{new Date(order.createdAt).toString()}</p>
                    <p className="text-center">{order.itemCount}</p>
                    <p className="text-center">${order.totalPrice}</p>
                    <p className="text-center">{order.status}</p>
                    <button 
                        className="text-center bg-green-600 text-white border rounded-md px-2 py-2 mx-5 hover:scale-105"
                        onClick={() => {
                            navigate(`/order-details/${order.id}`)
                        }}
                    >
                        View Details
                    </button>
                </div>
            ))}
        </div>
    </div>
}

export default Orders;