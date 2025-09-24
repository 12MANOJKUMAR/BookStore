// src/pages/Payment.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../util/axios";

const Payment = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: ""
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/cart`);
      
      const validCartItems = (response.data.cart || []).filter(item => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      cardNumber: formatted
    }));
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setFormData(prev => ({
      ...prev,
      expiryDate: formatted
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order from cart items - send individual book details
      const orderItems = cartItems.map(item => ({
        _id: item.book._id,
        qty: item.qty || 1,
        price: item.book.price || 0
      }));

      // Create order
      const orderResponse = await api.post(`/order`, {
        order: orderItems
      });
      
      // Clear cart after successful payment
      await api.delete(`/cart/clear`);
      
      // Dispatch order update event
      window.dispatchEvent(new CustomEvent('orderUpdated'));
      
      // Show success message
      alert("Payment successful! Your order has been placed.");
      
      // Redirect to order history with success state
      navigate("/profile/orderHistory", { state: { fromPayment: true } });
      
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => {
    if (!item || !item.book) return sum;
    return sum + (item.book.price || 0) * (item.qty || 1);
  }, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center py-20 bg-zinc-800/50 rounded-2xl backdrop-blur-sm border border-zinc-700 p-8">
          <div className="text-7xl mb-6">🛒</div>
          <h3 className="text-3xl font-bold text-gray-300 mb-3">Your cart is empty</h3>
          <p className="text-gray-400 text-lg mb-8">Add some books to your cart before checkout!</p>
          <Link 
            to="/all-books" 
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center mb-2">
            <span className="mr-3 text-5xl">💳</span> Checkout
          </h1>
          <p className="text-gray-400 text-lg">Complete your purchase securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700">
            <h2 className="text-2xl font-bold text-white mb-6">Payment Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Card Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-300">Card Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength="4"
                      className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-300">Contact Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Billing Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-300">Billing Address</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="NY"
                      className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="10001"
                    className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <span className="text-xl">💳</span>
                    Complete Payment - ₹{totalAmount}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700">
            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => {
                if (!item || !item.book) return null;
                
                return (
                  <div key={item.book._id} className="flex items-center gap-4 p-4 bg-zinc-700/50 rounded-lg">
                    {item.book.url ? (
                      <img 
                        src={item.book.url} 
                        alt={item.book.title} 
                        className="w-16 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-20 bg-zinc-600 flex items-center justify-center text-gray-400 rounded">
                        No Image
                      </div>
                    )}
                    <div className="flex-grow">
                      <h4 className="font-semibold text-white text-sm">{item.book.title}</h4>
                      <p className="text-gray-400 text-xs">by {item.book.author}</p>
                      <p className="text-green-400 font-semibold">₹{item.book.price} × {item.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-yellow-400">₹{(item.book.price || 0) * (item.qty || 1)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-zinc-600 pt-4 space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Delivery</span>
                <span className="text-green-400">FREE</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Tax</span>
                <span>₹0</span>
              </div>
              <div className="border-t border-zinc-600 pt-2 flex justify-between items-center">
                <span className="text-xl font-bold text-white">Total</span>
                <span className="text-2xl font-extrabold text-green-400">₹{totalAmount}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-blue-300 text-sm">
                <span className="text-lg">🔒</span>
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Cart Link */}
        <div className="mt-8 text-center">
          <Link 
            to="/cart" 
            className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <span>←</span> Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Payment;
