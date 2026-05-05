import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { Pill, Mail, Lock, User } from 'lucide-react';
import API from "../api/axios";

const Register = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      toast.success("Verification code sent");
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
      toast.error(err.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#F4F7F6] font-poppins flex items-center justify-center p-4 md:p-6 overflow-hidden">
      
      <div className="w-full max-w-[1000px] max-h-[90vh] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        
        {/* LEFT SIDE: Brand Visual & Quote */}
        <div className="hidden md:flex md:w-5/12 bg-[#02353C] p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-16">
              <div className="bg-teal-400/20 p-2 rounded-lg">
                <Pill size={20} className="text-teal-400" />
              </div>
              <span className="text-lg font-bold tracking-tight">PharmaLogix</span>
            </div>

            <div className="relative">
              <span className="absolute -top-10 -left-4 text-7xl text-teal-400/10 font-serif select-none">“</span>
              <h2 className="text-lg lg:text-xl font-bold leading-snug mb-4">
                Ensuring <span className="text-teal-400">Precision</span> <br /> 
                in Healthcare.
              </h2>
              <div className="space-y-4 border-l-2 border-teal-400/30 pl-6 py-1">
                <p className="text-teal-50/80 text-sm italic leading-relaxed font-light">
                  "The art of healing comes from medicine, but the science of safety comes from the pharmacist."
                </p>
              </div>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        </div>

        {/* RIGHT SIDE: Form Section */}
        <div className="w-full md:w-7/12 p-8 lg:p-12 flex flex-col justify-center overflow-hidden">
          <div className="max-w-md mx-auto w-full">
            <header className="mb-6">
              <h1 className="text-lg lg:text-xl font-bold text-gray-900 mb-1">
                {step === 1 ? "Create Account" : "Verify Email"}
              </h1>
              <p className="text-gray-400 text-[13px] font-medium">
                {step === 1 ? "Join the PharmaLogix healthcare network." : "Enter the 6-digit code sent to your inbox."}
              </p>
            </header>

            {step === 1 ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#02353C] transition-colors h-4 w-4" />
                    <input 
                      type="text" required placeholder="Enter your name"
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#02353C] outline-none transition-all bg-gray-50/30 font-poppins"
                      value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#02353C] transition-colors h-4 w-4" />
                    <input 
                      type="email" required placeholder="Enter your email"
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#02353C] outline-none transition-all bg-gray-50/30 font-poppins"
                      value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#02353C] transition-colors h-4 w-4" />
                    <input 
                      type="password" required placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-[#02353C] outline-none transition-all bg-gray-50/30 font-poppins"
                      value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit" disabled={loading} 
                  className="w-full bg-[#02353C] text-white py-3.5 rounded-xl text-sm font-bold hover:bg-[#034a52] transition-all shadow-md mt-2 font-poppins"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-6">
                <input 
                  type="text" placeholder="000000" maxLength={6} required
                  className="w-full text-center text-xl tracking-[0.5em] py-3.5 border border-gray-200 rounded-xl focus:border-[#02353C] outline-none transition-all bg-gray-50/30 font-mono"
                  value={otp} onChange={e => setOtp(e.target.value)} 
                />
                <button 
                  type="submit" disabled={loading}
                  className="w-full bg-[#02353C] text-white py-3.5 rounded-xl text-sm font-bold shadow-md font-poppins"
                >
                  {loading ? "Verifying..." : "Verify & Complete"}
                </button>
                <button type="button" onClick={() => setStep(1)} className="w-full text-[11px] text-gray-400 hover:text-[#02353C] transition-colors font-bold uppercase tracking-widest font-poppins">
                  ← Back to registration
                </button>
              </form>
            )}

            <div className="mt-8 pt-4 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500 font-poppins">
                Already have an account? 
                <Link to="/login" className="ml-1.5 text-[#02353C] font-bold hover:underline font-poppins">Sign In</Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;