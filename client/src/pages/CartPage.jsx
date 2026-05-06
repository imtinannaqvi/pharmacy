import { useEffect, useState } from "react";
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowLeft, Package, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast'; // Import toast

const CartPage = () => {
  const { cart, removeFromCart, refreshCart } = useCart();
  const [removing, setRemoving] = useState(null);
  const [mounted, setMounted] = useState(false);
  const items = cart?.items || [];
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    refreshCart();
    setTimeout(() => setMounted(true), 100);
  }, []);

  const handleRemove = async (productId) => {
    setRemoving(productId);
    await removeFromCart(productId);
    setRemoving(null);
  };

  // Temporary Checkout Handler
  const handleCheckout = () => {
    toast.success('Checkout system coming soon!', {
      style: {
        borderRadius: '10px',
        background: '#0f172a',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600'
      },
      icon: '🛒',
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafb',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>

      {/* Top nav bar */}
      <div style={{
        borderBottom: '1px solid #e8ecef',
        background: '#fff',
        padding: '16px 40px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Link to="/home" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: '#6b7280', textDecoration: 'none', fontSize: '13px', fontWeight: '500'
        }}>
          <ArrowLeft size={14} /> Back to Shop
        </Link>
        <span style={{ color: '#d1d5db' }}>·</span>
        <span style={{ color: '#111', fontSize: '13px', fontWeight: '600' }}>Cart</span>
      </div>

      <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Page title */}
        <div style={{
          marginBottom: '36px',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.5s ease'
        }}>
          <h1 style={{
            fontSize: '28px', fontWeight: '800',
            color: '#0f172a', margin: '0 0 4px',
            letterSpacing: '-0.02em'
          }}>
            Shopping Cart
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
            {items.length === 0 ? 'Your cart is empty' : `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart`}
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div style={{
            textAlign: 'center', padding: '80px 40px',
            background: '#fff', borderRadius: '20px',
            border: '1px solid #e8ecef',
            opacity: mounted ? 1 : 0,
            transition: 'all 0.5s ease 0.15s'
          }}>
            <div style={{
              width: '80px', height: '80px', margin: '0 auto 20px',
              background: '#f1f5f9', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Package size={36} color="#94a3b8" strokeWidth={1.5} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
              Nothing here yet
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '28px', fontSize: '14px' }}>
              Add some products to get started
            </p>
            <Link to="/home" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#0f172a', color: 'white',
              padding: '12px 28px', borderRadius: '10px',
              textDecoration: 'none', fontWeight: '600', fontSize: '14px',
            }}>
              <Sparkles size={15} /> Browse Products
            </Link>
          </div>

        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 320px',
            gap: '24px',
            alignItems: 'start'
          }}>

            {/* Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {items.map((item, i) => (
                <div
                  key={item.productId}
                  style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    border: '1px solid #e8ecef',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '18px',
                    opacity: mounted ? (removing === item.productId ? 0.4 : 1) : 0,
                    transform: mounted ? 'translateX(0)' : 'translateX(-16px)',
                    transition: `all 0.45s ease ${i * 0.07}s`,
                  }}
                >
                  {/* Image */}
                  <div style={{
                    width: '76px', height: '76px', flexShrink: 0,
                    background: '#f8fafb', borderRadius: '12px',
                    overflow: 'hidden', border: '1px solid #e8ecef',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {item.image ? (
                      <img
                        src={`http://localhost:4000/${item.image}`}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => {
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = '<span style="font-size:28px">💊</span>';
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '28px' }}>💊</span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontWeight: '700', fontSize: '15px', color: '#0f172a',
                      margin: '0 0 6px',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                      {item.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        background: '#f1f5f9', color: '#64748b',
                        fontSize: '12px', fontWeight: '600',
                        padding: '3px 10px', borderRadius: '6px'
                      }}>
                        Qty: {item.quantity}
                      </span>
                      <span style={{ color: '#cbd5e1', fontSize: '12px' }}>·</span>
                      <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                        £{Number(item.price).toFixed(2)} each
                      </span>
                    </div>
                  </div>

                  {/* Price + Remove */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{
                      fontSize: '18px', fontWeight: '800', color: '#0f172a',
                      margin: '0 0 8px', letterSpacing: '-0.02em'
                    }}>
                      £{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemove(item.productId)}
                      disabled={removing === item.productId}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        background: 'none', color: '#ef4444',
                        border: '1px solid #fecaca',
                        padding: '5px 12px', borderRadius: '8px',
                        cursor: removing === item.productId ? 'not-allowed' : 'pointer',
                        fontSize: '12px', fontWeight: '600',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#fef2f2';
                        e.currentTarget.style.borderColor = '#fca5a5';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'none';
                        e.currentTarget.style.borderColor = '#fecaca';
                      }}
                    >
                      <Trash2 size={12} />
                      {removing === item.productId ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid #e8ecef',
              position: 'sticky',
              top: '24px',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.5s ease 0.25s'
            }}>
              <h2 style={{
                fontSize: '16px', fontWeight: '700', color: '#0f172a',
                marginBottom: '20px', letterSpacing: '-0.01em'
              }}>
                Order Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', fontSize: '14px' }}>
                    Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})
                  </span>
                  <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>
                    £{subtotal.toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748b', fontSize: '14px' }}>Shipping</span>
                  <span style={{
                    fontSize: '11px', fontWeight: '700', color: '#16a34a',
                    background: '#f0fdf4', border: '1px solid #bbf7d0',
                    padding: '2px 8px', borderRadius: '20px'
                  }}>
                    FREE
                  </span>
                </div>

                <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>Total</span>
                  <span style={{
                    fontWeight: '800', fontSize: '22px', color: '#0f172a',
                    letterSpacing: '-0.03em'
                  }}>
                    £{subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                style={{
                  width: '100%', padding: '14px',
                  background: '#0f172a',
                  color: 'white', border: 'none', borderRadius: '12px',
                  fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                  letterSpacing: '0.01em',
                  transition: 'background 0.2s',
                  marginBottom: '10px'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1e293b'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#0f172a'; }}
              >
                Proceed to Checkout →
              </button>

              <Link to="/home" style={{
                display: 'block', textAlign: 'center',
                color: '#94a3b8', fontSize: '13px',
                textDecoration: 'none', fontWeight: '500',
              }}
                onMouseEnter={e => { e.target.style.color = '#0f172a'; }}
                onMouseLeave={e => { e.target.style.color = '#94a3b8'; }}
              >
                ← Continue Shopping
              </Link>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;