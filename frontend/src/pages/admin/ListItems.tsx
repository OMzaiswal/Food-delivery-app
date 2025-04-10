import { useEffect, useState } from "react"
import { api } from "../../api/axiosInstatnce";
import { toast } from "react-toastify";


export const ListItems = () => {

    interface FoodItem {
        id: string;
        name: string;
        price: string;
        category: string;
        imageUrl: string
    }

    const [foodList, setFoodList] = useState<FoodItem[]>([]);

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const response = await api.get('/foodList');
                if (response.status === 200 && Array.isArray(response.data)) {
                    setFoodList(response.data)
                } else {
                    toast.warn('Unexpected data');
                }
            } catch (err) {
                toast.error('Error while fetching data')
            }
        }
        fetchdata();
    }, [])

    const handleDelete = async ( id: string ) => {
        try {
            const res = await api.delete(`/admin/food/${id}`);
            if(res.status === 200) {
                toast.success('Food item deleted successfully');
                setFoodList((prev) => prev.filter((item) => item.id !== id));
            } else {
                toast.warn('Unable to delete, try again!!!');
            }
        } catch (err) {
            toast.error('Failed to delete!');
        }
    }


    return <div className="mt-10">
        <h1 className="text-2xl text-gray-700 mb-4">All Foods List</h1>
        <div>
            <div className="grid grid-cols-5 gap-4 border border-gray-300 rounded-sm px-3 py-3 text-gray-700 text-sm font-semibold">
                <p className="text-center">Image</p>
                <p className="text-center">Name</p>
                <p className="text-center">Category</p>
                <p className="text-center">Price</p>
                <p className="text-center">Action</p>
            </div>
            <div>
                { foodList.map((food) => (
                    <div key={food.id} className="grid grid-cols-5 gap-4 border border-gray-300 rounded-sm px-3 py-3 text-center text-lg items-center">
                        <img 
                            src={food.imageUrl} 
                            alt="Image" 
                            className="h-16 w-16 object-cover rounded-full mx-auto"
                            />
                        <p>{food.name}</p>
                        <p>{food.category}</p>
                        <p>{food.price}</p>
                        <button 
                            className="hover:text-red-400 hover:scale-120"
                            onClick={() => handleDelete(food.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </div>
}