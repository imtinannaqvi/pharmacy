import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

const Register = () => {
  const [step, setStep]       = useState(1); // 1=form, 2=otp
  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [otp, setOtp]         = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const navigate              = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await API.post("/auth/register", form);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await API.post("/auth/verify-otp", { email: form.email, otp });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-indigo-900 mb-1">
          {step === 1 ? "Create Account" : "Verify Email"}
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          {step === 1 ? "Fill in your details to register" : `Enter the OTP sent to ${form.email}`}
        </p>

        {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg mb-4">{error}</p>}

        {step === 1 ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" required placeholder="John Doe"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input type="email" required placeholder="john@example.com"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input type="password" required placeholder="••••••••"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400"
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition disabled:opacity-50">
              {loading ? "Sending OTP..." : "Register"}
            </button>
            <p className="text-center text-sm text-gray-400">
              Already have an account? <Link to="/login" className="text-indigo-600 font-medium">Login</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <input type="text" required placeholder="Enter 6-digit OTP" maxLength={6}
              value={otp} onChange={e => setOtp(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:border-indigo-400"
            />
            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition disabled:opacity-50">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;