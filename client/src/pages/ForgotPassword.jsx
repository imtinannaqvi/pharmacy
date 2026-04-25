import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

const ForgotPassword = () => {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setMessage("");
    try {
      const { data } = await API.post("/auth/forgot-password", { email });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-indigo-900 mb-1">Forgot Password</h1>
        <p className="text-sm text-gray-400 mb-6">Enter your email to receive a reset link</p>

        {message && <p className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg mb-4">{message}</p>}
        {error   && <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input type="email" required placeholder="john@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400"
            />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition disabled:opacity-50">
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          <p className="text-center text-sm text-gray-400">
            Remember it? <Link to="/login" className="text-indigo-600 font-medium">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;