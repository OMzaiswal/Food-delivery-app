
export const AddFood = () => {
    return <div>
        <form className="grid grid-cols-2">
            <input type="text" placeholder="name" required />
            <input type="text" placeholder="description" required />
            <input type="text" placeholder="price" required />
            <input type="text" placeholder="category" required />
            <input type="file" name="image" accept="image/*" required />
            <button>Add Food</button>
        </form>
    </div>
}