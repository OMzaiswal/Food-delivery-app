import { useRecoilState } from "recoil";
import { menu_list } from "../assets/assets";
import { foodCategoryState } from "../store/foodCategoryState";

export const ExploreMenu = () => {

    const [selectedCategory, setCategory] = useRecoilState(foodCategoryState);

    return (
        <div className="mt-5 " id="menu">
            <h1 className="text-4xl font-semibold">Explore our menu</h1>
            <p className="mt-4 text-lg">
                    Choose from a diverse menu featuring expertly crafted dishes made from the finest ingredients. 
                    Every bite is a perfect blend of flavor and quality, designed to satisfy your cravings and 
                    transform every meal into a delightful experience.</p>
            <div className="flex justify-between mt-8 overflow-x-auto space-x-4 px-2">
                {menu_list.map((item, index) => {
                    return (
                        <div key={index} className="flex flex-col items-center flex-shrink-0">
                            <img 
                            src={item.menu_image} alt={item.menu_name}
                            onClick={() => setCategory(item.menu_name)}
                            className={`cursor-pointer border-4 rounded-full p-0.5 transition-all w-32 h-32
                            ${selectedCategory === item.menu_name ? "border-red-500 shadow-lg" : "border-transparent"}`} 
                            />
                            <p className="text-center pt-2">{item.menu_name}</p>
                        </div>
                    )
                })}
            </div>
            <hr className="mt-10 h-0.5 text-gray-200 bg-gray-200" />
        </div>
    )
}