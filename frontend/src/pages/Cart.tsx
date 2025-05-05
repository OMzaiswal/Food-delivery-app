import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { cartState } from "../recoil/cartState"
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { cartSubtotal } from "../recoil/cartSubtotal";
import { foodList } from "../recoil/foodList";
import { userLoginSelector } from "../recoil/userLoginSelector";
import { showLoginPopup } from "../recoil/showLoginPopup";

export const Cart = () => {

    const foodListState = useRecoilValue(foodList);
    const isLoggedIn = useRecoilValue(userLoginSelector);
    const setLoginPopup = useSetRecoilState(showLoginPopup);
    const [cartItems, setCartItems] = useRecoilState(cartState);
    const setCartSubtotal = useSetRecoilState(cartSubtotal);
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

    if (Object.keys(cartItems).length === 0) {
        return <div className="flex flex-col items-center space-y-4 mt-20 mb-40">
           <h1 className="text-4xl font-bold text-red-600"> Your cart is empty! </h1>
           <p className="text-xl text-gray-500">Looks like you haven't added anything to your cart yet.</p>
           <button
            className="border rounded-md px-3 py-2 bg-green-500 text-white hover:scale-105"
            onClick={() => navigate('/')}
           >
                Browse Food Items
           </button>
        </div>
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
                const product = foodListState.find((item) => item.id === id);
                if (!product) {
                    console.warn("No matching product found for id:", id);
                    return null;
                }
                subtotal += ( product.price * quantity )

                return (
                    <div className="grid grid-cols-6 mt-4 text-xl items-center">
                        <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
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
                    <p>${subtotal > 0 ? 2 : 0}</p>
                </div>
                <div className="flex justify-between text-lg text-gray-500">
                    <p>Promo Discount</p>
                    <p>$0</p>
                </div>
                <hr className="text-gray-400"/>
                <div className="flex justify-between text-lg text-gray-500">
                    <b>Total</b>
                    <b>${subtotal > 0 ? (subtotal + 2) : 0}</b>
                </div>
                <button className="px-8 py-3 bg-orange-500 rounded-md text-white mt-2 hover:scale-105"
                    onClick={() => {
                        if (isLoggedIn) {
                            setCartSubtotal(subtotal);
                            navigate('/placeOrder');
                        } else {
                          setLoginPopup(true);
                        }
                        
                    }}
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


