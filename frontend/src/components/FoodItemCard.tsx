import { useState } from "react";
import { assets } from "../assets/assets";

export interface FoodDetails {
    name: string;
    image: string;
    price: number;
    description: string;
    category: string
}

export const FoodItemCard = ({ foodDetails }: { foodDetails: FoodDetails } ) => {

    const [itemCount, setItemCount] = useState(0);

    return (
        <div className="rounded-2xl shadow-md bg-white w-64 max-w-sm">
            <div className="relative">
                <img 
                    src={foodDetails.image} 
                    alt={foodDetails.name} 
                    className="w-64 h-48 rounded-t-2xl object-cover"/>
                { !itemCount ? (
                    <img 
                        src={assets.add_icon_white} 
                        alt="add icon"
                        className="absolute bottom-3 right-3 w-10 h-10 cursor-pointer transition hover:scale-110"
                        onClick={() => setItemCount(prev => prev + 1)} 
                    />
                ) : (
                    <div className="absolute bottom-2 right-2 flex items-center space-x-2 bg-white rounded-full p-1 shadow-md">
                        <img 
                            src={assets.remove_icon_red} 
                            alt="remove icon" 
                            className="w-8 h-8 cursor-pointer hover:scale-110 transition"
                            onClick={() => setItemCount(prev => prev - 1)}
                        />
                        <p className="text-lg font-semibold text-gray-600">{ itemCount }</p>
                        <img 
                            src={assets.add_icon_green} 
                            alt="add icon"
                            className="w-8 h-8 cursor-pointer hover:scale-110 transition"
                            onClick={() => setItemCount(prev => prev + 1)}
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