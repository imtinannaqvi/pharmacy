import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { Pill, Lock, User, Briefcase, MapPin, CheckCircle, ChevronRight, Shield, Star } from 'lucide-react';
import API from "../api/axios";

// ✅ Outside component — no re-mount on typing
const InputGroup = ({ label, name, type = "text", placeholder, options = null, value, onChange, required = true }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label style={{
      fontSize: '10px', fontWeight: '700', color: '#64748b',
      textTransform: 'uppercase', letterSpacing: '0.1em'
    }}>
      {label}
    </label>
    {options ? (
      <select
        value={value || ""}
        onChange={onChange}
        style={{
          width: '100%', padding: '10px 14px',
          border: '1.5px solid #e2e8f0', borderRadius: '10px',
          fontSize: '13px', color: '#0f172a', background: '#f8fafc',
          outline: 'none', cursor: 'pointer',
          fontFamily: 'inherit', transition: 'border-color 0.2s'
        }}
        onFocus={e => e.target.style.borderColor = '#0d9488'}
        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
      >
        <option value="">Select...</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        required={required}
        style={{
          width: '100%', padding: '10px 14px',
          border: '1.5px solid #e2e8f0', borderRadius: '10px',
          fontSize: '13px', color: '#0f172a', background: '#f8fafc',
          outline: 'none', boxSizing: 'border-box',
          fontFamily: 'inherit', transition: 'border-color 0.2s, background 0.2s'
        }}
        onFocus={e => { e.target.style.borderColor = '#0d9488'; e.target.style.background = '#fff'; }}
        onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
      />
    )}
  </div>
);

const SectionHeader = ({ icon: Icon, title, step, total }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    paddingBottom: '12px', marginBottom: '16px',
    borderBottom: '1px solid #f1f5f9'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '8px',
        background: 'linear-gradient(135deg, #0d9488, #0f766e)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon size={14} color="white" />
      </div>
      <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{title}</span>
    </div>
    <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600' }}>
      {step} of {total}
    </span>
  </div>
);

const Register = () => {
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState("Prescriber");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", dob: "",
    phoneNumber: "", address: "", professionalRole: "", registrationNumber: "",
    primarySpeciality: "", trainingQualification: "", practiceName: "",
    businessAddress: "", vatNumber: "", referralSource: "",
    agreedToTerms: false, isAuthorisedProfessional: false, confirmPOM: false
  });

  const handleChange = (name) => (e) => setForm({ ...form, [name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.agreedToTerms) return toast.error("You must agree to the terms.");
    setLoading(true);
    try {
      await API.post("/auth/register", { ...form, accountType });
      toast.success("Verification code sent to your email");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating account");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/verify-otp", { email: form.email, otp });
      toast.success("Account verified successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #f0fdfa 0%, #f8fafc 50%, #f0fdf4 100%)',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '100%', maxWidth: '1080px',
        background: '#fff', borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        overflow: 'hidden', display: 'flex',
        border: '1px solid #e2e8f0'
      }}>

        {/* ── Left Panel ── */}
        <div style={{
          width: '300px', flexShrink: 0,
          background: 'linear-gradient(160deg, #0f4c3a 0%, #0d3d2f 60%, #0a2e23 100%)',
          padding: '40px 32px',
          display: 'flex', flexDirection: 'column',
          position: 'relative', overflow: 'hidden'
        }}>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute', top: '-60px', right: '-60px',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'rgba(13,148,136,0.15)', pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', bottom: '-40px', left: '-40px',
            width: '150px', height: '150px', borderRadius: '50%',
            background: 'rgba(13,148,136,0.1)', pointerEvents: 'none'
          }} />

          {/* Logo */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px'
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(13,148,136,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Pill size={18} color="#2dd4bf" />
            </div>
            <span style={{ color: '#fff', fontWeight: '800', fontSize: '16px', letterSpacing: '-0.02em' }}>
              DrGPharma
            </span>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{
              display: 'inline-block', background: 'rgba(13,148,136,0.2)',
              color: '#2dd4bf', fontSize: '10px', fontWeight: '700',
              padding: '4px 10px', borderRadius: '20px',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px'
            }}>
              Professional Portal
            </div>
            <h2 style={{
              color: '#fff', fontSize: '22px', fontWeight: '800',
              lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: '12px'
            }}>
              Join Our Healthcare Network
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: 1.6, marginBottom: '32px' }}>
              Access premium medical products and prescribing tools designed for professionals.
            </p>

            {/* Feature list */}
            {[
              { icon: Shield, text: 'Verified professional access' },
              { icon: Star, text: 'Exclusive medical catalogue' },
              { icon: CheckCircle, text: 'Streamlined prescribing flow' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{
                display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px'
              }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '6px',
                  background: 'rgba(13,148,136,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Icon size={12} color="#2dd4bf" />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '12px' }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Bottom link */}
          <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#2dd4bf', textDecoration: 'none', fontWeight: '600' }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* ── Right Form Panel ── */}
        <div style={{
          flex: 1, overflowY: 'auto', maxHeight: '90vh',
          padding: '36px 40px'
        }}>
          {step === 1 ? (
            <form onSubmit={handleRegister}>

              {/* Page title */}
              <div style={{ marginBottom: '28px' }}>
                <h1 style={{
                  fontSize: '22px', fontWeight: '800', color: '#0f172a',
                  letterSpacing: '-0.02em', marginBottom: '4px'
                }}>
                  Create Your Account
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '13px' }}>
                  Complete all sections to register as a healthcare professional
                </p>
              </div>

              {/* Account Type Toggle */}
              <div style={{
                display: 'flex', background: '#f1f5f9', padding: '4px',
                borderRadius: '12px', marginBottom: '28px', gap: '4px'
              }}>
                {[
                  { key: "Prescriber", label: "Prescriber" },
                  { key: "Practitioner", label: "Non-Prescriber" }
                ].map(({ key, label }) => (
                  <button
                    key={key} type="button"
                    onClick={() => setAccountType(key)}
                    style={{
                      flex: 1, padding: '9px',
                      borderRadius: '9px', border: 'none',
                      fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: accountType === key ? '#fff' : 'transparent',
                      color: accountType === key ? '#0d9488' : '#94a3b8',
                      boxShadow: accountType === key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Section 1: Personal */}
              <div style={{ marginBottom: '28px' }}>
                <SectionHeader icon={User} title="Personal Details" step={1} total={4} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <InputGroup label="First Name" name="firstName" value={form.firstName} onChange={handleChange("firstName")} />
                  <InputGroup label="Last Name" name="lastName" value={form.lastName} onChange={handleChange("lastName")} />
                  <InputGroup label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange("dob")} />
                  <InputGroup label="Email Address" name="email" type="email" value={form.email} onChange={handleChange("email")} />
                  <InputGroup label="Phone Number" name="phoneNumber" value={form.phoneNumber} onChange={handleChange("phoneNumber")} />
                  <InputGroup label="Home / Contact Address" name="address" value={form.address} onChange={handleChange("address")} />
                </div>
              </div>

              {/* Section 2: Credentials */}
              <div style={{ marginBottom: '28px' }}>
                <SectionHeader
                  icon={Briefcase}
                  title={`${accountType === "Practitioner" ? "Non-Prescriber" : accountType} Credentials`}
                  step={2} total={4}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <InputGroup
                    label="Professional Role" name="professionalRole"
                    options={accountType === "Prescriber"
                      ? ["Medical Doctor", "Dentist", "Independent Nurse Prescriber", "Pharmacist Prescriber"]
                      : ["Nurse", "Beauty Therapist", "Paramedic", "Dental Hygienist"]}
                    value={form.professionalRole} onChange={handleChange("professionalRole")}
                  />
                  <InputGroup label="Registration No. (GMC/GDC/NMC)" name="registrationNumber" value={form.registrationNumber} onChange={handleChange("registrationNumber")} />
                  <InputGroup
                    label="Primary Speciality" name="primarySpeciality"
                    options={["General Practice", "Dermatology", "Cosmetic", "Dental", "Emergency Medicine"]}
                    value={form.primarySpeciality} onChange={handleChange("primarySpeciality")}
                  />
                  {accountType === "Practitioner" && (
                    <InputGroup label="Training Qualification" name="trainingQualification" value={form.trainingQualification} onChange={handleChange("trainingQualification")} />
                  )}
                </div>
              </div>

              {/* Section 3: Practice */}
              <div style={{ marginBottom: '28px' }}>
                <SectionHeader icon={MapPin} title="Practice Details" step={3} total={4} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <InputGroup label="Practice / Clinic Name" name="practiceName" value={form.practiceName} onChange={handleChange("practiceName")} />
                  <InputGroup label="Business Address" name="businessAddress" value={form.businessAddress} onChange={handleChange("businessAddress")} />
                  <InputGroup label="VAT Number (Optional)" name="vatNumber" value={form.vatNumber} onChange={handleChange("vatNumber")} required={false} />
                  <InputGroup
                    label="How did you hear about us?" name="referralSource"
                    options={["Google", "Social Media", "Colleague", "Event"]}
                    value={form.referralSource} onChange={handleChange("referralSource")}
                  />
                </div>
              </div>

              {/* Section 4: Password */}
              <div style={{ marginBottom: '28px' }}>
                <SectionHeader icon={Lock} title="Set Password" step={4} total={4} />
                <div style={{ maxWidth: '50%' }}>
                  <InputGroup label="Password" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange("password")} />
                </div>
              </div>

              {/* Declarations */}
              <div style={{
                background: '#f8fafc', borderRadius: '14px',
                padding: '20px', border: '1px solid #e2e8f0', marginBottom: '24px'
              }}>
                <p style={{
                  fontSize: '10px', fontWeight: '800', color: '#94a3b8',
                  textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px'
                }}>
                  Declarations & Agreements
                </p>
                {[
                  { key: 'isAuthorisedProfessional', text: 'I confirm I am a qualified healthcare professional authorised to purchase products.' },
                  { key: 'agreedToTerms', text: 'I agree to the Terms & Conditions and Privacy Policy of DrGPharma.' },
                  { key: 'confirmPOM', text: 'I understand POM products require a valid prescription from an independent prescriber.' },
                ].map(({ key, text }) => (
                  <label key={key} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    marginBottom: '10px', cursor: 'pointer'
                  }}>
                    <div style={{ position: 'relative', flexShrink: 0, marginTop: '1px' }}>
                      <input
                        type="checkbox"
                        checked={form[key]}
                        required
                        onChange={e => setForm({ ...form, [key]: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: '#0d9488', cursor: 'pointer' }}
                      />
                    </div>
                    <span style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>{text}</span>
                  </label>
                ))}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '14px',
                  background: loading ? '#94a3b8' : 'linear-gradient(135deg, #0d9488, #0f766e)',
                  color: '#fff', border: 'none', borderRadius: '12px',
                  fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.01em',
                  boxShadow: loading ? 'none' : '0 4px 16px rgba(13,148,136,0.35)',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 8px 24px rgba(13,148,136,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = loading ? 'none' : '0 4px 16px rgba(13,148,136,0.35)'; }}
              >
                {loading ? 'Processing...' : <>Complete Registration <ChevronRight size={16} /></>}
              </button>

            </form>

          ) : (
            /* ── OTP Step ── */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', textAlign: 'center' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #ccfbf1, #99f6e4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <CheckCircle size={32} color="#0d9488" />
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                Check Your Email
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '32px', maxWidth: '320px' }}>
                We sent a 6-digit verification code to<br />
                <strong style={{ color: '#0f172a' }}>{form.email}</strong>
              </p>

              <form onSubmit={handleVerify} style={{ width: '100%', maxWidth: '320px' }}>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  placeholder="000000"
                  onChange={e => setOtp(e.target.value)}
                  required
                  style={{
                    width: '100%', textAlign: 'center',
                    fontSize: '28px', letterSpacing: '0.4em',
                    padding: '14px', border: '2px solid #e2e8f0',
                    borderRadius: '14px', outline: 'none',
                    fontFamily: 'monospace', color: '#0f172a',
                    background: '#f8fafc', boxSizing: 'border-box',
                    marginBottom: '16px', transition: 'border-color 0.2s'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#0d9488'; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                />

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '13px',
                    background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                    color: '#fff', border: 'none', borderRadius: '12px',
                    fontSize: '14px', fontWeight: '700',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 16px rgba(13,148,136,0.3)',
                    marginBottom: '12px'
                  }}
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>
              </form>

              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#94a3b8', fontSize: '12px', fontWeight: '600',
                  textTransform: 'uppercase', letterSpacing: '0.08em'
                }}
              >
                ← Back to Registration
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;