import { useEffect, useState } from "react"
import { api } from "../../api/axiosInstatnce";
import { toast } from "react-toastify";


export const AdminOrders = () => {

      const statusOptions = [
        "PENDING",
        "CONFIRMED",
        "PREPARING",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED"
      ];

      type Order = {
        id: string;
        status: string;
        totalPrice: string;
        createdAt: string;
      }

    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get<Order[]>('/admin/orders');
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

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const res = await api.patch(`/admin/order/${orderId}/status`, { newStatus });

            if (res.status === 200) {
                setOrders((prev) => 
                prev.map((order) => 
                    order.id === orderId ? { ...order, status: newStatus } : order
                ))
                toast.success("Status updated successfully");
            } else {
                toast.warn('Failed to update status');
            }
        } catch(err) {
            console.log('Your error: ',err);
            toast.error('Error updating status');
        }
    }

    return <div className="mt-10">
        <h1 className="text-2xl text-gray-600 mb-4">Orders Page</h1>
        <div>
            <div className="grid grid-cols-5 gap-4 text-sm font-semibold border border-gray-300 rounded-sm px-3 py-3 items-center text-orange-400">
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
                        <p className="text-center truncate">{order.id}</p>
                        <p className="text-center">${Number(order.totalPrice)}</p>
                        <select
                            className="border px-2 py-1"
                            value={order.status} 
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        <p className="text-center">{new Date(order.createdAt).toString()}</p>
                        <button className="text-center">View Details</button>
                    </div>
                ))}
            </div>
        </div>
    </div>
}