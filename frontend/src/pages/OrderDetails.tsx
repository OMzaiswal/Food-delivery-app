import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { api } from "../api/axiosInstatnce";
import { toast } from "react-toastify";

const OrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState<any>();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await api.get(`user/order/${orderId}`)
                
                if(res.status === 200) {
                    setOrder(res.data);
                }
            } catch (err) {
                toast.error('Error while fetching order details');
            }
        }
        fetchDetails();
    }, [])

    return <div className="p-6 max-w-2xl mx-auto shadow-lg mt-20 mb-40">
        {order ? (
            <div>
            <div>
                <div className="flex items-center gap-4 mb-4">
                    <img src="/parcel_icon.png" alt="icon" className="w-24 h-24"/>
                    <div className="text-md text-gray-600">
                        <p className="text-xl font-bold">Order Details</p>
                        <p>Order ID: {order.id}</p>
                        <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
                        <p>Status: {order.status}</p>
                    </div>
                </div>
                <div>
                    {order.items.map((item: any, index: number) => (
                        <li
                            key={index}
                            className="flex justify-between items-center py-3 border-b text-2xl"
                        >
                            <div className="flex items-center gap-4">
                                <img src={item.foodItem.imageUrl} alt={item.foodItem.name} className="w-16 h-16"/>
                                <div>
                                    <p>{item.foodItem.name}</p>
                                    <p>Qty: {item.quantity}</p>
                                </div>
                            </div>
                            <div>
                                ${item.price}
                            </div>
                        </li>
                    ))}
                    <div className="text-2xl text-right my-4">Delivery Charge: $2</div>
                    <div className="text-2xl text-right">Total: ${order.totalPrice}</div>
                </div>
            </div>
            <div></div>
        </div>
        ) : (
            <div className="flex justify-center items-center h-screen">
                <div className="text-5xl font-bold">Loading...</div>
            </div>
        )}
        
    </div>
}

export default OrderDetails;