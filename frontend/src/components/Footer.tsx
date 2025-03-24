import { assets } from "../assets/assets"
import { AppDownload } from "./AppDownload"

export const Footer = () => {

    return (
        <div className="bg-gray-700 text-white w-full py-16 mt-4">
            <AppDownload />
            <div className="max-w-[1440px] mx-auto px-4 grid grid-cols-4 gap-6 mb-4">
                <div className="col-span-2 space-y-2">
                    <p className="text-3xl font-extrabold text-red-400">HungerBox</p>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Labore et velit recusandae aut, illum dolores, ipsam hic necessitatibus laborum repudiandae dolore alias asperiores. Facere sit aliquid magni? Mollitia, eligendi accusantium.</p>
                    <div className="flex space-x-2">
                        <img src={assets.facebook_icon} alt="facebok" />
                        <img src={assets.twitter_icon} alt="" />
                        <img src={assets.linkedin_icon} alt="" />
                    </div>
                </div>
                <div className="ml-20">
                    <h2 className="text-lg font-semibold pb-1">COMPANY</h2>
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
                <div id="contact-us">
                    <h2 className="text-lg font-semibold pb-1">GET IN TOUCH</h2>
                    <ul>
                        <li>+91-212-546-9708</li>
                        <li>contact@hungerbox.com</li>
                    </ul>
                </div>
            </div>
            <p className="text-center">Copyright 2025 &#169; HungerBox.com - All Right Reserved</p>
         </div>
    )
}