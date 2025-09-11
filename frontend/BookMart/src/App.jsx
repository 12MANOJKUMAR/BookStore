import Home from './pages/Home'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import {Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import AllBooks from './pages/AllBooks'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
import ViewBookDetails from './components/ViewBookDetails/ViewBookDetails';
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from './store/auth'
import { useEffect } from 'react'


const App = ()=>{
  const dispatch = useDispatch();
  const role = useSelector((state)=>state.auth.role);
  useEffect(()=>{
    if(localStorage.getItem("id") &&
     localStorage.getItem("token") &&
     localStorage.getItem("role")){
      dispatch(authActions.login());
      dispatch(authActions.changeRole(localStorage.getItem("role")));
    }
  },[])
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
        <Route  path= "/profile"  element ={<Profile/>} /> 
        <Route  path= "/book/:id"  element ={<ViewBookDetails/>} /> 
      </Routes>
      </main>
      <Footer/>
      </div>
  )
}

export default App;