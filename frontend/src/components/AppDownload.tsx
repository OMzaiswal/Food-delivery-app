import { assets } from "../assets/assets"

export const AppDownload = () => {
    return (
        <div className="justify-items-center" id="mobile-app">
            <div className="text-5xl justify-items-center space-y-3">
                <p>For better experience download</p>
                <p>HungerBox App</p>
            </div>
            <div className="py-8 flex space-x-8">
                <img src={assets.play_store} alt="play store icon" />
                <img src={assets.app_store} alt="app store icon" />
            </div>
        </div>
    )
}