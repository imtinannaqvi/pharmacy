import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { ShoppingCart, ArrowLeft, Minus, Plus, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/medicines/${id}`); 
        const data = res.data.medicine || res.data;
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleQuantity = (type) => {
    if (type === 'plus' && quantity < (product?.stock || 10)) setQuantity(prev => prev + 1);
    if (type === 'minus' && quantity > 1) setQuantity(prev => prev - 1);
  };

  // Helper to handle both adding and navigating
  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    navigate('/cart'); // Change this string if your cart route is different (e.g., '/checkout')
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return (
    <div className="max-w-xl mx-auto py-16 text-center">
      <h2 className="text-xl font-bold text-gray-800 mb-3">Medicine not found</h2>
      <button onClick={() => navigate('/home')} className="text-green-600 text-sm font-semibold hover:underline">Return to Shop</button>
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-poppins text-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-xs text-gray-400 mb-6 hover:text-gray-900 transition-colors">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6">
            <div className="sticky top-6 bg-[#fbfbfb] rounded-xl p-8 border border-gray-100 flex items-center justify-center overflow-hidden">
              <img 
                src={product.image ? `http://localhost:4000/${product.image}` : '/placeholder.png'} 
                alt={product.name} 
                className="w-full max-h-[350px] object-contain mix-blend-multiply transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded">
                  {product.category || 'Pharmaceutical'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h1>
              <p className="text-xs font-medium text-gray-400">Brand: {product.brand || 'Medico Guidance'}</p>
            </div>

            <div className="flex items-baseline gap-3 py-3 border-y border-gray-50">
              <span className="text-2xl font-bold text-gray-900">£{product.sellingPrice || product.price}</span>
              {product.price > (product.sellingPrice || 0) && (
                <span className="text-sm text-gray-300 line-through">£{product.price}</span>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-tighter">Description</h3>
              <p className="text-xs leading-relaxed text-gray-500 max-w-sm">
                {product.description || "High-quality pharmaceutical product prepared under strict medical standards."}
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg px-1 bg-white">
                  <button onClick={() => handleQuantity('minus')} className="p-1.5 text-gray-400 hover:text-gray-900"><Minus size={14} /></button>
                  <span className="w-8 text-center font-bold text-xs">{quantity}</span>
                  <button onClick={() => handleQuantity('plus')} className="p-1.5 text-gray-400 hover:text-gray-900"><Plus size={14} /></button>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  {product.stock > 0 ? `${product.stock} in stock` : <span className="text-red-500">Out of stock</span>}
                </p>
              </div>

              <div className="flex gap-3">
                <button 
                  disabled={product.stock <= 0}
                  onClick={handleAddToCart}
                  className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={16} />
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;