import { useRef, useState } from "react"
import { api } from "../../api/axiosInstatnce";
import { toast } from "react-toastify";
import { Loader } from 'lucide-react';

export const AddFood = () => {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async () => {
        if (!imageFile) {
            toast.error('Please select an image file.');
            return;
        }
        setLoading(true);
        const formdata = new FormData();
        formdata.append('name', name);
        formdata.append('description', description);
        formdata.append('price', parseFloat(price).toString());
        formdata.append('category', category);
        formdata.append('image', imageFile);

        try {
            const res = await api.post('/admin/add-food', formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            const data = res.data as { message?: string };
            if (res.status === 201) {
                toast.success('Food item added successfully');
                console.log(res);

            } else {
                toast.error(data.message || "something went wrong")
            }
            
            setName('');
            setDescription('');
            setPrice('');
            setCategory('');
            setImageFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
              setImageFile(null);
        } catch (err) {
            console.log(err);
            toast.error('Error adding food-item')
        } finally {
            setLoading(false);
        }
    }

    return <div className="w-full md:w-1/2 mt-10">
        <p className="text-2xl mb-4">Add new food item</p>
        <form className="grid grid-cols-2 [&>input]:p-3 [&>input]:border [&>input]:border-gray-400 [&>input]:rounded-md [&>input]:focus:outline-orange-400 space-x-4 space-y-4">
            <input 
                type="text" 
                placeholder="name" 
                required
                value={name} 
                onChange={e => setName(e.target.value)} 
            />
            <input 
                type="text" 
                placeholder="description" 
                className="col-span-2 h-20" 
                required 
                value={description}
                onChange={e => setDescription(e.target.value)} 
            />
            <input 
                type="number" 
                placeholder="price" 
                min='0' 
                step='1' 
                required 
                value={price}
                onChange={e => setPrice((e.target.value))} 
            />
            {/* <select type="select" placeholder="category" required /> */}
            <select 
                name="category" 
                id="" className="p-3 border border-gray-300 rounded-md focus:outline-none"
                value={category}
            onChange={e => setCategory(e.target.value)}
            >
                <option value="">Select Category</option>
                <option value="salad">Salad</option>
                <option value="rolls">Rolls</option>
                <option value="deserts">Deserts</option>
                <option value="sandwich">Sandwich</option>
                <option value="cake">Cake</option>
                <option value="pureVeg">Pure Veg</option>
                <option value="pasta">Pasta</option>
                <option value="noodles">Noodles</option>
            </select>
            <input 
                ref={fileInputRef}
                type="file" 
                name="image" 
                accept="image/*" 
                required 
                onChange={e => setImageFile(e.target.files?.[0] || null)} 
            />
        </form>
        <div className=" mt-3">
            <button 
                onClick={handleSubmit} 
                className="px-5 py-3 border border-gray-300 rounded-md bg-orange-400 text-white hover:scale-105"
            >
                {loading? (
                    <div className="flex items-center gap-2">
                        <Loader />
                        Adding...
                    </div>
                ) : (
                    "Add Food"
                )}
                
            </button>
        </div>
    </div>
}