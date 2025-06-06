import { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useRecoilState } from "recoil";
import { cartState } from "../recoil/cartState";

export interface FoodDetails {
    id: string,
    name: string;
    imageUrl: string;
    price: number;
    description: string;
    category: string
}

export const FoodItemCard = ({ foodDetails }: { foodDetails: FoodDetails } ) => {

    const [itemCount, setItemCount] = useState(0);
    const [cart, setCart] = useRecoilState(cartState)

    useEffect(() => {
        setItemCount(cart[foodDetails.id] || 0);  // Sync itemCount with cartState
    }, [cart, foodDetails.id]);

    const handleAddItem = () => {
        if (!foodDetails.id) {
            console.error("❌ foodDetails._id is undefined", foodDetails);
            return;
          }
        setItemCount(prev => prev + 1);
        setCart(prevCart => ({
            ...prevCart,
            [foodDetails.id]: (prevCart[foodDetails.id] || 0) + 1
        }));
    }

    const handleRemoveItem = () => {
        setItemCount(prev => prev - 1);
        setCart(({ [foodDetails.id]: count, ...rest}) => 
        count > 1 ? { ...rest, [foodDetails.id]: count - 1 } : { ...rest })
    }

    return (
        <div className="rounded-2xl shadow-md bg-white w-80 max-w-sm hover:scale-105">
            <div className="relative">
                <img 
                    src={foodDetails.imageUrl} 
                    alt={foodDetails.name} 
                    className="w-80 h-64 rounded-t-2xl object-cover"/>
                { !itemCount ? (
                    <img 
                        src={assets.add_icon_white} 
                        alt="add icon"
                        className="absolute bottom-3 right-3 w-10 h-10 cursor-pointer transition hover:scale-110"
                        onClick={ handleAddItem } 
                    />
                ) : (
                    <div className="absolute bottom-2 right-2 flex items-center space-x-2 bg-white rounded-full p-1 shadow-md">
                        <img 
                            src={assets.remove_icon_red} 
                            alt="remove icon" 
                            className="w-8 h-8 cursor-pointer hover:scale-110 transition"
                            onClick={handleRemoveItem}
                        />
                        <p className="text-lg font-semibold text-gray-600">{ itemCount }</p>
                        <img 
                            src={assets.add_icon_green} 
                            alt="add icon"
                            className="w-8 h-8 cursor-pointer hover:scale-110 transition"
                            onClick={handleAddItem}
                        />
                    </div>
                )}
            </div>
            <div className="p-4 space-y-2">
                <div className="flex justify-between">
                    <p className="font-semibold">{foodDetails.name}</p>
                    <img src={assets.rating_starts} alt="ratings" className="h-5"/>
                </div>
                <div className="text-xs text-gray-800">{foodDetails.description}</div>
                <div className="text-lg text-orange-500 font-semibold">${foodDetails.price}</div>
            </div>
        </div>
    )
}