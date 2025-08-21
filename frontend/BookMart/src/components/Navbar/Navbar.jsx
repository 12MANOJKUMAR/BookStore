import { Link } from "react-router-dom";
import logo from "../../assets/bookmart-logo.png";
import { FaGripLines } from "react-icons/fa";
import { useState } from "react";

const Navbar = () => {
  const links = [
    { title: "Home", link: "/" },
    { title: "All Books", link: "/all-books" },
    { title: "Cart", link: "/cart" },
    { title: "Profile", link: "/profile" },
  ];

  const [open, setOpen] = useState(false); // boolean use karte hain

  return (
    <>
      <nav className="navbar relative z-50 bg-zinc-800 text-white px-8 py-4 flex items-center justify-between">
        <Link to={"/"} className="logo flex items-center">
          <img src={logo} alt="logo" className="h-10 m-4" />
          <h1 className="text-2xl font-semibold">BookMart</h1>
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          {links.map((item, i) => (
            <Link
              to={item.link}
              key={i}
              className="hover:text-blue-400 transition-all duration-300"
            >
              {item.title}
            </Link>
          ))}
          <Link
            to={"/login"}
            className="px-4 py-1 border border-blue-500 rounded transition-all duration-300 hover:bg-amber-50 hover:text-zinc-700"
          >
            SignIn
          </Link>
          <Link
            to={"/signup"}
            className="px-4 py-1 bg-blue-500 rounded transition-all duration-300 hover:bg-amber-50 text-zinc-200 hover:text-zinc-700"
          >
            SignUp
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className=" block md:hidden text-white text-2xl hover:text-amber-400"
          onClick={() => setOpen(!open)} // toggle
        >
          <FaGripLines />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`${
          open ? "flex" : "hidden"
        } bg-zinc-800 h-screen absolute top-0 left-0 w-full z-40 flex-col items-center justify-center`}
      >
        {links.map((item, i) => (
          <Link
            to={item.link}
            key={i}
            className="hover:text-blue-500 mb-6 text-white text-3xl font-semibold transition-all duration-300"
            onClick={() => setOpen(false)} // menu close on click
          >
            {item.title}
          </Link>
        ))}
        <Link
          to={"/login"}
          className="px-4 py-1 border border-blue-500 rounded transition-all duration-300 hover:bg-amber-50 hover:text-zinc-700 mb-4 text-zinc-200"
          onClick={() => setOpen(false)}
        >
          SignIn
        </Link>
        <Link
          to={"/signup"}
          className="px-4 py-1 bg-blue-500 rounded transition-all duration-300 hover:bg-amber-50 text-zinc-200 hover:text-zinc-700"
          onClick={() => setOpen(false)}
        >
          SignUp
        </Link>
      </div>
    </>
  );
};

export default Navbar;
