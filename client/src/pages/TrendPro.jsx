import React, { useState, useEffect } from 'react';
import { ChevronRight, ShoppingCart, Check, Star } from 'lucide-react';
import API from "../api/axios";

const TrendPro = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState({});
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await API.get("/medicines");
        const data = Array.isArray(response.data)
          ? response.data
          : (response.data.medicines || []);
        setTimeout(() => {
          setProducts(data.slice(0, 8));
          setLoading(false);
        }, 200);
      } catch (error) {
        console.error("Error loading products:", error);
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  // Staggered card reveal after products load
  useEffect(() => {
    if (!loading && products.length) {
      products.forEach((_, i) => {
        setTimeout(() => {
          setVisible(prev => [...prev, i]);
        }, i * 70);
      });
    }
  }, [loading, products]);

  const handleAddToCart = (id) => {
    setAdded(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [id]: false })), 2000);
  };

  const SkeletonCard = ({ delay }) => (
    <div
      className="bg-white border border-gray-100 rounded-2xl p-4 animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="aspect-square bg-gray-100 rounded-xl mb-4" />
      <div className="h-2.5 bg-gray-100 rounded w-16 mb-2" />
      <div className="h-3 bg-gray-100 rounded mb-1.5" />
      <div className="h-3 bg-gray-100 rounded w-3/4 mb-4" />
      <div className="h-5 bg-gray-100 rounded w-16" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-white font-sans">

      {/* Animated progress bar while loading */}
      {loading && (
        <div className="h-0.5 bg-gray-100 rounded mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded"
            style={{ animation: 'loadBar 1.2s ease forwards' }}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2
            className="text-3xl font-semibold text-gray-800"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Trending <span className="text-green-600">Products</span>
          </h2>
          
        </div>
        <button className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 px-3 py-2 rounded-lg transition-all group">
          View All
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {loading
          ? Array(8).fill(0).map((_, i) => (
              <SkeletonCard key={i} delay={i * 50} />
            ))
          : products.map((item, i) => {
              const isVisible = visible.includes(i);
              const isAdded = added[item._id];
              const price = item.sellingPrice || item.price;
              const originalPrice = Math.round(price * 1.1);
              const discount = Math.round(100 - (price / (price * 1.1)) * 100);

              return (
                <div
                  key={item._id}
                  className="bg-white border border-gray-100 rounded-2xl p-4 group relative overflow-hidden cursor-pointer"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition:
                      'opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s, border-color 0.3s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(22,163,74,0.13)';
                    e.currentTarget.style.borderColor = 'rgba(22,163,74,0.2)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = '';
                    e.currentTarget.style.borderColor = '';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Discount badge */}
                  {/* <span className="absolute top-3 left-3 text-[10px] font-semibold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full z-10">
                    {discount}% off
                  </span> */}

                  {/* Product Image */}
                  <div className="aspect-square mb-4 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden p-4">
                    {item.image ? (
                      <img
                        src={`http://localhost:4000/${item.image}`}
                        alt={item.name}
                        className="max-w-full max-h-full object-contain transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-1"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-lg" />
                    )}
                  </div>

                  {/* Star rating with pop-in animation */}
                 

                  {/* Product name */}
                  <h3 className="text-lg font-bold text-gray-700 mb-4 line-clamp-2 min-h-[40px]">
                    {item.name}
                  </h3>
                     
                      <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, si) => (
                      <Star
                        key={si}
                        className="w-3 h-3 fill-orange-400 text-orange-400"
                        style={{
                          opacity: isVisible ? 1 : 0,
                          transform: isVisible ? 'scale(1)' : 'scale(0)',
                          transition: `opacity 0.3s ${(i * 70) + (si * 60)}ms, transform 0.3s ${(i * 70) + (si * 60)}ms cubic-bezier(0.22,1,0.36,1)`,
                        }}
                      />
                    ))}
                  </div>
                  {/* Price + Cart */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-400 line-through">
                        £{originalPrice}.00
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        £{price}.00
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(item._id)}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md shadow-green-200 transition-all duration-200 active:scale-90"
                      style={{ background: isAdded ? '#15803d' : '#16a34a' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
                    >
                      {isAdded
                        ? <Check className="w-4 h-4" strokeWidth={2.5} />
                        : <ShoppingCart className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </div>
              );
            })
        }
      </div>

      <style>{`
        @keyframes loadBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default TrendPro;