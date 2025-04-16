import { atom } from "recoil";

  export interface FoodDetails {
    id: string,
    name: string;
    imageUrl: string;
    price: number;
    description: string;
    category: string
}

export const foodList = atom<FoodDetails[]>({
    key: 'foodList',
    default: []
})