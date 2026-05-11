import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  ChevronDown,
  ShoppingCart,
  ShieldCheck,
  User,
  LogIn,
  UserPlus,
  Settings,
  LogOut,
  Pill,
  Home,
  Package,
  FileText,
  Info,
  Mail,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const HomeHeader = () => {
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showProductsMenu, setShowProductsMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  const navigate = useNavigate();
  const { cart, cartCount } = useCart();
  const { user, isAdmin, isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

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
      const all = Array.isArray(res.data)
        ? res.data
        : res.data?.medicines || [];

      const q = query.toLowerCase();

      setSearchResults(
        all
          .filter(
            (p) =>
              p.name?.toLowerCase().includes(q) ||
              p.brand?.toLowerCase().includes(q) ||
              p.category?.toLowerCase().includes(q)
          )
          .slice(0, 5)
      );
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const productCategories = [
    'Botulinum Toxins',
    'Dermal Fillers',
    'Skin Boosters',
    'Fat Dissolvers',
    'Consumables',
  ];

  const handleCategoryClick = (cat) => {
    setActiveNav('products');
    setShowProductsMenu(false);

    // If you want to use category filtering later, `cat` is available here
    // navigate(`/products?category=${encodeURIComponent(cat)}`);
    navigate('/trendpro');
  };

  const navLinkStyle = (key) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    padding: '0 20px',
    height: '100%',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    color:
      activeNav === key
        ? '#06b6d4'
        : 'rgba(255,255,255,0.6)',
    borderBottom:
      activeNav === key
        ? '2px solid #06b6d4'
        : '2px solid transparent',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
    whiteSpace: 'nowrap',
  });

  return (
    <header
      className="sticky top-0 z-50"
      style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
    >
      {/* ───────────────────── Top Bar ───────────────────── */}
      <div
        style={{
          background: '#0a1628',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 40px',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
          }}
        >
          {/* Logo */}
          <Link
            to="/home"
            onClick={() => setActiveNav('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background:
                  'linear-gradient(135deg, #0d1f3c, #16305c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow:
                  '0 0 20px rgba(13, 31, 60, 0.4)',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  color: '#fff',
                  fontWeight: '900',
                  fontSize: '15px',
                  letterSpacing: '-0.5px',
                }}
              >
                DrG
              </span>
            </div>

            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: '21px',
                  fontWeight: '900',
                  color: '#fff',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}
              >
                Dr<span style={{ color: '#fff' }}>GPharma</span>
              </p>

              <p
                style={{
                  margin: '3px 0 0',
                  fontSize: '9px',
                  fontWeight: '700',
                  color: '#64748b',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                Aesthetic Pharmacy Platform
              </p>
            </div>
          </Link>

          {/* Search */}
          <div
            style={{
              flex: 1,
              maxWidth: '560px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={(e) => {
                  e.target.style.background =
                    'rgba(255,255,255,0.11)';
                  e.target.style.borderColor =
                    'rgba(6,182,212,0.6)';

                  if (searchQuery.trim().length >= 2) {
                    setShowResults(true);
                  }
                }}
                onBlur={(e) => {
                  e.target.style.background =
                    'rgba(255,255,255,0.07)';
                  e.target.style.borderColor =
                    'rgba(255,255,255,0.1)';
                  setTimeout(() => setShowResults(false), 200);
                }}
                placeholder="Search your medicine product..."
                style={{
                  width: '100%',
                  padding: '11px 44px 11px 20px',
                  background: 'rgba(255,255,255,0.07)',
                  border:
                    '1.5px solid rgba(255,255,255,0.1)',
                  borderRadius: '30px',
                  fontSize: '14px',
                  color: '#fff',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s',
                }}
              />

              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowResults(false);
                  }}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.5)',
                    display: 'flex',
                  }}
                >
                  <X size={15} />
                </button>
              ) : (
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    color: 'rgba(255,255,255,0.35)',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </div>

            {/* Search Results */}
            {showResults && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  left: 0,
                  right: 0,
                  background: '#fff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  zIndex: 200,
                  boxShadow:
                    '0 16px 50px rgba(0,0,0,0.28)',
                }}
              >
                {searchLoading ? (
                  <div
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      fontSize: '13px',
                      color: '#94a3b8',
                    }}
                  >
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div
                      style={{
                        padding: '10px 16px 8px',
                        borderBottom: '1px solid #f1f5f9',
                        background: '#f8fafc',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: '800',
                          color: '#94a3b8',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                        }}
                      >
                        {searchResults.length} results found
                      </span>
                    </div>

                    {searchResults.map((product) => (
                      <div
                        key={product._id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setShowResults(false);
                          navigate(
                            `/medicine/${product._id}`
                          );
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          cursor: 'pointer',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            '#f0f9ff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            'transparent';
                        }}
                      >
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            flexShrink: 0,
                            background: '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {product.image ? (
                            <img
                              src={`http://localhost:4000/${product.image}`}
                              alt={product.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          ) : (
                            <Pill
                              size={16}
                              color="#0891b2"
                            />
                          )}
                        </div>

                        <div
                          style={{
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <p
                            style={{
                              margin: 0,
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#0f172a',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {product.name}
                          </p>

                          <p
                            style={{
                              margin: '2px 0 0',
                              fontSize: '12px',
                              color: '#94a3b8',
                            }}
                          >
                            {product.category}
                            {product.brand
                              ? ` · ${product.brand}`
                              : ''}
                          </p>
                        </div>

                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: '800',
                            color: '#0f172a',
                            flexShrink: 0,
                          }}
                        >
                          £
                          {product.sellingPrice ||
                            product.price}
                        </span>
                      </div>
                    ))}
                  </>
                ) : (
                  <div
                    style={{
                      padding: '24px',
                      textAlign: 'center',
                      fontSize: '13px',
                      color: '#94a3b8',
                    }}
                  >
                    No results for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          
{/* Right Actions */}
<div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginLeft: 'auto',
    flexShrink: 0,
  }}
>
  {/* Account Section */}
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 14px',
     
      flexShrink: 0,
    }}
  >
    {isLoggedIn ? (
      <>
        {/* Admin/User Badge (Clickable to Admin Dashboard if Admin) */}
        {isAdmin ? (
          <Link
            to="/admin"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 12px',
              borderRadius: '20px',
              background: 'rgba(6,182,212,0.12)',
              border: '1px solid rgba(6,182,212,0.25)',
              color: '#22d3ee',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                'rgba(6,182,212,0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                'rgba(6,182,212,0.12)';
            }}
          >
            <User size={14} />
            Admin
          </Link>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 12px',
              borderRadius: '20px',
              background: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.25)',
              color: '#4ade80',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            <User size={14} />
            User
          </div>
        )}

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '20px',
            background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.25)',
            color: '#f87171',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              'rgba(239,68,68,0.18)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              'rgba(239,68,68,0.12)';
          }}
        >
          <LogOut size={14} />
          Logout
        </button>
      </>
    ) : (
      <>
        {/* Login Button */}
        <Link
          to="/login"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '20px',
            background: 'rgba(37,99,235,0.12)',
            border: '1px solid rgba(37,99,235,0.25)',
            color: '#60a5fa',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              'rgba(37,99,235,0.18)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              'rgba(37,99,235,0.12)';
          }}
        >
          <LogIn size={14} />
          Login
        </Link>

        {/* Register Button */}
        <Link
          to="/register"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '20px',
            background: 'rgba(6,182,212,0.12)',
            border: '1px solid rgba(6,182,212,0.25)',
            color: '#22d3ee',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              'rgba(6,182,212,0.18)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              'rgba(6,182,212,0.12)';
          }}
        >
          <UserPlus size={14} />
          Register
        </Link>
      </>
    )}
  </div>

  {/* Cart */}
  <Link
    to="/cart"
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 22px',
      borderRadius: '30px',
      background: '#0d1f3c',
      textDecoration: 'none',
      transition: 'all 0.2s',
      position: 'relative',
      boxShadow: '0 4px 16px rgba(13,31,60,0.4)',
    }}
  >
    <div style={{ position: 'relative' }}>
      <ShoppingCart size={18} color="#fff" />
      {cartCount > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-9px',
            right: '-9px',
            background: '#fff',
            color: '#0d1f3c',
            fontSize: '9px',
            fontWeight: '900',
            borderRadius: '10px',
            minWidth: '17px',
            height: '17px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 3px',
          }}
        >
          {cartCount}
        </span>
      )}
    </div>

    <span
      style={{
        fontSize: '14px',
        fontWeight: '700',
        color: '#fff',
      }}
    >
      Cart
    </span>
  </Link>
</div>
        </div>
      </div>

      {/* ───────────────────── Navigation Row ───────────────────── */}
      <div
        style={{
          background: '#0d1f3c',
          borderBottom:
            '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 40px',
            display: 'flex',
            alignItems: 'center',
            height: '50px',
            gap: '6px',
            overflowX: 'auto',
          }}
        >
          {/* Home */}
          <Link
            to="/home"
            onClick={() => setActiveNav('home')}
            style={navLinkStyle('home')}
          >
            <Home size={15} />
            Home
          </Link>

          {/* Products Dropdown */}
          <div
            style={{
              position: 'relative',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
            onMouseEnter={() =>
              setShowProductsMenu(true)
            }
            onMouseLeave={() =>
              setShowProductsMenu(false)
            }
          >
            <button
              type="button"
              onClick={() => handleCategoryClick()}
              style={{
                ...navLinkStyle('products'),
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Package size={15} />
              Products
              <ChevronDown
                size={13}
                style={{
                  transform: showProductsMenu
                    ? 'rotate(180deg)'
                    : 'rotate(0)',
                  transition: 'transform 0.2s',
                }}
              />
            </button>

            {showProductsMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  background: '#fff',
                  borderRadius: '14px',
                  minWidth: '220px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  zIndex: 200,
                  boxShadow:
                    '0 16px 50px rgba(0,0,0,0.18)',
                }}
              >
                <div
                  style={{
                    padding: '10px 16px 8px',
                    borderBottom: '1px solid #f1f5f9',
                    background: '#f8fafc',
                  }}
                >
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: '800',
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                    }}
                  >
                    Categories
                  </span>
                </div>

                {productCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() =>
                      handleCategoryClick(cat)
                    }
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: '#06b6d4',
                        flexShrink: 0,
                      }}
                    />
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Prescription */}
          {/* Prescription — goes to prescription-form which renders PrescriptionDetailed tab bar */}
          <Link
            to="/prescription-form"
            onClick={() => setActiveNav('prescription')}
            style={navLinkStyle('prescription')}
          >
            <FileText size={15} />
            Prescription
          </Link>

          {/* How It Works */}
          <Link
            to="/how-it-works"
            onClick={() => setActiveNav('howItWorks')}
            style={navLinkStyle('howItWorks')}
          >

            How It Works
          </Link>

          {/* About Us */}
          <Link
            to="/about"
            onClick={() => setActiveNav('about')}
            style={navLinkStyle('about')}
          >
            <Info size={15} />
            About Us
          </Link>

          {/* Contact */}
          <Link
            to="/contact"
            onClick={() => setActiveNav('contact')}
            style={navLinkStyle('contact')}
          >
            <Mail size={15} />
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;