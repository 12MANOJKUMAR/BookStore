import {Link} from 'react-router-dom';
const BookCard = ({ data }) => {
  return (
    <>
      <Link to={`/book/${data._id}`}>
        <div className="bg-zinc-800 rounded p-4 flex flex-col">
          <div className="bg-zinc-900 rounded flex items-center justify-center">
            <img src={data.url || "https://via.placeholder.com/150"} alt='/' className='w-32 h-48 object-cover' />
          </div>
          <h4 className="text-zinc-200 font-semibold text-xl mt-2">{data.title}</h4>
          <p className='mt-2 text-zinc-400 font-semibold'> by {data.author}</p>
          <p className='mt-2 text-zinc-200 font-semibold'>₹ {data.price}</p>
          </div>
      </Link>
    </>
  );
};

export default BookCard;
