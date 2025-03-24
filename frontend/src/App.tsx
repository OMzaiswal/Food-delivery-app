import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { Cart } from './pages/Cart'
import { PlaceOrder } from './pages/PlaceOrder'
import { Footer } from './components/Footer'
import { LoginPopup } from './components/LoginPopup'


function App() {

  return (
    <BrowserRouter>
      <div className='main-container'>
        <LoginPopup />
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/cart' element={<Cart />}></Route>
          <Route path='/order' element={<PlaceOrder />}></Route>
        </Routes>
      </div>
      <div className='full-width'>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
