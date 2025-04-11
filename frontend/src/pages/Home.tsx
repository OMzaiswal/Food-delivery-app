import { useEffect } from "react"
import { ExploreMenu } from "../components/ExploreMenu"
import { FoodDisplay } from "../components/FoodDisplay"
import { Header } from "../components/Header"
import { api } from "../api/axiosInstatnce"
import { useSetRecoilState } from "recoil"
import { foodList } from "../store/foodList"

export const Home = () => {

    const setFoodListState = useSetRecoilState(foodList);

    useEffect(() => {
        const fetchFoodList = async () => {
            try {
                const res = await api.get('/foodList');
                if(res.status === 200 && Array.isArray(res.data)) {
                    setFoodListState(res.data);
                }
            } catch (err) {

            }
            fetchFoodList();
        }
    }, []);

    return <div>
        <Header />
        <ExploreMenu />
        <FoodDisplay />
    </div>
}