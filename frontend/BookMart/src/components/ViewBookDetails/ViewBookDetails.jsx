import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { GrLanguage } from "react-icons/gr";

const ViewBookDetails = () => {
  const { id } = useParams();
  const [Data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1000/api/v1/get-book/${id}`
        );
        console.log(response.data);
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen bg-zinc-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  } // show loader while fetching
  if (!Data) return <p className="text-red-500">Book not found</p>; // safe guard

  return (
    <div className="px-4 lg:px-12 py-8 bg-zinc-900 flex flex-col md:flex-row gap-8 rounded">
      <div className="bg-zinc-800 rounded p-4 h-[60vh] lg:h-[88vh] w-full lg:w-3/6 flex items-center justify-center ">
        {Data.url ? (
          <img
            src={Data.url}
            alt={Data.title || "Book"}
            className=" h-[50vh] lg:h-[70vh]"
          />
        ) : (
          <p className="text-gray-400">No image available</p>
        )}
      </div>
      <div className="p-4 w-full lg:w-3/6">
        <h2 className="text-2xl text-zinc-300">
          {Data.title || "Untitled Book"}
        </h2>
        <p className="text-gray-400 mt-1">
          by {Data.author || "Unknown Author"}
        </p>
        <p className="text-gray-500 mt-4 text-xl">
          {Data.desc || "No description available."}
        </p>
        <p className="flex items-center justify-start text-gray-400">
          <GrLanguage className="mr-3" /> {Data.language || "Unknown language"}
        </p>
        <p className="mt-4 text-zinc-100 text-3xl font-semibold">
          Price: ₹ {Data.price ?? "N/A"}
        </p>
      </div>
    </div>
  );
};

export default ViewBookDetails;
