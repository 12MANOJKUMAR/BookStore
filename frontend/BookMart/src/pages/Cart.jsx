// src/pages/Cart.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/cart`, {
        withCredentials: true,
      });

      // Filter out invalid items and ensure book is populated
      const validCartItems = (response.data.cart || []).filter((item) => {
        if (!item || !item.book) {
          console.warn("Filtering out invalid cart item:", item);
          return false;
        }
        return true;
      });

      setCartItems(validCartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = async (item) => {
    if (!item || !item.book || !item.book._id) {
      console.error("Invalid item for increment:", item);
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/cart/${item.book._id}`,
        { qty: (item.qty || 1) + 1 },
        { withCredentials: true }
      );
      // Update local state
      setCartItems((prev) =>
        prev.map((cartItem) =>
          cartItem.book && cartItem.book._id === item.book._id
            ? { ...cartItem, qty: (cartItem.qty || 1) + 1 }
            : cartItem
        )
      );
      // Dispatch cart update event
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity");
    }
  };

  const handleDecrement = async (item) => {
    if (!item || !item.book || !item.book._id || item.qty <= 1) return;

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/cart/${item.book._id}`,
        { qty: item.qty - 1 },
        { withCredentials: true }
      );
      // Update local state
      setCartItems((prev) =>
        prev.map((cartItem) =>
          cartItem.book && cartItem.book._id === item.book._id
            ? { ...cartItem, qty: cartItem.qty - 1 }
            : cartItem
        )
      );
      // Dispatch cart update event
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity");
    }
  };

  const handleRemove = async (bookId) => {
    if (!window.confirm("Remove this item from cart?")) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/cart/${bookId}`, {
        withCredentials: true,
      });
      // Update local state
      setCartItems((prev) => prev.filter((item) => item.book._id !== bookId));
      alert("Item removed from cart");
      // Dispatch cart update event
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (error) {
      console.error("Error removing from cart:", error);
      alert("Failed to remove item");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg">Loading your cart...</p>
        </div>
      </div>
    );

  const totalAmount = cartItems.reduce((sum, item) => {
    if (!item || !item.book) return sum;
    return sum + (item.book.price || 0) * (item.qty || 1);
  }, 0);

  return (
    <div className="cart-container p-4 md:p-8 bg-zinc-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white flex items-center">
              <span className="mr-2 sm:mr-3 text-3xl sm:text-4xl md:text-5xl">
                🛒
              </span>{" "}
              Shopping Cart
            </h2>
            <p className="text-gray-400 mt-2 text-sm sm:text-base md:text-lg">
              Review and manage your items
            </p>
          </div>
          <button
            onClick={fetchCart}
            className="bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
          >
            <span className="text-lg sm:text-xl">🔄</span> Refresh
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-zinc-800/50 rounded-2xl backdrop-blur-sm border border-zinc-700">
            <div className="text-5xl sm:text-6xl md:text-7xl mb-6">📦</div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-300 mb-3">
              Your cart is empty
            </h3>
            <p className="text-gray-400 text-base sm:text-lg mb-8">
              Discover amazing books to add to your collection!
            </p>
            <Link
              to="/all-books"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-6 lg:space-y-4">
              {cartItems.map((item) => {
                if (!item || !item.book) {
                  console.warn("Invalid cart item:", item);
                  return null;
                }

                return (
                  <div
                    key={item.book._id}
                    className="relative bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-zinc-700 hover:border-zinc-600"
                  >
                    {/* Single Delete button - always top right */}
                    <button
                      onClick={() => handleRemove(item.book._id)}
                      className="absolute top-2 right-2 p-2 sm:p-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200"
                      title="Remove from cart"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>

                    <div className="flex flex-row gap-4 sm:gap-6">
                      {/* Book Image */}
                      <div className="flex-shrink-0 my-auto">
                        {item.book.url ? (
                          <div className="relative w-20 h-28 sm:w-28 sm:h-40 md:w-40 md:h-56 overflow-hidden rounded-lg shadow-xl">
                            <img
                              src={item.book.url}
                              alt={item.book.title || "Book"}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-28 sm:w-28 sm:h-40 md:w-40 md:h-56 bg-zinc-700 flex items-center justify-center text-gray-400 rounded-lg shadow-xl">
                            <span className="text-xs sm:text-sm">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* Book Details */}
                      <div className="flex-grow flex flex-col justify-between pr-8 sm:pr-0">
                        <div>
                          <h3 className="font-bold text-white text-sm sm:text-base md:text-2xl mb-1 sm:mb-2 line-clamp-1">
                            {item.book.title || "Unknown Title"}
                          </h3>
                          <p className="text-gray-400 mb-2 sm:mb-4 text-xs sm:text-sm md:text-base line-clamp-1">
                            by {item.book.author || "Unknown Author"}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-4">
                            <span className="text-green-400 font-semibold text-sm sm:text-base md:text-lg">
                              ₹{item.book.price || 0}
                            </span>
                            <span className="text-gray-500 text-xs sm:text-sm">
                              per item
                            </span>
                          </div>
                        </div>

                        {/* Quantity + Subtotal Row */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <button
                              onClick={() => handleDecrement(item)}
                              className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                              disabled={item.qty <= 1}
                            >
                              −
                            </button>
                            <span className="font-bold text-white text-sm sm:text-lg md:text-xl min-w-[2rem] sm:min-w-[2.5rem] md:min-w-[3rem] text-center bg-zinc-700 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-lg">
                              {item.qty || 1}
                            </span>
                            <button
                              onClick={() => handleIncrement(item)}
                              className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white rounded-lg font-bold transition-all duration-200 text-sm sm:text-base"
                            >
                              +
                            </button>
                          </div>

                          {/* Subtotal aligned to extreme right */}
                          <div className="ml-auto text-right">
                            <p className="text-xs sm:text-sm text-gray-400">
                              Subtotal
                            </p>
                            <p className="font-bold text-yellow-400 text-base sm:text-xl md:text-2xl">
                              ₹{(item.book?.price || 0) * (item.qty || 1)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="mt-10 p-6 sm:p-8 bg-gradient-to-br from-zinc-800 via-zinc-800 to-zinc-700 rounded-2xl border border-zinc-600 shadow-2xl">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-300 text-sm sm:text-base">
                  <span>Items ({cartItems.length})</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-300 text-sm sm:text-base">
                  <span>Delivery</span>
                  <span className="text-green-400">FREE</span>
                </div>

                <div className="border-t border-zinc-600 pt-3 flex justify-between items-center">
                  <span className="text-lg sm:text-xl font-bold text-white">
                    Total Amount
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-green-400">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/payment")}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <span className="text-lg sm:text-xl">💳</span> Proceed to
                  Checkout
                </button>
                <Link
                  to="/all-books"
                  className="flex-1 bg-transparent border-2 border-zinc-500 text-zinc-300 hover:border-zinc-400 hover:text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <span className="text-lg sm:text-xl">📚</span> Continue
                  Shopping
                </Link>
              </div>

              <p className="text-center text-gray-500 text-xs sm:text-sm mt-6">
                🔒 Secure checkout powered by SSL encryption
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
