import Home from './pages/Home'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import {Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import AllBooks from './pages/AllBooks'
import Cart from './pages/Cart'
import Payment from './pages/Payment'
import Profile from './pages/Profile'
import ViewBookDetails from './components/ViewBookDetails/ViewBookDetails';
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from './store/auth'
import { useEffect,useState } from 'react'
import api from './util/axios'
import Loader from './components/Loader/Loader'
import Favourites from './components/Profile/Favourites'
import UserOrderHistory from './components/Profile/UserOrderHistory'
import Setting from './components/Profile/Setting'
import AdminAllOrders from './components/Profile/AdminAllOrders'
import AdminAddBook from './components/Profile/AdminAddBook'
import EditBook from './pages/EditBook'


const App = ()=>{
  const dispatch = useDispatch();
  const role = useSelector((state)=>state.auth.role);
  const [authChecked, setAuthChecked] = useState(false);
  useEffect(()=>{
   const checkAuth = async () => {
      try {
        const res = await api.get(`/get-user-information`);
        dispatch(authActions.login());
        dispatch(authActions.changeRole(res.data.role));
      } catch (err) {
        dispatch(authActions.logout());
      } finally {
        setAuthChecked(true); // ✅ auth check complete
      }
    };
    checkAuth();
  }, [dispatch]);

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-white">
        <Loader /> {/* loader instead of flicker */}
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-zinc-900">
      <Navbar/>
      <main className="flex-1">
        <Routes>
        <Route exact path= "/"  element ={<Home/>} /> 
        <Route  path= "/login"  element ={<Login/>} /> 
        <Route  path= "/signup"  element ={<SignUp/>} /> 
        <Route  path= "/all-books"  element ={<AllBooks/>} /> 
        <Route  path= "/cart"  element ={<Cart/>} /> 
        <Route  path= "/payment"  element ={<Payment/>} /> 
        <Route  path= "/profile"  element ={<Profile/>} >
        <Route index element = {<Favourites/>} />
        <Route path="/profile/orderHistory" element = {<UserOrderHistory/>} />
        <Route path="/profile/settings" element = {<Setting/>} />
        {/* Admin routes */}
        <Route path="/profile/admin/orders" element={<AdminAllOrders/>} />
        <Route path="/profile/admin/add-book" element={<AdminAddBook/>} />
        </Route> 
        <Route  path= "/book/:id"  element ={<ViewBookDetails/>} /> 
        <Route  path= "/edit-book/:id"  element ={ role === 'admin' ? <EditBook/> : <Home/> } /> 
      </Routes>
      </main>
      <Footer/>
      </div>
  )
}

export default App;