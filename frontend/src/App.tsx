import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { Cart } from './pages/Cart'
import { PlaceOrder } from './pages/PlaceOrder'
import { Footer } from './components/Footer'
import { LoginPopup } from './components/LoginPopup'
import { AdminLayout } from './pages/AdminLayout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AddFood } from './pages/admin/AddFood'
import { ListItems } from './pages/admin/ListItems'
import { AdminOrders } from './pages/admin/AdminOrders'

const AppContent = () => {
    
  const location = useLocation();
  const isAdminPage =  location.pathname.startsWith('/admin')

  return (
    <>
    <div className='main-container'>
        <LoginPopup />
        { !isAdminPage && <Navbar /> }
        <ToastContainer position='top-center' autoClose={3000} />
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/cart' element={<Cart />}></Route>
          <Route path='/order' element={<PlaceOrder />}></Route>
          <Route path='/admin' element={<AdminLayout />}>
            <Route path='add-food' element={<AddFood />}></Route>
            <Route path='list-items' element={<ListItems />}></Route>
            <Route path='orders' element={<AdminOrders />}></Route>
          </Route>
        </Routes>
      </div>
      { !isAdminPage && ( <div className='full-width'>
        <Footer /> 
      </div> 
    )}
    </>
  )
}

function App() {

  
  return (
    <BrowserRouter>
        <AppContent />
    </BrowserRouter>
  )
}

export default App
