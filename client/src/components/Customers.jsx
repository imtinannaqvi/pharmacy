import { useState, useEffect } from "react";
import Header from "./Header";
import API from "../api/axios";

const Customers = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleApprove = async (id) => {
    await API.patch(`/users/${id}/approve`);
    fetchUsers();
  };

  const handleReject = async (id) => {
    await API.patch(`/users/${id}/reject`);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    await API.delete(`/users/${id}`);
    fetchUsers();
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Header title="Customers" />
      <div className="p-6">

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-sm px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-400"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading users...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Verified</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Joined</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-medium text-gray-900">{user.name}</td>
                    <td className="px-5 py-3 text-gray-500">{user.email}</td>
                    <td className="px-5 py-3">
                      {user.isVerified
                        ? <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full font-medium">✓ Verified</span>
                        : <span className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded-full font-medium">✗ Unverified</span>
                      }
                    </td>
                    <td className="px-5 py-3">
                      {user.isApproved
                        ? <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">● Approved</span>
                        : <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-1 rounded-full font-medium">● Pending</span>
                      }
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {!user.isApproved ? (
                          <button onClick={() => handleApprove(user._id)}
                            className="text-xs px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition">
                            Approve
                          </button>
                        ) : (
                          <button onClick={() => handleReject(user._id)}
                            className="text-xs px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition">
                            Revoke
                          </button>
                        )}
                        <button onClick={() => handleDelete(user._id)}
                          className="text-xs px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-400 text-sm">No users found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;