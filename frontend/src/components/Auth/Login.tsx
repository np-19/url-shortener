import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, clearError } from '../../store/slices/authSlice';
import Button from '../Button';
import Logo from '../Logo';
import { loginDataSchema } from '../../schemas/apiSchemas';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    dispatch(clearError());

    const validatedData = loginDataSchema.safeParse({ email, password });
    if (!validatedData.success) {
      setLocalError(validatedData.error.issues[0]?.message ?? 'Please enter valid credentials');
      return;
    }

    try {
      await dispatch(loginUser(validatedData.data)).unwrap();
      navigate('/');
    } catch (err) {
      // Error is already set in Redux state
    }
  };

  const displayError = localError || error;

  return (
    <div className="flex flex-col lg:flex-row min-h-[85vh] bg-transparent animate-fadeIn">
      {/* Left Graphic Section (Hidden on mobile/tablet) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-start p-16 relative">
        <div className="absolute inset-0 bg-linear-to-br from-beige-100 to-white rounded-[3rem] shadow-soft -z-10 m-6"></div>
        <div className="relative z-10 max-w-lg">
          <div className="bg-white p-4 rounded-2xl inline-block mb-8 shadow-sm">
            <Logo width="140px" variant="text" />
          </div>
          <h1 className="text-5xl font-black text-silver-900 leading-tight tracking-tight mb-6">
            Welcome back to <br />
            <span className="text-gradient">smarter links.</span>
          </h1>
          <p className="text-lg text-silver-500 leading-relaxed font-medium">
            Access your dashboard to track analytics, manage custom aliases, and create new shortened URLs instantly.
          </p>
          
          <div className="mt-12 flex gap-4">
             <div className="bg-white/80 backdrop-blur p-4 rounded-2xl shadow-sm border border-silver-100 flex items-center gap-4">
                <div className="bg-forest-50 p-2.5 rounded-xl">
                  <svg className="w-6 h-6 text-forest-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-silver-900">Lightning Fast</p>
                  <p className="text-xs text-silver-500">Zero-delay redirects</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(107,114,128,0.15)] border border-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-forest-200 via-forest-500 to-forest-200"></div>
          
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo width="120px" variant="text" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-silver-900 tracking-tight mb-2">
            Sign in
          </h2>
          
          <p className="text-sm sm:text-base text-silver-500 font-medium">
            Don't have an account?&nbsp;
            <Link
              to="/register"
              className="font-bold text-silver-900 transition-all duration-200 hover:text-forest-600 hover:underline decoration-2 underline-offset-4"
            >
              Create one
            </Link>
          </p>

          {displayError && (
            <div className="mt-6 bg-apple-50 border border-apple-200 text-apple-600 px-5 py-4 rounded-2xl text-sm animate-fadeIn font-medium">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-silver-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-5 py-4 bg-beige-50 border border-silver-200 rounded-2xl focus:ring-4 focus:ring-silver-200 focus:border-silver-400 outline-none transition-all text-silver-900 placeholder-silver-400 shadow-inner font-medium"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-silver-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-5 py-4 bg-beige-50 border border-silver-200 rounded-2xl focus:ring-4 focus:ring-silver-200 focus:border-silver-400 outline-none transition-all text-silver-900 placeholder-silver-400 shadow-inner font-medium"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
