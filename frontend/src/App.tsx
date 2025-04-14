import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { Cart } from './pages/Cart'
import { PlaceOrder } from './pages/PlaceOrder'
import { Footer } from './components/Footer'
import { LoginPopup } from './components/LoginPopup'
import { AdminLayout } from './pages/AdminLayout'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AddFood } from './pages/admin/AddFood'
import { ListItems } from './pages/admin/ListItems'
import { AdminOrders } from './pages/admin/AdminOrders'
import { Orders } from './pages/Orders'
import { useSetRecoilState } from 'recoil'
import { loginState } from './store/loginState'
import { useEffect } from 'react'
import { api } from './api/axiosInstatnce'

const AppContent = () => {
    
  const location = useLocation();
  const isAdminPage =  location.pathname.startsWith('/admin')
  const setLoginState = useSetRecoilState(loginState);

  interface LoginResponse {
    message: string | null
    fullName: string | null
}

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get<LoginResponse>('/user/auth/me');
        if (res.status === 200) {
          setLoginState({
            isLoggedIn: true,
            role: 'user',
            fullName: res.data.fullName
          })
          // toast.success(`Welcome back Mr. ${res.data.fullName}`)
        }
      } catch (err) {}
    }
    checkAuth();
  }, [])

  return (
    <>
    <div className='main-container'>
        <LoginPopup />
        { !isAdminPage && <Navbar /> }
        <ToastContainer position='top-right' autoClose={3000} />
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/cart' element={<Cart />}></Route>
          <Route path='/placeOrder' element={<PlaceOrder />}></Route>
          <Route path='/orders' element={<Orders />}></Route>
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
