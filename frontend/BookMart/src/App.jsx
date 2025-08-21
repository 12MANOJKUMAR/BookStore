import Home from './pages/Home'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import AllBooks from './pages/AllBooks'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
const App = ()=>{
  return (
    <div className="">
      <Router>
      <Navbar/>
        <Routes>
        <Route exact path= "/"  element ={<Home/>} /> 
        <Route  path= "/login"  element ={<Login/>} /> 
        <Route  path= "/signup"  element ={<SignUp/>} /> 
        <Route  path= "/all-books"  element ={<AllBooks/>} /> 
        <Route  path= "/cart"  element ={<Cart/>} /> 
        <Route  path= "/profile"  element ={<Profile/>} /> 
      </Routes>
      <Footer/>
      </Router>
    </div>
  )
}

export default App;