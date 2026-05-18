import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerUser, clearError } from '../../store/slices/authSlice';
import Button from '../Button';
import Logo from '../Logo';
import { registerDataSchema } from '../../schemas/apiSchemas';

const Register = () => {
  const [name, setName] = useState('');
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

    const validatedData = registerDataSchema.safeParse({ name, email, password });
    if (!validatedData.success) {
      setLocalError(validatedData.error.issues[0]?.message ?? 'Please enter valid registration details');
      return;
    }

    try {
      await dispatch(registerUser(validatedData.data)).unwrap();
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
        <div className="absolute inset-0 bg-gradient-to-br from-beige-100 to-white rounded-[3rem] shadow-soft -z-10 m-6"></div>
        <div className="relative z-10 max-w-lg">
          <div className="bg-white p-4 rounded-2xl inline-block mb-8 shadow-sm">
            <Logo width="140px" variant="text" />
          </div>
          <h1 className="text-5xl font-black text-silver-900 leading-tight tracking-tight mb-6">
            Join the future of <br />
            <span className="text-gradient">link sharing.</span>
          </h1>
          <p className="text-lg text-silver-500 leading-relaxed font-medium">
            Create an account to start managing your links, tracking detailed analytics, and elevating your brand.
          </p>
          
          <div className="mt-12 flex gap-4">
             <div className="bg-white/80 backdrop-blur p-4 rounded-2xl shadow-sm border border-silver-100 flex items-center gap-4">
                <div className="bg-forest-50 p-2.5 rounded-xl">
                  <svg className="w-6 h-6 text-forest-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-silver-900">Secure & Private</p>
                  <p className="text-xs text-silver-500">Your data is safe</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(107,114,128,0.15)] border border-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-silver-300 via-silver-400 to-silver-300"></div>
          
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo width="120px" variant="text" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-silver-900 tracking-tight mb-2">
            Create account
          </h2>
          
          <p className="text-sm sm:text-base text-silver-500 font-medium">
            Already have an account?&nbsp;
            <Link
              to="/login"
              className="font-bold text-silver-900 transition-all duration-200 hover:text-forest-600 hover:underline decoration-2 underline-offset-4"
            >
              Sign in
            </Link>
          </p>

          {displayError && (
            <div className="mt-6 bg-apple-50 border border-apple-200 text-apple-600 px-5 py-4 rounded-2xl text-sm animate-fadeIn font-medium">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-silver-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-5 py-4 bg-beige-50 border border-silver-200 rounded-2xl focus:ring-4 focus:ring-silver-200 focus:border-silver-400 outline-none transition-all text-silver-900 placeholder-silver-400 shadow-inner font-medium"
              />
            </div>

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
              <p className="mt-2 text-xs text-silver-500 font-medium ml-2">Must be at least 6 characters</p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
