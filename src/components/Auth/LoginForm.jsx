import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, checkHealth } from '../../api/auth';
import toast from 'react-hot-toast';
import SignupForm from './SignupForm';
import { Sprout, Loader } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [healthCheck, setHealthCheck] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        await checkHealth();
        setHealthCheck(true);
      } catch (error) {
        toast.error('Backend server is not reachable. Please ensure FastAPI is running on port 8000.');
        console.log(error)
        setHealthCheck(false);
      }
    };
    checkBackendHealth();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!healthCheck) {
      toast.error('Backend server is not available');
      return;
    }

    setLoading(true);
    try {
      const response = await login(email, password);
      if (response.uid) {
        localStorage.setItem('uid', response.uid);
        localStorage.setItem('email', email);
        toast.success('Welcome back to BloomWatch!');
        navigate('/map');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (showSignup) {
    return <SignupForm onBack={() => setShowSignup(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      <div className="w-full max-w-md px-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 transform transition-all duration-300 hover:shadow-3xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Sprout className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">BloomWatch</h1>
            <p className="text-gray-500 text-sm mt-2">AI-Powered Crop Health Monitoring</p>
            <div className="flex items-center mt-3 gap-2">
              <div className={`w-2 h-2 rounded-full ${healthCheck ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-xs ${healthCheck ? 'text-green-600' : 'text-red-600'}`}>
                {healthCheck ? 'Server Connected' : 'Server Offline'}
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="farmer@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !healthCheck}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => setShowSignup(true)}
                className="text-green-600 font-semibold hover:text-green-700 transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
