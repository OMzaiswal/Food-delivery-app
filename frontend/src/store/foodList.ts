import { atom } from "recoil";

  export interface FoodDetails {
    _id: string,
    name: string;
    image: string;
    price: number;
    description: string;
    category: string
}

export const foodList = atom<FoodDetails[]>({
    key: 'foodList',
    default: []
})