import { ExploreMenu } from "../components/ExploreMenu"
import { FoodDisplay } from "../components/FoodDisplay"
import { Header } from "../components/Header"

export const Home = () => {
    return <div>
        <Header />
        <ExploreMenu />
        <FoodDisplay />
    </div>
}