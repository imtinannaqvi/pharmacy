import { useState } from 'react';
import { 
  ArrowRight, HandCoins, Plus, Minus, RotateCcwIcon, 
  ShoppingCart, ShoppingCartIcon, Truck, Headset, 
  ChevronDown, X 
} from 'lucide-react';
import TrendPro from './TrendPro';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 

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
    answer: "We prioritize direct diagnostics through our SmartFix AI technology, ensuring accuracy and speed that traditional marketplace services cannot match."
  },
  {
    question: "Can FixItNow handle large-scale service requirements?",
    answer: "Yes, our marketplace is designed to scale. We coordinate multiple service providers simultaneously to manage high-volume requirements efficiently."
  }
];

const Navbar = () => {
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);

  const { cart, cartCount, removeFromCart } = useCart();

  // ✅ FIX: cart is { items: [] }, not an array
  const items = cart?.items || [];

  const subtotal = items.reduce((acc, item) => {
    return acc + ((item.price || 0) * (item.quantity || 1));
  }, 0);
  
  // FIX: Destructure with a fallback to an empty array to prevent crashes if context is null/undefined
  

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md relative z-50 font-poppins">
      <Link to="/" className="text-2xl font-bold text-green-700">Verbic</Link>

      <form className="flex-grow mx-8 max-w-2xl">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search medicine, medical products or services..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none transition-all"
          />
          <button type="button" className="absolute right-3 text-gray-500 hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>

      <div className="flex items-center space-x-6 text-gray-700 font-medium">
        <div
          className="relative"
          onMouseEnter={() => setShowAccountDropdown(true)}
          onMouseLeave={() => setShowAccountDropdown(false)}
        >
          <div className="flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors py-2">
            <p>Your Account</p>
            <ChevronDown className={`w-4 h-4 transition-transform ${showAccountDropdown ? 'rotate-180' : ''}`} />
          </div>
          {showAccountDropdown && (
            <div className="absolute top-full right-0 w-48 bg-white border border-gray-100 shadow-xl rounded-xl py-2 animate-fadeIn z-50">
              <Link to="/login" className="block px-4 py-2 hover:bg-green-50 hover:text-green-700 transition-colors">Login</Link>
              <Link to="/signup" className="block px-4 py-2 hover:bg-green-50 hover:text-green-700 transition-colors">Sign Up</Link>
              <div className="border-t border-gray-100 my-1"></div>
              <Link to="/profile" className="block px-4 py-2 hover:bg-green-50 text-sm text-gray-500">Settings</Link>
            </div>
          )}
        </div>

        <div
          className="relative"
          onMouseEnter={() => setShowCartDropdown(true)}
          onMouseLeave={() => setShowCartDropdown(false)}
        >
          <Link to="/cart" className="flex items-center space-x-2 cursor-pointer hover:text-green-600 transition-colors py-2">
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
            <span>Your Cart</span>
          </Link>

          {showCartDropdown && (
            <div className="absolute top-full right-0 w-80 bg-white border border-gray-100 shadow-2xl rounded-2xl py-5 px-4 animate-fadeIn z-50">
              <h3 className="text-gray-900 font-bold mb-4 border-b pb-2 text-sm uppercase tracking-tight">Shopping Cart</h3>

              <div className="max-h-64 overflow-y-auto space-y-4 pr-1">
                {items.length > 0 ? (
                  items.map((item) => (
                    <div key={item.productId} className="flex gap-3 items-center group">
                      <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                        <img
                          src={item.image ? `http://localhost:4000/${item.image}` : '/placeholder.jpg'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-800 truncate">{item.name}</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          Qty: {item.quantity} × <span className="text-green-600 font-bold">${item.price}</span>
                        </p>
                      </div>
                      {/* ✅ FIX: use item.productId not item._id */}
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-sm text-gray-400 italic">Your cart is empty</p>
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="mt-5 pt-4 border-t space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs font-bold uppercase">Subtotal</span>
                    <span className="text-gray-900 font-black text-xl">${subtotal.toFixed(2)}</span>
                  </div>
                  <Link
                    to="/cart"
                    className="block w-full bg-green-600 text-white text-center py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                  >
                    Go to Checkout
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
  const [openIndex, setOpenIndex] = useState(1);

  return (
    <div className="max-w-5xl mx-auto py-16 px-4 font-sans">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
        We've answered all your questions
      </h2>
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className={`rounded-xl transition-all duration-300 ${
              openIndex === index ? 'bg-[#F4F7F9] border-l-4 border-green-600' : 'bg-[#F4F7F9]'
            }`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <span className={`text-lg font-semibold ${openIndex === index ? 'text-green-600' : 'text-gray-700'}`}>
                {item.question}
              </span>
              {openIndex === index
                ? <Minus className="text-green-600 w-6 h-6" />
                : <Plus className="text-gray-400 w-6 h-6" />
              }
            </button>
            {openIndex === index && (
              <div className="px-6 pb-6 text-gray-500 leading-relaxed animate-fadeIn">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <div className="font-poppins">
      <Navbar />

      <main className="w-full">
        {/* Hero Section */}
        <div className="bg-green-900 min-h-[400px] flex flex-col md:flex-row items-center justify-between px-8 md:px-24 py-16 gap-12">
          <div className="md:w-3/5 text-white space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Improving health with <span className="text-green-400">Best Medicine</span>
            </h1>
            <p className="text-lg text-green-100 max-w-lg">
              Elevate your health journey with Medico Guidance. Get exclusive discounts and unparalleled convenience.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-all shadow-lg">
                Shop Now <ShoppingCartIcon className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-2 border border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-green-900 transition-all">
                Top Products <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="md:w-2/5 flex justify-center md:justify-end">
            <img
              src="pexels-shkrabaanthony-5215009.jpg"
              alt="Medical Professional"
              className="w-72 md:w-80 lg:w-96 rounded-3xl shadow-2xl object-cover"
            />
          </div>
        </div>

        {/* Trust Bar */}
        <div className="flex flex-nowrap justify-between items-center gap-4 px-4 lg:px-16 py-10 bg-white border-b border-gray-100 overflow-x-auto">
          <div className="flex items-center gap-3 group shrink-0">
            <span className="p-2 md:p-3 bg-green-100 text-green-900 rounded-full group-hover:bg-green-900 group-hover:text-white transition-all">
              <Truck className="w-5 h-5 md:w-6 md:h-6" />
            </span>
            <div>
              <h1 className="font-bold text-gray-900 text-sm md:text-base whitespace-nowrap">Free Shipping & Returns</h1>
              <p className="text-xs md:text-sm text-gray-500 leading-tight">For All orders over <br /> $ 199.00</p>
            </div>
          </div>
          <div className="flex items-center gap-3 group shrink-0">
            <span className="p-2 md:p-3 bg-green-100 text-green-900 rounded-full group-hover:bg-green-900 group-hover:text-white transition-all">
              <HandCoins className="w-5 h-5 md:w-6 md:h-6" />
            </span>
            <div>
              <h1 className="font-bold text-gray-900 text-sm md:text-base whitespace-nowrap">Secure Payment</h1>
              <p className="text-xs md:text-sm text-gray-500 leading-tight">We Ensure Secure <br /> payments</p>
            </div>
          </div>
          <div className="flex items-center gap-3 group shrink-0">
            <span className="p-2 md:p-3 bg-green-100 text-green-900 rounded-full group-hover:bg-green-900 group-hover:text-white transition-all">
              <RotateCcwIcon className="w-5 h-5 md:w-6 md:h-6" />
            </span>
            <div>
              <h1 className="font-bold text-gray-900 text-sm md:text-base whitespace-nowrap">Money back Guarantee</h1>
              <p className="text-xs md:text-sm text-gray-500 leading-tight">Returning money <br /> 30 days</p>
            </div>
          </div>
          <div className="flex items-center gap-3 group shrink-0">
            <span className="p-2 md:p-3 bg-green-100 text-green-900 rounded-full group-hover:bg-green-900 group-hover:text-white transition-all">
              <Headset className="w-5 h-5 md:w-6 md:h-6" />
            </span>
            <div>
              <h1 className="font-bold text-gray-900 text-sm md:text-base whitespace-nowrap">24/7 Customer Service</h1>
              <p className="text-xs md:text-sm text-gray-500 leading-tight">Friendly customer <br /> service</p>
            </div>
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 md:px-24 py-12 bg-gray-50">
          <div className="relative overflow-hidden rounded-2xl group cursor-pointer h-64 border border-gray-100">
            <img src="/pexels-karola-g-7321231.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Anti-age" />
            <div className="absolute inset-0 p-6 flex flex-col justify-between bg-gradient-to-t from-black/40 to-transparent">
              <div className="flex justify-start">
                <span className="bg-blue-700 text-white text-[10px] font-black w-12 h-12 flex items-center justify-center rounded-full shadow-xl ring-2 ring-white/50 tracking-tighter uppercase">Verbic</span>
              </div>
              <h2 className="text-white text-2xl font-bold leading-tight drop-shadow-lg">Anti-age<br />Skin Serum</h2>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl group cursor-pointer h-64 border border-gray-100">
            <img src="/pexels-gustavo-fring-3985039.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Natural Wealth" />
            <div className="absolute inset-0 p-6 flex flex-col bg-gradient-to-b from-black/20 via-transparent to-black/40">
              <div className="bg-white w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-2xl self-start border border-gray-100">
                <span className="text-[10px] text-orange-500 font-black tracking-widest leading-none">SALE</span>
                <span className="text-lg font-extrabold text-green-600 leading-none">50%</span>
              </div>
              <h2 className="text-white text-2xl font-bold mt-auto drop-shadow-lg">Natural Wealth<br />Beta karoten</h2>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl group cursor-pointer h-64 border border-gray-100">
            <img src="/pexels-kindelmedia-7149130.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Family care" />
            <div className="absolute inset-0 p-6">
              <div className="bg-white/80 backdrop-blur-sm inline-block px-4 py-2 rounded-md shadow-lg border-l-4 border-red-600">
                <p className="text-blue-900 font-black text-xl italic leading-none">FixItNow</p>
                <p className="text-[7px] text-blue-500 tracking-[0.2em] uppercase font-bold mt-1">Smart Diagnostics</p>
              </div>
            </div>
          </div>
        </div>

        <TrendPro />

        {/* Promo Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 font-poppins">
          <div className="bg-[#E0F9FB] rounded-[2rem] flex flex-row items-center min-h-[500px] overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
            <div className="flex flex-col p-8 flex-1 z-10">
              <div>
                <span className="inline-block bg-[#00C853] text-white text-[12px] font-bold px-4 py-1.5 rounded-full uppercase">25% OFF</span>
                <h1 className="text-4xl font-bold text-gray-900 mt-6 mb-4">Black Garlic Oil</h1>
                <p className="text-gray-500 text-lg leading-relaxed max-w-[220px] mb-8">Stronger and Thicker Hair With Black Garlic Oil.</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm line-through">$37.00</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-gray-900">$27.75</span>
                  <span className="text-gray-500 text-sm">Including Tax</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 w-[46%] h-full flex items-center justify-center p-4">
              <img src="/pexels-ron-lach-8140898.jpg" alt="Black Garlic Oil" className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-[#FCE4EC] rounded-[2rem] p-8 flex flex-row items-center justify-between overflow-hidden flex-1 group hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
              <div className="z-10 flex-1 pr-4 min-w-0">
                <span className="inline-block bg-[#00C853] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">25% OFF</span>
                <h1 className="text-xl font-bold text-gray-900 mt-3 mb-2">Dental Care Set for Vivid <br /> and Bright Smiles</h1>
                <p className="text-gray-400 text-xs line-through">$33.90</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-gray-900">$22.90</span>
                  <span className="text-gray-500 text-xs">Including Tax</span>
                </div>
              </div>
              <div className="flex-shrink-0 w-[38%] flex items-center justify-center">
                <img src="/pexels-helloaesthe-15694640.jpg" alt="Dental Care Set" className="w-full h-auto max-h-[160px] object-contain transition-transform duration-500 group-hover:scale-105" />
              </div>
            </div>
            <div className="bg-[#E8EAF6] rounded-[2rem] p-8 flex flex-row items-center justify-between overflow-hidden flex-1 group hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
              <div className="z-10 flex-1 pr-4 min-w-0">
                <span className="inline-block bg-[#00C853] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">25% OFF</span>
                <h1 className="text-xl font-bold text-gray-900 mt-3 mb-2">Banana Flavoured <br /> Toothpaste</h1>
                <p className="text-gray-400 text-xs line-through">$37.00</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-gray-900">$37.00</span>
                  <span className="text-gray-500 text-xs">Including Tax</span>
                </div>
              </div>
              <div className="flex-shrink-0 w-[38%] flex items-center justify-center">
                <img src="/download (12).jpg" alt="Banana Toothpaste" className="w-full h-auto max-h-[160px] object-contain transition-transform duration-500 group-hover:scale-105" />
              </div>
            </div>
          </div>
        </div>

        <FAQ />
      </main>

      {/* Footer Section */}
      <footer className="bg-[#05422C] text-white pt-14 pb-8 px-8 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="flex flex-col gap-5">
              <div className="text-2xl font-extrabold tracking-tight flex items-center gap-1.5">
                <span className="border-2 border-emerald-400 text-emerald-400 px-1.5 py-0.5 rounded text-xl leading-none">V</span>
                Verbic
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-[200px]">Your trusted partner for medical guidance and smart home services.</p>
              <div className="flex flex-col gap-2.5 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Faisalabad, Punjab, Pakistan
                </span>
                <span className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 flex-shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1 19.79 19.79 0 0 1 1.61 4.57 2 2 0 0 1 3.58 2.36h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.61-1.61a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  +92 300 000 0000
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-emerald-400 mb-5">Quick Links</h3>
              <ul className="flex flex-col gap-3 text-sm text-gray-400">
                {['Home', 'Medico Guidance', 'FixItNow', 'Careers', 'Contact'].map(link => (
                  <li key={link} className="hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-emerald-400 mb-5">Projects</h3>
              <ul className="flex flex-col gap-3 text-sm text-gray-400">
                {['Telemedicine', 'AI Diagnostics', 'Home Marketplace', 'Medical API', 'Verbic Cloud'].map(service => (
                  <li key={service} className="hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-emerald-400 mb-5">Follow Us</h3>
              <ul className="flex flex-col gap-3 text-sm text-gray-400">
                {[
                  { name: 'Facebook', icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
                  { name: 'Instagram', icon: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z' },
                  { name: 'Twitter / X', icon: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' },
                ].map(({ name, icon }) => (
                  <li key={name} className="hover:text-white hover:translate-x-1 transition-all duration-200 cursor-pointer flex items-center gap-2.5 group">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 flex-shrink-0">
                      <path d={icon} />
                    </svg>
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 pb-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">Payment Partners</span>
            <div className="flex flex-wrap gap-2.5 items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-7 bg-white px-2 py-1 rounded-md" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-7 bg-white px-2 py-1 rounded-md" />
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
            <span>© 2026 Verbic Ecosystem. All rights reserved.</span>
            <span>Developed for <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">FixItNow & Medico Guidance</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;