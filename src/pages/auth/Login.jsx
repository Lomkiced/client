import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Use the hook we just made

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('Staff'); // Default selection
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate Network Request
    setTimeout(() => {
      login(selectedRole); // Pass the selected role to the "Vault"
      setIsLoading(false);
      navigate('/dashboard'); // Go to Dashboard
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-xl mx-auto flex items-center justify-center text-3xl mb-4 backdrop-blur-sm">
            ⚛️
          </div>
          <h1 className="text-2xl font-bold text-white">DOST-RMS Portal</h1>
          <p className="text-blue-100 text-sm mt-1">Region 1 Record Management System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username / Email</label>
            <input 
              type="text" 
              defaultValue="admin@dost.gov.ph"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              defaultValue="password123"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          {/* SIMULATION ROLE SELECTOR (For Demo Only) */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Select Role to Simulate:</p>
            <div className="grid grid-cols-3 gap-2">
              {['Super Admin', 'Admin', 'Staff'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`text-xs py-2 rounded font-medium transition-all ${
                    selectedRole === role 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? 'Authenticating...' : 'Secure Login →'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;