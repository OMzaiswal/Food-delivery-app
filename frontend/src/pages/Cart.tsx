import { useRecoilState } from "recoil"
import { cartState } from "../store/cartState"
import { assets, food_list } from "../assets/assets";
import { useNavigate } from "react-router-dom";

export const Cart = () => {

    const [cartItems, setCartItems] = useRecoilState(cartState);
    let subtotal = 0;
    const navigate = useNavigate();

    const handleQuantityChange = (id: string, change: number) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev };
            if (updatedCart[id] + change > 0) {
                updatedCart[id] += change;
            } else {
                delete updatedCart[id];
            }
            return updatedCart;
        })
    }

    const handleRemove = (id: string) => {
        setCartItems((prev) => {
            const updatedCart = { ...prev }
            delete updatedCart[id];
            return updatedCart;
        })
    }
    
    return <div className="mt-5 p-4">

        <div className="grid grid-cols-6 text-gray-700 text-xl font-semibold pb-2">
            <div>Items</div>
            <div>Title</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Total</div>
            <div>Remove Item</div>
        </div>
        <hr />
        
        <div>
            {Object.entries(cartItems).map(([id, quantity]) => {
                const product = food_list.find((item) => item._id === id);
                if (!product) return null;
                subtotal += ( product.price * quantity )

                return (
                    <div className="grid grid-cols-6 mt-4 text-xl items-center">
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                        <div>{product.name}</div>
                        <div>${product.price}</div>
                        <div className="flex space-x-2">
                            <img 
                                src={assets.remove_icon_red} 
                                alt="remove icon" 
                                className="w-8 h-8 cursor-pointer hover:scale-110 transition"
                                onClick={() => handleQuantityChange(id, -1)}
                            />
                            <div>{quantity}</div>
                            <img 
                            src={assets.add_icon_green} 
                            alt="add icon"
                            className="w-8 h-8 cursor-pointer hover:scale-110 transition"
                            onClick={() => handleQuantityChange(id, +1)}
                        />
                        </div>
                        <div>${product.price * quantity}</div>
                        <button 
                            className="text-start hover:text-red-400 hover:cursor-pointer"
                            onClick={() => handleRemove(id)}
                            >Remove</button>
                    </div>
                )
            })}
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-3">Cart Total</h2>
        <div className="flex flex-col-reverse md:grid md:grid-cols-2 md:space-x-12">
            <div className="space-y-1">
                <div className="flex justify-between text-lg text-gray-500">
                    <p>Subtotal</p>
                    <p>${subtotal}</p>
                </div>
                <div className="flex justify-between text-lg text-gray-500">
                    <p>Delivery Fee</p>
                    <p>$2</p>
                </div>
                <div className="flex justify-between text-lg text-gray-500">
                    <p>Promo Discount</p>
                    <p>$0</p>
                </div>
                <hr className="text-gray-400"/>
                <div className="flex justify-between text-lg text-gray-500">
                    <b>Total</b>
                    <b>${subtotal + 2}</b>
                </div>
                <button className="px-8 py-3 bg-orange-500 rounded-md text-white mt-2 hover:scale-105"
                    onClick={() => navigate('/order')}
                >PROCEED TO CHECKOUT</button>
            </div>
            <div className="my-2">
                <p className="text-lg">If you have a promo code, Enter it here</p>
                <div className="mt-1">
                    <input type="text" placeholder="promo code" className="px-6 py-3 bg-gray-200 rounded-md" />
                    <button className="px-8 py-3 bg-black text-white rounded-md">Submit</button>
                </div>
            </div>
        </div>
    </div>
}


