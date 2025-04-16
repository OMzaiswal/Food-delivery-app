import { useRecoilValue } from "recoil";
// import { food_list } from "../assets/assets";
import { FoodItemCard } from "./FoodItemCard";
import { foodCategoryState } from "../recoil/foodCategoryState";
import { foodList } from "../recoil/foodList";

export const FoodDisplay = () => {

    const foodListState = useRecoilValue(foodList);
    console.log(foodListState);

    const foodCategory = useRecoilValue(foodCategoryState)
    const filteredFoodList = foodCategory === 'All' ? foodListState : foodListState.filter(foodItem => foodItem.category === foodCategory)

    return (
        <div className="mt-5">
            <h2 className="text-2xl font-semibold mb-2">Top dishes near you</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                {filteredFoodList.map((foodItem) => (
                    <FoodItemCard key={foodItem.id} foodDetails={foodItem}/>
                ))}
            </div>
        </div>
    )
}