import logo from "../../assets/bookmart-logo.png";

const Navbar = () => {

  const links = [
    {
      title:"Home",
      link : '/'
    },
    {
      title: 'About Us',
      link : '/about-us'
    },
    {
      title: 'All Books',
      link : '/all-books'
    },
    {
      title: 'Cart',
      link : '/cart'
    },
    {
      title: 'Profile',
      link : '/profile'
    }
  ]
  return (
    <div className="navbar bg-zinc-800 text-white px-8 py-4 flex items-center justify-between">
      <div className="logo flex items-center">
        <img src={logo} alt="logo" className="h-10 m-4" />
        <h1 className="text-2xl font-semibold">BookMart</h1>
      </div>
      <div className="nav-right-side flex items-center gap-4">
      <div className="nav-links flex  items-center gap-4">
       {links.map((item,i)=>(
        <div key ={item} className="hover:text-blue-500 cursor-pointer transition-all duration-300">{item.title}</div>
       ))}
      </div>
      <div className="flex gap-4">
       <button className="px-2 py-1 border border-blue-500 rounded transition-all duration-300 hover:bg-amber-50 hover:text-zinc-700">SignIn</button>
       <button className="px-2 py-1 bg-blue-500 rounded transition-all duration-300 hover:bg-amber-50 hover:text-zinc-700">SignUp</button>
      </div>
      </div>
    </div>
  );
};

export default Navbar;
