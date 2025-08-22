import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import Loader from "../Loader/Loader";

const RecentlyAdded = ()=>{

  const [Data, setData] = useState();
   
  useEffect(()=>{
    const fetch = async ()=>
       {
        const response = await axios.get('http://localhost:1000/api/v1/recent-books');
        setData(response.data.data)
       };
        fetch()
      },
      []);
  return (
    <div className="recent m-8 px-2">
      <h4 className="text-3xl text-yellow-100">Recently added books</h4>
      {!Data && <div className="loader flex items-center justify-center h-96"><span className="text-white">Loading...</span>
        <Loader /></div>}
      <div className="my-8 grid grid-col1 sd:grid-cols-3 md:grid-cols-4 gap-4 ">
        {Data && Data.map((item,i)=>(
        <div key={i}>
        <BookCard data={item}/>
        </div>
      ))}
      </div>
    </div>
  )
}

export default RecentlyAdded;