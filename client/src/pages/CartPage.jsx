import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cart, removeFromCart } = useCart();

  // ✅ cart shape is { items: [] }
  const items = cart?.items || [];
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="max-w-4xl mx-auto p-8 font-poppins">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <Link to="/" className="text-green-600 font-bold hover:underline">Continue Shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.image ? `http://localhost:4000/${item.image}` : '/placeholder.jpg'}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-700">${(item.price * item.quantity).toFixed(2)}</p>
                {/* ✅ FIX: item.productId matches what CartContext stores */}
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-red-500 text-sm hover:underline mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="mt-8 pt-6 border-t">
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-green-800">${subtotal.toFixed(2)}</span>
            </div>
            <button className="w-full bg-green-600 text-white py-4 rounded-xl mt-6 font-bold hover:bg-green-700 transition-colors">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;