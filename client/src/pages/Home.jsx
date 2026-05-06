import { useState, useRef } from 'react';
import { 
  ArrowRight, HandCoins, Plus, Minus, RotateCcwIcon, 
  ShoppingCart, ShoppingCartIcon, Truck, Headset, 
  ChevronDown, X, Search, FileText, UploadCloud,
  Mail, Phone, MapPin
} from 'lucide-react';
import TrendPro from './TrendPro';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API from '../api/axios';

// 👇 Custom SVG brand icons — lucide-react doesn't include these
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const faqData = [
  {
    question: "How do I start online consultation with the doctors on Medico Guidance?",
    answer: "You can start by creating an account on Medico Guidance, selecting your preferred specialist, and booking an available time slot for a secure video call."
  },
  {
    question: "How does the diagnostic process work at FixItNow?",
    answer: "Our process is seamless. We utilize integrated computer vision and AI systems for service diagnostics, allowing you to get automated reporting and accurate assessments for your home service needs."
  },
  {
    question: "What sets Verbic services apart from others?",
    answer: "We prioritize direct diagnostics through our SmartFix technology, ensuring accuracy and speed that traditional marketplace services cannot match."
  },
  {
    question: "Can FixItNow handle large-scale service requirements?",
    answer: "Yes, our marketplace is designed to scale. We coordinate multiple service providers simultaneously to manage high-volume requirements efficiently."
  }
];

const Navbar = () => {
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const navigate = useNavigate();
  const { cart, cartCount, removeFromCart } = useCart();
  const items = cart?.items || [];
  const subtotal = items.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    setSearchLoading(true);
    setShowResults(true);
    try {
      const res = await API.get('/medicines');
      const all = Array.isArray(res.data) ? res.data : (res.data.medicines || []);
      const filtered = all.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(query.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(filtered.slice(0, 6));
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <nav className="sticky top-0 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 relative z-50 font-poppins">
      <Link to="/" className="text-2xl font-black text-green-700 tracking-tight shrink-0">Medrixcs</Link>

      <div className="flex-grow mx-8 max-w-2xl relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 300)}
            placeholder="Search medicine, products or categories..."
            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-400 transition-all bg-gray-50/50 text-sm"
          />
          {searchQuery && (
            <button onClick={clearSearch} className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-[100]">
            {searchLoading ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">
                <div className="inline-block w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin mr-3 align-middle" />
                Searching for you...
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div className="px-4 pt-3 pb-1 border-b border-gray-50 bg-gray-50/30">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                {searchResults.map(product => (
                  <div
                    key={product._id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setShowResults(false);
                      navigate(`/medicine/${product._id}`);
                    }}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-green-50/50 cursor-pointer transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-100 shrink-0 flex items-center justify-center shadow-sm">
                      {product.image ? (
                        <img src={`http://localhost:4000/${product.image}`} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg">💊</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate group-hover:text-green-700 transition-colors">{product.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{product.category} {product.brand ? `· ${product.brand}` : ''}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-gray-900">£{product.sellingPrice || product.price}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.stock > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {product.stock > 5 ? 'Available' : 'Low Stock'}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="px-4 py-10 text-center">
                <div className="text-3xl mb-2 opacity-50">🔍</div>
                <p className="text-sm font-bold text-gray-700">We couldn't find that</p>
                <p className="text-xs text-gray-400 mt-1">Check spelling or try a different category</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-6 text-gray-700 font-medium shrink-0">
        <div
          className="relative"
          onMouseEnter={() => setShowAccountDropdown(true)}
          onMouseLeave={() => setShowAccountDropdown(false)}
        >
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-green-700 transition-colors py-2 text-sm">
            <p>Your Account</p>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAccountDropdown ? 'rotate-180' : ''}`} />
          </div>
          {showAccountDropdown && (
            <div className="absolute top-full right-0 w-52 bg-white border border-gray-100 shadow-2xl rounded-2xl py-2 mt-1 z-50 overflow-hidden">
              <Link to="/login" className="block px-4 py-2.5 text-sm hover:bg-green-50 hover:text-green-700 transition-colors">Login</Link>
              <Link to="/register" className="block px-4 py-2.5 text-sm hover:bg-green-50 hover:text-green-700 transition-colors">Sign Up</Link>
              <div className="border-t border-gray-50 my-1"></div>
              <Link to="/profile" className="block px-4 py-2.5 text-sm hover:bg-green-50 transition-colors">Settings</Link>
            </div>
          )}
        </div>

        <div
          className="relative"
          onMouseEnter={() => setShowCartDropdown(true)}
          onMouseLeave={() => setShowCartDropdown(false)}
        >
          <Link to="/cart" className="flex items-center space-x-2 cursor-pointer hover:text-green-700 transition-colors py-2 group">
            <div className="relative">
              <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-sm">Your Cart</span>
          </Link>

          {showCartDropdown && (
            <div className="absolute top-full right-0 w-80 bg-white border border-gray-100 shadow-2xl rounded-2xl py-5 px-5 mt-1 z-50">
              <h3 className="text-gray-900 font-bold mb-4 border-b border-gray-50 pb-3 text-xs uppercase tracking-widest">Shopping Bag</h3>
              <div className="max-h-72 overflow-y-auto space-y-4 pr-1">
                {items.length > 0 ? (
                  items.map((item) => (
                    <div key={item.productId} className="flex gap-4 items-center group">
                      <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0 flex items-center justify-center shadow-sm">
                        {item.image ? (
                          <img src={`http://localhost:4000/${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl">💊</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-bold text-gray-800 truncate">{item.name}</h4>
                        <p className="text-[11px] text-gray-500 mt-1">
                          Qty: {item.quantity} × <span className="text-green-600 font-black">£{item.price}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center">
                    <p className="text-sm text-gray-400 font-medium">Your cart is empty</p>
                  </div>
                )}
              </div>
              {items.length > 0 && (
                <div className="mt-6 pt-5 border-t border-gray-50 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-tighter">Total Est.</span>
                    <span className="text-gray-900 font-black text-2xl">£{subtotal.toFixed(2)}</span>
                  </div>
                  <Link
                    to="/cart"
                    className="block w-full bg-green-600 text-white text-center py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-xl shadow-green-100 active:scale-[0.98]"
                  >
                    Checkout Now
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <div className="max-w-4xl mx-auto py-24 px-6 font-sans">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
          Got Questions? <span className="text-green-600">We've Got Answers.</span>
        </h2>
        <p className="text-gray-400 max-w-lg mx-auto">Everything you need to know about Medico Guidance and our services.</p>
      </div>
      <div className="space-y-3">
        {faqData.map((item, index) => (
          <div
            key={index}
            className={`rounded-2xl transition-all duration-500 border ${
              openIndex === index
              ? 'bg-white shadow-xl shadow-gray-100 border-green-100'
              : 'bg-gray-50/50 border-transparent hover:border-gray-200'
            }`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <span className={`text-[17px] font-bold ${openIndex === index ? 'text-green-700' : 'text-gray-800'}`}>
                {item.question}
              </span>
              <div className={`p-1.5 rounded-full transition-colors ${openIndex === index ? 'bg-green-100' : 'bg-gray-200'}`}>
                {openIndex === index
                  ? <Minus className="text-green-700 w-4 h-4" />
                  : <Plus className="text-gray-500 w-4 h-4" />
                }
              </div>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ${openIndex === index ? 'max-h-40' : 'max-h-0'}`}>
              <div className="px-6 pb-6 text-gray-500 text-[15px] leading-relaxed">{item.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Max 5MB allowed.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleProceedWithOrder = (e) => {
    e.stopPropagation();
    if (!selectedFile) {
      alert("Prescription is required to proceed with this order.");
    } else {
      navigate('/cart', { state: { prescriptionAttached: true } });
    }
  };

  const onUploadContainerClick = () => fileInputRef.current.click();

  return (
    <div className="font-poppins bg-white selection:bg-green-100 selection:text-green-900">
      <Navbar />
      <main className="w-full">

        {/* Hero Section */}
        <div className="bg-[#05422C] min-h-[550px] flex flex-col md:flex-row items-center justify-between px-8 md:px-24 py-20 gap-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] -mr-48 -mt-48" />
          <div className="md:w-3/5 text-white space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-300">Trusted Healthcare Partner</p>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
              Improving health with <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Best Medicine</span>
            </h1>
            <p className="text-lg text-green-100/70 max-w-lg leading-relaxed">
              Elevate your health journey with Medico Guidance. Get exclusive discounts and unparalleled convenience delivered to your doorstep.
            </p>
            <div className="flex flex-wrap gap-5 pt-4">
              <button
                onClick={() => navigate('/cart')}
                className="group flex items-center gap-3 bg-green-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-green-400 transition-all shadow-2xl shadow-green-900/50 active:scale-95"
              >
                Shop Now <ShoppingCartIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/medicines')}
                className="flex items-center gap-3 border-2 border-white/20 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white hover:text-green-900 transition-all active:scale-95"
              >
                Top Products <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="md:w-2/5 flex justify-center md:justify-end z-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-green-500/20 rounded-[3rem] blur-2xl group-hover:bg-green-500/30 transition-colors" />
              <img
                src="pexels-shkrabaanthony-5215009.jpg"
                alt="Medical Professional"
                className="w-72 md:w-80 lg:w-96 rounded-[3rem] shadow-2xl object-cover relative border-4 border-white/5 grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="flex flex-nowrap justify-between items-center gap-8 px-8 lg:px-24 py-12 bg-white border-b border-gray-50 overflow-x-auto">
          {[
            { icon: Truck, title: "Free Shipping", sub: "Orders over £199" },
            { icon: HandCoins, title: "Secure Payment", sub: "100% encryption" },
            { icon: RotateCcwIcon, title: "30-Day Returns", sub: "Money back policy" },
            { icon: Headset, title: "24/7 Support", sub: "Expert guidance" }
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center gap-4 group shrink-0">
              <span className="p-4 bg-green-50 text-green-700 rounded-2xl group-hover:bg-green-700 group-hover:text-white transition-all duration-300">
                <feature.icon className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-black text-gray-900 text-sm tracking-tight">{feature.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{feature.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Prescription Upload Section */}
        <div className="px-8 md:px-24 py-16 bg-white">
          <div className="max-w-7xl mx-auto bg-gradient-to-br from-green-50 to-emerald-50 rounded-[3rem] p-8 md:p-12 border border-green-100 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/20 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="flex-1 space-y-6 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full">
                <FileText className="w-3 h-3 text-green-600" />
                <p className="text-[10px] font-black uppercase tracking-widest text-green-700">Fast Track Ordering</p>
              </div>
              <h2 className="text-4xl font-black text-gray-900 leading-tight">
                Quick Order with <span className="text-green-600">Prescription</span>
              </h2>
              <p className="text-gray-500 max-w-md text-sm leading-relaxed">
                Short on time? Just upload your prescription, and our pharmacists will process your order immediately.
              </p>
              <ul className="space-y-3">
                {['Verified Pharmacists', 'Secure Document Handling', 'Same-Day Processing', 'Privacy Guaranteed'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full md:w-[400px] z-10">
              <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-green-200/50 border border-white relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.pdf"
                />
                <div
                  onClick={onUploadContainerClick}
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center text-center group transition-colors cursor-pointer ${
                    selectedFile ? 'border-green-500 bg-green-50/30' : 'border-green-200 hover:border-green-500'
                  }`}
                >
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-black text-gray-900 mb-1">
                    {selectedFile ? 'File Selected' : 'Upload File'}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-medium truncate w-full px-4 mb-4">
                    {selectedFile ? selectedFile.name : 'PNG, JPG or PDF (Max 5MB)'}
                  </p>
                  <button
                    onClick={handleProceedWithOrder}
                    className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      selectedFile
                        ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
                        : 'bg-gray-900 text-white hover:bg-red-500'
                    }`}
                  >
                    {selectedFile ? 'Proceed to Cart' : 'Order Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Promo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 md:px-24 py-20 bg-gray-50/50">
          <div className="relative overflow-hidden rounded-[2.5rem] group cursor-pointer h-72 border border-white shadow-xl">
            <img src="/pexels-karola-g-7321231.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Anti-age" />
            <div className="absolute inset-0 p-8 flex flex-col justify-between bg-gradient-to-t from-black/60 via-transparent to-transparent">
              <div className="flex justify-start">
                <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-xl tracking-widest uppercase">Skin Care</span>
              </div>
              <h2 className="text-white text-3xl font-black leading-tight">Anti-age<br />Skin Serum</h2>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2.5rem] group cursor-pointer h-72 border border-white shadow-xl">
            <img src="/pexels-gustavo-fring-3985039.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Natural Wealth" />
            <div className="absolute inset-0 p-8 flex flex-col bg-gradient-to-b from-black/30 via-transparent to-black/60">
              <div className="bg-white/90 backdrop-blur-md w-16 h-16 rounded-2xl flex flex-col items-center justify-center shadow-xl self-start">
                <span className="text-[9px] text-orange-600 font-black tracking-widest">SAVE</span>
                <span className="text-xl font-black text-green-700">50%</span>
              </div>
              <h2 className="text-white text-3xl font-black mt-auto">Natural Wealth<br />Beta Karoten</h2>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2.5rem] group cursor-pointer h-72 border border-white shadow-xl">
            <img src="/pexels-kindelmedia-7149130.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Services" />
            <div className="absolute inset-0 p-8">
              <div className="bg-white/95 backdrop-blur-md inline-block px-5 py-3 rounded-2xl shadow-xl border-l-4 border-red-600">
                <p className="text-blue-900 font-black text-2xl italic tracking-tighter leading-none">Medico</p>
                <p className="text-[8px] text-blue-500 tracking-[0.3em] uppercase font-bold mt-1.5">Smart AI Diagnostics</p>
              </div>
            </div>
          </div>
        </div>

        <div className="py-10">
          <TrendPro />
        </div>

        {/* Featured Deals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 md:px-24 py-12 font-poppins">
          <div className="bg-[#E0F9FB] rounded-[2.5rem] flex flex-row items-center min-h-[380px] overflow-hidden group hover:shadow-xl transition-all duration-500 cursor-pointer border border-white">
            <div className="flex flex-col p-8 flex-1 z-10">
              <span className="inline-block bg-green-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest w-fit">25% OFF</span>
              <h1 className="text-3xl font-black text-gray-900 mt-6 mb-3 tracking-tight leading-tight">Black Garlic Oil</h1>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[200px] mb-8 font-medium">Stronger and Thicker Hair With Pure Extracts.</p>
              <div>
                <p className="text-gray-400 text-xs line-through font-bold">£37.00</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-gray-900">£27.75</span>
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Inc. Tax</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 w-[45%] h-full flex items-center justify-center p-4">
              <img src="/pexels-ron-lach-8140898.jpg" alt="Black Garlic Oil" className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-[#FCE4EC] rounded-[2.5rem] p-8 flex flex-row items-center justify-between overflow-hidden flex-1 group hover:shadow-xl transition-all duration-500 cursor-pointer border border-white">
              <div className="z-10 flex-1 pr-4">
                <span className="inline-block bg-green-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">PROMO</span>
                <h1 className="text-xl font-black text-gray-900 mt-3 mb-1 leading-tight">Vivid Bright <br /> Smiles Set</h1>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-xl font-black text-gray-900">£22.90</span>
                  <p className="text-gray-400 text-[10px] line-through font-bold">£33.90</p>
                </div>
              </div>
              <div className="flex-shrink-0 w-[35%]">
                <img src="/pexels-helloaesthe-15694640.jpg" alt="Dental Care" className="w-full h-auto max-h-[140px] object-contain group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>

            <div className="bg-[#E8EAF6] rounded-[2.5rem] p-8 flex flex-row items-center justify-between overflow-hidden flex-1 group hover:shadow-xl transition-all duration-500 cursor-pointer border border-white">
              <div className="z-10 flex-1 pr-4">
                <span className="inline-block bg-green-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">POPULAR</span>
                <h1 className="text-xl font-black text-gray-900 mt-3 mb-1 leading-tight">Banana <br /> Toothpaste</h1>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-xl font-black text-gray-900">£37.00</span>
                </div>
              </div>
              <div className="flex-shrink-0 w-[35%]">
                <img src="/download (12).jpg" alt="Toothpaste" className="w-full h-auto max-h-[140px] object-contain group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="px-8 md:px-24 py-16 bg-green-50/50">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <span className="inline-block bg-green-100 text-green-700 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Stay Updated</span>
            <h2 className="text-3xl font-black text-gray-900">Subscribe to Our Newsletter</h2>
            <p className="text-gray-400 text-sm">Get the latest health tips, exclusive offers, and product updates delivered straight to your inbox.</p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-green-400 bg-white"
              />
              <button className="bg-green-600 text-white px-6 py-3.5 rounded-2xl text-sm font-black hover:bg-green-700 transition-all whitespace-nowrap">
                Subscribe
              </button>
            </div>
            <p className="text-[11px] text-gray-400">No spam. Unsubscribe anytime.</p>
          </div>
        </div>

        <FAQ />
      </main>

      {/* Footer */}
      <footer className="bg-[#042F1E] text-white pt-24 pb-10 px-8 md:px-24 font-sans relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">

            {/* Brand */}
            <div className="flex flex-col gap-6">
              <div className="text-3xl font-black tracking-tighter flex items-center gap-2">
                <div className="bg-green-500 p-1.5 rounded-lg">
                  <span className="text-white text-xl leading-none">M</span>
                </div>
                Medrixcs
              </div>
              <p className="text-gray-400 text-[15px] leading-relaxed">
                Empowering your health journey through expert medical guidance, verified pharmacists, and technology-driven healthcare solutions.
              </p>
              <div className="flex flex-col gap-4 text-[14px] text-gray-400">
                <span className="flex items-center gap-3 hover:text-green-400 transition-colors cursor-pointer">
                  <div className="bg-white/5 p-2 rounded-lg"><MapPin size={14}/></div>
                  123 Health Street, London, UK
                </span>
                <span className="flex items-center gap-3 hover:text-green-400 transition-colors cursor-pointer">
                  <div className="bg-white/5 p-2 rounded-lg"><Phone size={14}/></div>
                  +44 20 0000 0000
                </span>
                <span className="flex items-center gap-3 hover:text-green-400 transition-colors cursor-pointer">
                  <div className="bg-white/5 p-2 rounded-lg"><Mail size={14}/></div>
                  support@medrixcs.com
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-bold">Quick Links</h3>
              <ul className="flex flex-col gap-3 text-gray-400 text-sm">
                <li><Link to="/" className="hover:text-green-400 transition-colors">Home</Link></li>
                <li><Link to="/medicines" className="hover:text-green-400 transition-colors">Medicines</Link></li>
                <li><Link to="/cart" className="hover:text-green-400 transition-colors">Your Cart</Link></li>
                <li><Link to="/profile" className="hover:text-green-400 transition-colors">My Account</Link></li>
                <li><Link to="/login" className="hover:text-green-400 transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-green-400 transition-colors">Register</Link></li>
              </ul>
            </div>

            {/* Services & Policy */}
            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-bold">Services</h3>
              <ul className="flex flex-col gap-3 text-gray-400 text-sm">
                <li><Link to="/medicines" className="hover:text-green-400 transition-colors">Online Pharmacy</Link></li>
                <li><span className="hover:text-green-400 transition-colors cursor-pointer">Prescription Upload</span></li>
                <li><span className="hover:text-green-400 transition-colors cursor-pointer">Doctor Consultation</span></li>
                <li><span className="hover:text-green-400 transition-colors cursor-pointer">Health Diagnostics</span></li>
              </ul>
              <h3 className="text-lg font-bold mt-4">Legal</h3>
              <ul className="flex flex-col gap-3 text-gray-400 text-sm">
                <li><span className="hover:text-green-400 transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-green-400 transition-colors cursor-pointer">Terms of Service</span></li>
                <li><span className="hover:text-green-400 transition-colors cursor-pointer">Refund Policy</span></li>
              </ul>
            </div>

            {/* Newsletter + Social */}
            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-bold">Stay Connected</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Follow us on social media for health tips, promotions, and updates.
              </p>
              <div className="flex gap-3">
                <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-green-500 transition-all text-gray-400 hover:text-white">
                  <FacebookIcon />
                </a>
                <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-green-500 transition-all text-gray-400 hover:text-white">
                  <TwitterIcon />
                </a>
                <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-green-500 transition-all text-gray-400 hover:text-white">
                  <InstagramIcon />
                </a>
                <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-green-500 transition-all text-gray-400 hover:text-white">
                  <LinkedinIcon />
                </a>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-bold mb-3">Quick Newsletter</h4>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                  />
                  <button className="px-4 py-2.5 bg-green-500 rounded-xl text-sm font-bold hover:bg-green-400 transition-all">
                    Go
                  </button>
                </div>
              </div>

              <div className="mt-2 space-y-2">
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">We Accept</p>
                <div className="flex gap-2">
                  {['VISA', 'MC', 'AMEX', 'PayPal'].map(card => (
                    <div key={card} className="bg-white/10 px-3 py-1.5 rounded-lg">
                      <span className="text-[10px] font-black text-gray-300">{card}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs">
            <p>© 2026 Medico Guidance. All rights reserved.</p>
            <p className="text-gray-600">Designed with ❤️ for better healthcare</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;