import { useRecoilState } from "recoil"
import { cartState } from "../store/cartState"
import { assets, food_list } from "../assets/assets";

export const Cart = () => {

    const [cartItems, setCartItems] = useRecoilState(cartState);

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
        <h2 className="text-2xl font-bold mb-4">Your cart items</h2>

        <div className="grid grid-cols-6 text-gray-700 text-xl font-semibold pb-2">
            <div>Items</div>
            <div>Title</div>
            <div>Price</div>
            <div>Quantity</div>
            <div>Total</div>
            <div>Remove</div>
        </div>
        <hr />
        
        <div>
            {Object.entries(cartItems).map(([id, quantity]) => {
                const product = food_list.find((item) => item._id === id);
                if (!product) return null;

                return (
                    <div className="grid grid-cols-6 mt-4 text-xl items-center">
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                        <div>{product.name}</div>
                        <div>{product.price}</div>
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
                        <div>{product.price * quantity}</div>
                        <button 
                            className="text-start hover:text-red-400"
                            onClick={() => handleRemove(id)}
                            >X</button>
                    </div>
                )
            })}
        </div>

    </div>
}


