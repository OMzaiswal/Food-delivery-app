import { useState, useEffect } from "react";

const images = [
  "/foodprf10.jpg",
  "/foodprf1.jpg",
  "/foodprf7.jpg",
  "/foodprf8.jpg",
  "/foodprf5.jpg",
];


export const Header = () => {

    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prv) => (prv + 1) % images.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [])

    const goToImage = (index: number) => {
        setCurrentImage(index);
    }

    return (
        <div className="relative h-[600px] bg-cover bg-center flex items-center px-6 mt-8 transition-all duration-1000 rounded-lg"
        style={{ backgroundImage: `url(${images[currentImage]})` }}
        >
            <div className="relative z-10 text-white text-center md:text-left p-8 md:p-12 max-w-3xl">
                <h2 className="text-5xl md:text-7xl font-semibold leading-tight">Order your <br /> favourite food here</h2>
                <p className="mt-4 text-lg md:text-xl font-semibold">
                    Choose from a diverse menu featuring expertly crafted dishes made from the finest ingredients. 
                    Every bite is a perfect blend of flavor and quality, designed to satisfy your cravings and 
                    transform every meal into a delightful experience.</p>
                    <button
                    className="mt-6 px-6 py-3 bg-white text-gray-500 text-lg font-semibold rounded-3xl shadow-lg hover:bg-red-400 hover:text-white"
                    >View Menu</button>
            </div>

            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`w-2 h-2 rounded-full transition-all duration-3000 ${
              index === currentImage ? "bg-white scale-125" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
        </div>
    )
}